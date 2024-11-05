import api from "../../config/axios";

export const getReport = async () => {
    try {
        const response = await api.get(`Report `);
        return response.data;
    } catch (error) {
        console.error("Error fetching reports:", error);
        throw error;
    }
};

export const updateReport= async (id, description, healthDescription,workStatus) => {
    try {
        const response = await api.put(`Report/${id}`, {
            description, healthDescription, workStatus
        });
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export const deleteReport = async (id) => {
    try {
        const response = await api.put(`Report/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting report:", error);
        throw error;
    }
};
export const addReport = async (
    workId,
    description,
    workStatus
    
) => {
    try {
        const response = await api.post(`Report`, {
            workId,
            description,
            workStatus
        });
        return response.data;
    } catch (error) {
        console.error("Error create report:", error);
        throw error;
    }
};