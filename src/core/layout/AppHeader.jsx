import { Button, Flex, Typography, Input, Avatar, Dropdown, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { clearToken } from "../store/Auth/auth";

const { Title } = Typography;

const AppHeader = () => {
    const fullName = useSelector((state) => state.auth.fullName);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(clearToken());
        window.location.href = "/login";
    };
    const menu = (
        <Menu>
            <Menu.Item key="1">
                <p>{fullName}</p>
            </Menu.Item>
            <Menu.Item key="2">
                <Button
                    type="text"
                    onClick={handleLogout}
                    style={{ fontWeight: "bold", width: "100%" }}
                >
                    Logout
                </Button>
            </Menu.Item>
        </Menu>
    );

    const getInitials = (fullName) => {
        return fullName
            .split(" ")
            .map((word) => word[0])
            .join("");
    };
    return (
        <Flex className="mx-28 h-full" vertical gap={"0.8rem"}>
            <Flex justify="space-between" className="h-20 ">
                <Flex flex={0.4} justify="start" align="center">
                    <Title style={{ marginBottom: "0" }} className="w-3/5 font-serif" level={4}>
                        PIGGERY MANAGEMENT
                    </Title>
                </Flex>
                <Flex flex={0.3} justify="end" align="center">
                    <Dropdown overlay={menu} placement="bottomRight">
                        <Avatar
                            style={{ backgroundColor: "#87d068", cursor: "pointer" }}
                            icon={<UserOutlined />}
                        >
                            {getInitials(fullName)}
                        </Avatar>
                    </Dropdown>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default AppHeader;
