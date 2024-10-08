import api from "../../config/axios";

export const getAllManager = async () => {
    try {
        const response = await api.get(`account/managers`);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};
export const addManager = async (
    full_name,
    email,
    password,
    role_id,
    phone_number,
    address,
    date_of_birth
) => {
    try {
        const response = await api.post(`account/users/manager`, {
            full_name,
            email,
            password,
            role_id,
            phone_number,
            address,
            date_of_birth,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};
