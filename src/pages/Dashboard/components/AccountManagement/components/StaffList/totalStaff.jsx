import React from "react";
import { useSelector } from "react-redux";
import { Card } from "antd";

const TotalStaff = () => {
    const staffData = useSelector((state) => state.staff);

    const staffCount = staffData.staffs && staffData.staffs.data ? staffData.staffs.data.length : 0;

    return (
        <Card title="">
            <p>Total staffs: {staffCount}</p>
        </Card>
    );
};

export default TotalStaff;
