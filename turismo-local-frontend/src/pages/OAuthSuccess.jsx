import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function OAuthSuccess() {
    const navigate = useNavigate();

    useEffect(() => {

        const loadUser = async () => {
            try {

                const response = await api.get(
                    "/users/me",
                    {
                        withCredentials: true
                    }
                );

                console.log("Usuario OAuth:", response.data);


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
                console.error(error);
                navigate("/");
            }
        };

        loadUser();

    }, [navigate]);

    return (
        <div style={{ padding: "40px", textAlign: "center" }}>
            <h2>Iniciando sesión...</h2>
            <p>Cargando información del usuario.</p>
        </div>
    );
}

export default OAuthSuccess;