import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        pictureUrl: "",
        role: "USER",
        active: true
    });

    const loadUsers = async () => {
        try {
            const response = await api.get("/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Error cargando usuarios:", error);
            alert("No se pudieron cargar los usuarios.");
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const openEditForm = (user) => {
        setEditingId(user.id);

        setForm({
            name: user.name || "",
            email: user.email || "",
            pictureUrl: user.pictureUrl || "",
            role: user.role || "USER",
            active: user.active ?? true
        });

        setShowForm(true);
    };

    const saveUser = async (e) => {
        e.preventDefault();

        const payload = {
            name: form.name,
            email: form.email,
            pictureUrl: form.pictureUrl,
            role: form.role,
            active: form.active
        };

        try {
            await api.put(`/users/${editingId}`, payload);
            await loadUsers();

            setShowForm(false);
            setEditingId(null);

            alert("Usuario actualizado correctamente");
        } catch (error) {
            console.error("Error actualizando usuario:", error);
            alert("No se pudo actualizar el usuario.");
        }
    };

    return (
        <div className="admin-page">
            <aside className="admin-sidebar">
                <h3>Administración</h3>

            <Link to="/admin/places">Panel</Link>
            <Link to="/admin/towns">Pueblos</Link>
            <Link to="/admin/places">Lugares</Link>
            <Link to="/admin/categories">Categorías</Link>
            <Link className="active" to="/admin/users">Usuarios</Link>
            <a>Estadísticas</a>
            </aside>

            <main className="admin-content">
                <div className="admin-header">
                    <div>
                        <span className="section-kicker">
                            Panel de administración
                        </span>

                        <h1>Gestión de usuarios</h1>
                    </div>
                </div>

                <div className="admin-table-card">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Foto</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <img
                                            src={
                                                user.pictureUrl ||
                                                "https://placehold.co/100x100"
                                            }
                                            alt={user.name || "Usuario"}
                                            style={{
                                                width: "55px",
                                                height: "55px",
                                                borderRadius: "50%",
                                                objectFit: "cover"
                                            }}
                                        />
                                    </td>

                                    <td>{user.name}</td>
                                    <td>{user.email}</td>

                                    <td>
                                        <span
                                            className="admin-badge"
                                            style={{
                                                backgroundColor:
                                                    user.role === "ADMIN"
                                                        ? "#064635"
                                                        : "#d89b3d",
                                                color: "#ffffff"
                                            }}
                                        >
                                            {user.role}
                                        </span>
                                    </td>

                                    <td>
                                        <span
                                            className={
                                                user.active
                                                    ? "status active"
                                                    : "status inactive"
                                            }
                                        >
                                            {user.active ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            className="edit-btn"
                                            onClick={() => openEditForm(user)}
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
                    <div className="admin-modal" style={{ maxWidth: "650px" }}>
                        <h2>Editar Usuario</h2>

                        <form onSubmit={saveUser}>
                            <label>Nombre</label>
                            <input
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                                required
                            />

                            <label>Correo</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                                required
                            />

                            <label>URL de foto</label>
                            <input
                                value={form.pictureUrl}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        pictureUrl: e.target.value
                                    })
                                }
                            />

                            <label>Rol</label>
                            <select
                                value={form.role}
                                onChange={(e) =>
                                    setForm({ ...form, role: e.target.value })
                                }
                            >
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>

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
                                    }}
                                >
                                    Cancelar
                                </button>

                                <button type="submit">
                                    Actualizar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminUsers;