import axios from "axios";
import api from "../../config/axios";


const getArea = async () => {
    try {
        const response = await api.get(`Area`);
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};

const createArea = async (name) => {
    try {
        const response = await api.post(`Area`, {
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
        const response = await api.delete(`Area/${id}`);
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};
const updateArea = async (id, name) => {
    try {
        const response = await api.put(`Area/${id}`, {
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
        const response = await api.get(`Area/${id}`);
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};
export { createArea, getArea,deleteArea,updateArea,getAreaById };








