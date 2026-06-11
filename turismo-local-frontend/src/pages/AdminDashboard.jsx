import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

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

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
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

            const admins = users.filter((user) => user.role === "ADMIN").length;
            const normalUsers = users.filter((user) => user.role === "USER").length;

            const categoryCounter = {};
            activePlaces.forEach((place) => {
                const categoryName = place.category?.name || "Sin categoría";
                categoryCounter[categoryName] = (categoryCounter[categoryName] || 0) + 1;
            });

            const townCounter = {};
            activePlaces.forEach((place) => {
                const townName = place.town?.name || "Sin pueblo";
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
        }
    };

    const categoryChartData = {
        labels: Object.keys(placesByCategory),
        datasets: [
            {
                label: "Lugares por categoría",
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
                label: "Lugares por pueblo",
                data: Object.values(placesByTown),
                backgroundColor: "#064635"
            }
        ]
    };

    const usersChartData = {
        labels: ["Administradores", "Usuarios normales"],
        datasets: [
            {
                label: "Usuarios por rol",
                data: [stats.admins, stats.normalUsers],
                backgroundColor: ["#064635", "#d89b3d"]
            }
        ]
    };

    return (
        <div className="admin-page">
            <aside className="admin-sidebar">
                <h3>Administración</h3>

                <Link className="active" to="/admin">Dashboard</Link>
                <Link to="/admin/towns">Pueblos</Link>
                <Link to="/admin/places">Lugares</Link>
                <Link to="/admin/categories">Categorías</Link>
                <{currentUser?.role === "SUPER_ADMIN" && (
                     <Link to="/admin/users">Usuarios</Link>
                 )}
                <Link to="/admin/stats">Estadísticas</Link>

            </aside>

            <main className="admin-content">
                <div className="admin-header">
                    <div>
                        <span className="section-kicker">
                            Panel de administración
                        </span>

                        <h1>Dashboard</h1>
                    </div>
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <h3>Lugares turísticos activos</h3>
                        <h2>{stats.places}</h2>
                    </div>

                    <div className="dashboard-card">
                        <h3>Pueblos activos</h3>
                        <h2>{stats.towns}</h2>
                    </div>

                    <div className="dashboard-card">
                        <h3>Categorías activas</h3>
                        <h2>{stats.categories}</h2>
                    </div>

                    <div className="dashboard-card">
                        <h3>Usuarios</h3>
                        <h2>{stats.users}</h2>
                    </div>

                    <div className="dashboard-card">
                        <h3>Administradores</h3>
                        <h2>{stats.admins}</h2>
                    </div>

                    <div className="dashboard-card">
                        <h3>Usuarios normales</h3>
                        <h2>{stats.normalUsers}</h2>
                    </div>
                </div>

                <div className="quick-actions">
                    <Link to="/admin/places" className="quick-action-btn">
                        + Agregar Lugar
                    </Link>

                    <Link to="/admin/towns" className="quick-action-btn">
                        + Crear Pueblo
                    </Link>

                    <Link to="/admin/categories" className="quick-action-btn">
                        + Crear Categoría
                    </Link>

                    <Link to="/admin/users" className="quick-action-btn">
                        Administrar Usuarios
                    </Link>

                    <Link to="/admin/stats" className="quick-action-btn">
                        Ver Estadísticas
                    </Link>
                </div>

                <div className="dashboard-charts">
                    <div className="chart-card">
                        <h3>Lugares activos por categoría</h3>
                        <Pie data={categoryChartData} />
                    </div>

                    <div className="chart-card">
                        <h3>Usuarios por rol</h3>
                        <Pie data={usersChartData} />
                    </div>

                    <div className="chart-card chart-wide">
                        <h3>Lugares activos por pueblo</h3>
                        <Bar data={townChartData} />
                    </div>
                </div>

                <div className="latest-card">
                    <h3>Últimos lugares activos agregados</h3>

                    {latestPlaces.length === 0 ? (
                        <p>No hay lugares activos registrados.</p>
                    ) : (
                        <div className="latest-list">
                            {latestPlaces.map((place) => (
                                <div className="latest-item" key={place.id}>
                                    <img
                                        src={
                                            place.imageUrl ||
                                            "https://placehold.co/100x100"
                                        }
                                        alt={place.name}
                                    />

                                    <div>
                                        <strong>{place.name}</strong>
                                        <p>
                                            {place.town?.name || "Sin pueblo"} ·{" "}
                                            {place.category?.name || "Sin categoría"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;