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
                .then(response => {
                    setTown(response.data);
                })
                .catch(error => {
                    console.error("Error cargando pueblo:", error);
                });
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

            <header className="login-topbar">
                Turismo Local UNA
            </header>

            <main className="login-main">

                <section className="login-card">

                    <div className="login-badge">
                        Turismo local · Costa Rica
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
                                : "Inicia sesión para descubrir pueblos con historia, naturaleza y cultura en Costa Rica."
                        }
                    </p>

                    <button
                        type="button"
                        className="login-google-btn"
                        onClick={handleGoogleLogin}
                    >
                        Continuar con Google <span>G</span>
                    </button>

                    <small>
                        Acceso seguro con cuenta de Google
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