import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm } from "antd";
import moment from "moment";

import { createArea, getArea, deleteArea, updateArea, getAreaById } from '/src/services/api/AreaApi.js';
// import { Link, Navigate, useNavigate } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const AreaManagement = () => {
    const [areas, setAreas] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingArea, setEditingArea] = useState(null);
    const [form] = Form.useForm();
    const role = useSelector((state) => state.auth.role);
    const navigate = useNavigate();  // Define navigate at the component level
    useEffect(() => {
        fetchAreas();
    }, []);

    const fetchAreas = async () => {
        try {
            // Fetch areas data from API
            const response = await getArea();
            const data = response; // Extract data from response
            setAreas(data); // Set areas data into state
          
        } catch (error) {
            message.error("Failed to fetch areas data.");
        }
    };

    const handleAdd = () => {
        setEditingArea(null);
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingArea(record);
        setIsModalVisible(true);
        form.setFieldsValue({
            ...record,
            createdDate: record.createdDate ? new Date(record.createdDate) : null,
            updatedDate: record.updatedDate ? new Date(record.updatedDate) : null,
        });
    };

    const handleDelete = async (id) => {
        try {
            // Delete area by id from API (implement deleteArea function)
            await deleteArea(id);
            setAreas(areas.filter((item) => item.areaID !== id));
            message.success("Area deleted successfully.");
        } catch (error) {
            message.error("Failed to delete area.");
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const name = values.name;
    
            if (!name || typeof name !== 'string') {
                message.error("Invalid name. Please input a valid string.");
                return;
            }
    
            if (editingArea) {
                // Update existing area
                await updateArea(editingArea.areaID, name);
                const updatedAreas = areas.map((item) =>
                    item.areaID === editingArea.areaID ? { ...item, name } : item
                );
                setAreas(updatedAreas);
                message.success("Area updated successfully.");
            } else {
                // Create new area
                const newArea = await createArea(name);
    
                // Kiểm tra nếu areas là một mảng
                if (Array.isArray(areas)) {
                    setAreas([newArea, ...areas]);
                } else {
                    setAreas([newArea]); // Nếu không, khởi tạo mảng mới
                }
                message.success("Area added successfully.");
            }
            setIsModalVisible(false);
            form.resetFields();
            fetchAreas(); // Cập nhật dữ liệu sau khi thêm
        } catch (error) {
            message.error("Validation failed: " + error.message);
        }
    };
    
    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };
    const handleViewCage = (areaID) => {
        navigate(`/cages/${areaID}`);
    };

    const columns = [
        {
            title: "No",
            // dataIndex: "index", // Sử dụng thuộc tính "name" từ dữ liệu trả về
            key: "id",
            render: (text, record, index) => index + 1, // Hiển thị số thứ tự dựa trên index
        },
        {
            title: "Area Name",
            dataIndex: "name", // Sử dụng thuộc tính "name" từ dữ liệu trả về
            key: "name",
            render: (text, record) => (
                <Link to={`/cages/${record.areaID}`}>{text}</Link>
            ),
        },
        {
            title: "Created Date",
            dataIndex: "createdDate",
            key: "createdDate",
            render: (text) => moment(text).format("YYYY-MM-DD"),
        },
         {
            title: "Action",
            key: "action",
            render: (_, record) => (
                role === "MANAGER" ? (
                <Space size="middle">
                    <Button type="primary" onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                   
                    <Popconfirm
                        title="Are you sure to delete this cage?"
                        onConfirm={() => handleDelete(record.areaID)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
             ) :   <Button type="primary" onClick={() => handleViewCage(record.areaID)}>
             View Cage
         </Button>
            ), 
        },
    ];

    return (
        <div>
                {role === "MANAGER" && (
                <Space style={{ margin: 15 }}>
                    <Button type="primary" onClick={handleAdd}>Add Area</Button>
                </Space>
            )}
                <Modal
                    title={editingArea ? "Edit Area" : "Add Area"}
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input the name!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
               <Table dataSource={areas} columns={columns} rowKey="areaID" pagination={{ pageSize: 7 }} />
        </div>
    );
};

export default AreaManagement;
