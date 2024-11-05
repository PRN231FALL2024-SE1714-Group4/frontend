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
import ReportManagement from "../../pages/Dashboard/components/ReportManagement/Report";
import ReportDetail from "../../pages/Dashboard/components/WorkManagement/reportDetail";
import ShiftManagement from "../../pages/Dashboard/components/ShiftManagement/shift";
import AnimalManagement from "../../pages/Dashboard/components/AnimalManagement/Animal";
import HistoryManagement from "../../pages/Dashboard/components/HistoryManagement/History";
import HealthReportManagement from "../../pages/Dashboard/components/HealthReportManagement/HealthReport";
import CageNeedToReport from "../../pages/Dashboard/components/HealthReportManagement/CageNeedToReport";
import MyCageHealthReport from "../../pages/Dashboard/components/HealthReportManagement/MyCageHealthReport";
import AuthCallback from "../../pages/Login/AuthCallback ";
import WorkTodayManagement from "../../pages/Dashboard/components/WorkManagement/workToDay";



const AppRouting = () => {
    const Auth = localStorage.getItem("fullName");
    console.log(Auth);
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route exact path="/" element={<ProtectedRoute element={<Dashboard />} />}>
                <Route path="users" element={<UserManagement />} />
                <Route path="staffs" element={<StaffManagement />} />
                <Route path="managers" element={<ManagerManagement />} />
                <Route>
                    <Route path="areas" element={<AreaManagement />} />
                    <Route path="cages/:areaId" element={<CageManagement />} />
                    <Route path="histories/:cageId" element={<HistoryManagement />} />
                    <Route path="healths/:cageId" element={<HealthReportManagement />} />
                </Route>
             
                <Route>
                     <Route path="works" element={<WorkManagement />} />
                     <Route path="report-detail/:workId" element={<ReportDetail />} />
                </Route>
                     
                <Route path="task-today" element={<WorkTodayManagement />} />                       
                <Route path="all-task" element={<WorkManagement />} />
                <Route path="reports" element={<ReportManagement />} />
                <Route path="shifts" element={<ShiftManagement />} />
                 
                <Route path="cages" element={<CageManagement />} />
                <Route path="animals" element={<AnimalManagement />} />
                <Route path="histories" element={<HistoryManagement />} />
                <Route path="healths" element={<HealthReportManagement />} />
                <Route path="cageNeedToReport" element={<CageNeedToReport />} />
                <Route path="myReport" element={<MyCageHealthReport />} />
                
                
            </Route>
        </Routes>
    );
};

export default AppRouting;
