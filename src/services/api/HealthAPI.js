import api from "../../config/axios";

export const getHealth = async () => {
    try {
        const response = await api.get(`HealthReport`);
        return response.data;
    } catch (error) {
        console.error("Error fetching HealthReport:", error);
        throw error;
    }
};

export const updateHealthReport = async (id, data) => {
    try {
        const response = await api.put(`HealthReport/${id}`, data)
        return response.data;
    } catch (error) {
        console.error("Error updating HealthReport:", error);
        throw error;
    }
};

export const deleteHealthReport = async (id) => {
    try {
        const response = await api.delete(`HealthReport/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting HealthReport:", error);
        throw error;
    }
};
export const addHealthReport = async (data) => {
    try {
        const response = await api.post('HealthReport', data);
        console.log("API response:", response.data); // Check API response
        return response.data;
    } catch (error) {
        console.error("Error adding HealthReport:", error);
        throw error;
    }
};
