import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, test, expect, vi } from "vitest";
import PlaceCard from "./PlaceCard";

// Mock de las traducciones por si usa i18next dentro
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key
  })
}));

describe("PlaceCard", () => {
  test("renderiza los detalles del pueblo correctamente", () => {
    const mockTown = {
      id: "123",
      name: "Zarcero",
      province: "Alajuela",
      image: "zarcero.jpg",
      description: "Famoso por su parque de cipreses."
    };

    render(
      <BrowserRouter>
        <PlaceCard town={mockTown} />
      </BrowserRouter>
    );

    // Verifica que se muestre el nombre del pueblo
    expect(screen.getByText("Zarcero")).toBeTruthy();
  });
});