import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "../../../config/axios";

export const fetchAllManagers = createAsyncThunk("manager/fetchAllManagers", async () => {
    const response = await api.get("/account/managers");
    return response.data;
});

const managerSlice = createSlice({
    name: "manager",
    initialState: {
        managers: [],
        loading: false,
        error: "",
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllManagers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllManagers.fulfilled, (state, action) => {
                state.loading = false;
                state.managers = action.payload;
                state.error = "";
            })
            .addCase(fetchAllManagers.rejected, (state, action) => {
                state.loading = false;
                state.managers = [];
                state.error = action.error.message;
            });
    },
});

export default managerSlice.reducer;
