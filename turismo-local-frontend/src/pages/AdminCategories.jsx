import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const [form, setForm] = useState({
        name: "",
        color: "#d89b3d",
        active: true
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await api.get("/categories");
            setCategories(response.data);
        } catch (error) {
            console.error("Error cargando categorías:", error);
        }
    };

    const openCreateForm = () => {
        setEditingCategory(null);
        setForm({
            name: "",
            color: "#d89b3d",
            active: true
        });
        setShowForm(true);
    };

    const openEditForm = (category) => {
        setEditingCategory(category);
        setForm({
            name: category.name || "",
            color: category.color || "#d89b3d",
            active: category.active ?? true
        });
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingCategory(null);
        setForm({
            name: "",
            color: "#d89b3d",
            active: true
        });
    };

    const saveCategory = async (e) => {
        e.preventDefault();

        const payload = {
            name: form.name,
            color: form.color,
            active: form.active
        };

        try {
            if (editingCategory) {
                await api.put(`/categories/${editingCategory.id}`, payload);
                alert("Categoría actualizada correctamente");
            } else {
                await api.post("/categories", payload);
                alert("Categoría creada correctamente");
            }

            await loadCategories();
            closeForm();
        } catch (error) {
            console.error("Error guardando categoría:", error);
            alert("No se pudo guardar la categoría.");
        }
    };

    const toggleCategoryStatus = async (category) => {
        const payload = {
            name: category.name,
            color: category.color,
            active: !category.active
        };

        try {
            await api.put(`/categories/${category.id}`, payload);
            await loadCategories();
        } catch (error) {
            console.error("Error cambiando estado:", error);
            alert("No se pudo cambiar el estado de la categoría.");
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
                        onClick={openCreateForm}
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
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id}>
                                    <td>{category.name}</td>

                                    <td>
                                        <span
                                            title={category.color}
                                            style={{
                                                display: "inline-block",
                                                width: "30px",
                                                height: "30px",
                                                borderRadius: "50%",
                                                backgroundColor: category.color || "#d89b3d",
                                                border: "2px solid #f1f1f1",
                                                boxShadow: "0 4px 12px rgba(0,0,0,0.12)"
                                            }}
                                        ></span>
                                    </td>

                                    <td>
                                        <button
                                            type="button"
                                            className={`status ${category.active ? "active" : "inactive"}`}
                                            onClick={() => toggleCategoryStatus(category)}
                                        >
                                            {category.active ? "Activo" : "Inactivo"}
                                        </button>
                                    </td>

                                    <td>
                                        <button
                                            type="button"
                                            className="edit-btn"
                                            onClick={() => openEditForm(category)}
                                        >
                                            Editar
                                        </button>
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
                        <h2>
                            {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
                        </h2>

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

                            <label>Estado</label>
                            <select
                                value={form.active ? "true" : "false"}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        active: e.target.value === "true"
                                    })
                                }
                            >
                                <option value="true">Activo</option>
                                <option value="false">Inactivo</option>
                            </select>

                            <div className="modal-actions" style={{ marginTop: "20px" }}>
                                <button
                                    type="button"
                                    onClick={closeForm}
                                >
                                    Cancelar
                                </button>

                                <button type="submit">
                                    {editingCategory ? "Actualizar" : "Guardar"}
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