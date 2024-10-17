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

export const updateAnimal = async (id, breed, gender,age,source, dateOfBirth) => {
    try {
        const response = await api.put(`account/${id}`, {
            breed, gender,age,source, dateOfBirth
        });
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export const deleteAnimal = async (id) => {
    try {
        const response = await api.put(`Animal/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};
export const addAnimal = async (breed, age, gender, source) => {
    try {
        const response = await api.post('Animal', { breed, age, gender, source });
        console.log("API response:", response.data); // Check API response
        return response.data;
    } catch (error) {
        console.error("Error adding animal:", error);
        throw error;
    }
};
