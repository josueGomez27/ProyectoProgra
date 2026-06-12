import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("language", lang);
    };

    return (
        <div className="d-flex gap-2 align-items-center">
            <button
                type="button"
                className="btn btn-sm btn-outline-light"
                onClick={() => changeLanguage("es")}
                aria-label="Cambiar idioma a español"
                title="Español"
            >
                ES
            </button>

            <button
                type="button"
                className="btn btn-sm btn-outline-light"
                onClick={() => changeLanguage("en")}
                aria-label="Change language to English"
                title="English"
            >
                EN
            </button>
        </div>
    );
}

export default LanguageSwitcher;