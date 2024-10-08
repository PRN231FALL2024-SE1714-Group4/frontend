import React from "react";
import { useSelector } from "react-redux";
import { Card } from "antd";

const TotalManager = () => {
    const managerData = useSelector((state) => state.manager);

    const managerCount =
        managerData.managers && managerData.managers.data ? managerData.managers.data.length : 0;

    return (
        <Card title="">
            <p>Total managers: {managerCount}</p>
        </Card>
    );
};

export default TotalManager;
