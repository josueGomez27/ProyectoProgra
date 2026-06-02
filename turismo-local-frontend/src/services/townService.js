import api from "../api/api";

export const getAllTowns = async () => {
    const response = await api.get("/towns");
    return response.data;
};