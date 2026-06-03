import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark custom-navbar">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    Turismo Local UNA
                </Link>

                <div className="ms-auto">
                    <Link className="nav-link d-inline text-white me-4" to="/">
                        Inicio
                    </Link>

                    <Link className="nav-link d-inline text-white" to="/login">
                        Acceso
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;