import api from "../../config/axios";

export const LoginAPI = async (data) => {
    try {
        const response = await api.post(`/User/login`, data);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};
export const LoginGoogleAPI = async () => {
    try {
        const response = await api.get(`/Google/google-login`);
        return response;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const LoginGoogleResponseAPI = async () => {
    try {
        const response = await api.get(`/Google/google-response` )

        return response;
    } catch (error) {
        console.error("Error fetching Google response:", error);
        throw error;
    }
};