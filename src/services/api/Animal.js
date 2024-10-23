import api from "../../config/axios";

export const getAnimal = async () => {
    try {
        const response = await api.get(`Animal`);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const updateAnimal = async (id, data) => {
    try {
        const response = await api.put(`Animal/${id}`, data)
        return response.data;
    } catch (error) {
        console.error("Error updating animal:", error);
        throw error;
    }
};

export const deleteAnimal = async (id) => {
    try {
        const response = await api.delete(`Animal/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting animal:", error);
        throw error;
    }
};
export const addAnimal = async (data) => {
    try {
        const response = await api.post('Animal', data);
        console.log("API response:", response.data); // Check API response
        return response.data;
    } catch (error) {
        console.error("Error adding animal:", error);
        throw error;
    }
};
