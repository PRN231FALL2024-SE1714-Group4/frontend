import React from "react";
import { Outlet } from "react-router-dom";

export const AccountManagement = () => {
    return (
        <div>
            <h1>Account Management</h1>
            <Outlet />
        </div>
    );
};
