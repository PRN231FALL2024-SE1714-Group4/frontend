import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm } from "antd";
import moment from "moment";

import {  } from '/src/services/api/ShiftApi.js';
import { getAvailableUsers, getWorkerInShift } from "../../../../services/api/ShiftApi";
import { useSelector } from "react-redux";
const AreaManagement = () => {
    const [workerInShifts, setWorkerInShifts] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingShift, setEditingShift] = useState(null);
    const [form] = Form.useForm();

    const role = useSelector((state) => state.auth.role);
    // const dataSource = role === "STAFF"
    // ? myWorks
    // : role === "MANAGER"
    // ? myAssignedTask
    // : works;

    useEffect(() => {
        if(role === "MANAGER") { 
            fetchWorkerInShift();
        }
      else{
        fetchAvailableUsers();
      }
      
    }, []);

    const fetchWorkerInShift = async () => {
        try {
            // Fetch workerInShifts data from API
            const response = await getWorkerInShift();
            const data = response; // Extract data from response
            setWorkerInShifts(data); // Set workerInShifts data into state
          
        } catch (error) {
            message.error("Failed to fetch workerInShifts data.");
        }
    };
    const fetchAvailableUsers = async () => {
        try {
   
            const response = await getAvailableUsers();
            const data = response; // Extract data from response
            setWorkerInShifts(data); // Set workerInShifts data into state
          
        } catch (error) {
            message.error("Failed to fetch workerInShifts data.");
        }
    };
    const handleAdd = () => {
        setEditingShift(null);
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingShift(record);
        setIsModalVisible(true);
        form.setFieldsValue({
            ...record,
            // createdDate: record.createdDate ? new Date(record.createdDate) : null,
            // updatedDate: record.updatedDate ? new Date(record.updatedDate) : null,
        });
    };

    const handleDelete = async (id) => {
        try {
            // Delete area by id from API (implement deleteArea function)
            await deleteArea(id);
            setWorkerInShifts(workerInShifts.filter((item) => item.areaID !== id));
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
    
            if (editingShift) {
                // Update existing area
                await updateArea(editingShift.areaID, name);
                const updatedAreas = workerInShifts.map((item) =>
                    item.areaID === editingShift.areaID ? { ...item, name } : item
                );
                setWorkerInShifts(updatedAreas);
                message.success("Area updated successfully.");
            } else {
                // Create new area
                const newArea = await createArea(name);
    
                // Kiểm tra nếu workerInShifts là một mảng
                if (Array.isArray(workerInShifts)) {
                    setWorkerInShifts([newArea, ...workerInShifts]);
                } else {
                    setWorkerInShifts([newArea]); // Nếu không, khởi tạo mảng mới
                }
                message.success("Area added successfully.");
            }
            setIsModalVisible(false);
            form.resetFields();
            fetchWorkerInShift(); // Cập nhật dữ liệu sau khi thêm
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
                    title={editingShift ? "Edit Area" : "Add Area"}
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
               <Table dataSource={workerInShifts} columns={columns} rowKey="areaID" pagination={{ pageSize: 7 }} />
        </div>
    );
};

export default AreaManagement;