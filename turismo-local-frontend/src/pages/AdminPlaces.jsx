import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import api from "../api/api";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

function LocationMarker({ position, setPosition, setForm }) {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;

            setPosition([lat, lng]);

            setForm((prev) => ({
                ...prev,
                latitude: lat.toFixed(6),
                longitude: lng.toFixed(6),
            }));
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={markerIcon} />
    );
}

function AdminPlaces() {
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const [places, setPlaces] = useState([]);
    const [towns, setTowns] = useState([]);
    const [categories, setCategories] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [mapMarkerPos, setMapMarkerPos] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [form, setForm] = useState({
        name: "",
        categoryId: "",
        address: "",
        imageUrl: "",
        townId: "",
        latitude: "",
        longitude: ""
    });

    const loadData = async () => {
        try {
            const [placesRes, townsRes, categoriesRes] = await Promise.all([
                api.get("/places"),
                api.get("/towns"),
                api.get("/categories")
            ]);

            setPlaces(placesRes.data);
            setTowns(townsRes.data);
            setCategories(categoriesRes.data);
        } catch (error) {
            console.error("Error al cargar datos:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const openAddForm = () => {
        setEditingId(null);
        setMapMarkerPos(null);
        setUploadingImage(false);

        setForm({
            name: "",
            categoryId: "",
            address: "",
            imageUrl: "",
            townId: "",
            latitude: "",
            longitude: ""
        });

        setShowForm(true);
    };

    const openEditForm = (place) => {
        setEditingId(place.id);
        setUploadingImage(false);

        if (place.latitude && place.longitude) {
            setMapMarkerPos([
                Number(place.latitude),
                Number(place.longitude)
            ]);
        } else {
            setMapMarkerPos(null);
        }

        setForm({
            name: place.name || "",
            categoryId: place.category?.id || "",
            address: place.address || "",
            imageUrl: place.imageUrl || "",
            townId: place.town?.id || "",
            latitude: place.latitude || "",
            longitude: place.longitude || ""
        });

        setShowForm(true);
    };

    const uploadImage = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploadingImage(true);

            const response = await api.post("/images/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setForm((prev) => ({
                ...prev,
                imageUrl: response.data.imageUrl,
            }));

            alert("Imagen subida correctamente.");
        } catch (error) {
            console.error("Error subiendo imagen:", error);
            alert("No se pudo subir la imagen.");
        } finally {
            setUploadingImage(false);
        }
    };

    const savePlace = async (e) => {
        e.preventDefault();

        if (uploadingImage) {
            alert("Espere a que termine de subir la imagen.");
            return;
        }

        if (!form.imageUrl) {
            alert("Debe subir una imagen o ingresar una URL.");
            return;
        }

        const payload = {
            name: form.name,
            address: form.address,
            imageUrl: form.imageUrl,
            active: editingId
                ? places.find((p) => p.id === editingId)?.active
                : true,
            townId: parseInt(form.townId),
            categoryId: parseInt(form.categoryId),
            latitude: form.latitude ? parseFloat(form.latitude) : null,
            longitude: form.longitude ? parseFloat(form.longitude) : null,

            // Auditoría
            createdBy: currentUser?.email
        };

        try {
            if (editingId) {
                await api.put(`/places/${editingId}`, payload);
            } else {
                await api.post("/places", payload);
            }

            await loadData();
            setShowForm(false);
        } catch (error) {
            console.error("Error al guardar lugar:", error);
            alert("No se pudo guardar el lugar.");
        }
    };

    const deletePlace = async (id) => {
        if (confirm("¿Seguro que desea eliminar este lugar?")) {
            try {
                await api.delete(`/places/${id}`);
                await loadData();
            } catch (error) {
                console.error("Error al eliminar:", error);
            }
        }
    };

    const toggleStatus = async (place) => {
        try {
            const payload = {
                name: place.name,
                address: place.address,
                imageUrl: place.imageUrl,
                active: !place.active,
                townId: place.town?.id || null,
                categoryId: place.category?.id || null,
                latitude: place.latitude || null,
                longitude: place.longitude || null,

                // Auditoría
                createdBy: place.createdBy
            };

            await api.put(`/places/${place.id}`, payload);
            await loadData();
        } catch (error) {
            console.error("Error al cambiar estado:", error);
        }
    };

    const defaultCenter = mapMarkerPos || [10.6346, -85.4377];

    return (
        <div className="admin-page">
            <aside className="admin-sidebar">
                <h3>Administración</h3>

                <Link to="/admin">Dashboard</Link>
                <Link to="/admin/towns">Pueblos</Link>
                <Link className="active" to="/admin/places">Lugares</Link>
                <Link to="/admin/categories">Categorías</Link>

                {currentUser?.role === "SUPER_ADMIN" && (
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
                        <h1>Gestión de lugares turísticos</h1>
                    </div>

                    <button className="admin-add-btn" onClick={openAddForm}>
                        + Agregar Lugar
                    </button>
                </div>

                <div className="admin-table-card">
                    <table className="admin-table places-table">
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Nombre</th>
                                <th>Pueblo</th>
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
                                            src={place.imageUrl || "https://placehold.co/100x100"}
                                            alt={place.name}
                                        />
                                    </td>

                                    <td>{place.name}</td>
                                    <td>{place.town?.name || "Sin pueblo"}</td>

                                    <td>
                                        <span
                                            className="admin-badge"
                                            style={{
                                                backgroundColor: place.category?.color || "#d89b3d",
                                                color: "#ffffff"
                                            }}
                                        >
                                            {place.category?.name || "Sin categoría"}
                                        </span>
                                    </td>

                                    <td>{place.address}</td>

                                    <td>
                                        <button
                                            className={place.active ? "status active" : "status inactive"}
                                            onClick={() => toggleStatus(place)}
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
                    <div
                        className="admin-modal"
                        style={{ maxWidth: "900px", width: "90%" }}
                    >
                        <h2>{editingId ? "Editar lugar" : "Agregar nuevo lugar"}</h2>

                        <form onSubmit={savePlace}>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "20px"
                                }}
                            >
                                <div>
                                    <label>Nombre</label>
                                    <input
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm({ ...form, name: e.target.value })
                                        }
                                        required
                                    />

                                    <label>Pueblo</label>
                                    <select
                                        value={form.townId}
                                        onChange={(e) =>
                                            setForm({ ...form, townId: e.target.value })
                                        }
                                        required
                                    >
                                        <option value="">Seleccione un pueblo...</option>
                                        {towns.map((town) => (
                                            <option key={town.id} value={town.id}>
                                                {town.name}
                                            </option>
                                        ))}
                                    </select>

                                    <label>Categoría</label>
                                    <select
                                        value={form.categoryId}
                                        onChange={(e) =>
                                            setForm({ ...form, categoryId: e.target.value })
                                        }
                                        required
                                    >
                                        <option value="">Seleccione una categoría...</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>

                                    <label>Dirección</label>
                                    <input
                                        value={form.address}
                                        onChange={(e) =>
                                            setForm({ ...form, address: e.target.value })
                                        }
                                        required
                                    />

                                    <label>Imagen del lugar</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={uploadImage}
                                    />

                                    {uploadingImage && (
                                        <small>Subiendo imagen...</small>
                                    )}

                                    <label>URL de imagen</label>
                                    <input
                                        value={form.imageUrl}
                                        onChange={(e) =>
                                            setForm({ ...form, imageUrl: e.target.value })
                                        }
                                        required
                                    />

                                    {form.imageUrl && (
                                        <img
                                            src={form.imageUrl}
                                            alt="Vista previa"
                                            style={{
                                                width: "100%",
                                                height: "140px",
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                                marginTop: "10px"
                                            }}
                                        />
                                    )}
                                </div>

                                <div>
                                    <label>Ubicación Geográfica</label>

                                    <div
                                        style={{
                                            height: "260px",
                                            borderRadius: "8px",
                                            overflow: "hidden",
                                            border: "1px solid #ccc",
                                            marginBottom: "12px"
                                        }}
                                    >
                                        <MapContainer
                                            center={defaultCenter}
                                            zoom={13}
                                            style={{ height: "100%", width: "100%" }}
                                        >
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                                            <LocationMarker
                                                position={mapMarkerPos}
                                                setPosition={setMapMarkerPos}
                                                setForm={setForm}
                                            />
                                        </MapContainer>
                                    </div>

                                    <small>
                                        Haz clic en el mapa para marcar el punto exacto.
                                    </small>

                                    <label>Latitud</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={form.latitude}
                                        onChange={(e) =>
                                            setForm({ ...form, latitude: e.target.value })
                                        }
                                        required
                                    />

                                    <label>Longitud</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={form.longitude}
                                        onChange={(e) =>
                                            setForm({ ...form, longitude: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div
                                className="modal-actions"
                                style={{ marginTop: "20px" }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancelar
                                </button>

                                <button type="submit" disabled={uploadingImage}>
                                    {uploadingImage ? "Subiendo..." : "Guardar"}
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