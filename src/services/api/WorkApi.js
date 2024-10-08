import api from "../../config/axios";

export const getWork = async () => {
    try {
        const response = await api.get(`Work `);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const getMyWork = async () => {
    try {
        const response = await api.get(`Work/my-work`);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};
export const getAssignedTask = async () => {
    try {
        const response = await api.get(`Work/assigned-tasks`);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const addWork = async (
    areaID,
    description,
    startDate,
    endDate,
    shift,
    assigneeID,
 
) => {
    try {
        const response = await api.post(`Work/create`, {
            areaID,
            description,
            startDate,
            endDate,
            shift,
            assigneeID,
         
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const updateWork = async (id, description, startDate, endDate, shift, assigneeID, mission, status) => {
    try {
        const response = await api.put(`account/${id}`, {
            description, startDate, endDate, shift, assigneeID, mission, status
        });
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};
export const deleteWork = async (id) => {
    try {
        const response = await api.delete(`account/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

