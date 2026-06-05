import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import "./login.css";

function Login() {
    const { townId } = useParams();
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

    const [town, setTown] = useState(null);

    useEffect(() => {
        if (townId) {
            api.get(`/towns/${townId}`)
                .then(response => setTown(response.data))
                .catch(error => console.error("Error cargando pueblo:", error));
        }
    }, [townId]);

    const handleGoogleLogin = () => {
        if (townId) {
            localStorage.setItem("qrTownId", townId);
        }

        window.location.href = `${backendUrl}/oauth2/authorization/google`;
    };

    return (
        <div className="login-page">
            <div className="login-container">

                <section className="login-left">
                    <div className="brand-badge">Turismo local · Costa Rica</div>

                    <h2>Turismo Local UNA</h2>
                    <span>Explora destinos únicos</span>

                    <h1>
                        {town ? `Bienvenido a ${town.name}` : "Comienza tu aventura"}
                    </h1>

                    <p>
                        {
                            town
                                ? town.description
                                : "Inicia sesión para descubrir pueblos, cultura, naturaleza y lugares turísticos únicos."
                        }
                    </p>

                    <button
                        type="button"
                        className="login-google-btn"
                        onClick={handleGoogleLogin}
                    >
                        Continuar con Google <span>G</span>
                    </button>

                    <small>Acceso seguro con cuenta de Google</small>
                </section>

                <section className="login-right">
                    <div className="image-card">

                        <div className="floating-box floating-main">
                            <strong>Descubre lugares increíbles</strong>
                            <p>Playas, montañas, pueblos y cultura local.</p>
                        </div>

                        <div className="floating-pill floating-one">🌊 Playas</div>
                        <div className="floating-pill floating-two">🌿 Bosques</div>
                        <div className="floating-pill floating-three">🏘️ Pueblos</div>

                        <div className="image-text">
                            <h3>Descubre Costa Rica</h3>
                            <p>Playas • Bosques • Cultura • Aventuras</p>
                        </div>

                    </div>
                </section>

            </div>
        </div>
    );
}

export default Login;