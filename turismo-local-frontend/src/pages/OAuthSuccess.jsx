import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuthSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        const townId = localStorage.getItem("qrTownId");

        if (townId) {
            localStorage.removeItem("qrTownId");
            navigate(`/places/${townId}`);
        } else {
            navigate("/home");
        }
    }, [navigate]);

    return (
        <div style={{ padding: "40px", textAlign: "center" }}>
            <h2>Iniciando sesión...</h2>
            <p>Redirigiendo al sistema.</p>
        </div>
    );
}

export default OAuthSuccess;