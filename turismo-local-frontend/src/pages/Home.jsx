import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAllTowns } from "../services/townService";
import PlaceCard from "../components/PlaceCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

function Home() {
    const { t } = useTranslation();

    const [towns, setTowns] = useState([]);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTowns();
    }, []);

    const loadTowns = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAllTowns();

            const activeTowns = Array.isArray(data)
                ? data.filter((town) => town.active === true)
                : [];

            setTowns(activeTowns);
        } catch (error) {
            console.error("Error cargando pueblos", error);
            setError(t("home.loadError"));
        } finally {
            setLoading(false);
        }
    };

    const filteredTowns = towns.filter((town) => {
        const text = search.toLowerCase();

        return (
            town.name?.toLowerCase().includes(text) ||
            town.province?.toLowerCase().includes(text) ||
            town.canton?.toLowerCase().includes(text) ||
            town.district?.toLowerCase().includes(text)
        );
    });

    return (
        <>
            <section className="travel-hero">
                <div className="travel-hero-overlay"></div>

                <div className="container travel-hero-content">
                    <div className="hero-left">
                        <span className="travel-kicker">
                            {t("home.kicker")}
                        </span>

                        <h1>{t("home.title")}</h1>

                        <p>{t("home.description")}</p>

                        <div className="hero-search-card">
                            <label htmlFor="town-search">
                                {t("home.searchLabel")}
                            </label>

                            <div className="hero-search-row">
                                <input
                                    id="town-search"
                                    type="text"
                                    placeholder={t("home.searchPlaceholder")}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    aria-label={t("home.searchLabel")}
                                />

                                <a href="#pueblos" className="hero-search-btn">
                                    {t("buttons.search")}
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="hero-feature-card">
                        <img
                            src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=90"
                            alt="Paisaje natural de Costa Rica"
                        />

                        <div className="hero-feature-info">
                            <span>{t("home.featuredLabel")}</span>
                            <h3>{t("home.featuredTitle")}</h3>
                            <p>{t("home.featuredText")}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container travel-categories image-categories">
                <div className="travel-category-card image-category-card beach-card">
                    <img
                        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=90"
                        alt={t("home.beachTitle")}
                    />

                    <div>
                        <span>{t("home.beachSpan")}</span>
                        <h3>{t("home.beachTitle")}</h3>
                        <p>{t("home.beachText")}</p>
                    </div>
                </div>

                <div className="travel-category-card image-category-card forest-card">
                    <img
                        src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=90"
                        alt={t("home.forestTitle")}
                    />

                    <div>
                        <span>{t("home.forestSpan")}</span>
                        <h3>{t("home.forestTitle")}</h3>
                        <p>{t("home.forestText")}</p>
                    </div>
                </div>

                <div className="travel-category-card image-category-card culture-card">
                    <img
                        src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=90"
                        alt={t("home.cultureTitle")}
                    />

                    <div>
                        <span>{t("home.cultureSpan")}</span>
                        <h3>{t("home.cultureTitle")}</h3>
                        <p>{t("home.cultureText")}</p>
                    </div>
                </div>

                <div className="travel-category-card image-category-card mountain-card">
                    <img
                        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=90"
                        alt={t("home.mountainTitle")}
                    />

                    <div>
                        <span>{t("home.mountainSpan")}</span>
                        <h3>{t("home.mountainTitle")}</h3>
                        <p>{t("home.mountainText")}</p>
                    </div>
                </div>
            </section>

            <main className="container" id="pueblos">
                <div className="section-header">
                    <span className="section-kicker">
                        {t("home.destinationKicker")}
                    </span>

                    <h2 className="section-title">
                        {t("home.destinationTitle")}
                    </h2>

                    <p className="section-subtitle">
                        {t("home.destinationSubtitle")}
                    </p>
                </div>

                {loading && (
                    <LoadingSpinner text={t("home.loading")} />
                )}

                {!loading && error && (
                    <ErrorMessage
                        message={error}
                        onRetry={loadTowns}
                        retryText={t("buttons.retry")}
                    />
                )}

                {!loading && !error && (
                    <div className="row justify-content-center">
                        {filteredTowns.length > 0 ? (
                            filteredTowns.map((town) => (
                                <div
                                    className="col-12 col-md-6 col-lg-4 mb-4"
                                    key={town.id}
                                >
                                    <PlaceCard town={town} />
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted">
                                {t("home.noTowns")}
                            </p>
                        )}
                    </div>
                )}
            </main>
        </>
    );
}

export default Home;