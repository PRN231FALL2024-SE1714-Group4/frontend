import React, { useState } from "react";
import { Button, Divider, Flex, Form, Input, Typography, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "@core/store/Auth/auth";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { LoginAPI, LoginGoogleAPI, LoginGoogleResponseAPI } from "../../services/api/LoginAPI";
import { GoogleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const openNotification = (placement, description, message) => {
        notification.error({
            message: message,
            description: description,
            placement,
            duration: 5,
        });
    };

    const handleLogin = async (values) => {
        try {
            setLoading(true);
            const response = await LoginAPI(values);
            const { token, fullName, email, role } = response;
            dispatch(setToken({ token, fullName, email, role }));
            navigate("/");
        } catch (error) {
            const msg = error.response?.data?.message || "Login failed";
            openNotification("top", msg, "Sign in failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        // Redirect user to the backend's Google login endpoint
        window.location.href = "https://localhost:7017/api/Google/google-login";
        // try {
        //     const response = await LoginGoogleResponseAPI(); 
        //     const { token, fullName, email, role}; 
        //     dispatch(setToken({token, fullName, email, role})); 
        // }catch (error) {

        // }
    };
    

    return (
        <GoogleOAuthProvider clientId={clientId}> 
            <Flex vertical>
                <Flex className="w-full z-10 bg-white py-5 fixed top-0 lg:px-[100px] p-10 gap-10" justify="left" align="center">
                    <Title style={{ marginBottom: "0" }} className="font-serif " level={3}>
                        <Link className="!text-black" to={"/"}>PIGGERY MANAGEMENT</Link>
                    </Title>
                    <Title style={{ marginBottom: "0" }} className="font-serif !my-auto" level={3}>Login</Title>
                </Flex>
                <div className="w-[100vw] h-[100vh] flex justify-center items-center relative overflow-hidden">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFqsKMp9UidTH6xwuT2WUc3WKYKQEqUQyD0w&s" className="absolute top-0 left-0 z-1 w-full h-screen" />
                    <Flex gap={20} className="relative bg-white rounded">
                        <Flex vertical className="text-left justify-between !font-serif w-[350px] p-5" gap={5}>
                            <Title level={2} className="!m-0 !font-serif">Welcome</Title>
                            <Title level={3} className="!my-5 !font-serif">Login your account</Title>
                            <Form
                                initialValues={{ remember: true }}
                                autoComplete="off"
                                layout="vertical"
                                className="flex gap-10 flex-col !font-sans"
                                onFinish={handleLogin}
                            >
                                <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please input your email!" }]} className="!m-0 h-[50px]">
                                    <Input type="email" className="rounded-none border-0 border-b-[1px] border-black focus:border-b-[1px] focus:border-b-black" />
                                </Form.Item>
                                <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please input your password!" }]} className="!m-0 h-[50px]">
                                    <Input.Password className="rounded-none border-0 border-b-[1px] border-black focus:border-b-[1px] focus:border-b-black" />
                                </Form.Item>
                                <Form.Item className="w-full !m-0">
                                    <Button loading={loading} className="w-full bg-[#946257] font-serif hover:!bg-[#946257] hover:!shadow-none" type="primary" htmlType="submit">
                                        Login
                                    </Button>
                                </Form.Item>
                            </Form>
                            <Divider className="!border-solid !border-[#B5B5B5]">or</Divider>
                            <Title className="text-center font-sans" level={5}>Login with:</Title>
                            <div className="social text-center">
                        
                                <Button
                                    onClick={handleGoogleLogin}
                                >
                                    <GoogleOutlined style={{ fontSize: 30, cursor: "pointer", color: "green" }} />
                                </Button>
                    
                            </div>
                        </Flex>
                    </Flex>
                </div>
            </Flex>
            </GoogleOAuthProvider>
    );
};


