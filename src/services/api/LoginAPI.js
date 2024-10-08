import api from "../../config/axios";

const API_BASE_URL = "https://localhost:7017/api";
export const LoginAPI = async (data) => {
    try {
        const response = await api.post(`/User/login`, data);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};
