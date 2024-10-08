import axios from "axios";
const API_BASE_URL = "http://apijewelryauction.techx.id.vn:8081";
const createCategory = async (name) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/v1/category`, {
            name,
        });
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};

const getAllCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/category`);
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};
const getCategoryById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/category/${id}`);
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};
const updateCategory = async (id, name) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/api/v1/category/${id}`, { name });
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};
const deleteCategory = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/api/v1/category/${id}`);
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};

export { createCategory, deleteCategory, getAllCategories, updateCategory, getCategoryById };
