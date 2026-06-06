import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        name: "",
        color: "#d89b3d"
    });

    const loadCategories = async () => {
        try {
            const response = await api.get("/categories");
            setCategories(response.data);
        } catch (error) {
            console.error("Error cargando categorías:", error);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const saveCategory = async (e) => {
        e.preventDefault();

        const payload = {
            name: form.name,
            color: form.color,
            active: true
        };

        try {
            await api.post("/categories", payload);
            await loadCategories();

            setShowForm(false);

            setForm({
                name: "",
                color: "#d89b3d"
            });

            alert("Categoría creada correctamente");
        } catch (error) {
            console.error("Error guardando categoría:", error);
            alert("No se pudo guardar la categoría.");
        }
    };

    return (
        <div className="admin-page">
            <aside className="admin-sidebar">
                <h3>Administración</h3>

                <Link to="/admin">Dashboard</Link>
                <Link to="/admin/towns">Pueblos</Link>
                <Link to="/admin/places">Lugares</Link>
                <Link className="active" to="/admin/categories">Categorías</Link>
                <Link to="/admin/users">Usuarios</Link>
               <Link to="/admin/stats">Estadísticas</Link>
            </aside>

            <main className="admin-content">
                <div className="admin-header">
                    <div>
                        <span className="section-kicker">
                            Panel de administración
                        </span>

                        <h1>Gestión de categorías</h1>
                    </div>

                    <button
                        className="admin-add-btn"
                        onClick={() => setShowForm(true)}
                    >
                        + Crear Categoría
                    </button>
                </div>

                <div className="admin-table-card">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Color</th>
                                <th>Estado</th>
                            </tr>
                        </thead>

                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id}>
                                    <td>{category.name}</td>

                                    <td>
                                        <span
                                            style={{
                                                display: "inline-block",
                                                width: "30px",
                                                height: "30px",
                                                borderRadius: "50%",
                                                backgroundColor: category.color || "#d89b3d"
                                            }}
                                        ></span>
                                    </td>

                                    <td>
                                        <span className="status active">
                                            {category.active ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {showForm && (
                <div className="modal-backdrop-custom">
                    <div className="admin-modal" style={{ maxWidth: "500px" }}>
                        <h2>Nueva Categoría</h2>

                        <form onSubmit={saveCategory}>
                            <label>Nombre</label>
                            <input
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                                required
                            />

                            <label>Color</label>
                            <input
                                type="color"
                                value={form.color}
                                onChange={(e) =>
                                    setForm({ ...form, color: e.target.value })
                                }
                            />

                            <div className="modal-actions" style={{ marginTop: "20px" }}>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancelar
                                </button>

                                <button type="submit">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminCategories;