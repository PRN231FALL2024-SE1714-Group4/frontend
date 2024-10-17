
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Space, Select,Popconfirm } from "antd";
import moment from "moment";
import { addAnimal, deleteAnimal, getAnimal, updateAnimal } from "../../../../services/api/Animal";

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
            const response = await getAnimal();
            setAnimals(response); // Set animals data into state
        } catch (error) {
            message.error("Failed to fetch animals data.");
        }
    };

    const handleAdd = () => {
        setEditingAnimal(null);
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const { breed, gender, age, source } = values;

            if (editingAnimal) {
                // Update existing animal
                await updateAnimal(editingAnimal.animalID, breed, gender, age, source);
                const updatedAnimals = animals.map((item) =>
                    item.animalID === editingAnimal.animalID ? { ...item, breed, gender, age, source } : item
                );
                setAnimals(updatedAnimals);
                message.success("Animal updated successfully.");
            } else {
                // Add new animal
                const newAnimal = await addAnimal(breed, age, gender, source);
                setAnimals([newAnimal, ...animals]);
                message.success("Animal added successfully.");
            }

            setIsModalVisible(false);
            form.resetFields();
            fetchAnimals();
        } catch (error) {
            message.error("Validation failed: " + error.message);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

 const handleEdit = (record) => {
        setEditingAnimal(record);
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
            await deleteAnimal(id);
            setAnimals(animals.filter((item) => item.animalID !== id));
            message.success("Animal deleted successfully.");
        } catch (error) {
            message.error("Failed to delete area.");
        }
    };
    const columns = [
        {
            title: "No",
            key: "id",
            render: (text, record, index) => index + 1, // Display serial number based on index
        },
        {
            title: "Breed",
            dataIndex: "breed",
            key: "breed",
        },
        {
            title: "Source",
            dataIndex: "source",
            key: "source",
        },
        {
            title: "Gender",
            dataIndex: "gender",
            key: "gender",
        },
        {
            title: "Age",
            dataIndex: "age",
            key: "age",
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
                        title="Are you sure to delete animal?"
                        onConfirm={() => handleDelete(record.animalID)}
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
                    Add Animal
                </Button>
            </Space>
            <Modal
                title={editingAnimal ? "Edit Animal" : "Add Animal"}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="breed"
                        label="Breed"
                        rules={[{ required: true, message: "Please select the breed!" }]}
                    >
                        <Select>
                            <Select.Option value="brood_sow">Brood Sow</Select.Option>
                            <Select.Option value="market_hog">Market Hog</Select.Option>
                            <Select.Option value="boar">Boar</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[{ required: true, message: "Please select the gender!" }]}
                    >
                        <Select>
                            <Select.Option value="female">Female</Select.Option>
                            <Select.Option value="male">Male</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="age"
                        label="Age"
                        rules={[{ required: true, message: "Please input the age!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="source"
                        label="Source"
                        rules={[{ required: true, message: "Please input the source!" }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            <Table
                dataSource={animals}
                columns={columns}
                rowKey="animalID"
                pagination={{ pageSize: 7 }}
            />
        </div>
    );
};

export default AnimalManagement;
