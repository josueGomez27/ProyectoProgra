import { Link } from "react-router-dom";

function PlaceCard({ town }) {
    return (
        <div className="town-card h-100">
            <img
                src={
                    town.imageUrl ||
                    "https://www.travelexcellence.com/wp-content/uploads/2020/09/liberia-guanacaste-01.jpg"
                }
                className="town-img"
                alt={town.name}
            />

            <div className="town-card-body">
                <span className="location-pill">
                    {town.province} · {town.canton}
                </span>

                <h3 className="town-title">{town.name}</h3>

                <p className="town-description">
                    {town.description}
                </p>

                <Link className="btn-tour" to={`/places/${town.id}`}>
                    Ver lugares turísticos
                </Link>
            </div>
        </div>
    );
}

export default PlaceCard;