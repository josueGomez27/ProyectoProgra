import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function AdminTowns() {
    const [towns, setTowns] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        province: "",
        canton: "",
        district: "",
        description: "",
        imageUrl: "",
        active: true
    });

    const loadTowns = async () => {
        try {
            const response = await api.get("/towns");
            setTowns(response.data);
        } catch (error) {
            console.error("Error cargando pueblos:", error);
        }
    };

    useEffect(() => {
        loadTowns();
    }, []);

    const resetForm = () => {
        setForm({
            name: "",
            province: "",
            canton: "",
            district: "",
            description: "",
            imageUrl: "",
            active: true
        });
    };

    const openCreateForm = () => {
        setEditingId(null);
        resetForm();
        setShowForm(true);
    };

    const openEditForm = (town) => {
        setEditingId(town.id);

        setForm({
            name: town.name || "",
            province: town.province || "",
            canton: town.canton || "",
            district: town.district || "",
            description: town.description || "",
            imageUrl: town.imageUrl || "",
            active: town.active ?? true
        });

        setShowForm(true);
    };

    const saveTown = async (e) => {
        e.preventDefault();

        const payload = {
            name: form.name,
            province: form.province,
            canton: form.canton,
            district: form.district,
            description: form.description,
            imageUrl: form.imageUrl,
            slug: form.name.toLowerCase().replaceAll(" ", "-"),
            active: form.active
        };

        try {
            if (editingId) {
                await api.put(`/towns/${editingId}`, payload);
                alert("Pueblo actualizado correctamente");
            } else {
                await api.post("/towns", payload);
                alert("Pueblo creado correctamente");
            }

            await loadTowns();
            setShowForm(false);
            setEditingId(null);
            resetForm();
        } catch (error) {
            console.error("Error guardando pueblo:", error);
            alert("No se pudo guardar el pueblo.");
        }
    };

    const deleteTown = async (id) => {
        const confirmDelete = confirm(
            "¿Seguro que deseas eliminar este pueblo? Si tiene lugares asociados, puede dar error."
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/towns/${id}`);
            await loadTowns();
            alert("Pueblo eliminado correctamente");
        } catch (error) {
            console.error("Error eliminando pueblo:", error);
            alert("No se pudo eliminar el pueblo. Puede tener lugares asociados.");
        }
    };

    return (
        <div className="admin-page">
            <aside className="admin-sidebar">
                <h3>Administración</h3>

               <Link to="/admin">Dashboard</Link>
               <Link className="active" to="/admin/towns">Pueblos</Link>
               <Link to="/admin/places">Lugares</Link>
               <Link to="/admin/categories">Categorías</Link>
               <Link to="/admin/users">Usuarios</Link>
               <Link to="/admin/stats">Estadísticas</Link>
            </aside>

            <main className="admin-content">
                <div className="admin-header">
                    <div>
                        <span className="section-kicker">
                            Panel de administración
                        </span>

                        <h1>Gestión de pueblos</h1>
                    </div>

                    <button className="admin-add-btn" onClick={openCreateForm}>
                        + Crear Pueblo
                    </button>
                </div>

                <div className="admin-table-card">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Nombre</th>
                                <th>Provincia</th>
                                <th>Cantón</th>
                                <th>Distrito</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {towns.map((town) => (
                                <tr key={town.id}>
                                    <td>
                                        <img
                                            src={town.imageUrl || "https://placehold.co/100x100"}
                                            alt={town.name}
                                        />
                                    </td>

                                    <td>{town.name}</td>
                                    <td>{town.province}</td>
                                    <td>{town.canton}</td>
                                    <td>{town.district}</td>

                                    <td>
                                        <span
                                            className={
                                                town.active
                                                    ? "status active"
                                                    : "status inactive"
                                            }
                                        >
                                            {town.active ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            className="edit-btn"
                                            onClick={() => openEditForm(town)}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() => deleteTown(town.id)}
                                        >
                                            Eliminar
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
                    <div className="admin-modal" style={{ maxWidth: "700px" }}>
                        <h2>{editingId ? "Editar Pueblo" : "Nuevo Pueblo"}</h2>

                        <form onSubmit={saveTown}>
                            <label>Nombre</label>
                            <input
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                                required
                            />

                            <label>Provincia</label>
                            <input
                                value={form.province}
                                onChange={(e) =>
                                    setForm({ ...form, province: e.target.value })
                                }
                                required
                            />

                            <label>Cantón</label>
                            <input
                                value={form.canton}
                                onChange={(e) =>
                                    setForm({ ...form, canton: e.target.value })
                                }
                                required
                            />

                            <label>Distrito</label>
                            <input
                                value={form.district}
                                onChange={(e) =>
                                    setForm({ ...form, district: e.target.value })
                                }
                                required
                            />

                            <label>Descripción</label>
                            <textarea
                                rows="4"
                                value={form.description}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        description: e.target.value
                                    })
                                }
                            />

                            <label>URL de imagen del pueblo</label>
                            <input
                                type="text"
                                value={form.imageUrl}
                                onChange={(e) =>
                                    setForm({ ...form, imageUrl: e.target.value })
                                }
                                placeholder="https://ejemplo.com/imagen.jpg"
                                required
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

                            <div
                                className="modal-actions"
                                style={{ marginTop: "20px" }}
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingId(null);
                                        resetForm();
                                    }}
                                >
                                    Cancelar
                                </button>

                                <button type="submit">
                                    {editingId ? "Actualizar" : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminTowns;