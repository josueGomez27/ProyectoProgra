import { Link } from "react-router-dom";

function Navbar() {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role?.trim();
    const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

    console.log("Usuario navbar:", user);
    console.log("Es admin:", isAdmin);

    return (
        <nav className="custom-navbar travel-navbar">
            <div className="nav-content">
                <Link className="brand-logo" to="/home">
                    <span className="brand-icon">✈</span>
                    <span>Turismo Local UNA</span>
                </Link>

                <div className="nav-links">
                    <Link to="/home" className="nav-pill">
                        <i className="bi bi-house-door-fill"></i>
                        Inicio
                    </Link>

                    {isAdmin && (
                        <>
                            <Link to="/admin" className="nav-pill">
                                <i className="bi bi-speedometer2"></i>
                                Administración
                            </Link>

                            <Link to="/admin/qr" className="nav-pill nav-pill-gold">
                                <i className="bi bi-qr-code"></i>
                                Generar QR
                            </Link>
                        </>
                    )}

                    {user && (
                        <div className="user-pill">
                            <img
                                src={user.picture || user.pictureUrl}
                                alt="Perfil"
                                className="user-avatar"
                            />

                            <div>
                                <strong>Hola, {user.name?.split(" ")[0]}</strong>

                                {isAdmin && (
                                    <span>{role}</span>
                                )}
                            </div>
                        </div>
                    )}

                    <Link
                        className="logout-pill"
                        to="/"
                        onClick={() => localStorage.removeItem("user")}
                    >
                        <i className="bi bi-box-arrow-right"></i>
                        Salir
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;