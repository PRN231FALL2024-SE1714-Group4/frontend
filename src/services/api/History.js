import axios from "axios";
import api from "../../config/axios";


const getHistory = async () => {
    try {
        const response = await api.get(`History`);
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};

const createHistory = async (data) => {
    try {
        const response = await api.post(`History`,data);
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};
const deleteHistory = async (id) => {
    try {
        const response = await api.delete(`History/${id}`);
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};
const updateHistory = async (id, name) => {
    try {
        const response = await api.put(`History/${id}`, {
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
        const response = await api.get(`History/${id}`);
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};
export { createHistory, getHistory,deleteHistory,updateHistory,getAreaById };








