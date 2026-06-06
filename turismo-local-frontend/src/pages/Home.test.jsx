import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import Home from "./Home";

vi.mock("../services/townService", () => ({
  getAllTowns: () => Promise.resolve([])
}));

vi.mock("../components/PlaceCard", () => ({
  default: () => <div>PlaceCard</div>
}));

describe("Home", () => {
  test("actualiza el valor del buscador", () => {

    render(<Home />);

    const input = screen.getByPlaceholderText(
      "Buscar pueblo, provincia o cantón..."
    );

    fireEvent.change(input, {
      target: { value: "Liberia" }
    });

    expect(input.value).toBe("Liberia");
  });
});