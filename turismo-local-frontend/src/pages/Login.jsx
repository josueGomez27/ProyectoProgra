import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/api";
import LoadingSpinner from "../components/LoadingSpinner";
import "./login.css";

function Login() {
    const { t } = useTranslation();
    const { townId } = useParams();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

    const [town, setTown] = useState(null);
    const [loadingTown, setLoadingTown] = useState(false);

    useEffect(() => {
        if (townId) {
            setLoadingTown(true);

            api.get(`/towns/${townId}`)
                .then((response) => {
                    if (!response.data || response.data.active === false) {
                        navigate("/error");
                        return;
                    }

                    setTown(response.data);
                })
                .catch(() => {
                    navigate("/error");
                })
                .finally(() => {
                    setLoadingTown(false);
                });
        }
    }, [townId, navigate]);

    const handleGoogleLogin = () => {
        if (townId) {
            localStorage.setItem("qrTownId", townId);
        }

        window.location.href = `${backendUrl.replace(/\/$/, "")}/oauth2/authorization/google`;
    };

    return (
        <main className="login-page">
            <div className="login-overlay"></div>

            <div className="login-container">
                <section className="login-left" aria-label="Inicio de sesión">
                    <div className="brand-badge">{t("login.brand")}</div>

                    <h2>{t("login.appName")}</h2>
                    <span>{t("login.subtitle")}</span>

                    {loadingTown ? (
                        <LoadingSpinner text={t("login.loadingTown")} />
                    ) : (
                        <>
                            <h1>
                                {town
                                    ? t("login.welcomeTown", { town: town.name })
                                    : t("login.start")}
                            </h1>

                            <p>
                                {town
                                    ? town.description
                                    : t("login.defaultText")}
                            </p>
                        </>
                    )}

                    <button
                        type="button"
                        className="login-google-btn"
                        onClick={handleGoogleLogin}
                        aria-label={t("login.google")}
                    >
                        <img
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                            alt=""
                            className="google-icon"
                            aria-hidden="true"
                        />
                        <span className="google-text">{t("login.google")}</span>
                    </button>

                    <small>{t("login.secure")}</small>
                </section>

                <section className="login-right" aria-label="Imagen promocional">
                    <div className="image-card">
                        <div className="floating-box floating-main">
                            <strong>{t("login.floatingTitle")}</strong>
                            <p>{t("login.floatingText")}</p>
                        </div>

                        <div className="floating-pill floating-one">{t("login.beach")}</div>
                        <div className="floating-pill floating-two">{t("login.forest")}</div>
                        <div className="floating-pill floating-three">{t("login.towns")}</div>
                        <div className="floating-pill floating-four">{t("login.mountains")}</div>

                        <div className="image-text">
                            <h3>{t("login.imageTitle")}</h3>
                            <p>{t("login.imageText")}</p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Login;