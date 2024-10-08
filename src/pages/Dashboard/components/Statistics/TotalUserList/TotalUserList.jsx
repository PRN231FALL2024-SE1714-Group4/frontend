// import { Card, Row, Col, Typography } from "antd";

// const { Title, Text } = Typography;

// const totalUsers = 10; // này phải call api nha

// export const TotalUserList = () => {
//     return (
//         <div className="container" style={{ marginTop: "2rem" }}>
//             <Row gutter={[16, 16]}>
//                 <Col span={8}>
//                     <Card>
//                         <Title level={4}>Total Users</Title>
//                         <Text
//                             className="display-4"
//                             style={{ fontSize: "2rem" }}
//                         >
//                             {totalUsers}
//                         </Text>
//                     </Card>
//                 </Col>
//                 {/* Add more cards for other statistics as needed */}
//             </Row>
//         </div>
//     );
// };
import { useState, useEffect } from "react";
import { Card, Row, Col, Typography } from "antd";
import { fetchTotalUsers } from "@api/UserApi.js"; // Đảm bảo import hàm fetchTotalUsers từ file API thích hợp

const { Title, Text } = Typography;

export const TotalUserList = () => {
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        const fetchTotalUserCount = async () => {
            try {
                const count = await fetchTotalUsers();
                setTotalUsers(count);
            } catch (error) {
                console.error("Error fetching total user count:", error);
            }
        };
        fetchTotalUserCount();
    }, []);

    return (
        <div className="container" style={{ marginTop: "2rem" }}>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Card>
                        <Title level={4}>Total Users</Title>
                        <Text
                            className="display-4"
                            style={{ fontSize: "2rem" }}
                        >
                            {totalUsers}
                        </Text>
                    </Card>
                </Col>
                {/* Add more cards for other statistics as needed */}
            </Row>
        </div>
    );
};
