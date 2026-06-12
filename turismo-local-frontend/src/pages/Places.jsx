import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import api from "../api/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

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

const getUserLocationIcon = () => {
    return L.divIcon({
        className: "",
        html: `
            <div style="
                width: 22px;
                height: 22px;
                background: #0d6efd;
                border: 4px solid white;
                border-radius: 50%;
                box-shadow: 0 0 0 6px rgba(13,110,253,0.25);
            "></div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
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

function LocateUserButton() {
    const { t } = useTranslation();
    const map = useMap();
    const [userPosition, setUserPosition] = useState(null);
    const [locationError, setLocationError] = useState("");

    const locateUser = () => {
        setLocationError("");

        if (!navigator.geolocation) {
            setLocationError(t("places.geoUnsupported"));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                setUserPosition([lat, lng]);

                map.flyTo([lat, lng], 16, {
                    animate: true,
                    duration: 1.5,
                });
            },
            () => {
                setLocationError(t("places.geoError"));
            }
        );
    };

    return (
        <>
            <button
                type="button"
                className="view-btn"
                style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    zIndex: 1000,
                }}
                onClick={locateUser}
                aria-label={t("buttons.myLocation")}
            >
                📍 {t("buttons.myLocation")}
            </button>

            {locationError && (
                <div
                    className="alert alert-warning py-2 px-3"
                    style={{
                        position: "absolute",
                        top: "65px",
                        right: "15px",
                        zIndex: 1000,
                        maxWidth: "280px",
                        fontSize: "0.85rem",
                    }}
                    role="alert"
                >
                    {locationError}
                </div>
            )}

            {userPosition && (
                <Marker position={userPosition} icon={getUserLocationIcon()}>
                    <Popup>{t("places.youAreHere")}</Popup>
                </Marker>
            )}
        </>
    );
}

function Places() {
    const { t } = useTranslation();
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const [town, setTown] = useState(null);
    const [places, setPlaces] = useState([]);
    const [view, setView] = useState("list");
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [categoryFilter, setCategoryFilter] = useState(
        searchParams.get("category") || "ALL"
    );
    const [sortBy, setSortBy] = useState(searchParams.get("sort") || "name");
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPlaces();
    }, [id]);

    useEffect(() => {
        const params = {};

        if (search.trim() !== "") {
            params.search = search;
        }

        if (categoryFilter !== "ALL") {
            params.category = categoryFilter;
        }

        if (sortBy !== "name") {
            params.sort = sortBy;
        }

        setSearchParams(params);
    }, [search, categoryFilter, sortBy, setSearchParams]);

    const loadPlaces = async () => {
        try {
            setLoading(true);
            setMessage("");
            setError("");

            const [townRes, placesRes] = await Promise.all([
                api.get(`/towns/${id}`),
                api.get(`/places/town/${id}`),
            ]);

            if (!townRes.data || townRes.data.active === false) {
                setTown(null);
                setPlaces([]);
                setMessage(t("places.inactiveTown"));
                return;
            }

            const activePlaces = Array.isArray(placesRes.data)
                ? placesRes.data.filter((place) => place.active === true)
                : [];

            setTown(townRes.data);
            setPlaces(activePlaces);

            if (activePlaces.length === 0) {
                setMessage(t("places.noActivePlaces"));
            }
        } catch (error) {
            console.error("Error cargando lugares", error);
            setTown(null);
            setPlaces([]);
            setError(t("places.loadError"));
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        ...new Map(
            places
                .filter((place) => place.category && place.category.active !== false)
                .map((place) => [place.category.id, place.category])
        ).values(),
    ];

    const filteredPlaces = places
        .filter((place) => {
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
        })
        .sort((a, b) => {
            if (sortBy === "name") {
                return (a.name || "").localeCompare(b.name || "");
            }

            if (sortBy === "category") {
                return (a.category?.name || "").localeCompare(
                    b.category?.name || ""
                );
            }

            if (sortBy === "createdAt") {
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            }

            return 0;
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
                    <span className="places-tag">{t("places.tag")}</span>

                    <h1>
                        {town
                            ? t("places.titleWithTown", { town: town.name })
                            : t("places.unavailableTitle")}
                    </h1>

                    <p>{t("places.description")}</p>
                </div>
            </section>

            <main className="container places-section">
                {loading && (
                    <LoadingSpinner text={t("places.loading")} />
                )}

                {!loading && error && (
                    <ErrorMessage
                        message={error}
                        onRetry={loadPlaces}
                        retryText={t("buttons.retry")}
                    />
                )}

                {!loading && !error && message && (
                    <div className="alert alert-warning text-center" role="alert">
                        {message}
                    </div>
                )}

                {!loading && !error && town && (
                    <>
                        <div className="places-filter-box">
                            <label htmlFor="place-search" className="visually-hidden">
                                {t("places.filterPlaceholder")}
                            </label>

                            <input
                                id="place-search"
                                type="text"
                                placeholder={t("places.filterPlaceholder")}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                aria-label={t("places.filterPlaceholder")}
                            />

                            <label htmlFor="category-filter" className="visually-hidden">
                                {t("places.allCategories")}
                            </label>

                            <select
                                id="category-filter"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                aria-label={t("places.allCategories")}
                            >
                                <option value="ALL">{t("places.allCategories")}</option>

                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>

                            <label htmlFor="sort-filter" className="visually-hidden">
                                {t("places.sortName")}
                            </label>

                            <select
                                id="sort-filter"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                aria-label={t("places.sortName")}
                            >
                                <option value="name">{t("places.sortName")}</option>
                                <option value="category">{t("places.sortCategory")}</option>
                                <option value="createdAt">{t("places.sortCreatedAt")}</option>
                            </select>
                        </div>

                        <p className="text-center text-muted mt-3">
                            {t("places.count", { count: filteredPlaces.length })}
                        </p>

                        <div className="places-actions">
                            <button
                                type="button"
                                className={view === "list" ? "view-btn active" : "view-btn"}
                                onClick={() => setView("list")}
                            >
                                {t("places.listView")}
                            </button>

                            <button
                                type="button"
                                className={view === "map" ? "view-btn active" : "view-btn"}
                                onClick={() => setView("map")}
                            >
                                {t("places.mapView")}
                            </button>
                        </div>

                        {view === "list" && (
                            <div className="row">
                                {filteredPlaces.length === 0 ? (
                                    <p className="text-center text-muted">
                                        {t("places.noPlaces")}
                                    </p>
                                ) : (
                                    filteredPlaces.map((place) => (
                                        <div
                                            className="col-12 col-md-6 col-lg-4 mb-4"
                                            key={place.id}
                                        >
                                            <div className="place-tour-card h-100 card shadow-sm border-0">
                                                <img
                                                    src={
                                                        place.imageUrl ||
                                                        "https://www.travelexcellence.com/wp-content/uploads/2020/09/liberia-guanacaste-01.jpg"
                                                    }
                                                    className="card-img-top"
                                                    alt={`Imagen de ${place.name}`}
                                                    style={{
                                                        height: "220px",
                                                        objectFit: "cover",
                                                    }}
                                                />

                                                <div className="place-tour-body card-body d-flex flex-column">
                                                    <span
                                                        className="place-category badge text-white align-self-start mb-2"
                                                        style={{
                                                            fontSize: "0.8rem",
                                                            textTransform: "uppercase",
                                                            backgroundColor:
                                                                place.category?.color || "#064635",
                                                        }}
                                                    >
                                                        {place.category?.name || t("places.defaultCategory")}
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
                                                            lineHeight: "1.5",
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
                                                            {t("places.viewOnMap")}
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
                                    <h3>{t("places.locatedPlaces")}</h3>

                                    {validPlaces.length === 0 ? (
                                        <p className="text-muted">
                                            {t("places.noCoordinates")}
                                        </p>
                                    ) : (
                                        validPlaces.map((place, index) => (
                                            <button
                                                type="button"
                                                className="map-place-item"
                                                key={place.id}
                                                onClick={() => handlePlaceClick(place)}
                                                style={{
                                                    cursor: "pointer",
                                                    width: "100%",
                                                    textAlign: "left",
                                                    border: "none",
                                                }}
                                            >
                                                <img
                                                    src={
                                                        place.imageUrl ||
                                                        "https://www.travelexcellence.com/wp-content/uploads/2020/09/liberia-guanacaste-01.jpg"
                                                    }
                                                    alt={`Imagen de ${place.name}`}
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
                                                            marginTop: "6px",
                                                        }}
                                                    >
                                                        <div
                                                            aria-hidden="true"
                                                            style={{
                                                                width: "12px",
                                                                height: "12px",
                                                                borderRadius: "50%",
                                                                backgroundColor:
                                                                    place.category?.color || "#064635",
                                                            }}
                                                        ></div>

                                                        <span
                                                            style={{
                                                                backgroundColor:
                                                                    place.category?.color || "#064635",
                                                                color: "white",
                                                                padding: "3px 10px",
                                                                borderRadius: "20px",
                                                                fontSize: "0.8rem",
                                                                fontWeight: "800",
                                                                textTransform: "uppercase",
                                                            }}
                                                        >
                                                            {place.category?.name || t("places.defaultCategory")}
                                                        </span>
                                                    </div>
                                                </div>
                                            </button>
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

                                        <LocateUserButton />

                                        <TileLayer
                                            attribution="&copy; OpenStreetMap contributors"
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
                                                            alt={`Imagen de ${place.name}`}
                                                            style={{
                                                                width: "100%",
                                                                height: "110px",
                                                                objectFit: "cover",
                                                                borderRadius: "10px",
                                                                marginBottom: "10px",
                                                            }}
                                                        />

                                                        <h6
                                                            style={{
                                                                fontWeight: "800",
                                                                marginBottom: "8px",
                                                                color: "#064635",
                                                            }}
                                                        >
                                                            {place.name}
                                                        </h6>

                                                        <span
                                                            style={{
                                                                display: "inline-block",
                                                                backgroundColor:
                                                                    place.category?.color || "#064635",
                                                                color: "white",
                                                                padding: "4px 10px",
                                                                borderRadius: "20px",
                                                                fontSize: "0.75rem",
                                                                fontWeight: "800",
                                                                marginBottom: "10px",
                                                                textTransform: "uppercase",
                                                            }}
                                                        >
                                                            {place.category?.name || t("places.defaultCategory")}
                                                        </span>

                                                        <p
                                                            style={{
                                                                fontSize: "0.85rem",
                                                                color: "#6c757d",
                                                                marginBottom: "8px",
                                                            }}
                                                        >
                                                            {place.description?.substring(0, 80)}...
                                                        </p>

                                                        <div
                                                            style={{
                                                                fontSize: "0.8rem",
                                                                color: "#495057",
                                                                marginBottom: "10px",
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
                                                                fontSize: "0.8rem",
                                                            }}
                                                        >
                                                            {t("places.fullInfo")}
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