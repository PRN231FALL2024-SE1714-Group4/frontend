import api from "../../config/axios";



const getCage = async () => {
    try {
        const response = await api.get(`Cage`);
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};

const createCage  = async (cageName,areaID) => {
    try {
        const response = await api.post(`Cage`, {
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
        const response = await api.delete(`Cage/${id}`);
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};
const updateCage  = async (id, cageName,areaID) => {
    try {
        const response = await api.put(`Cage/${id}`, {
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
        const response = await api.get(`Cage/${id}`);
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};
export { createCage, getCage,deleteCage,updateCage,getCageById };








