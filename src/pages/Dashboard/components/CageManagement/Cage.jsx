import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Space, Select, Popconfirm } from "antd";
import moment from "moment";
import { getArea } from '/src/services/api/AreaApi.js';
import { createCage, getCage, deleteCage, updateCage } from '/src/services/api/CageApi.js';

const { Option } = Select;

const CageManagement = () => {
    const [cages, setCages] = useState([]);
    const [areas, setAreas] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCage, setEditingCage] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchCages();
        fetchAreas();
    }, []);

    const fetchAreas = async () => {
        try {
            const response = await getArea();
            setAreas(response); 
        } catch (error) {
            message.error("Failed to fetch areas data.");
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

    const handleAdd = () => {
        setEditingCage(null);
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingCage(record);
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
            setCages(cages.filter((item) => item.cageID !== id));
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

            if (editingCage) {
                // Update existing Cage
                await updateCage(editingCage.cageID, cageName, areaID );
                const updatedCages = cages.map((item) =>
                    item.cageID === editingCage.cageID ? { ...item, cageName, areaID } : item
                );
                setCages(updatedCages);
                message.success("Cage updated successfully.");
            } else {
                // Create new Cage
                const newCage = await createCage(cageName, areaID );
                setCages([newCage, ...cages]);
                message.success("Cage added successfully.");
            }
            setIsModalVisible(false);
            form.resetFields();
            fetchCages();
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
            title: "Cage Name",
            dataIndex: "cageName",
            key: "cageName",
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
                    Add Cage
                </Button>
            </Space>

            <Modal
                title={editingCage ? "Edit Cage" : "Add Cage"}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="cageName"  // Sử dụng tên trường đúng là cageName
                        label="Cage Name"
                        rules={[{ required: true, message: "Please input the Cage Name!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="areaID"
                        label="Area"
                        rules={[{ required: true, message: "Please select an area!" }]}
                    >
                        <Select placeholder="Select an area">
                            {areas.map((area) => (
                                <Option key={area.areaID} value={area.areaID}>
                                    {area.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <Table dataSource={cages} columns={columns} rowKey="cageID" pagination={{ pageSize: 7 }} />
        </div>
    );
};

export default CageManagement;
