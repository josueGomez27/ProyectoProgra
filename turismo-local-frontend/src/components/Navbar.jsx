import { Link } from "react-router-dom";

function Navbar() {

    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <nav className="navbar navbar-expand-lg navbar-dark custom-navbar">
            <div className="container">

                <Link className="navbar-brand" to="/home">
                    Turismo Local UNA
                </Link>

                <div className="ms-auto d-flex align-items-center">

                    <Link
                        className="nav-link d-inline text-white me-4"
                        to="/home"
                    >
                        Inicio
                    </Link>

                    {user?.role === "ADMIN" && (
                        <>
                            <Link
                                className="nav-link d-inline text-white me-4"
                                to="/admin/places"
                            >
                                Administración
                            </Link>

                            <Link
                                className="nav-link d-inline text-white me-4"
                                to="/admin/qr"
                            >
                                Generar QR
                            </Link>
                        </>
                    )}

                    {user && (
                        <div
                            className="d-flex align-items-center me-4"
                            style={{ color: "white" }}
                        >

                            <img
                                src={user.picture}
                                alt="Perfil"
                                style={{
                                    width: "42px",
                                    height: "42px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    marginRight: "10px",
                                    border: "2px solid white"
                                }}
                            />

                            <div style={{ lineHeight: "1.2" }}>

                                <div
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "500"
                                    }}
                                >
                                    Bienvenido, {user.name.split(" ")[0]}
                                </div>

                                {user.role === "ADMIN" && (
                                    <small
                                        style={{
                                            color: "#FFD700",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        ADMIN
                                    </small>
                                )}

                            </div>

                        </div>
                    )}

                    <Link
                        className="nav-link d-inline text-white"
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