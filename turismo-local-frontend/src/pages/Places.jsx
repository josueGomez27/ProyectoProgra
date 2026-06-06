import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import api from "../api/api";

const getCategoryIcon = (color = "#064635") => {
    return L.divIcon({
        className: "",
        html: `
            <div style="
                width: 28px;
                height: 28px;
                background: ${color};
                border: 3px solid white;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            ">
                <div style="
                    width: 9px;
                    height: 9px;
                    background: white;
                    border-radius: 50%;
                    margin: 6px auto;
                "></div>
            </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
};

function FlyToPlace({ selectedPlace }) {
    const map = useMap();

    useEffect(() => {
        if (selectedPlace?.latitude && selectedPlace?.longitude) {
            map.flyTo(
                [Number(selectedPlace.latitude), Number(selectedPlace.longitude)],
                18,
                { animate: true, duration: 1.2 }
            );
        }
    }, [selectedPlace, map]);

    return null;
}

function Places() {
    const { id } = useParams();

    const [town, setTown] = useState(null);
    const [places, setPlaces] = useState([]);
    const [view, setView] = useState("list");
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadPlaces();
    }, [id]);

    const loadPlaces = async () => {
        try {
            setMessage("");

            const [townRes, placesRes] = await Promise.all([
                api.get(`/towns/${id}`),
                api.get(`/places/town/${id}`)
            ]);

            if (!townRes.data || townRes.data.active === false) {
                setTown(null);
                setPlaces([]);
                setMessage("Este pueblo no está activo o no se encuentra disponible.");
                return;
            }

            const activePlaces = Array.isArray(placesRes.data)
                ? placesRes.data.filter((place) => place.active === true)
                : [];

            setTown(townRes.data);
            setPlaces(activePlaces);

            if (activePlaces.length === 0) {
                setMessage("Este pueblo no tiene lugares turísticos activos disponibles.");
            }
        } catch (error) {
            console.error("Error cargando lugares", error);
            setTown(null);
            setPlaces([]);
            setMessage("No se pudieron cargar los lugares turísticos.");
        }
    };

    const categories = [
        ...new Map(
            places
                .filter((place) => place.category && place.category.active !== false)
                .map((place) => [place.category.id, place.category])
        ).values()
    ];

    const filteredPlaces = places.filter((place) => {
        const text = search.toLowerCase();

        const matchesSearch =
            place.name?.toLowerCase().includes(text) ||
            place.address?.toLowerCase().includes(text) ||
            place.description?.toLowerCase().includes(text) ||
            place.category?.name?.toLowerCase().includes(text);

        const matchesCategory =
            categoryFilter === "ALL" ||
            String(place.category?.id) === String(categoryFilter);

        return matchesSearch && matchesCategory;
    });

    const validPlaces = filteredPlaces.filter(
        (place) => place.latitude && place.longitude
    );

    const mapCenter =
        validPlaces.length > 0
            ? [Number(validPlaces[0].latitude), Number(validPlaces[0].longitude)]
            : [10.6346, -85.4377];

    const handlePlaceClick = (place) => {
        setSelectedPlace(place);
        setView("map");
    };

    return (
        <>
            <section className="places-banner">
                <div className="container">
                    <span className="places-tag">
                        Lugares para visitar
                    </span>

                    <h1>
                        {town
                            ? `Lugares turísticos en ${town.name}`
                            : "Destino no disponible"}
                    </h1>

                    <p>
                        Descubrí los sitios más representativos, su ubicación y la
                        información principal para visitarlos.
                    </p>
                </div>
            </section>

            <main className="container places-section">
                {message && (
                    <div className="alert alert-warning text-center">
                        {message}
                    </div>
                )}

                {town && (
                    <>
                        <div className="places-filter-box">
                            <input
                                type="text"
                                placeholder="Buscar lugar, dirección o categoría..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="ALL">Todas las categorías</option>

                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="places-actions">
                            <button
                                className={view === "list" ? "view-btn active" : "view-btn"}
                                onClick={() => setView("list")}
                            >
                                Vista Lista
                            </button>

                            <button
                                className={view === "map" ? "view-btn active" : "view-btn"}
                                onClick={() => setView("map")}
                            >
                                Vista Mapa
                            </button>
                        </div>

                        {view === "list" && (
                            <div className="row">
                                {filteredPlaces.length === 0 ? (
                                    <p className="text-center text-muted">
                                        No hay lugares activos que coincidan con la búsqueda o categoría.
                                    </p>
                                ) : (
                                    filteredPlaces.map((place) => (
                                        <div
                                            className="col-md-6 col-lg-4 mb-4"
                                            key={place.id}
                                        >
                                            <div className="place-tour-card h-100 card shadow-sm border-0">
                                                <img
                                                    src={
                                                        place.imageUrl ||
                                                        "https://www.travelexcellence.com/wp-content/uploads/2020/09/liberia-guanacaste-01.jpg"
                                                    }
                                                    className="card-img-top"
                                                    alt={place.name}
                                                    style={{
                                                        height: "220px",
                                                        objectFit: "cover"
                                                    }}
                                                />

                                                <div className="place-tour-body card-body d-flex flex-column">
                                                    <span
                                                        className="place-category badge text-white align-self-start mb-2"
                                                        style={{
                                                            fontSize: "0.8rem",
                                                            textTransform: "uppercase",
                                                            backgroundColor: place.category?.color || "#064635"
                                                        }}
                                                    >
                                                        {place.category?.name || "Turístico"}
                                                    </span>

                                                    <h3 className="card-title h5 mb-2 fw-bold text-dark">
                                                        {place.name}
                                                    </h3>

                                                    <div className="place-address text-muted small mb-3">
                                                        📍 {place.address}
                                                        {town ? `, ${town.name}` : ""}
                                                    </div>

                                                    <p
                                                        className="card-text text-secondary"
                                                        style={{
                                                            fontSize: "0.9rem",
                                                            lineHeight: "1.5"
                                                        }}
                                                    >
                                                        {place.description}
                                                    </p>

                                                    {place.latitude && place.longitude && (
                                                        <button
                                                            type="button"
                                                            className="view-btn mt-auto"
                                                            onClick={() => handlePlaceClick(place)}
                                                            style={{ alignSelf: "flex-start" }}
                                                        >
                                                            Ver en mapa
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {view === "map" && (
                            <div className="map-layout">
                                <div className="map-list">
                                    <h3>Lugares ubicados</h3>

                                    {validPlaces.length === 0 ? (
                                        <p className="text-muted">
                                            No hay coordenadas registradas para esta búsqueda.
                                        </p>
                                    ) : (
                                        validPlaces.map((place, index) => (
                                            <div
                                                className="map-place-item"
                                                key={place.id}
                                                onClick={() => handlePlaceClick(place)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <img
                                                    src={
                                                        place.imageUrl ||
                                                        "https://www.travelexcellence.com/wp-content/uploads/2020/09/liberia-guanacaste-01.jpg"
                                                    }
                                                    alt={place.name}
                                                />

                                                <div>
                                                    <strong>
                                                        {index + 1}. {place.name}
                                                    </strong>

                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "8px",
                                                            marginTop: "6px"
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                width: "12px",
                                                                height: "12px",
                                                                borderRadius: "50%",
                                                                backgroundColor: place.category?.color || "#064635"
                                                            }}
                                                        ></div>

                                                        <span
                                                            style={{
                                                                backgroundColor: place.category?.color || "#064635",
                                                                color: "white",
                                                                padding: "3px 10px",
                                                                borderRadius: "20px",
                                                                fontSize: "0.8rem",
                                                                fontWeight: "800",
                                                                textTransform: "uppercase"
                                                            }}
                                                        >
                                                            {place.category?.name || "Turístico"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="map-box">
                                    <MapContainer
                                        center={mapCenter}
                                        zoom={15}
                                        scrollWheelZoom={true}
                                        className="leaflet-map"
                                    >
                                        <FlyToPlace selectedPlace={selectedPlace} />

                                        <TileLayer
                                            attribution='&copy; OpenStreetMap contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />

                                        {validPlaces.map((place) => (
                                            <Marker
                                                key={place.id}
                                                position={[
                                                    Number(place.latitude),
                                                    Number(place.longitude),
                                                ]}
                                                icon={getCategoryIcon(place.category?.color)}
                                            >
                                                <Popup>
                                                    <div style={{ width: "220px" }}>
                                                        <img
                                                            src={
                                                                place.imageUrl ||
                                                                "https://www.travelexcellence.com/wp-content/uploads/2020/09/liberia-guanacaste-01.jpg"
                                                            }
                                                            alt={place.name}
                                                            style={{
                                                                width: "100%",
                                                                height: "110px",
                                                                objectFit: "cover",
                                                                borderRadius: "10px",
                                                                marginBottom: "10px"
                                                            }}
                                                        />

                                                        <h6
                                                            style={{
                                                                fontWeight: "800",
                                                                marginBottom: "8px",
                                                                color: "#064635"
                                                            }}
                                                        >
                                                            {place.name}
                                                        </h6>

                                                        <span
                                                            style={{
                                                                display: "inline-block",
                                                                backgroundColor: place.category?.color || "#064635",
                                                                color: "white",
                                                                padding: "4px 10px",
                                                                borderRadius: "20px",
                                                                fontSize: "0.75rem",
                                                                fontWeight: "800",
                                                                marginBottom: "10px",
                                                                textTransform: "uppercase"
                                                            }}
                                                        >
                                                            {place.category?.name || "Turístico"}
                                                        </span>

                                                        <p
                                                            style={{
                                                                fontSize: "0.85rem",
                                                                color: "#6c757d",
                                                                marginBottom: "8px"
                                                            }}
                                                        >
                                                            {place.description?.substring(0, 80)}...
                                                        </p>

                                                        <div
                                                            style={{
                                                                fontSize: "0.8rem",
                                                                color: "#495057",
                                                                marginBottom: "10px"
                                                            }}
                                                        >
                                                            📍 {place.address}
                                                        </div>

                                                        <Link
                                                            to={`/place/${place.id}`}
                                                            className="btn-tour"
                                                            style={{
                                                                display: "inline-block",
                                                                width: "100%",
                                                                textAlign: "center",
                                                                padding: "8px 12px",
                                                                fontSize: "0.8rem"
                                                            }}
                                                        >
                                                            Ver información completa
                                                        </Link>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        ))}
                                    </MapContainer>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </>
    );
}

export default Places;