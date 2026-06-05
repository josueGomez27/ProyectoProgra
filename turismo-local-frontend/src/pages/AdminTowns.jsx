import { useState } from "react";
import api from "../api/api";

function AdminTowns() {
    const [form, setForm] = useState({
        name: "",
        province: "",
        canton: "",
        district: "",
        description: "",
        imageUrl: ""
    });

    const handleSubmit = async (e) => {
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

            alert("Pueblo guardado correctamente");

            setForm({
                name: "",
                province: "",
                canton: "",
                district: "",
                description: "",
                imageUrl: ""
            });
        } catch (error) {
            console.error("Error guardando pueblo:", error);
            alert("No se pudo guardar el pueblo");
        }
    };

    return (
        <div className="admin-content">
            <div className="admin-header">
                <div>
                    <span className="section-kicker">
                        Panel de administración
                    </span>

                    <h1>Gestión de pueblos</h1>
                </div>
            </div>

            <div className="admin-table-card">
                <h3>Nuevo pueblo</h3>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                        required
                    />

                    <input
                        type="text"
                        placeholder="Provincia"
                        value={form.province}
                        onChange={(e) =>
                            setForm({ ...form, province: e.target.value })
                        }
                        required
                    />

                    <input
                        type="text"
                        placeholder="Cantón"
                        value={form.canton}
                        onChange={(e) =>
                            setForm({ ...form, canton: e.target.value })
                        }
                        required
                    />

                    <input
                        type="text"
                        placeholder="Distrito"
                        value={form.district}
                        onChange={(e) =>
                            setForm({ ...form, district: e.target.value })
                        }
                        required
                    />

                    <textarea
                        placeholder="Descripción"
                        rows="4"
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                    />

                    <input
                        type="text"
                        placeholder="URL de imagen del pueblo"
                        value={form.imageUrl}
                        onChange={(e) =>
                            setForm({ ...form, imageUrl: e.target.value })
                        }
                        required
                    />

                    <button type="submit">
                        Guardar Pueblo
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminTowns;