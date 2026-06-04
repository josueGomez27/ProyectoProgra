import { useState } from "react";

function AdminTowns() {

    const [form, setForm] = useState({
        name: "",
        province: "",
        canton: "",
        district: ""
    });

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

                <input
                    type="text"
                    placeholder="Nombre"
                    value={form.name}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                />

                <button>
                    Guardar Pueblo
                </button>
            </div>
        </div>
    );
}

export default AdminTowns;