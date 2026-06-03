import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import api from "../api/api";

const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

function Places() {
    const { id } = useParams();

    const [town, setTown] = useState(null);
    const [places, setPlaces] = useState([]);
    const [view, setView] = useState("list");

    useEffect(() => {
        loadPlaces();
    }, [id]);

    const loadPlaces = async () => {
        try {
            const response = await api.get(`/towns/${id}`);

            setTown(response.data);
            setPlaces(response.data.places || []);
        } catch (error) {
            console.error("Error cargando lugares", error);
        }
    };

    const validPlaces = places.filter(
        (place) => place.latitude && place.longitude
    );

    const mapCenter =
        validPlaces.length > 0
            ? [Number(validPlaces[0].latitude), Number(validPlaces[0].longitude)]
            : [10.6346, -85.4377];

    return (
        <>
            <section className="places-banner">
                <div className="container">
                    <span className="places-tag">Lugares para visitar</span>

                    <h1>
                        {town
                            ? `Lugares turísticos en ${town.name}`
                            : "Cargando destino..."}
                    </h1>

                    <p>
                        Descubrí los sitios más representativos, su ubicación y la
                        información principal para visitarlos.
                    </p>
                </div>
            </section>

            <main className="container places-section">
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
                        {places.length === 0 ? (
                            <p className="text-center text-muted">
                                No hay lugares registrados para este pueblo.
                            </p>
                        ) : (
                            places.map((place) => (
                                <div className="col-md-6 col-lg-4 mb-4" key={place.id}>
                                    <div className="place-tour-card h-100">
                                        <img
                                            src={
                                                place.imageUrl ||
                                                "https://www.travelexcellence.com/wp-content/uploads/2020/09/liberia-guanacaste-01.jpg"
                                            }
                                            alt={place.name}
                                        />

                                        <div className="place-tour-body">
                                            <span className="place-category">
                                                {place.category?.name || "Turístico"}
                                            </span>

                                            <h3>{place.name}</h3>

                                            <p>{place.description}</p>

                                            <div className="place-address">
                                                📍 {place.address}
                                            </div>
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
                                    No hay coordenadas registradas.
                                </p>
                            ) : (
                                validPlaces.map((place, index) => (
                                    <div className="map-place-item" key={place.id}>
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
                                            <span>
                                                {place.category?.name || "Turístico"}
                                            </span>
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
                                        icon={markerIcon}
                                    >
                                        <Popup>
                                            <strong>{place.name}</strong>
                                            <br />
                                            {place.description}
                                            <br />
                                            {place.address}
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}

export default Places;