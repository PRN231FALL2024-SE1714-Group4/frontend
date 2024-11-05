
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Space, Select,Popconfirm, DatePicker, Tag } from "antd";
import moment from "moment";
import { addAnimal, deleteAnimal, getAnimal, updateAnimal } from "../../../../services/api/Animal";
import { addHealthReport, deleteHealthReport, getHealth, getHealthReport, updateHealthReport } from "../../../../services/api/HealthAPI";
import { getCage } from "../../../../services/api/CageApi";
import TextArea from "antd/es/input/TextArea";
import { useSelector } from "react-redux";



const CageNeedToReport = () => {
    const [healths, setHealths] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalReportVisible, setIsModalReportVisible] = useState(false);
    const [cages, setCages] = useState([]); 
    const [cageNeedtoReport, setCageNeedToReport] = useState([]); 
    const [editingHealth, setEditingHealth] = useState(null);
    const [form] = Form.useForm();
    const role = useSelector((state) => state.auth.role);
    const [selectedCageID, setSelectedCageID] = useState(null); // Add state for selected cage ID
    const [selectedDateTime, setSelectedDateTime] = useState(null); // Add state for selected cage ID
    useEffect(() => {
        // fetchHealths();
        fetchCageNeedToReport();
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
    const fetchCageNeedToReport = async () => {
        try { 
            const response = await getHealthReport() ; 
            console.log("Fetched Health Reports:", response);
            setCageNeedToReport(response); 
        }catch (error) { 
            message.warning("không có cage cần report");
        }
    }


    const handleAdd = (cageID,dateTime) => {
        console.log("Selected Cage ID:", cageID); // Debugging line
        setSelectedCageID(cageID); // Set selected cage ID
        setSelectedDateTime(dateTime);
        setEditingHealth(null);
        form.resetFields();
        form.setFieldsValue({ cageID }); // Set the cageID in the form
        console.log("Form Values after setting cageID:", form.getFieldsValue()); 
        setIsModalVisible(true);
    };

    const handleOk = async (values) => {
        try {
            const formattedValues = {
                ...values,
                cageID: role === "STAFF" ? selectedCageID : values.cageID, // Use selected cage ID for staff
                dateTime: role === "STAFF" ? selectedDateTime: values.dateTime.format("YYYY-MM-DD"),
            };
            console.log("formatted value: ", formattedValues);
            const newAnimal = await addHealthReport(formattedValues);
            setHealths([newAnimal, ...healths]);
            message.success("Health Report added successfully.");
            setIsModalVisible(false);
            form.resetFields();
            fetchCageNeedToReport();
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
            render: (text, record, index) => index + 1, // Display serial number based on index
        },
        {
            title: "Cage",
            dataIndex: ["cage","cageName"],
            key: "cageID",
        
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
                <Button type = "default" onClick={() => handleAdd(record.cage.cageID, record.dateTime) }>  
                    Write Report 
                </Button>
               
            ) 
        },
    ];

    return (
        <div>
      
            <Modal
                title={ "Add Health Report"}
                open={isModalVisible}
                onOk={() => form.submit()}
                onCancel={handleCancel}
            >
                <Form onFinish={handleOk} form={form} layout="vertical">
            
                    {/* If role is staff, the cageID will be set automatically and not shown in the form */}
                    <Form.Item
                        name="description"
                        label="Description"
                  
                    >
                        <TextArea />
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
                dataSource={cageNeedtoReport}
                columns={columns}
                rowKey="helthReportID"
                pagination={{ pageSize: 7 }}
            />
        </div>
    );
};

export default CageNeedToReport;
