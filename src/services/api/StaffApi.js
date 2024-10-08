import api from "../../config/axios";

export const getAllStaff = async () => {
    try {
        const response = await api.get(`account/staffs`);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};
export const addStaff = async (
    full_name,
    email,
    password,
    role_id,
    phone_number,
    address,
    date_of_birth
) => {
    try {
        const response = await api.post(`account/users/staff`, {
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
