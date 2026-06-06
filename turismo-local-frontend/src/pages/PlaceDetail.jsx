import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/api";

function PlaceDetail() {
    const { id } = useParams();
    const [place, setPlace] = useState(null);
    const [message, setMessage] = useState("Cargando lugar...");

    useEffect(() => {
        loadPlace();
    }, [id]);

    const loadPlace = async () => {
        try {
            const response = await api.get(`/places/${id}`);

            if (!response.data || response.data.active === false) {
                setPlace(null);
                setMessage("Este lugar turístico no está activo o no se encuentra disponible.");
                return;
            }

            setPlace(response.data);
        } catch (error) {
            console.error("Error cargando lugar:", error);
            setPlace(null);
            setMessage("No se pudo cargar la información del lugar.");
        }
    };

    if (!place) {
        return (
            <div className="container places-section">
                <div className="alert alert-warning text-center">
                    {message}
                </div>

                <Link className="btn-tour" to="/home">
                    Volver al inicio
                </Link>
            </div>
        );
    }

    return (
        <main className="container places-section">
            <div className="place-detail-card">
                <img
                    src={
                        place.imageUrl ||
                        "https://www.travelexcellence.com/wp-content/uploads/2020/09/liberia-guanacaste-01.jpg"
                    }
                    alt={place.name}
                />

                <div className="place-detail-content">
                    <span
                        className="place-category badge text-white mb-3"
                        style={{
                            backgroundColor: place.category?.color || "#064635"
                        }}
                    >
                        {place.category?.name || "Turístico"}
                    </span>

                    <h1>{place.name}</h1>

                    <p>{place.description}</p>

                    <div className="place-detail-info">
                        <strong>Dirección:</strong> {place.address}
                    </div>

                    <div className="place-detail-info">
                        <strong>Pueblo:</strong> {place.town?.name}
                    </div>

                    <Link
                        className="btn-tour mt-4"
                        to={`/places/${place.town?.id}`}
                    >
                        Volver a lugares
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default PlaceDetail;