import { describe, test, expect, vi, beforeEach } from "vitest";
import { getAllTowns } from "./townService";
import api from "../api/api";

// Mockear el cliente de la API (Axios custom)
vi.mock("../api/api", () => ({
  default: {
    get: vi.fn()
  }
}));

describe("townService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("getAllTowns devuelve la data correctamente cuando la API responde con éxito", async () => {
    const mockData = [{ id: 1, name: "Liberia" }];
    api.get.mockResolvedValue({ data: mockData });

    const result = await getAllTowns();

    expect(api.get).toHaveBeenCalledWith("/towns");
    expect(result).toEqual(mockData);
  });

  test("getAllTowns lanza un error cuando la petición de la API falla", async () => {
    api.get.mockRejectedValue(new Error("Network Error"));

    await expect(getAllTowns()).rejects.toThrow("Network Error");
  });
});