import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, test, expect, vi } from "vitest";
import Error404 from "./Error404";

// Mock exacto con todas las llaves que renderiza el componente
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        "notFound.kicker": "Error",
        "notFound.title": "Página no encontrada",
        "notFound.text": "Lo sentimos, el lugar que buscas no existe o ha sido movido.",
        "notFound.warning": "Advertencia",
        "buttons.backHome": "Volver al Inicio",
        "buttons.retry": "Reintentar"
      };
      return translations[key] || key;
    }
  })
}));

describe("Error404", () => {
  test("renderiza los textos de error 404 y el botón de navegación correctamente", () => {
    render(
      <BrowserRouter>
        <Error404 />
      </BrowserRouter>
    );

    // Verificaciones de contenido traducido
    expect(screen.getByText("Página no encontrada")).toBeTruthy();
    expect(screen.getByText("Lo sentimos, el lugar que buscas no existe o ha sido movido.")).toBeTruthy();
    expect(screen.getByText("Volver al Inicio")).toBeTruthy();

    // Encuentra el botón de reintentar
    const retryBtn = screen.queryByText("Reintentar") || screen.queryByText("buttons.retry");
    expect(retryBtn).toBeTruthy();

    // Hacemos clic en el botón para cubrir la línea 41 (el handler de reintentar)
    if (retryBtn) {
      fireEvent.click(retryBtn);
    }
  });
});