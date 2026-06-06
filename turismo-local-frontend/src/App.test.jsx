import { render } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import App from "./App";

describe("App", () => {
  test("renderiza la aplicación sin errores", () => {
    render(<App />);
    expect(document.body).toBeTruthy();
  });
});