import { Link } from "react-router-dom";

function Error404() {
    return (
        <div className="error-page">
            <div className="glass-card">
                <span className="section-kicker">Ruta no encontrada</span>

                <h1 className="section-title mt-2">
                    404
                </h1>

                <h3>¡Ups! Pueblo no encontrado</h3>

                <p className="section-subtitle mb-4">
                    El código QR escaneado no corresponde a un pueblo registrado,
                    la ruta no existe o la sesión pudo haber expirado.
                </p>

                <div className="alert alert-warning">
                    ⚠️ Posibles causas: QR inválido, pueblo eliminado, sin conexión
                    a internet o sesión expirada.
                </div>

                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                    <Link className="btn-tour" to="/">
                        Volver al inicio
                    </Link>

                    <button
                        className="btn-tour"
                        onClick={() => window.location.reload()}
                    >
                        Reintentar conexión
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Error404;