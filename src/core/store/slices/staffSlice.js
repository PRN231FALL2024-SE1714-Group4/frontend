import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "../../../config/axios";

export const fetchAllStaffs = createAsyncThunk("staff/fetchAllStaffs", async () => {
    const response = await api.get("/account/staffs");
    return response.data;
});

const staffSlice = createSlice({
    name: "staff",
    initialState: {
        staffs: [],
        loading: false,
        error: "",
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllStaffs.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllStaffs.fulfilled, (state, action) => {
                state.loading = false;
                state.staffs = action.payload;
                state.error = "";
            })
            .addCase(fetchAllStaffs.rejected, (state, action) => {
                state.loading = false;
                state.staffs = [];
                state.error = action.error.message;
            });
    },
});

export default staffSlice.reducer;
