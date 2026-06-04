import api from "../api/api";

export const getAllTowns = async () => {
    const response = await api.get("/towns");

    console.log("RESPUESTA API:", response);
    console.log("RESPUESTA DATA:", response.data);

    return response.data;
};