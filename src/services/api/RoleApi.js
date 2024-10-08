import axios from "axios";

const API_BASE_URL = "https://localhost:7017";
const getRole = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/Role`);
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};

const createRole = async (name) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/Role`, {
            name,
        });
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};
const deleteRole = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/api/Role/${id}`);
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};
const updateRole = async (id, name) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/api/Role/${id}`, {
            name,
        });
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};


export { createRole, getRole, deleteRole, updateRole };








