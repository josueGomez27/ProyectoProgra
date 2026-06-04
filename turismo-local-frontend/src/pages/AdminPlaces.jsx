import { useState, useEffect } from "react";
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
            const newPos = [lat, lng];
            setPosition(newPos);


            setForm((prev) => ({
                ...prev,
                latitude: lat.toFixed(6),
                longitude: lng.toFixed(6),
            }));
        },
    });

    return position === null ? null : <Marker position={position} icon={markerIcon} />;
}

function AdminPlaces() {
    const [places, setPlaces] = useState([]);
    const [towns, setTowns] = useState([]);
    const [categories, setCategories] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);


    const [mapMarkerPos, setMapMarkerPos] = useState(null);

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
            console.error("Error al sincronizar con la DB:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const openAddForm = () => {
        setEditingId(null);
        setMapMarkerPos(null);
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


        if (place.latitude && place.longitude) {
            setMapMarkerPos([Number(place.latitude), Number(place.longitude)]);
        } else {
            setMapMarkerPos(null);
        }

        setForm({
            name: place.name,
            categoryId: place.category?.id || "",
            address: place.address,
            imageUrl: place.imageUrl,
            townId: place.town?.id || "",
            latitude: place.latitude || "",
            longitude: place.longitude || ""
        });
        setShowForm(true);
    };

    const savePlace = async (e) => {
        e.preventDefault();
console.log("FORM:", form);

const lugarPayload = {
    name: form.name,
    address: form.address,
    imageUrl: form.imageUrl,
    active: editingId ? places.find(p => p.id === editingId)?.active : true,
    townId: parseInt(form.townId),
    categoryId: parseInt(form.categoryId),
    latitude: form.latitude ? parseFloat(form.latitude) : null,
    longitude: form.longitude ? parseFloat(form.longitude) : null
};

console.log("PAYLOAD:", lugarPayload);

        try {
            if (editingId) {
                await api.put(`/places/${editingId}`, lugarPayload);
            } else {
                await api.post("/places", lugarPayload);
            }
            await loadData();
            setShowForm(false);
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Error al intentar guardar el registro.");
        }
    };

    const deletePlace = async (id) => {
        if (confirm("¿Seguro que desea eliminar este lugar de la base de datos?")) {
            try {
                await api.delete(`/places/${id}`);
                loadData();
            } catch (error) {
                console.error("Error al eliminar:", error);
            }
        }
    };

    const toggleStatus = async (place) => {
        try {
            const lugarModificado = {
                name: place.name,
                address: place.address,
                imageUrl: place.imageUrl,
                active: !place.active,
                townId: place.town?.id ? parseInt(place.town.id) : null,
                categoryId: place.category?.id ? parseInt(place.category.id) : null,
                latitude: place.latitude ? parseFloat(place.latitude) : null,
                longitude: place.longitude ? parseFloat(place.longitude) : null
            };

            await api.put(`/places/${place.id}`, lugarModificado);
            loadData();
        } catch (error) {
            console.error("Error al mutar estado:", error);
        }
    };


    const defaultCenter = mapMarkerPos ? mapMarkerPos : [10.6346, -85.4377];

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
                                        <span className="admin-badge">
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
                                        <button className="edit-btn" onClick={() => openEditForm(place)}>Editar</button>
                                        <button className="delete-btn" onClick={() => deletePlace(place.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {showForm && (
                            <div className="modal-backdrop-custom">

                                <div className="admin-modal" style={{ maxWidth: '900px', width: '90%' }}>
                                    <h2>{editingId ? "Editar lugar" : "Agregar nuevo lugar"}</h2>

                                    <form onSubmit={savePlace}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

                                <div>
                                    <label>Nombre</label>
                                    <input
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        required
                                    />

                                    <label>Pueblo</label>
                                    <select
                                        value={form.townId}
                                        onChange={(e) => setForm({ ...form, townId: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '8px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
                                    >
                                        <option value="">Seleccione un pueblo...</option>
                                        {towns.map((t) => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>

                                    <label>Categoría</label>
                                    <select
                                        value={form.categoryId}
                                        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '8px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
                                    >
                                        <option value="">Seleccione una categoría...</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>

                                    <label>Dirección</label>
                                    <input
                                        value={form.address}
                                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                                        required
                                    />

                                    <label>URL de imagen</label>
                                    <input
                                        value={form.imageUrl}
                                        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                                        required
                                    />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <label style={{ fontWeight: 'bold', marginBottom: '6px' }}>Ubicación Geográfica</label>

                                    <div style={{ height: "260px", borderRadius: "8px", overflow: "hidden", border: "1px solid #ccc", marginBottom: '12px' }}>
                                        <MapContainer
                                            center={defaultCenter}
                                            zoom={13}
                                            style={{ height: "100%", width: "100%" }}
                                        >
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                            <LocationMarker position={mapMarkerPos} setPosition={setMapMarkerPos} setForm={setForm} />
                                        </MapContainer>
                                    </div>
                                    <span style={{ fontSize: '11px', color: '#6c757d', marginBottom: '12px', marginTop: '-6px' }}>
                                        💡 Haz un clic en el mapa para marcar el punto exacto.
                                    </span>

                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '12px' }}>Latitud</label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={form.latitude}
                                                onChange={(e) => {
                                                    setForm({ ...form, latitude: e.target.value });
                                                    if(e.target.value && form.longitude) setMapMarkerPos([Number(e.target.value), Number(form.longitude)]);
                                                }}
                                                required
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '12px' }}>Longitud</label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={form.longitude}
                                                onChange={(e) => {
                                                    setForm({ ...form, longitude: e.target.value });
                                                    if(form.latitude && e.target.value) setMapMarkerPos([Number(form.latitude), Number(e.target.value)]);
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="modal-actions" style={{ marginTop: '20px' }}>
                                <button type="button" onClick={() => setShowForm(false)}>Cancelar</button>
                                <button type="submit">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPlaces;