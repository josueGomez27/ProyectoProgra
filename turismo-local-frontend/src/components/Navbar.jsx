import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

function Navbar() {
    const { t } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role?.trim();
    const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="custom-navbar travel-navbar" aria-label="Menú principal">
            <div className="nav-content">
                <div className="nav-top-row">
                    <Link className="brand-logo" to="/home" onClick={closeMenu}>
                        <span className="brand-icon" aria-hidden="true">✈</span>
                        <span>Turismo Local UNA</span>
                    </Link>

                    <button
                        type="button"
                        className="mobile-menu-btn"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Abrir o cerrar menú"
                    >
                        <i className={menuOpen ? "bi bi-x-lg" : "bi bi-list"}></i>
                        <span>Menú</span>
                    </button>
                </div>

                <div className={menuOpen ? "nav-links nav-links-open" : "nav-links"}>
                    <Link to="/home" className="nav-pill" onClick={closeMenu}>
                        <i className="bi bi-house-door-fill" aria-hidden="true"></i>
                        {t("nav.home")}
                    </Link>

                    {isAdmin && (
                        <>
                            <Link to="/admin" className="nav-pill" onClick={closeMenu}>
                                <i className="bi bi-speedometer2" aria-hidden="true"></i>
                                {t("nav.admin")}
                            </Link>

                            <Link
                                to="/admin/qr"
                                className="nav-pill nav-pill-gold"
                                onClick={closeMenu}
                            >
                                <i className="bi bi-qr-code" aria-hidden="true"></i>
                                {t("nav.qr")}
                            </Link>
                        </>
                    )}

                    {user && (
                        <div className="user-pill">
                            <img
                                src={user.picture || user.pictureUrl}
                                alt={`Foto de perfil de ${user.name || "usuario"}`}
                                className="user-avatar"
                            />

                            <div>
                                <strong>
                                    {t("nav.hello")}, {user.name?.split(" ")[0]}
                                </strong>

                                {isAdmin && <span>{role}</span>}
                            </div>
                        </div>
                    )}

                    <Link
                        className="logout-pill"
                        to="/"
                        onClick={() => {
                            localStorage.removeItem("user");
                            closeMenu();
                        }}
                    >
                        <i className="bi bi-box-arrow-right" aria-hidden="true"></i>
                        {t("nav.logout")}
                    </Link>

                    <LanguageSwitcher />
                </div>
            </div>
        </nav>
    );
}

export default Navbar;