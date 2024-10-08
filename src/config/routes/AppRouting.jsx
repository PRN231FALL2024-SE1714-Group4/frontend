import { Route, Routes } from "react-router-dom";
import { Dashboard } from "@pages/Dashboard";


import { Login } from "@pages/Login/Login";
import { useSelector } from "react-redux";
import ProtectedRoute from "./ProtectedRoute";

import StaffManagement from "../../pages/Dashboard/components/AccountManagement/components/StaffList/StaffList";
import UserManagement from "../../pages/Dashboard/components/AccountManagement/components/UserList/UserList";
import ManagerManagement from "../../pages/Dashboard/components/AccountManagement/components/ManagerList/ManagerList";


import AreaManagement from "../../pages/Dashboard/components/AreaManagement/area";
import CageManagement from "../../pages/Dashboard/components/CageManagement/Cage";
import WorkManagement from "../../pages/Dashboard/components/WorkManagement/work";



const AppRouting = () => {
    const Auth = localStorage.getItem("fullName");
    console.log(Auth);
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route exact path="/" element={<ProtectedRoute element={<Dashboard />} />}>
                <Route path="users" element={<UserManagement />} />
                <Route path="staffs" element={<StaffManagement />} />
                <Route path="managers" element={<ManagerManagement />} />
                <Route path="areas" element={<AreaManagement />} />
                <Route path="cages" element={<CageManagement />} />
                <Route path="works" element={<WorkManagement />} />
            </Route>
        </Routes>
    );
};

export default AppRouting;
