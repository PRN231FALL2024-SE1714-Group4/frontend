import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Space, Select, Popconfirm, DatePicker, Tag } from "antd";
import moment from "moment";

import { addWork,deleteWork,getAvailableUsers,getMyAssignedTask,getMyWork,getMyWorkToday,getWork, updateWork } from "../../../../services/api/WorkApi";
import {  getCage } from "../../../../services/api/CageApi";
import { getAllUsers } from "../../../../services/api/UserApi";
import TextArea from "antd/es/input/TextArea";
import { useSelector } from "react-redux";
import { addReport, getReport, updateReport } from "../../../../services/api/ReportApi";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const { Option } = Select;

const WorkTodayManagement = () => {
    const [users, setUsers] = useState([]);
    const [works, setWorks] = useState([]);
    const [myWorks, setMyWorks] = useState([]);
    const [myAssignedTask, setMyAssignedWorks] = useState([]);
    const [reports, setReports] = useState([]);
    const [cages, setCages] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingWork, setEditingWork] = useState(null);
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);
    const [availableUser, setAvailableUser] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [shift, setShift] = useState(null);
    const [assignee, setAssignee] = useState(null);
    const [myWorkToday, setMyWorkToday] = useState([]);
const [editingReport, setEditingReport] = useState(null);

    const [form] = Form.useForm();
    const role = useSelector((state) => state.auth.role);
    
    useEffect(() => {
        fetchMyWorkToday();
        fetchCages();
        fetchUsers();
    }, []);
  const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            const filteredUsers = response.filter(user => user.role.name === "STAFF");
            setUsers(filteredUsers);
        } catch (error) {
            message.error("Failed to fetch users data.");
        }
    };
   // Function to fetch available users
  const fetchAvailableUser = async () => {
    if (startDate && endDate && shift) {
      try {
        const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
        const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');
        const response = await getAvailableUsers(formattedStartDate,formattedEndDate, shift);
        console.log("Parameters sent to the database:", { formattedStartDate, formattedEndDate, shift })
        console.log("API response for available users:", response);
        setAvailableUser(response);
        // const data = await response;
        // setAvailableUser(data); // Assuming data is an array of available users
        // console.log("check data", data)
      } catch (error) {
        console.error('Error fetching available users:', error);
      }
    }
  };
  useEffect(() => {
    if (startDate && endDate && shift) {
        console.log("Shift has been updated:", shift);
      fetchAvailableUser();
    }
  }, [startDate, endDate, shift]);
    const fetchCages = async () => {
        try {
            const response = await getCage();
            setCages(response); 
        } catch (error) {
            message.error("Failed to fetch Cages data.");
        }
    };
    
    const fetchMyWorkToday = async () => {
        try {
            const response = await getMyWorkToday();
            console.log("check response:" , response);
            setMyWorkToday(response); 
        } catch (error) {
            message.error("Failed to fetchMyWorkToday data.");
        }
    };
    const fetchMyAssignedTask = async () => {
        try {
            const response = await getMyAssignedTask ();
            setMyAssignedWorks(response); 
        } catch (error) {
            message.error("Failed to fetch MyTask data.");
        }
    };
    const fetchWorks = async () => {
        try {
            const response = await getWork ();
            setWorks(response); 
        } catch (error) {
            message.error("Failed to fetch Works data.");
        }
    };
    const fetchReports = async () => {
        try {
            const response = await getReport();
            setReports(response); 
        } catch (error) {
            message.error("Failed to fetch Reports data.");
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
            startDate: record.startDate ? moment(record.startDate) : null,
            endDate: record.endDate ? moment(record.endDate) : null,
            assigneeID: record.assignee?.userID,  // Set assignee by ID
            cageId: record.cage?.cageID,  // Set cage by ID
            mission: record.mission,  // Assuming it's stored as a string or number
            shift: record.shift,  // Set shift value
            description: record.description  // Set description value
        });
    };

    const handleDelete = async (id) => {
        try {
            await deleteWork(id);
            setWorks(works.filter((item) => item.workId !== id));
            message.success("Work deleted successfully.");
        } catch (error) {   
            message.error("Failed to delete Work.");
        }
        
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log(values);
            const {cageId, description,startDate,endDate,shift,assigneeID,mission,status } = values;  // Sử dụng cageName và areaID từ form values
         
            if (editingWork) {
                // Update existing Cage
                await updateWork(editingWork.workId, description,startDate,endDate,shift,assigneeID,mission,status );
                const updatedWorks = works.map((item) =>
                    item.workId === editingWork.workId ? {  description,startDate,endDate,shift,assigneeID,mission,status , ...item, } : item
                );
                setWorks(updatedWorks);
                message.success("Work updated successfully.");
            } else {
                // Create new Cage
                const newWork = await addWork(cageId, description,startDate,endDate,shift,assigneeID,mission );
                setWorks([newWork, ...works]);
                message.success("Work added successfully.");
            }
            setIsModalVisible(false);
            form.resetFields();
            fetchWorks();
            fetchMyAssignedTask();
        } catch (error) {
            message.error("Validation failed: " + error.message);
        }
    };
    const handleOkReport = async () => {
        try {
            const values = await form.validateFields();
            console.log(values);
            const { workId, description, workStatus } = values;
    
            if (editingReport) {
                // Update existing Report
                await updateReport(editingReport.workId, description, workStatus);
                const updatedReports = reports.map((item) =>
                    item.workId === editingReport.workId ? { ...item, description, workStatus } : item
                );
                setReports(updatedReports);
                message.success("Report updated successfully.");
            } else {
                // Create new Report
                const newReport = await addReport(workId, description, workStatus);
                setReports([newReport, ...reports]);
    
                // Update work to indicate that a report has been written
                const updatedWorks = works.map((work) =>
                    work.workId === workId ? { ...work, hasReport: true } : work
                );
                setWorks(updatedWorks);
    
                message.success("Report added successfully.");
            }
    
            setIsReportModalVisible(false);
            form.resetFields();
            // fetchReports();
            fetchMyWorkToday();
        } catch (error) {
            message.error("Validation failed: " + error.message);
        }
    };
    
    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleWriteReport = (record) => {
        setEditingReport(null);
        setIsReportModalVisible(true);
        form.setFieldsValue( {workId: record.workId} ); // Set the selected workId in the form
        console.log("check workId", workId);
    };
    
    
    const handleEditReport = (record) => {
        setEditingReport(record);
        setIsReportModalVisible(true);
        form.setFieldsValue({
            mission: record.mission,
            description: record.report?.description || "",
            healthDescription: record.report?.healthDescription || ""
        });
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
            render: (text, record) => (
                <Link to={`/report-detail/${record.workId}`}>
                     <Tag color="blue">{text}</Tag>             
                </Link>
                   ),
        },
        {
            title: "Shift",
            dataIndex: "shift",
            key: "shift",
            render: (shift) => (
                <Tag bordered={true} color="green">
                    {shift}
                </Tag>
            ),
        },
        {
            title: "Cage",
            dataIndex: ["cage","cageName"],
            key: "cage",
            render: (cage) => (
                <Tag bordered={true} color="error">
                    {cage}
                </Tag>
            ),
        },
        {
            title: "Area",
            dataIndex: ["area","name"],
            key: "area",
            render: (area) => (
                <Tag bordered={true} color="warning">
                    {area}
                </Tag>
            ),
        },
        // {
        //     title: "Assignee",
        //     dataIndex: ["assignee","fullName"],
        //     key: "assignee",
        //     render: (assignee) => (
        //         <Tag bordered={true} color="blue">
        //             {assignee}
        //         </Tag>
        //     ),
        // },
        // {
        //     title: "Start Date",
        //     dataIndex: "startDate",
        //     key: "startDate",
        //     render: (text) =>  
        //      <Tag bordered={false} color="orange">
        //          {dayjs(text).format("YYYY-MM-DD HH:mm:ss")}
        //      </Tag>,
        //        sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),  // Sort by startDate
        // },
        
        // {
        //     title: "End Date",
        //     dataIndex: "endDate",
        //     key: "endDate",
        //     render: (text) => 
        //     <Tag bordered={false} color="gold">
        //           {moment(text).format("YYYY-MM-DD HH:mm")}
        //     </Tag> ,
        //       sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),  // Sort by startDate
        // },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (assigner) => (
                <Tag bordered={true} color="volcano">
                    {assigner}
                </Tag>
            ),
        },
        
        {
            title: "Status",
            dataIndex: ["status"],
            key: "status",
            render: (status) => (
                <Tag bordered={true} color="cyan">
                    {status}
                </Tag>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (                
                <Space size="middle">
               {role === "STAFF" && (
                    <>
                        {record.hasReport ? (
                            <Button type="primary" onClick={() => handleEditReport(record)}>Edit Report</Button>
                        ) : (
                            <Button 
                            color="primary" variant="outlined"
                                onClick={() => handleWriteReport(record)}
                                >
                                Write Report
                            </Button>
                        )}
                    </>
                )}
                    {role !== "STAFF" && (
                    <Button type="primary" onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                       )}
                    <Popconfirm
                        title="Are you sure to delete this work?"
                        onConfirm={() => handleDelete(record.workId)}
                        okText="Yes"
                        cancelText="No"
                    >
                          {role !== "STAFF" && (
                        <Button type="primary" danger>
                            Delete
                        </Button>
                           )}
                    </Popconfirm>
                </Space>
            ),
        },
    ];
   
    return (
        <div>
            <Space style={{ margin: 15 }}>
            {role !== "STAFF" && (
                    <Button type="primary" onClick={handleAdd}>
                        Add Work
                    </Button>
                )}
            </Space>

            <Modal
                title={editingWork ? "Edit Work" : "Add Work"}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                   
                    <Form.Item
                    name = "startDate"
                    label = "Start Date"
                    rules={[{ required: true, message: "Please select startDate!" }]}
                    >
                        <DatePicker onChange={(date) => setStartDate(date)} 
                             format="YYYY-MM-DD"/>
                    </Form.Item>
                    <Form.Item
                    name = "endDate"
                    label = "End Date"
                    rules={[{ required: true, message: "Please select endDate!" }]}
                    >
                        <DatePicker onChange={(date) => setEndDate(date)}  format="YYYY-MM-DD"/>
                    </Form.Item>
                    <Form.Item
                        name = "shift"
                        label="Shift"
                        rules={[{required: true, message: "Please select the Shift"}]}
                    >
                      <Select
    placeholder="Select a Shift"   
    onChange={(value) => {
        console.log("Selected Shift:", value); // Debug log
        setShift(value);
    }}
>
                            <Option value='SHIFT_ONE'> SHIFT_ONE</Option>
                            <Option value='SHIFT_TWO'> SHIFT_TWO</Option>
                            <Option value='SHIFT_THREE'> SHIFT_THREE</Option>                         
                        </Select>
                        
                    </Form.Item>
                    <Form.Item
                        name="assigneeID"
                        label="Assignee Name"
                        rules={[{ required: true, message: "Please select an assignee!" }]}
                    >
                        <Select placeholder="Select an assignee"
                         onChange={(value) => setAssignee(value)}
                     
                         >
                            {availableUser.map((user) => (
                                <Option key={user.user.userID} value={user.user.userID}>
                                    {user.user.fullName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name = "mission"
                        label="Mission"
                        rules={[{required: true, message: "Please select the Mission"}]}
                    >
                        <Select placeholder = "Select a mission"
                        >
                            <Option value='FEED'> FEED</Option>
                            <Option value='CLEAN_CAGE'> CLEAN_CAGE</Option>
                            <Option value='ANIMAL_MOVE'> ANIMAL_MOVE</Option>
                            <Option value='OTHER'> OTHER</Option>
                        </Select>

                    </Form.Item>
                    <Form.Item
                        name="description"  // Sử dụng tên trường đúng là cageName
                        label="Description "  
                        rules={[{ required: true, message: "Please input a description!" }]}    
                    >
                        <TextArea/>
                    </Form.Item>
                
                    <Form.Item
                        name="cageId"
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
                   
                    {editingWork && (
                    <Form.Item
                        name = "status"
                        label="Status"
                        rules={[{required: true, message: "Please select the Status"}]}
                    >
                        <Select placeholder = "Select a Status"
                        >
                            <Option value='OPEN'> OPEN</Option>
                            <Option value='IN_PROGRESS'> IN_PROGRESS</Option>
                            <Option value='DONE'> DONE</Option>
                            <Option value='CLOSED'> CLOSED</Option>                         
                        </Select>              
                    </Form.Item>
                      )}
                </Form>
            </Modal>
            <Modal
    title={editingReport ? "Edit Report" : "Write Report"}
    visible={isReportModalVisible}
    onOk={handleOkReport}
    onCancel={() => setIsReportModalVisible(false)}
>
    <Form form={form} layout="vertical">
        <Form.Item
            name="workId"
            label="Work Name"
            rules={[{ required: true, message: "Please select a work!" }]}
            hidden 
        >
            <Select placeholder="Select a work">
                {myWorks.map((work) => (
                    <Option key={work.workId} value={work.workId}>
                        {work.name}
                    </Option>
                ))}
            </Select>
        </Form.Item>
        <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please input the description!" }]}
        >
            <TextArea />
        </Form.Item>
        <Form.Item
            name="workStatus"
            label="Work Status"
            rules = {[{ required: true, message: "Please select the status!" }]}
        >
            <Select>
                <Option value ="IN_PROGRESS">IN_PROGRESS</Option> 
                <Option value ="DONE">DONE</Option> 
            </Select>
        </Form.Item>
    </Form>
</Modal>
            <Table dataSource={myWorkToday} columns={columns} rowKey="workId" pagination={{ pageSize: 10 }} />
        </div>
    );
};

export default WorkTodayManagement;
