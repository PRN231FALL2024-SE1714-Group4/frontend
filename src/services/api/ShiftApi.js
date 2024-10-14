
import api from "../../config/axios";


const getWorkerInShift = async () => {
    try {
        const response = await api.get(`UserShift/workers-in-shift`);
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};
const getAvailableUsers = async () => {
    try {
        const response = await api.get(`UserShift/available-users`);
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};
const registerShift = async (data) => {
    try {
        const response = await api.post(`UserShift`, {data});
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
        throw error;
    }
};

export { registerShift, getWorkerInShift,getAvailableUsers };








