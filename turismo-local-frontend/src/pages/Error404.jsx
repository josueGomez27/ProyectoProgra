import { Link } from "react-router-dom";

function Error404() {
    return (
        <div className="error-page">
            <div className="glass-card">
                <span className="section-kicker">Ruta no encontrada</span>

                <h1 className="section-title mt-2">
                    404
                </h1>

                <p className="section-subtitle mb-4">
                    La página que intentás abrir no existe o el código QR no corresponde
                    a un destino registrado.
                </p>

                <Link className="btn-tour" to="/">
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}

export default Error404;