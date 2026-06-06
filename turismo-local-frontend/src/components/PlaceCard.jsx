import { Link } from "react-router-dom";

function PlaceCard({ town }) {
    return (
        <div className="town-card travel-town-card h-100">
            <div className="travel-town-img-wrap">
                <img
                    src={
                        town.imageUrl ||
                        "https://www.travelexcellence.com/wp-content/uploads/2020/09/liberia-guanacaste-01.jpg"
                    }
                    className="town-img"
                    alt={town.name}
                />

                <span className="travel-town-badge">
                    {town.province}
                </span>
            </div>

            <div className="town-card-body">
                <span className="location-pill">
                    <i className="bi bi-geo-alt-fill"></i>
                    {town.province} · {town.canton}
                </span>

                <h3 className="town-title">{town.name}</h3>

                <p className="town-description">
                    {town.description}
                </p>

                <Link className="btn-tour travel-card-btn" to={`/places/${town.id}`}>
                    Ver lugares turísticos
                    <i className="bi bi-arrow-right ms-2"></i>
                </Link>
            </div>
        </div>
    );
}

export default PlaceCard;