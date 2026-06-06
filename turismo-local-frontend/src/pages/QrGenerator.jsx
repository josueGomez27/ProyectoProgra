import { useEffect, useState } from "react";
import api from "../api/api";
import "./QrGenerator.css";

function QrGenerator() {
    const [towns, setTowns] = useState([]);
    const [townId, setTownId] = useState("");
    const [qr, setQr] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        loadTowns();
    }, []);

    const loadTowns = async () => {
        try {
            const response = await api.get("/towns");

            const activeTowns = response.data.filter(
                (town) => town.active === true
            );

            setTowns(activeTowns);

            if (activeTowns.length > 0) {
                setTownId(activeTowns[0].id);
            } else {
                setTownId("");
            }
        } catch (error) {
            console.error("Error cargando pueblos:", error);
            setError("No se pudieron cargar los pueblos.");
        }
    };

    const validateTownSelected = () => {
        if (!townId) {
            setError("Seleccione un pueblo activo antes de continuar.");
            return false;
        }

        return true;
    };

    const generateQr = async () => {
        if (!validateTownSelected()) return;

        try {
            setError("");
            setQr(null);

            const response = await api.post(`/qrcodes/generate/town/${townId}`);

            setQr(response.data);
        } catch (e) {
            console.error(e);
            setError("No se pudo generar el código QR.");
        }
    };

    const regenerateQr = async () => {
        if (!validateTownSelected()) return;

        try {
            setError("");
            setQr(null);

            const response = await api.post(`/qrcodes/regenerate/town/${townId}`);

            setQr(response.data);
        } catch (e) {
            console.error(e);
            setError("No se pudo regenerar el código QR.");
        }
    };

    const getActiveQr = async () => {
        if (!validateTownSelected()) return;

        try {
            setError("");
            setQr(null);

            const response = await api.get(`/qrcodes/town/${townId}/active`);

            setQr(response.data);
        } catch (e) {
            console.error(e);
            setError("No se encontró un QR activo para este pueblo.");
        }
    };

    const selectedTown = towns.find(
        (town) => String(town.id) === String(townId)
    );

    return (
        <div className="qr-page">
            <div className="qr-card">
                <h1>Gestión de códigos QR</h1>

                <p>
                    Seleccioná un pueblo activo para generar, regenerar o consultar
                    su código QR de acceso al sistema.
                </p>

                <label className="qr-label">
                    Seleccione un pueblo
                </label>

                <select
                    className="qr-select"
                    value={townId}
                    onChange={(e) => {
                        setTownId(e.target.value);
                        setQr(null);
                        setError("");
                    }}
                >
                    {towns.length === 0 ? (
                        <option value="">
                            No hay pueblos activos registrados
                        </option>
                    ) : (
                        towns.map((town) => (
                            <option key={town.id} value={town.id}>
                                {town.name} - {town.canton}
                            </option>
                        ))
                    )}
                </select>

                {selectedTown && (
                    <div className="qr-town-preview">
                        <strong>{selectedTown.name}</strong>
                        <span>
                            {selectedTown.province} · {selectedTown.canton}
                        </span>
                    </div>
                )}

                <div className="qr-buttons">
                    <button onClick={generateQr}>
                        Generar QR
                    </button>

                    <button onClick={regenerateQr}>
                        Regenerar QR
                    </button>

                    <button onClick={getActiveQr}>
                        Ver QR activo
                    </button>
                </div>

                {error && (
                    <div className="qr-error">
                        {error}
                    </div>
                )}

                {qr && (
                    <div className="qr-result">
                        <h3>QR del pueblo</h3>

                        {qr.qrImageUrl && (
                            <img
                                src={qr.qrImageUrl}
                                alt="Código QR"
                            />
                        )}

                        <p>
                            <strong>Valor:</strong> {qr.qrValue}
                        </p>

                        {qr.qrValue && (
                            <a
                                href={qr.qrValue}
                                target="_blank"
                                rel="noreferrer"
                                className="qr-link"
                            >
                                Probar enlace del QR
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default QrGenerator;