import api from "../../config/axios";

export const getAllUsers = async () => {
    try {
        const response = await api.get(`User `);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};
export const getRoles = async () => {
    try {
        const response = await api.get(`Role `);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};
export const updateUser = async (id, full_name, email, password, roleId, phone_number, address, is_active, date_of_birth) => {
    try {
        const response = await api.put(`account/${id}`, {
            full_name,
            email,
            password,
            roleId,
            phone_number,
            address,
            is_active,
            date_of_birth,
        });
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export const banUser = async (id) => {
    try {
        const response = await api.put(`account/${id}/ban`);
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};
export const addUser = async (
    roleID,
    password,
    fullName,
    dateOfBirth,
    gender,
    address,
    email,
    phone
) => {
    try {
        const response = await api.post(`User/register`, {
            roleID,
            password,
            fullName,
            dateOfBirth,
            gender,
            address,
            email,
            phone
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};