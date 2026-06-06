import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function AdminDashboard() {

    const [stats, setStats] = useState({
        places: 0,
        towns: 0,
        categories: 0,
        users: 0
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {

        try {

            const [places, towns, categories, users] =
                await Promise.all([
                    api.get("/places"),
                    api.get("/towns"),
                    api.get("/categories"),
                    api.get("/users")
                ]);

            setStats({
                places: places.data.length,
                towns: towns.data.length,
                categories: categories.data.length,
                users: users.data.length
            });

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="admin-page">

            <aside className="admin-sidebar">

                <h3>Administración</h3>

                <Link className="active" to="/admin">
                    Dashboard
                </Link>

                <Link to="/admin/towns">
                    Pueblos
                </Link>

                <Link to="/admin/places">
                    Lugares
                </Link>

                <Link to="/admin/categories">
                    Categorías
                </Link>

                <Link to="/admin/users">
                    Usuarios
                </Link>

                <Link to="/admin/stats">
                    Estadísticas
                </Link>

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
                        <h3>Lugares turísticos</h3>
                        <h2>{stats.places}</h2>
                    </div>

                    <div className="dashboard-card">
                        <h3>Pueblos</h3>
                        <h2>{stats.towns}</h2>
                    </div>

                    <div className="dashboard-card">
                        <h3>Categorías</h3>
                        <h2>{stats.categories}</h2>
                    </div>

                    <div className="dashboard-card">
                        <h3>Usuarios</h3>
                        <h2>{stats.users}</h2>
                    </div>

                </div>

            </main>

        </div>
    );
}

export default AdminDashboard;