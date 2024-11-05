import { UserOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { CrownOutlined, ShoppingOutlined, RocketOutlined, MonitorOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import AppHeader from "./AppHeader";
import { useSelector } from "react-redux"; // Import useSelector để lấy thông tin người dùng
import ReportManagement from "../../pages/Dashboard/components/ReportManagement/Report";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

export const AppLayout = ({ components }) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // Giả sử bạn có thông tin người dùng trong Redux store
    const role = useSelector((state) => state.auth.role); // Lấy thông tin roleName từ Redux store
    const [menuItems, setMenuItems] = useState([]);

    
    useEffect(() => {
        console.log("Current roleName:", role); // Thêm log để kiểm tra roleName

       
        const items = [
          
            ...(role === "ADMIN"
                ? [
                      // Chỉ thêm Account Management nếu role là ADMIN
                      getItem("Account Management", "sub1", <UserOutlined />, [
                          getItem("User Management", "1", <Link to="/users"></Link>),
                      ]),
                     
                  ]
                : [
                      // Nếu không phải ADMIN thì thêm các mục này
                      {
                          key: "4",
                          icon: <ShoppingOutlined />,
                          label: <Link to="/areas">Area Management</Link>,
                      },
                      {
                        key: "1", 
                        icon: <ShoppingOutlined/>, 
                        label: <Link to ="/works">Work Management</Link>
                    },
                      {
                          key: "5",
                          icon: <ShoppingOutlined />,
                          label: <Link to="/cages">Cage Management</Link>,
                      },
                         
                          
                  ]),
         
            ...(role === "MANAGER"
                ? [
                    {
                        key: "8",
                        icon: <ShoppingOutlined />,
                        label: <Link to="/reports">Report Management</Link>,
                    },
                    {
                        key: "9", 
                        icon: <ShoppingOutlined/>, 
                        label: <Link to ="/shifts">Shifts Management</Link>
                    },
                       {
                        key: "10", 
                        icon: <ShoppingOutlined/>, 
                        label: <Link to ="/animals">Animal Management</Link>
                    },
                    {
                            key: "3", 
                            icon: <ShoppingOutlined/>, 
                            label: <Link to ="/histories">Cage's Pig Management</Link>
                        },   
                    
                    {
                        key: "11",
                        icon: <ShoppingOutlined />,
                        label: <Link to="/healths">Health Report</Link>,
                    }, 
           
                ]
                : []), // Nếu role là ADMIN thì thêm mục Report Management
                ...( role === "STAFF"
                    ? [
                        getItem("Task Management", "sub1", <ShoppingOutlined />, [
                            getItem("Task Today", "20", <Link to="/task-today"></Link>),
                            getItem("All Task", "2", <Link to="/all-task"></Link>),
                        ]),
                        {
                            key: "15", 
                            icon: <ShoppingOutlined/>, 
                            label: <Link to ="/shifts">Shifts Management</Link>
                        },
                        // {
                        //     key: "16", 
                        //     icon: <ShoppingOutlined/>, 
                        //     label: <Link to ="/animals">Animal Management</Link>
                        // },
                        
                        {
                            key: "17",
                            icon: <ShoppingOutlined />,
                            label: <Link to="/cageNeedToReport">Cage's Health Report</Link>,
                        }, 
                        {
                            key: "18",
                            icon: <ShoppingOutlined />,
                            label: <Link to="/myReport">My Cage's Health Report</Link>,
                        }, 
               
                    ]
                    : []), // Nếu role là ADMIN thì thêm mục Report Management
                
             

           
        ];

        setMenuItems(items);
    }, [role]); // Chạy lại effect này mỗi khi roleName thay đổi
    return (
        <Layout>
            <Sider
                width={236}
                className="site-layout-background"
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
            >
                <div className="demo-logo-vertical" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={["4"]} items={menuItems} />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >
                    <AppHeader />
                </Header>
                <Content
                    style={{
                        margin: "24px 16px 0",
                    }}
                >
                    <div
                        style={{
                            padding: 24,
                            minHeight: `81vh`,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {components}
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: "center",
                    }}
                >
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    );
};
