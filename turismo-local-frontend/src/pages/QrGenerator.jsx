import { useState } from "react";
import api from "../api/api";
import "./QrGenerator.css";

function QrGenerator() {
    const [townId, setTownId] = useState("");
    const [qr, setQr] = useState(null);
    const [error, setError] = useState("");

    const generateQr = async () => {
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

    return (
        <div className="qr-page">
            <div className="qr-card">
                <h1>Gestión de códigos QR</h1>

                <p>
                    Ingresá el ID del pueblo para generar, regenerar o consultar
                    su código QR de acceso.
                </p>

                <input
                    type="number"
                    placeholder="ID del pueblo"
                    value={townId}
                    onChange={(e) => setTownId(e.target.value)}
                />

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

                        {qr.qrImageUrl && (
                            <a
                                href={qr.qrValue}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Abrir URL del QR
                            </a>
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default QrGenerator;