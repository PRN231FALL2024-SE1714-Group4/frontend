import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:7017/api/",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// const refreshToken = async () => {
//     const refresh = localStorage.getItem("refreshToken");
//     if (!refresh) {
//         throw new Error("No refresh token available");
//     }
//     const response = await axios.post("https://localhost:7017/api/User/login", { refreshToken: refresh });
//     const { token } = response.data;
//     localStorage.setItem("token", token);
//     return token;
// };

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // const newAccessToken = await refreshToken();
                // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (error) {
                localStorage.removeItem("token");
                localStorage.removeItem("fullName");
                localStorage.removeItem("email");
                localStorage.removeItem("role");
                // window.location.href = '/login';
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);
export default api;
