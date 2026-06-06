import { Link } from "react-router-dom";

function Navbar() {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <nav className="custom-navbar travel-navbar">
            <div className="nav-content">
                <Link className="brand-logo" to="/home">
                    <span className="brand-icon">🌴</span>
                    Turismo Local UNA
                </Link>

                <div className="nav-links">
                    <Link to="/home" className="nav-pill">
                        Inicio
                    </Link>

                    {user?.role === "ADMIN" && (
                        <>
                            <Link to="/admin" className="nav-pill">
                                Administración
                            </Link>

                            <Link to="/admin/qr" className="nav-pill nav-pill-gold">
                                Generar QR
                            </Link>
                        </>
                    )}

                    {user && (
                        <div className="user-pill">
                            <img
                                src={user.picture}
                                alt="Perfil"
                                className="user-avatar"
                            />

                            <div>
                                <strong>
                                    Bienvenido, {user.name.split(" ")[0]}
                                </strong>

                                {user.role === "ADMIN" && (
                                    <span>ADMIN</span>
                                )}
                            </div>
                        </div>
                    )}

                    <Link
                        className="logout-pill"
                        to="/"
                        onClick={() => {
                            localStorage.removeItem("user");
                        }}
                    >
                        Cerrar sesión
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;