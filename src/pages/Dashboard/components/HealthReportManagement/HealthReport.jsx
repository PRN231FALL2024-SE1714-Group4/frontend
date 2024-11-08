
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Space, Select,Popconfirm, DatePicker, Tag } from "antd";
import moment from "moment";
import { addAnimal, deleteAnimal, getAnimal, updateAnimal } from "../../../../services/api/Animal";
import { addHealthReport, deleteHealthReport, getHealth, getHealthReport, updateHealthReport } from "../../../../services/api/HealthAPI";
import { getCage } from "../../../../services/api/CageApi";
import TextArea from "antd/es/input/TextArea";
import { useSelector } from "react-redux";



const HealthReportManagement = () => {
    const [healths, setHealths] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalReportVisible, setIsModalReportVisible] = useState(false);
    const [cages, setCages] = useState([]); 
   
    const [editingHealth, setEditingHealth] = useState(null);
    const [form] = Form.useForm();
    const role = useSelector((state) => state.auth.role);
    const [selectedCageID, setSelectedCageID] = useState(null); // Add state for selected cage ID
    useEffect(() => {
        // fetchHealths();
        fetchHealths();
        fetchCages();
    }, []);

    const fetchCages = async () => {
        try { 
            const response = await getCage() ; 
            setCages(response); 

        }catch (error) { 
            message.error("Failed to fetch Cages data");
        }
    }
 
    const fetchHealths = async () => {
        try {
            const response = await getHealth();
            setHealths(response); // Set healths data into state
        } catch (error) {
            message.error("Failed to fetch healths data.");
        }
    };

    const handleAdd = (cageID) => {
        setEditingHealth(null);
        form.resetFields();
       
        setIsModalVisible(true);
    };

    const handleOk = async (values) => {
        try {
            const formattedValues = {
                ...values,
                dateTime: values.dateTime ? values.dateTime.format("YYYY-MM-DD") : null,
            };
            console.log("formatted value: ", formattedValues);
            const newAnimal = await addHealthReport(formattedValues);
            setHealths([newAnimal, ...healths]);
            message.success("Health Report added successfully.");
            setIsModalVisible(false);
            form.resetFields();
            // fetchHealths();
        } catch (error) {
            message.error("Validation failed: " + error.message);
        }
    };



    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleEdit = (record) => {
        setEditingHealth(record);
        setIsModalVisible(true);
        form.setFieldsValue({
            ...record,
            dateTime: record.dateTime ? moment(record.dateTime) : null, // Convert to moment object
        });
    };
    

    const handleDelete = async (id) => {
        try {
            // Delete area by id from API (implement deleteArea function)
            await deleteHealthReport(id);
            setHealths(healths.filter((item) => item.helthReportID !== id));
            message.success("Health report deleted successfully.");
        } catch (error) {
            message.error("Failed to delete health report.");
        }
    };
    const columns = [
        {
            title: "No",
            key: "id",
            render: (text, record, index) => index + 1, // Display serial number based on index
        },
        {
            title: "Cage",
            dataIndex: "cageID",
            key: "cageID",
            render: (cageID) => {
                const cage = cages.find(cage => cage.cageID === cageID);
                return cage ? cage.cageName : "Unknown";
            }
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
     
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag bordered={true} color="green">
                    {status}
                </Tag>
            ),
        },       
        {
            title: "Date Time",
            dataIndex: "dateTime",
            key: "dateTime",
            render: (text) => moment(text).format("YYYY-MM-DD"),
        },
        {
            title: "Action",
            key: "action",
            dataIndex:"cage",
            render: (_, record) => (
          
                <Space size="middle">
                    <Button type="primary" onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete Health Report?"
                        onConfirm={() => handleDelete(record.animalID)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ) 
        },
    ];

    return (
        <div>
            { <Space style={{ margin: 15 }}>
                <Button type="primary" onClick={handleAdd}>
                    Add Health Report
                </Button>
            </Space>}
            <Modal
                title={editingHealth ? "Edit Health Report" : "Add Health Report"}
                open={isModalVisible}
                onOk={() => form.submit()}
                onCancel={handleCancel}
            >
                <Form onFinish={handleOk} form={form} layout="vertical">
                    { (
                        <Form.Item
                            name="cageID"
                            label="Cage"
                            rules={[{ required: true, message: "Please select the cage!" }]}
                        >
                            <Select placeholder="Select a cage">
                                {cages.map((cage) => (
                                    <Select.Option key={cage.cageID} value={cage.cageID}>
                                        {cage.cageName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}
              
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: "Please enter the description!" }]}
                    >
                        <TextArea />
                    </Form.Item>
                    <Form.Item
                        name="dateTime"
                        label="Date Time"
                        rules={[{ required: true, message: "Please input the dateTime!" }]}
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true, message: "Please select the status!" }]}
                    >
                        <Select>
                            <Option value="GOOD">Good</Option>
                            <Option value="WARNING">WARNING</Option>
                            <Option value="BAD">BAD</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Table
                dataSource={healths}
                columns={columns}
                rowKey="helthReportID"
                pagination={{ pageSize: 7 }}
            />
        </div>
    );
};

export default HealthReportManagement;
