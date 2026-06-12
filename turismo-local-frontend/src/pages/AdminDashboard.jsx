import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
);

function AdminDashboard() {
    const { t } = useTranslation();

    const [stats, setStats] = useState({
        places: 0,
        towns: 0,
        categories: 0,
        users: 0,
        admins: 0,
        normalUsers: 0
    });

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const [placesByCategory, setPlacesByCategory] = useState({});
    const [placesByTown, setPlacesByTown] = useState({});
    const [latestPlaces, setLatestPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const [placesRes, townsRes, categoriesRes, usersRes] =
                await Promise.all([
                    api.get("/places"),
                    api.get("/towns"),
                    api.get("/categories"),
                    api.get("/users")
                ]);

            const places = placesRes.data || [];
            const towns = townsRes.data || [];
            const categories = categoriesRes.data || [];
            const users = usersRes.data || [];

            const activePlaces = places.filter((place) => place.active === true);
            const activeTowns = towns.filter((town) => town.active === true);
            const activeCategories = categories.filter((category) => category.active === true);

            const admins = users.filter(
                (user) => user.role === "ADMIN" || user.role === "SUPER_ADMIN"
            ).length;

            const normalUsers = users.filter(
                (user) => user.role === "USER" || user.role === "CLIENT"
            ).length;

            const categoryCounter = {};
            activePlaces.forEach((place) => {
                const categoryName = place.category?.name || t("admin.noCategory");
                categoryCounter[categoryName] = (categoryCounter[categoryName] || 0) + 1;
            });

            const townCounter = {};
            activePlaces.forEach((place) => {
                const townName = place.town?.name || t("admin.noTown");
                townCounter[townName] = (townCounter[townName] || 0) + 1;
            });

            setStats({
                places: activePlaces.length,
                towns: activeTowns.length,
                categories: activeCategories.length,
                users: users.length,
                admins,
                normalUsers
            });

            setPlacesByCategory(categoryCounter);
            setPlacesByTown(townCounter);
            setLatestPlaces([...activePlaces].slice(-4).reverse());

        } catch (error) {
            console.error("Error cargando dashboard:", error);
            setErrorMessage(t("admin.loadError"));
        } finally {
            setLoading(false);
        }
    };

    const categoryChartData = {
        labels: Object.keys(placesByCategory),
        datasets: [
            {
                label: t("admin.placesByCategory"),
                data: Object.values(placesByCategory),
                backgroundColor: [
                    "#4CAF50",
                    "#14715f",
                    "#2196F3",
                    "#9C27B0",
                    "#d89b3d",
                    "#8B5A1A"
                ]
            }
        ]
    };

    const townChartData = {
        labels: Object.keys(placesByTown),
        datasets: [
            {
                label: t("admin.placesByTown"),
                data: Object.values(placesByTown),
                backgroundColor: "#064635"
            }
        ]
    };

    const usersChartData = {
        labels: [t("admin.admins"), t("admin.normalUsers")],
        datasets: [
            {
                label: t("admin.usersByRole"),
                data: [stats.admins, stats.normalUsers],
                backgroundColor: ["#064635", "#d89b3d"]
            }
        ]
    };

    return (
        <div className="admin-page">
            <aside className="admin-sidebar" aria-label="Menú de administración">
                <h3>{t("admin.sidebarTitle")}</h3>

                <Link className="active" to="/admin">{t("admin.dashboard")}</Link>
                <Link to="/admin/towns">{t("admin.towns")}</Link>
                <Link to="/admin/places">{t("admin.places")}</Link>
                <Link to="/admin/categories">{t("admin.categories")}</Link>

                {currentUser?.role === "SUPER_ADMIN" && (
                    <Link to="/admin/users">{t("admin.users")}</Link>
                )}

                <Link to="/admin/stats">{t("admin.stats")}</Link>
            </aside>

            <main className="admin-content">
                <div className="admin-header">
                    <div>
                        <span className="section-kicker">
                            {t("admin.section")}
                        </span>

                        <h1>{t("admin.dashboard")}</h1>
                    </div>
                </div>

                {loading && (
                    <LoadingSpinner text={t("admin.loading")} />
                )}

                {!loading && errorMessage && (
                    <ErrorMessage
                        message={errorMessage}
                        onRetry={loadDashboard}
                        retryText={t("buttons.retry")}
                    />
                )}

                {!loading && !errorMessage && (
                    <>
                        <div className="dashboard-grid">
                            <div className="dashboard-card">
                                <h3>{t("admin.activePlaces")}</h3>
                                <h2>{stats.places}</h2>
                            </div>

                            <div className="dashboard-card">
                                <h3>{t("admin.activeTowns")}</h3>
                                <h2>{stats.towns}</h2>
                            </div>

                            <div className="dashboard-card">
                                <h3>{t("admin.activeCategories")}</h3>
                                <h2>{stats.categories}</h2>
                            </div>

                            <div className="dashboard-card">
                                <h3>{t("admin.users")}</h3>
                                <h2>{stats.users}</h2>
                            </div>

                            <div className="dashboard-card">
                                <h3>{t("admin.admins")}</h3>
                                <h2>{stats.admins}</h2>
                            </div>

                            <div className="dashboard-card">
                                <h3>{t("admin.normalUsers")}</h3>
                                <h2>{stats.normalUsers}</h2>
                            </div>
                        </div>

                        <div className="quick-actions">
                            <Link to="/admin/places" className="quick-action-btn">
                                {t("admin.addPlace")}
                            </Link>

                            <Link to="/admin/towns" className="quick-action-btn">
                                {t("admin.addTown")}
                            </Link>

                            <Link to="/admin/categories" className="quick-action-btn">
                                {t("admin.addCategory")}
                            </Link>

                            {currentUser?.role === "SUPER_ADMIN" && (
                                <Link to="/admin/users" className="quick-action-btn">
                                    {t("admin.manageUsers")}
                                </Link>
                            )}

                            <Link to="/admin/stats" className="quick-action-btn">
                                {t("admin.viewStats")}
                            </Link>
                        </div>

                        <div className="dashboard-charts">
                            <div className="chart-card">
                                <h3>{t("admin.placesByCategory")}</h3>
                                <Pie data={categoryChartData} />
                            </div>

                            <div className="chart-card">
                                <h3>{t("admin.usersByRole")}</h3>
                                <Pie data={usersChartData} />
                            </div>

                            <div className="chart-card chart-wide">
                                <h3>{t("admin.placesByTown")}</h3>
                                <Bar data={townChartData} />
                            </div>
                        </div>

                        <div className="latest-card">
                            <h3>{t("admin.latestPlaces")}</h3>

                            {latestPlaces.length === 0 ? (
                                <p>{t("admin.noLatestPlaces")}</p>
                            ) : (
                                <div className="latest-list">
                                    {latestPlaces.map((place) => (
                                        <div className="latest-item" key={place.id}>
                                            <img
                                                src={
                                                    place.imageUrl ||
                                                    "https://placehold.co/100x100"
                                                }
                                                alt={`Imagen de ${place.name}`}
                                            />

                                            <div>
                                                <strong>{place.name}</strong>
                                                <p>
                                                    {place.town?.name || t("admin.noTown")} ·{" "}
                                                    {place.category?.name || t("admin.noCategory")}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default AdminDashboard;