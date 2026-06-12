function LoadingSpinner({ text = "Cargando..." }) {
    return (
        <div
            className="d-flex flex-column align-items-center justify-content-center py-5"
            role="status"
            aria-live="polite"
        >
            <div className="spinner-border text-success mb-3" aria-hidden="true"></div>
            <p className="text-muted mb-0">{text}</p>
        </div>
    );
}

export default LoadingSpinner;