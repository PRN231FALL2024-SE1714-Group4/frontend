import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addReport, getReport, updateReport } from "../../../../services/api/ReportApi";
import { Button, Form, Modal, Select, Space, Table, Tag, message,Popconfirm } from "antd";
import moment from "moment";
import TextArea from "antd/es/input/TextArea";
import { getMyWork } from "../../../../services/api/WorkApi";

const ReportDetail = () => {
    const { workId } = useParams();
    const [reports, setReports] = useState([]);
    const [workName, setWorkName] = useState(""); // Thêm state để lưu tên công việc
    const [editingReport, setEditingCage] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [myWorks, setMyWorks] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetchReports();
        fetchMyWorks();
    }, [workId]);

    const fetchReports = async () => {
        try {
            const response = await getReport();
            console.log("Response from API:", response); // Thêm dòng này
            const filteredReports = response.filter(report => report.workId === workId);

            // Lấy tên công việc từ báo cáo đầu tiên (nếu có)
            if (filteredReports.length > 0) {
                const work = filteredReports[0].work; // Giả định rằng 'work' là đối tượng chứa thông tin công việc
                setWorkName(work.mission); // Hoặc trường phù hợp mà bạn muốn hiển thị
            }
            setReports(filteredReports);
        } catch (error) {
            message.error("Failed to fetch reports.");
        }
    };
    const fetchMyWorks = async () => {
        try {
            const response = await getMyWork ();
            setMyWorks(response); 
        } catch (error) {
            message.error("Failed to fetch Cages data.");
        }
    };
   
    const handleEdit = (record) => {
        setEditingCage(record);
        setIsModalVisible(true);
        form.setFieldsValue( {reportID: record.reportID, description: record.description, healthDescription: record.healthDescription, workStatus: record.workStatus} ); // Set the selected workId in the form
    };
    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log(values);
            const { reportID,description, healthDescription,workStatus } = values;  // Sử dụng cageName và areaID từ form values

            if (editingReport) {
                // Update existing Report
                await updateReport(editingReport.reportID, description, healthDescription,workStatus);
                const updatedReports = reports.map((item) =>
                    item.reportID === editingReport.reportID ? { ...item, description, healthDescription ,workStatus} : item
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
            title: "No.", // Tiêu đề cột số thứ tự
            render: (text, record, index) => index + 1, // Số thứ tự
            key: "no",
            width: 50, // Đặt chiều rộng cột nếu cần
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (description) => (
                <Tag bordered={true} color="cyan">
                    {description}
                </Tag>  
            ),
        },
        // {
        //     title: "Health Description",
        //     dataIndex: "healthDescription",
        //     key: "healthDescription",
        //     render: (healthDescription) => (
        //         <Tag bordered={true} color="processing">
        //             {healthDescription}
        //         </Tag>  
        //     ),
        // },

        {
            title: "Date",
            dataIndex: "dateTime",
            key: "dateTime",
            render: (text) => 
                
                <Tag bordered={false} color="lime">
                {moment(text).format("YYYY-MM-DD HH:mm")}
            </Tag>
        },
        // {
        //     title: "Status",
        //     dataIndex: "status",
        //     key: "status",
        //     render: (status) => (
        //         <Tag bordered={true} color="orange">
        //             {status}
        //         </Tag>  
        //     ),
        // },
        // {
        //     title: "Action",
        //     key: "action",
        //     render: (_, record) => (
        //         <Space size="middle">
        //             <Button type="primary" onClick={() => handleEdit(record)}>
        //                 Edit
        //             </Button>
                   
        //         </Space>
        //     ),
        // },
        
    ];

    return (
        <div>
            <Button onClick={() => navigate("/works")} type="primary" style={{ marginBottom: '16px' }}>
                Back
            </Button>
            <h1>Report Details for Work: <Tag color="geekblue">{workName}</Tag> </h1> {/* Hiển thị tên công việc */}
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
                            rules={[{ required: true, message: "Please select a work!" }]}
                            hidden 
                    >
                        <Select placeholder="Select an report">
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
                    <Form.Item
                            name="work"
                            label="Work Status"
                            rules={[{ required: true, message: "Please select a workStatus!" }]}
                          
                    >
                         
                        <Select placeholder="Select an status">
                         <Option value='OPEN'> OPEN</Option>
                            <Option value='IN_PROGRESS'> IN_PROGRESS</Option>
                            <Option value='DONE'> DONE</Option>  
                            <Option value='CLOSED'> CLOSED</Option>                             
                        </Select>
                    </Form.Item>
                </Form>

            </Modal>
            <Table dataSource={reports} columns={columns} rowKey="reportID" pagination={{ pageSize: 10 }} />
        </div>
        
    );
};

export default ReportDetail;
