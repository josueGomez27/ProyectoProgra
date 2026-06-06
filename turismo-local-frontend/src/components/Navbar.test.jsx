import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, test, expect } from "vitest";
import Navbar from "./Navbar";

describe("Navbar", () => {
  test("muestra el enlace Inicio", () => {

    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "Dana",
        role: "ADMIN",
        picture: "foto.jpg"
      })
    );

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText("Inicio")).toBeTruthy();
  });
});