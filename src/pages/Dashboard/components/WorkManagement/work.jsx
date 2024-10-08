import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Space, Select, Popconfirm } from "antd";
import moment from "moment";

import { addWork,getWork } from "../../../../services/api/WorkApi";
import {  getCage } from '/src/services/api/CageApi.js';
import { getAllUsers } from "../../../../services/api/UserApi";

const { Option } = Select;

const WorkManagement = () => {
    const [users, setUsers] = useState([]);
    const [works, setWorks] = useState([]);
    const [cages, setCages] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingWork, setEditingWork] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchWorks();
        fetchCages();
        fetchUsers();
    }, []);
  const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            setUsers(response);
        } catch (error) {
            message.error("Failed to fetch users data.");
        }
    };
    const fetchCages = async () => {
        try {
            const response = await getCage();
            setCages(response); 
        } catch (error) {
            message.error("Failed to fetch Cages data.");
        }
    };

    const fetchWorks = async () => {
        try {
            const response = await getWork ();
            setWorks(response); 
        } catch (error) {
            message.error("Failed to fetch Cages data.");
        }
    };

    const handleAdd = () => {
        setEditingWork(null);
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingWork(record);
        setIsModalVisible(true);
        form.setFieldsValue({
            ...record,
            createdDate: record.createdDate ? new Date(record.createdDate) : null,
            updatedDate: record.updatedDate ? new Date(record.updatedDate) : null,
        });
    };

    const handleDelete = async (id) => {
        try {
            await deleteCage(id);
            setWorks(works.filter((item) => item.cageID !== id));
            message.success("Cage deleted successfully.");
        } catch (error) {
            message.error("Failed to delete Cage.");
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log(values);
            const { cageName, areaID } = values;  // Sử dụng cageName và areaID từ form values

            if (editingWork) {
                // Update existing Cage
                await updateWork(editingWork.cageID, cageName, areaID );
                const updatedCages = works.map((item) =>
                    item.cageID === editingWork.cageID ? { ...item, cageName, areaID } : item
                );
                setWorks(updatedCages);
                message.success("Cage updated successfully.");
            } else {
                // Create new Cage
                const newCage = await addWork(cageId, description,startDate,endDate,shift,assigneeID,mission );
                setWorks([newCage, ...works]);
                message.success("Cage added successfully.");
            }
            setIsModalVisible(false);
            form.resetFields();
            fetchWorks();
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
            key: "id",
            render: (text, record, index) => index + 1,
        },
        {
            title: "Mission",
            dataIndex: "mission",
            key: "mission",
        },
        {
            title: "Shift",
            dataIndex: "shift",
            key: "shift",
        },
        {
            title: "Cage",
            dataIndex: ["cage","cageName"],
            key: "cage",
        },
        {
            title: "Area",
            dataIndex: ["area","name"],
            key: "area",
        },
        {
            title: "Start Date",
            dataIndex: "startDate",
            key: "startDate",
            render: (text) => moment(text).format("YYYY-MM-DD"),
        },
        {
            title: "End Date",
            dataIndex: "endDate",
            key: "endDate",
            render: (text) => moment(text).format("YYYY-MM-DD"),
        },
        {
            title: "Assigner",
            dataIndex: ["assigner","fullName"],
            key: "assigner",
        },
        {
            title: "Assignee",
            dataIndex: ["assignee","fullName"],
            key: "assignee",
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
                        title="Are you sure to delete this work?"
                        onConfirm={() => handleDelete(record.cageID)}
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
                    Add Work
                </Button>
            </Space>

            <Modal
                title={editingWork ? "Edit Work" : "Add Work"}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name = "mission"
                        label="Mission"
                        rules={[{required: true, message: "Please select the Mission"}]}
                    >
                        <Select placeholder = "Select a mission"
                        >
                            <Option value={0}> FEED</Option>
                            <Option value={1}> CLEAN_CAGE</Option>
                            <Option value={2}> ANIMAL_MOVE</Option>
                            <Option value={4}> OTHER</Option>
                        </Select>

                    </Form.Item>
                    <Form.Item
                        name="cageName"  // Sử dụng tên trường đúng là cageName
                        label="Cage Name"
                        rules={[{ required: true, message: "Please input the Cage Name!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="cageID"
                        label="Cage Name"
                        rules={[{ required: true, message: "Please select a cage name!" }]}
                    >
                        <Select placeholder="Select a cage">
                            {cages.map((cage) => (
                                <Option key={cage.cageID} value={cage.cageID}>
                                    {cage.cageName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name = "shift"
                        label="Shift"
                        rules={[{required: true, message: "Please select the Shift"}]}
                    >
                        <Select placeholder = "Select a Shift"
                        >
                            <Option > SHIFT_ONE</Option>
                            <Option > SHIFT_TWO</Option>
                            <Option > SHIFT_THREE</Option>
                          
                        </Select>

                    </Form.Item>
                    <Form.Item
                        name = "status"
                        label="Status"
                        rules={[{required: true, message: "Please select the Status"}]}
                    >
                        <Select placeholder = "Select a Status"
                        >
                            <Option value={0}> OPEN</Option>
                            <Option value={1}> IN_PROGRESS</Option>
                            <Option value={2}> DONE</Option>
                            <Option value={3}> CLOSED</Option>
                          
                        </Select>
                        assigneeID
                    </Form.Item>
                </Form>
            </Modal>

            <Table dataSource={works} columns={columns} rowKey="cageID" pagination={{ pageSize: 7 }} />
        </div>
    );
};

export default WorkManagement;
