import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark custom-navbar">
            <div className="container">

                <Link className="navbar-brand" to="/home">
                    Turismo Local UNA
                </Link>

                <div className="ms-auto">

                    <Link className="nav-link d-inline text-white me-4" to="/home">
                        Inicio
                    </Link>

                    <Link className="nav-link d-inline text-white me-4" to="/admin/places">
                        Administración
                    </Link>

                    <Link className="nav-link d-inline text-white me-4" to="/admin/qr">
                        Generar QR
                    </Link>

                    <Link className="nav-link d-inline text-white" to="/">
                        Cerrar sesión
                    </Link>

                </div>
            </div>
        </nav>
    );
}

export default Navbar;