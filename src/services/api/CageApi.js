import axios from "axios";

const API_BASE_URL = "https://localhost:7017";
const API_CAGE_URL = API_BASE_URL + "/api/Cage";
const getCage = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/Cage`);
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};

const createCage  = async (cageName,areaID) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/Cage`, {
            cageName,areaID
        });
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};
const deleteCage  = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/api/Cage/${id}`);
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};
const updateCage  = async (id, cageName,areaID) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/api/Cage/${id}`, {
            cageName, areaID
        });
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};

const getCageById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/Cage/${id}`);
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};
export { createCage, getCage,deleteCage,updateCage,getCageById };








