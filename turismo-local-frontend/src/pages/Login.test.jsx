import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, test, expect, vi, beforeEach, afterAll } from "vitest";
import Login from "./Login";
import api from "../api/api";

// 1. Mock de react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, options) => {
      const translations = {
        "login.brand": "Turismo UNA",
        "login.appName": "Turismo Local",
        "login.subtitle": "Descubre Costa Rica",
        "login.loadingTown": "Cargando información del destino...",
        "login.start": "¡Bienvenido a Turismo Local!",
        "login.defaultText": "Inicia sesión para explorar los mejores rincones.",
        "login.google": "Iniciar sesión con Google",
        "login.secure": "Conexión segura SSL",
        "login.floatingTitle": "Destinos Populares",
        "login.floatingText": "Más de 100 lugares por visitar",
        "login.beach": "Playas",
        "login.forest": "Bosques",
        "login.towns": "Pueblos",
        "login.mountains": "Montañas",
        "login.imageTitle": "Explora más",
        "login.imageText": "Tu aventura comienza aquí.",
        "login.welcomeTown": `¡Bienvenido a ${options?.town}!`,
      };
      return translations[key] || key;
    }
  })
}));

// 2. Mock de la API axios
vi.mock("../api/api", () => ({
  default: {
    get: vi.fn()
  }
}));

const originalLocation = window.location;

describe("Login", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    localStorage.clear();

    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, href: "" },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  test("renderiza el login por defecto de manera correcta (sin ID de pueblo)", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/error" element={<div>Página de Error</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("¡Bienvenido a Turismo Local!")).toBeTruthy();
    expect(screen.getByText("Inicia sesión para explorar los mejores rincones.")).toBeTruthy();
  });

  test("renderiza la bienvenida personalizada si encuentra un pueblo válido y activo", async () => {
    api.get.mockResolvedValue({
      data: { id: "123", name: "Liberia", description: "La ciudad blanca", active: true }
    });

    render(
      <MemoryRouter initialEntries={["/login/123"]}>
        <Routes>
          <Route path="/login/:townId" element={<Login />} />
          <Route path="/error" element={<div>Página de Error</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Cargando información del destino...")).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText("¡Bienvenido a Liberia!")).toBeTruthy();
      expect(screen.getByText("La ciudad blanca")).toBeTruthy();
    });
  });

  test("redirige a /error si el pueblo devuelto por la API está inactivo", async () => {
    api.get.mockResolvedValue({
      data: { id: "123", name: "Pueblo Oculto", active: false }
    });

    render(
      <MemoryRouter initialEntries={["/login/123"]}>
        <Routes>
          <Route path="/login/:townId" element={<Login />} />
          <Route path="/error" element={<div>Página de Error</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Página de Error")).toBeTruthy();
    });
  });

  test("redirige a /error si la llamada a la API falla", async () => {
    api.get.mockRejectedValue(new Error("API Fail"));

    render(
      <MemoryRouter initialEntries={["/login/123"]}>
        <Routes>
          <Route path="/login/:townId" element={<Login />} />
          <Route path="/error" element={<div>Página de Error</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Página de Error")).toBeTruthy();
    });
  });

  test("guarda qrTownId en localStorage y redirige a la URL de Google OAuth al hacer clic en el botón", () => {
    const locationMock = { href: "" };
    Object.defineProperty(window, "location", {
      configurable: true,
      value: locationMock,
    });

    render(
      <MemoryRouter initialEntries={["/login/123"]}>
        <Routes>
          <Route path="/login/:townId" element={<Login />} />
          <Route path="/error" element={<div>Página de Error</div>} />
        </Routes>
      </MemoryRouter>
    );

    const googleBtn = screen.getByLabelText("Iniciar sesión con Google");
    fireEvent.click(googleBtn);

    expect(localStorage.getItem("qrTownId")).toBe("123");
    expect(locationMock.href).toContain("/oauth2/authorization/google");
  });
});