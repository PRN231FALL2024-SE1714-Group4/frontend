import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, ...rest }) => {
    const accessToken = localStorage.getItem("token");
    return accessToken ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
