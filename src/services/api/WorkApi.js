import api from "../../config/axios";

export const getWork = async () => {
    try {
        const response = await api.get(`Work `);
        return response.data;
    } catch (error) {
        console.error("Error fetching work:", error);
        throw error;
    }
};

export const getMyWork = async () => {
    try {
        const response = await api.get(`Work/my-work`);
        return response.data;
    } catch (error) {
        console.error("Error fetching my-work:", error);
        throw error;
    }
};
export const getMyAssignedTask = async () => {
    try {
        const response = await api.get(`Work/assigned-tasks`);
        return response.data;
    } catch (error) {
        console.error("Error fetching assigned-tasks :", error);
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
    cageId,
    description,
    startDate,
    endDate,
    shift,
    assigneeID,
    mission
) => {
    try {
        const response = await api.post(`Work/create`, {
            cageId,
            description,
            startDate,
            endDate,
            shift,
            assigneeID,
            mission
        });
        return response.data;
    } catch (error) {
        console.error("Error ADD WORK:", error);
        throw error;
    }
};

export const updateWork = async (id, description, startDate, endDate, shift, assigneeID, mission, status) => {
    try {
        const response = await api.put(`Work/${id}`, {
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
        const response = await api.delete(`Work/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

