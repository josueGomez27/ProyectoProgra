import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

function Navbar() {
    const { t } = useTranslation();

    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role?.trim();
    const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

    return (
        <nav className="custom-navbar travel-navbar" aria-label="Menú principal">
            <div className="nav-content">
                <Link className="brand-logo" to="/home">
                    <span className="brand-icon" aria-hidden="true">✈</span>
                    <span>Turismo Local UNA</span>
                </Link>

                <div className="nav-links">
                    <Link to="/home" className="nav-pill">
                        <i className="bi bi-house-door-fill" aria-hidden="true"></i>
                        {t("nav.home")}
                    </Link>

                    {isAdmin && (
                        <>
                            <Link to="/admin" className="nav-pill">
                                <i className="bi bi-speedometer2" aria-hidden="true"></i>
                                {t("nav.admin")}
                            </Link>

                            <Link to="/admin/qr" className="nav-pill nav-pill-gold">
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