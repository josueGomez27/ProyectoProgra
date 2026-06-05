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
                .catch(error => console.error(error));
        }
    }, [townId]);

    const handleGoogleLogin = () => {
        if (townId) {
            localStorage.setItem("qrTownId", townId);
        }

        window.location.href = backendUrl + "/oauth2/authorization/google";
    };

    return (
        <div className="login-page">

            <header className="login-topbar">
                <span>Turismo Local UNA</span>
            </header>

            <main className="login-main">

                <section className="login-card">

                    <div className="login-badge">
                        🌿 Explora Costa Rica
                    </div>

                    <img
                        src="/icons.svg"
                        alt="Turismo Local"
                        className="login-town-icon"
                    />

                    <h1>
                        {town ? `Bienvenido a ${town.name}` : "Bienvenidos"}
                    </h1>

                    <p>
                        {
                            town
                                ? town.description
                                : "Inicia sesión para descubrir pueblos, cultura, naturaleza y lugares únicos cerca de ti."
                        }
                    </p>

                    <button
                        className="login-google-btn"
                        onClick={handleGoogleLogin}
                    >
                        Continuar con Google <span>G</span>
                    </button>

                    <small>
                        Solo se aceptan cuentas @gmail.com
                    </small>

                </section>

            </main>

            <footer className="login-footer">
                Universidad Nacional · Programación 4
            </footer>

        </div>
    );
}

export default Login;