import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Space, DatePicker, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../../../../../../core/store/slices/userSlice";
import { updateUser, banUser, getRoles, addUser } from "../../../../../../services/api/UserApi";
import { getRole } from "../../../../../../services/api/RoleApi";
import TotalUsers from "./totalUsers";
import dayjs from "dayjs";

const { Option } = Select;

const UserManagement = () => {
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [rolesData, setRolesData] = useState([]);
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchUsers());
        // fetchRoles();
    }, [dispatch]);

    useEffect(() => {
        console.log("User Data:", userData);
    }, [userData]);

    // const fetchRoles = async () => {
    //     try {
    //         const response = await getRole();
    //         setRolesData(response);
    //     } catch (error) {
    //         message.error("Failed to fetch roles data.");
    //     }
    // };

    const columns = [
        // {
        //     title: "ID",
        //     dataIndex: "id",
        //     key: "id",
        //     sorter: (a, b) => a.id - b.id,
        //     sortDirections: ["ascend", "descend"],
        // },
        {
            title: "Name",
            dataIndex: "fullName",
            key: "fullName",
        },
        {
            title: "Phone Number",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Role",
            dataIndex: ["role", "name"],
            key: "roleName",
            filters: rolesData?.map((role) => ({ text: role.name, value: role.name })) || [],
            onFilter: (value, record) => record.role?.name === value,
        },

        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (isActive) => (isActive ? "Active" : "Banned"),
            // filters: [
            //     { text: "Active", value: true },
            //     { text: "Banned", value: false },
            // ],
            // onFilter: (value, record) => record.is_active === value,
        },
        // {
        //     title: "Actions",
        //     key: "actions",
        //     render: (_, record) => (
        //         <Space size="middle">
        //             <Button type="primary" onClick={() => handleEdit(record)}>
        //                 Edit
        //             </Button>
        //             <Button type="primary" danger onClick={() => handleBan(record.id)} disabled={record.is_active === false}>
        //                 Ban
        //             </Button>
        //         </Space>
        //     ),
        // },
    ];
    const handleAddUser = async (values) => {
        try {
            await addUser(
                values.roleID,
                values.password,
                values.fullName,
                values.dateOfBirth ? values.dateOfBirth.format("YYYY-MM-DD") : null,
                values.gender,
                values.address,
                values.email,
                values.phone
            );
            message.success("User added successfully.");
            setIsAddModalVisible(false);
            dispatch(fetchUsers()); // Refresh the user list
        } catch (error) {
            message.error("Failed to add user.");
        }
    };
    const handleEdit = (record) => {
        console.log("Selected User:", record); // Debugging log
        setSelectedUser(record);
        setIsEditModalVisible(true);
    };

    // const handleSaveAdd = async (values) => {
    //     try {
    //         await addUser(values.full_name, values.email, values.password, values.roleId, values.phone_number, values.address, values.date_of_birth.format("YYYY-MM-DD"));
    //         message.success("User added successfully.");
    //         setIsAddModalVisible(false);
    //         dispatch(fetchUsers()); // Refresh the user list
    //     } catch (error) {
    //         message.error("Failed to add user.");
    //     }
    // };

    const handleSaveEdit = async (values) => {
        try {
            await updateUser(
                selectedUser.id,
                values.fullName,
                values.email,
                values.password,
                values.roleId,
                values.phone,
                values.address,
                values.status,
                values.dateOfBirth ? values.dateOfBirth.format("YYYY-MM-DD") : null
            );
            message.success("User updated successfully.");
            setIsEditModalVisible(false);
            dispatch(fetchUsers()); // Refresh the user list
        } catch (error) {
            message.error("Failed to update user.");
        }
    };

    const handleBan = async (id) => {
        try {
            await banUser(id);
            message.success("User banned successfully.");
            dispatch(fetchUsers()); // Refresh the user list
        } catch (error) {
            message.error("Failed to ban user.");
        }
    };
    const handleCancel = () => {
        setIsAddModalVisible(false);
        setIsEditModalVisible(false);
        setSelectedUser(null);
    };
    const handleEditModalCancel = () => {
        setIsEditModalVisible(false);
        setSelectedUser(null);
    };

    const handleAdd = async () => {
        setIsAddModalVisible(true);
    };
    const dataSource = Array.isArray(userData.users) ? userData.users : [];

    return (
        <div>

<Button type="primary" onClick={handleAdd}>
                Add User
            </Button>
            <TotalUsers />
            <Table dataSource={dataSource} columns={columns} loading={userData.loading} pagination={{ pageSize: 7 }} />


                  {/* Add User Modal */}
                  <Modal title="Add User" visible={isAddModalVisible} onCancel={handleCancel} footer={null}>
                <Form onFinish={handleAddUser}>
                    <Form.Item label="Name" name="fullName" rules={[{ required: true, message: "Please input the user's full name!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please input the user's email!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please input the user's password!" }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item label="Role" name="roleID" rules={[{ required: true, message: "Please select a role!" }]}>
                        <Select placeholder="Select a role">
                            {rolesData.map((role) => (
                                <Option key={role.roleID} value={role.roleID}>
                                    {role.name}
                                </Option>
                            ))}
                            
                        </Select>
                    </Form.Item>
                    <Form.Item label="Phone Number" name="phone">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Address" name="address">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Date of Birth" name="dateOfBirth">
                        <DatePicker format="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item label="Gender" name="gender">
                        <Select>
                            <Option value="male">Male</Option>
                            <Option value="female">Female</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add User
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
 {/* Edit User Modal */}
            {selectedUser && (
                <Modal title="Edit Account" visible={isEditModalVisible} onCancel={() => handleEditModalCancel()} footer={null}>
                    <Form
                        initialValues={{
                            ...selectedUser,
                            roleId: selectedUser.role_id ? selectedUser.role_id.id : null,
                            date_of_birth: selectedUser.dateOfBirth ? dayjs(selectedUser.dateOfBirth) : null,
                        }}
                        onFinish={handleSaveEdit}
                    >
                        <Form.Item label="Name" name="fullName">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Email" name="email">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Password" name="password">
                            <Input.Password />
                        </Form.Item>
                        <Form.Item label="Role" name="roleId">
                            <Select placeholder="Select a role">
                                {rolesData.map((role) => (
                                    <Option key={role.roleID} value={role.roleID}>
                                        {role.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Phone Number" name="phone">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Address" name="address">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Date of Birth" name="dateOfBirth">
                            <DatePicker format="YYYY-MM-DD" />
                        </Form.Item>
                        <Form.Item label="Status" name="status">
                            <Select>
                                <Option value={true}>Active</Option>
                                <Option value={false}>Banned</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            )}
        </div>
    );
};

export default UserManagement;
