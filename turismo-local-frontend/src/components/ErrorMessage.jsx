function ErrorMessage({ message, onRetry, retryText = "Reintentar" }) {
    return (
        <div
            className="alert alert-danger d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3"
            role="alert"
        >
            <span>{message}</span>

            {onRetry && (
                <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={onRetry}
                >
                    {retryText}
                </button>
            )}
        </div>
    );
}

export default ErrorMessage;