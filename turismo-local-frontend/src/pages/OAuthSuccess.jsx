import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/api";
import LoadingSpinner from "../components/LoadingSpinner";

function OAuthSuccess() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const response = await api.get("/users/me", {
                    withCredentials: true
                });

                if (response.data.authenticated) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }

                const townId = localStorage.getItem("qrTownId");

                if (townId) {
                    localStorage.removeItem("qrTownId");
                    navigate(`/places/${townId}`);
                } else {
                    navigate("/home");
                }

            } catch (error) {
                console.error("Error iniciando sesión:", error);
                navigate("/");
            }
        };

        loadUser();
    }, [navigate]);

    return (
        <main className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="text-center">
                <h2 className="fw-bold text-success mb-3">
                    {t("oauth.title")}
                </h2>

                <LoadingSpinner text={t("oauth.text")} />
            </div>
        </main>
    );
}

export default OAuthSuccess;