import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Auth/auth";
import userReducer from "./slices/userSlice";
import staffReducer from "./slices/staffSlice";
import managerReducer from "./slices/managerSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        staff: staffReducer,
        manager: managerReducer,

    },
});

export default store;
