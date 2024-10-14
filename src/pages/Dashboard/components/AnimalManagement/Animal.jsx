import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm } from "antd";
import moment from "moment";

import { createArea, getArea, deleteArea, updateArea, getAreaById } from '/src/services/api/AreaApi.js';
import { updateAnimal } from "../../../../services/api/Animal";
const AnimalManagement = () => {
    const [animals, setAnimals] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingAnimal, setEditingAnimal] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchAnimals();
    }, []);

    const fetchAnimals = async () => {
        try {
            // Fetch animals data from API
            const response = await getArea();
            const data = response; // Extract data from response
            setAnimals(data); // Set animals data into state
          
        } catch (error) {
            message.error("Failed to fetch animals data.");
        }
    };

    const handleAdd = () => {
        setEditingAnimal(null);
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingAnimal(record);
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
            setAnimals(animals.filter((item) => item.areaID !== id));
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
    
            if (editingAnimal) {
                // Update existing area
                await updateAnimal(editingAnimal.areaID, name);
                const updatedAnimals = animals.map((item) =>
                    item.areaID === editingAnimal.areaID ? { ...item, name } : item
                );
                setAnimals(updatedAnimals);
                message.success("Area updated successfully.");
            } else {
                // Create new area
                const newArea = await createArea(name);
    
                // Kiểm tra nếu animals là một mảng
                if (Array.isArray(animals)) {
                    setAnimals([newArea, ...animals]);
                } else {
                    setAnimals([newArea]); // Nếu không, khởi tạo mảng mới
                }
                message.success("Area added successfully.");
            }
            setIsModalVisible(false);
            form.resetFields();
            fetchAnimals(); // Cập nhật dữ liệu sau khi thêm
        } catch (error) {
            message.error("Validation failed: " + error.message);
        }
    };
    

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
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
            ),
        },
    ];

    return (
        <div>
                <Space style={{ margin: 15 }}>
                    <Button type="primary" onClick={handleAdd}>
                        Add Areas
                    </Button>
                </Space>
            
                <Modal
                    title={editingAnimal ? "Edit Area" : "Add Area"}
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
               <Table dataSource={animals} columns={columns} rowKey="areaID" pagination={{ pageSize: 7 }} />
        </div>
    );
};

export default AnimalManagement;
