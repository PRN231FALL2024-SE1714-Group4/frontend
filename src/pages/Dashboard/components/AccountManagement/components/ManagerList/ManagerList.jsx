import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, message } from "antd";

import { addManager, getAllManager } from "../../../../../../services/api/ManagerApi";
import { fetchAllManagers } from "../../../../../../core/store/slices/managerSlice";
import { useSelector, useDispatch } from "react-redux";
import TotalManager from "./totalManager";
import moment from "moment";
const ManagerManagement = () => {
    // const [managerData, setManagerData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const dispatch = useDispatch();
    const managerData = useSelector((state) => state.manager);

    useEffect(() => {
        dispatch(fetchAllManagers());
    }, [dispatch]);

    useEffect(() => {
        console.log("Manager Data:", managerData);
    }, [managerData]);

    const columns = [
        {
            title: "ID",
            dataIndex: ["id"],
            key: "id",
            sorter: (a, b) => a.id - b.id,
            sortDirections: ["ascend", "descend"],
        },
        {
            title: "Name",
            dataIndex: "full_name",
            key: "full_name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Phone Number",
            dataIndex: "phone_number",
            key: "phone_number",
        },

        {
            title: "Role",
            dataIndex: ["role_id", "name"],
            key: "roleName",
        },
        {
            title: "Role ID",
            dataIndex: ["role_id", "id"],
            key: "roleName",
        },

        // {
        //     title: "Actions",
        //     key: "actions",
        //     render: (_, record) => (
        //         <Button type="link" onClick={() => handleEdit(record)}>
        //             Edit
        //         </Button>
        //     ),
        // },
    ];

    const handleEdit = (record) => {
        // Implement edit logic here
        console.log("Edit staff:", record);
    };

    const handleAdd = () => {
        setIsModalVisible(true);
    };

    const handleSave = async (values) => {
        try {
            await addManager(
                values.full_name,
                values.email,
                values.password,
                values.role_id,
                values.phone_number,
                values.address,
                values.date_of_birth.format("YYYY-MM-DD") // Định dạng lại ngày tháng
            );
            message.success("Manager added successfully.");
            setIsModalVisible(false);
            dispatch(fetchAllManagers()); // Refresh the staff list
        } catch (error) {
            message.error("Failed to add Manager.");
        }
    };

    // Kiểm tra staffData.staffs là một mảng
    const dataSource = Array.isArray(managerData.managers.data) ? managerData.managers.data : [];
    return (
        <div>
            <Button type="primary" onClick={handleAdd}>
                Add Manager
            </Button>
            <TotalManager />
            <Table dataSource={dataSource} columns={columns} loading={managerData.loading} />

            <Modal title="Add Account" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
                <Form onFinish={handleSave}>
                    <Form.Item label="Name" name="full_name" rules={[{ required: true, message: "Please enter a name" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter an email" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter a password" }]}>
                        <Input.Password />
                    </Form.Item>

                    <Form.Item label="Phone Number" name="phone_number" rules={[{ required: true, message: "Please enter a phone number" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Address" name="address" rules={[{ required: true, message: "Please enter an address" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Date Of Birth" name="date_of_birth" rules={[{ required: true, message: "Please enter date of birth" }]}>
                        <DatePicker />
                    </Form.Item>
                    {/* Add more form fields as needed */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
export default ManagerManagement;
