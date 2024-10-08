import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    token: localStorage.getItem("token") || "",
    fullName: localStorage.getItem("fullName") || "",
    email: localStorage.getItem("email") || "",
    role: localStorage.getItem("role") || "",
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action) => {
            const { token, fullName,email, role} = action.payload;
            state.token = token;
            state.email = email;
            state.fullName = fullName;
            state.role = role;
            localStorage.setItem("token", token);
            localStorage.setItem("fullName", fullName);
            localStorage.setItem("email", email);
            localStorage.setItem("role", role);
        },
        clearToken: (state) => {
            state.token = "";
            state.fullName = "";
            state.email = "";
            state.role = "";
            localStorage.removeItem("token");
            localStorage.removeItem("fullName");
            localStorage.removeItem("email");
            localStorage.removeItem("role");
        },
    },
});

export const { setToken, clearToken } = authSlice.actions;

export default authSlice.reducer;
