import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Error404() {
    const { t } = useTranslation();

    return (
        <main className="error-page">
            <div className="glass-card" role="alert">
                <span className="section-kicker">{t("notFound.kicker")}</span>

                <h1 className="section-title mt-2">
                    404
                </h1>

                <h3>{t("notFound.title")}</h3>

                <p className="section-subtitle mb-4">
                    {t("notFound.text")}
                </p>

                <div className="alert alert-warning">
                    {t("notFound.warning")}
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        justifyContent: "center",
                        flexWrap: "wrap"
                    }}
                >
                    <Link className="btn-tour" to="/">
                        {t("buttons.backHome")}
                    </Link>

                    <button
                        type="button"
                        className="btn-tour"
                        onClick={() => window.location.reload()}
                    >
                        {t("buttons.retry")}
                    </button>
                </div>
            </div>
        </main>
    );
}

export default Error404;