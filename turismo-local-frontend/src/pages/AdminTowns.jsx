import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function AdminTowns() {
    const [towns, setTowns] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        name: "",
        province: "",
        canton: "",
        district: "",
        description: "",
        imageUrl: ""
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

    const openForm = () => {
        setForm({
            name: "",
            province: "",
            canton: "",
            district: "",
            description: "",
            imageUrl: ""
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
            active: true
        };

        try {
            await api.post("/towns", payload);
            await loadTowns();

            setShowForm(false);

            alert("Pueblo creado correctamente");
        } catch (error) {
            console.error("Error guardando pueblo:", error);
            alert("No se pudo guardar el pueblo.");
        }
    };

    return (
        <div className="admin-page">
            <aside className="admin-sidebar">
                <h3>Administración</h3>
                <Link to="/admin/places">Panel</Link>
                <Link className="active" to="/admin/towns">Pueblos</Link>
                <Link to="/admin/places">Lugares</Link>
                <Link to="/admin/categories">Categorías</Link>
                <a>Usuarios</a>
                <a>Estadísticas</a>
            </aside>

            <main className="admin-content">
                <div className="admin-header">
                    <div>
                        <span className="section-kicker">Panel de administración</span>
                        <h1>Gestión de pueblos</h1>
                    </div>

                    <button className="admin-add-btn" onClick={openForm}>
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
                                        <span className="status active">
                                            {town.active ? "Activo" : "Inactivo"}
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
                    <div className="admin-modal" style={{ maxWidth: "700px" }}>
                        <h2>Nuevo Pueblo</h2>

                        <form onSubmit={saveTown}>
                            <label>Nombre</label>
                            <input
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />

                            <label>Provincia</label>
                            <input
                                value={form.province}
                                onChange={(e) => setForm({ ...form, province: e.target.value })}
                                required
                            />

                            <label>Cantón</label>
                            <input
                                value={form.canton}
                                onChange={(e) => setForm({ ...form, canton: e.target.value })}
                                required
                            />

                            <label>Distrito</label>
                            <input
                                value={form.district}
                                onChange={(e) => setForm({ ...form, district: e.target.value })}
                                required
                            />

                            <label>Descripción</label>
                            <textarea
                                rows="4"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />

                            <label>URL de imagen del pueblo</label>
                            <input
                                type="text"
                                value={form.imageUrl}
                                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                                placeholder="https://ejemplo.com/imagen.jpg"
                                required
                            />

                            <div className="modal-actions" style={{ marginTop: "20px" }}>
                                <button type="button" onClick={() => setShowForm(false)}>
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

export default AdminTowns;