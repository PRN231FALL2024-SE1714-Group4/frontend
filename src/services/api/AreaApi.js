import axios from "axios";

const API_BASE_URL = "https://localhost:7017";
const getArea = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/Area`);
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};

const createArea = async (name) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/Area`, {
            name,
        });
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};
const deleteArea = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/api/Area/${id}`);
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};
const updateArea = async (id, name) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/api/Area/${id}`, {
            name,
        });
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};

const getAreaById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/Area/${id}`);
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};
export { createArea, getArea,deleteArea,updateArea,getAreaById };








