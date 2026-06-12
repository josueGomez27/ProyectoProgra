import axios from "axios";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
    baseURL: `${backendUrl.replace(/\/$/, "")}/api`,
    withCredentials: true,
});

export default api;