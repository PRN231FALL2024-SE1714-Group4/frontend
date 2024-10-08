import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Space, DatePicker } from "antd";
import { addStaff, getAllStaff } from "../../../../../../services/api/StaffApi";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllStaffs } from "../../../../../../core/store/slices/staffSlice";
import TotalStaff from "./totalStaff";

const StaffManagement = () => {
    // const [staffData, setStaffData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const dispatch = useDispatch();
    const staffData = useSelector((state) => state.staff);

    useEffect(() => {
        dispatch(fetchAllStaffs());
    }, [dispatch]);

    useEffect(() => {
        console.log("Staff Data:", staffData);
    }, [staffData]);

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
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
            title: "Phone Number",
            dataIndex: "phone_number",
            key: "phone_number",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Date Of Birth",
            dataIndex: "date_of_birth",
            key: "date_of_birth",
        },

        // Add more columns as needed (e.g., email, role, etc.)
        // {
        //     title: "Actions",
        //     key: "actions",
        //     render: (_, record) => (
        //         <Space size="middle">
        //             {/* <Button type="primary" onClick={() => handleEdit(record)}>
        //                 Edit
        //             </Button> */}
        //             <Button type="primary" danger onClick={() => handleDelete(record)}>
        //                 Delete
        //             </Button>
        //         </Space>
        //     ),
        // },
    ];

    const handleEdit = (record) => {
        // Implement edit logic here
        console.log("Edit staff:", record);
    };
    const handleDelete = (record) => {
        // Implement delete logic here
        console.log("Delete staff:", record);
    };
    const handleAdd = async () => {
        setIsModalVisible(true);
    };

    const handleSave = async (values) => {
        try {
            await addStaff(
                values.full_name,
                values.email,
                values.password,
                values.role_id,
                values.phone_number,
                values.address,
                values.date_of_birth.format("YYYY-MM-DD") // Định dạng lại ngày tháng
            );
            message.success("Staff added successfully.");
            setIsModalVisible(false);
            dispatch(fetchAllStaffs()); // Refresh the staff list
        } catch (error) {
            message.error("Request không hợp lệ.");
        }
    };
    // Kiểm tra staffData.staffs là một mảng
    const dataSource = Array.isArray(staffData.staffs.data) ? staffData.staffs.data : [];

    return (
        <div>
            <Button type="primary" onClick={handleAdd}>
                Add Staff
            </Button>
            <TotalStaff />
            <Table dataSource={dataSource} columns={columns} loading={staffData.loading} />

            <Modal title="Add Staff" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
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

export default StaffManagement;
