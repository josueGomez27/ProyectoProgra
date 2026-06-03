import { useState } from "react";

function AdminPlaces() {
    const [places, setPlaces] = useState([
        {
            id: 1,
            name: "Parque Central Liberia",
            category: "Turístico",
            address: "Centro de Liberia",
            imageUrl: "https://www.travelexcellence.com/wp-content/uploads/2020/09/liberia-guanacaste-01.jpg",
            active: true,
        },
    ]);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        category: "",
        address: "",
        imageUrl: "",
    });

    const openAddForm = () => {
        setEditingId(null);
        setForm({
            name: "",
            category: "",
            address: "",
            imageUrl: "",
        });
        setShowForm(true);
    };

    const openEditForm = (place) => {
        setEditingId(place.id);
        setForm({
            name: place.name,
            category: place.category,
            address: place.address,
            imageUrl: place.imageUrl,
        });
        setShowForm(true);
    };

    const savePlace = (e) => {
        e.preventDefault();

        if (editingId) {
            setPlaces(
                places.map((place) =>
                    place.id === editingId
                        ? { ...place, ...form }
                        : place
                )
            );
        } else {
            setPlaces([
                ...places,
                {
                    id: Date.now(),
                    ...form,
                    active: true,
                },
            ]);
        }

        setShowForm(false);
    };

    const deletePlace = (id) => {
        const confirmDelete = confirm("¿Seguro que desea eliminar este lugar?");
        if (confirmDelete) {
            setPlaces(places.filter((place) => place.id !== id));
        }
    };

    const toggleStatus = (id) => {
        setPlaces(
            places.map((place) =>
                place.id === id
                    ? { ...place, active: !place.active }
                    : place
            )
        );
    };

    return (
        <div className="admin-page">
            <aside className="admin-sidebar">
                <h3>Administración</h3>

                <a>Panel</a>
                <a>Pueblos</a>
                <a className="active">Lugares</a>
                <a>Usuarios</a>
                <a>Estadísticas</a>
            </aside>

            <main className="admin-content">
                <div className="admin-header">
                    <div>
                        <span className="section-kicker">Panel de administración</span>
                        <h1>Gestión de lugares turísticos</h1>
                    </div>

                    <button className="admin-add-btn" onClick={openAddForm}>
                        + Agregar nuevo lugar
                    </button>
                </div>

                <div className="admin-table-card">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Nombre</th>
                                <th>Categoría</th>
                                <th>Dirección</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {places.map((place) => (
                                <tr key={place.id}>
                                    <td>
                                        <img
                                            src={place.imageUrl}
                                            alt={place.name}
                                        />
                                    </td>

                                    <td>{place.name}</td>

                                    <td>
                                        <span className="admin-badge">
                                            {place.category}
                                        </span>
                                    </td>

                                    <td>{place.address}</td>

                                    <td>
                                        <button
                                            className={
                                                place.active
                                                    ? "status active"
                                                    : "status inactive"
                                            }
                                            onClick={() => toggleStatus(place.id)}
                                        >
                                            {place.active ? "Activo" : "Inactivo"}
                                        </button>
                                    </td>

                                    <td>
                                        <button
                                            className="edit-btn"
                                            onClick={() => openEditForm(place)}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() => deletePlace(place.id)}
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
                    <div className="admin-modal">
                        <h2>
                            {editingId ? "Editar lugar" : "Agregar nuevo lugar"}
                        </h2>

                        <form onSubmit={savePlace}>
                            <label>Nombre</label>
                            <input
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                                required
                            />

                            <label>Categoría</label>
                            <input
                                value={form.category}
                                onChange={(e) =>
                                    setForm({ ...form, category: e.target.value })
                                }
                                required
                            />

                            <label>Dirección</label>
                            <input
                                value={form.address}
                                onChange={(e) =>
                                    setForm({ ...form, address: e.target.value })
                                }
                                required
                            />

                            <label>URL de imagen</label>
                            <input
                                value={form.imageUrl}
                                onChange={(e) =>
                                    setForm({ ...form, imageUrl: e.target.value })
                                }
                                required
                            />

                            <div className="modal-actions">
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

export default AdminPlaces;