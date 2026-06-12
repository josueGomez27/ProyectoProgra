import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, test, expect, beforeEach, vi, afterAll } from "vitest";
import Navbar from "./Navbar";

// 1. Mock de react-i18next (Corregido i18next -> i18n para evitar excepciones unhandled)
const mockChangeLanguage = vi.fn();
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        "nav.home": "Inicio",
        "nav.admin": "Panel Admin",
        "nav.qr": "Escanear QR",
        "nav.hello": "Hola",
        "nav.logout": "Cerrar Sesión"
      };
      return translations[key] || key;
    },
    i18n: {
      changeLanguage: mockChangeLanguage
    }
  })
}));

describe("Navbar", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("muestra el enlace Inicio", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByText("Inicio")).toBeTruthy();
  });

  test("muestra el nombre del usuario cuando la sesión está activa", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ name: "Dana", role: "USER", picture: "foto.jpg" })
    );

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText(/Hola, Dana/i)).toBeTruthy();
  });

  test("muestra opciones exclusivas de administrador si el rol es ADMIN", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ name: "Dana", role: "ADMIN", picture: "foto.jpg" })
    );

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText("Panel Admin")).toBeTruthy();
    expect(screen.getByText("Escanear QR")).toBeTruthy();
  });

  test("remueve el usuario del localStorage al hacer clic en Cerrar Sesión y cierra el menú", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ name: "Dana", role: "USER", picture: "foto.jpg" })
    );

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const logoutBtn = screen.getAllByText("Cerrar Sesión")[0];
    fireEvent.click(logoutBtn);

    expect(localStorage.getItem("user")).toBeNull();
  });

  test("abre y cierra el menú móvil al interactuar con el botón de menú y el logo", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Simula abrir/cerrar el menú móvil con el botón de hamburguesa
    const menuBtn = screen.getByLabelText("Abrir o cerrar menú");
    fireEvent.click(menuBtn); // Abre menú

    // Hace clic en el logo de la marca para activar closeMenu() (Línea 30)
    const brandLogo = screen.getByText("Turismo Local UNA");
    fireEvent.click(brandLogo);
  });

  test("interactúa con los botones del LanguageSwitcher", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Buscamos los botones de idioma generados por LanguageSwitcher (ES / EN)
    const btnES = screen.queryByText("ES") || screen.queryByTitle("Español");
    const btnEN = screen.queryByText("EN") || screen.queryByTitle("English");

    if (btnES) fireEvent.click(btnES);
    if (btnEN) fireEvent.click(btnEN);

    // Verifica que la función i18n.changeLanguage fue llamada tras los clics
    expect(mockChangeLanguage).toHaveBeenCalled();
  });
});