function Login() {
    const handleGoogleLogin = () => {
        const backendUrl = import.meta.env.VITE_API_URL;

        alert("Backend usado: " + backendUrl);

        window.location.href = backendUrl + "/oauth2/authorization/google";
    };

    return (
        <div className="login-page">
            <div className="glass-card">
                <span className="section-kicker">Acceso al sistema</span>

                <h1 className="section-title mt-2">
                    Turismo Local UNA
                </h1>

                <p className="section-subtitle mb-4">
                    Iniciá sesión con tu cuenta de Google para administrar o consultar
                    la información turística del sistema.
                </p>

                <button className="google-btn" onClick={handleGoogleLogin}>
                    Continuar con Google
                </button>
            </div>
        </div>
    );
}

export default Login;