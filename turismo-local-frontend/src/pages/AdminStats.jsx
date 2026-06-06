import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function AdminStats() {
    const [stats, setStats] = useState({
        towns: 0,
        places: 0,
        categories: 0,
        users: 0,
        activeUsers: 0,
        admins: 0
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [townsRes, placesRes, categoriesRes, usersRes] =
                await Promise.all([
                    api.get("/towns"),
                    api.get("/places"),
                    api.get("/categories"),
                    api.get("/users")
                ]);

            const towns = townsRes.data || [];
            const places = placesRes.data || [];
            const categories = categoriesRes.data || [];
            const users = usersRes.data || [];

            const activeTowns = towns.filter((town) => town.active === true);
            const activePlaces = places.filter((place) => place.active === true);
            const activeCategories = categories.filter((category) => category.active === true);

            setStats({
                towns: activeTowns.length,
                places: activePlaces.length,
                categories: activeCategories.length,
                users: users.length,
                activeUsers: users.filter((u) => u.active === true).length,
                admins: users.filter((u) => u.role === "ADMIN").length
            });
        } catch (error) {
            console.error("Error cargando estadísticas:", error);
            alert("No se pudieron cargar las estadísticas.");
        }
    };

    return (
        <div className="admin-page">
            <aside className="admin-sidebar">
                <h3>Administración</h3>

                <Link to="/admin">Dashboard</Link>
                <Link to="/admin/towns">Pueblos</Link>
                <Link to="/admin/places">Lugares</Link>
                <Link to="/admin/categories">Categorías</Link>
                <Link to="/admin/users">Usuarios</Link>
                <Link className="active" to="/admin/stats">Estadísticas</Link>
            </aside>

            <main className="admin-content">
                <div className="admin-header">
                    <div>
                        <span className="section-kicker">
                            Panel de administración
                        </span>

                        <h1>Estadísticas generales</h1>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stats-card">
                        <span>🏘️</span>
                        <h3>{stats.towns}</h3>
                        <p>Pueblos activos</p>
                    </div>

                    <div className="stats-card">
                        <span>📍</span>
                        <h3>{stats.places}</h3>
                        <p>Lugares turísticos activos</p>
                    </div>

                    <div className="stats-card">
                        <span>🏷️</span>
                        <h3>{stats.categories}</h3>
                        <p>Categorías activas</p>
                    </div>

                    <div className="stats-card">
                        <span>👥</span>
                        <h3>{stats.users}</h3>
                        <p>Usuarios registrados</p>
                    </div>

                    <div className="stats-card">
                        <span>✅</span>
                        <h3>{stats.activeUsers}</h3>
                        <p>Usuarios activos</p>
                    </div>

                    <div className="stats-card">
                        <span>🛡️</span>
                        <h3>{stats.admins}</h3>
                        <p>Administradores</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminStats;