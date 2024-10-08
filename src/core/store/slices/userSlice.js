import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "../../../config/axios";

export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
    const response = await api.get("/User");
    return response.data;
});

const userSlice = createSlice({
    name: "user",
    initialState: {
        users: [],
        loading: false,
        error: "",
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
                state.error = "";
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.users = [];
                state.error = action.error.message;
            });
    },
});

export default userSlice.reducer;
