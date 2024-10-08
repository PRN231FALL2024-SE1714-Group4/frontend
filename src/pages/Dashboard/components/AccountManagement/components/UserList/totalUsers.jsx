import React from "react";
import { useSelector } from "react-redux";
import { Card } from "antd";

const TotalUser = () => {
    const userData = useSelector((state) => state.user);

    const userCount = userData.users ? userData.users.length : 0;

    return (
        <Card title="">
            <p>Total Accounts: {userCount}</p>
        </Card>
    );
};

export default TotalUser;
