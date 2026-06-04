import "./Login.css";

function Login() {
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

    const handleGoogleLogin = () => {
        window.location.href = backendUrl + "/oauth2/authorization/google";
    };

    return (
        <div className="login-page">
            <header className="login-header">
                Turismo Local UNA
            </header>

            <main className="login-content">
                <section className="login-card">
                    <div className="town-image-box">
                        <img
                            src="/icons.svg"
                            alt="Turismo Local"
                            className="town-image"
                        />
                    </div>

                    <h1>Bienvenido a Santa María</h1>

                    <p>
                        Iniciá sesión para descubrir los lugares turísticos
                        disponibles en este pueblo.
                    </p>

                    <button className="google-btn" onClick={handleGoogleLogin}>
                        <span className="google-icon">G</span>
                        Continuar con Google
                    </button>

                    <small>
                        Solo se aceptan cuentas registradas con Gmail.
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