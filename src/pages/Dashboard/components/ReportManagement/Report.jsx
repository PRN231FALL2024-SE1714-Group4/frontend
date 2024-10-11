import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Space, Select, Popconfirm } from "antd";
import moment from "moment";
import { getArea } from '/src/services/api/AreaApi.js';
import { createCage, getCage, } from '/src/services/api/CageApi.js';
import { addReport, getReport, deleteReport, updateReport } from "../../../../services/api/ReportApi";
import { useSelector } from "react-redux";
import { getMyWork } from "../../../../services/api/WorkApi";
import TextArea from "antd/es/input/TextArea";

const { Option } = Select;

const ReportManagement = () => {
    const [reports, setReports] = useState([]);
    const [myWorks, setMyWorks] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingReport, setEditingCage] = useState(null);
    const [form] = Form.useForm();

    const role = useSelector((state) => state.auth.role);
    const dataSource = role === "STAFF" || role === "MANAGER" ? myWorks : "no data";
    useEffect(() => {
        fetchReports();
        if (role === "STAFF") {
            fetchMyWorks(); // Chỉ fetch my works nếu role là STAFF
        }
    }, [role]);

    const fetchMyWorks = async () => {
        try {
            const response = await getMyWork ();
            setMyWorks(response); 
        } catch (error) {
            message.error("Failed to fetch Cages data.");
        }
    };

    const fetchReports = async () => {
        try {
            const response = await getReport();
            setReports(response); 
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
        });
    };

    const handleDelete = async (id) => {
        try {
            await deleteReport(id);
            setReports(reports.filter((item) => item.workId !== id));
            message.success("Report deleted successfully.");
        } catch (error) {
            message.error("Failed to delete Report.");
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log(values);
            const { reportID,description, healthDescription } = values;  // Sử dụng cageName và areaID từ form values

            if (editingReport) {
                // Update existing Report
                await updateReport(editingReport.reportID, description, healthDescription );
                const updatedReports = reports.map((item) =>
                    item.reportID === editingReport.reportID ? { ...item, description, healthDescription } : item
                );
                setReports(updatedReports);
                message.success("Report updated successfully.");
            } else {
                // Create new Report
                const newReport = await addReport(reportID, description,healthDescription );
                setReports([newReport, ...reports]);
                message.success("Report added successfully.");
            }
            setIsModalVisible(false);
            form.resetFields();
            fetchReports();
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
            title: "Work Name",
            dataIndex: ["work", "mission"],
            key: "workName",
        },
        {
            title: "Shift",
            dataIndex: ["work", "shift"],
            key: "Shift",
        },
        {
            title: "Status",
            dataIndex: ["work", "status"],
            key: "status",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
         {
            title: "Health Description",
            dataIndex: "healthDescription",
            key: "healthDescription",
        },
        {
            title: "Created Date",
            dataIndex: "createdDate",
            key: "createdDate",
            render: (text) => moment(text).format("YYYY-MM-DD"),
        },
        {
            title: "Updated Date",
            dataIndex: "updatedDate",
            key: "updatedDate",
            render: (text) => moment(text).format("YYYY-MM-DD"),
        },
        // {
        //     title: "Action",
        //     key: "action",
        //     render: (_, record) => (
        //         <Space size="middle">
        //             <Button type="primary" onClick={() => handleEdit(record)}>
        //                 Edit
        //             </Button>
        //             <Popconfirm
        //                 title="Are you sure to delete this cage?"
        //                 onConfirm={() => handleDelete(record.workId)}
        //                 okText="Yes"
        //                 cancelText="No"
        //             >
        //                 <Button type="primary" danger>
        //                     Delete
        //                 </Button>
        //             </Popconfirm>
        //         </Space>
        //     ),
        // },
    ];

    return (
        <div>
            {/* <Space style={{ margin: 15 }}>
                <Button type="primary" onClick={handleAdd}>
                    Add Report
                </Button>
            </Space>

            <Modal
                title={editingReport ? "Edit Report" : "Add Report"}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                <Form.Item
                        name="reportID"
                        label="Report Name"
                        rules={[{ required: true, message: "Please select an work!" }]}
                        hidden
                    >
                        <Select placeholder="Select an work">
                            {myWorks.map((work) => (
                                <Option key={work.workId} value={work.workId}>
                                    {work.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="description"  // Sử dụng tên trường đúng là cageName
                        label="Description"
                        rules={[{ required: true, message: "Please input the description!" }]}
                    >
                   <TextArea/>
                    </Form.Item>
                    <Form.Item
                        name="healthDescription"  // Sử dụng tên trường đúng là cageName
                        label="Health Description"
                        rules={[{ required: true, message: "Please input the health description!" }]}
                    >
                   <TextArea/>
                    </Form.Item>
                    
                </Form>

            </Modal> */}

            <Table dataSource={reports} columns={columns} rowKey="reportID" pagination={{ pageSize: 7 }} />
        </div>
    );
};

export default ReportManagement;
