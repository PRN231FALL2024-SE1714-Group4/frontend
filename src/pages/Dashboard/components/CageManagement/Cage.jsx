import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Space, Select, Popconfirm } from "antd";
import moment from "moment";
import { getArea } from '/src/services/api/AreaApi.js';
import { createCage, getCage, deleteCage, updateCage } from '/src/services/api/CageApi.js';
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const { Option } = Select;

const CageManagement = () => {
    const { areaId } = useParams(); // Lấy areaId từ params
    const [cages, setCages] = useState([]);
    const [cagesByAreId, setCagesByAreaId] = useState([]);
    const [areas, setAreas] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCage, setEditingCage] = useState(null);
    const [form] = Form.useForm();
   
    const role = useSelector((state) => state.auth.role);
    const navigate = useNavigate();
    useEffect(() => {
        fetchCagesById();
    }, [areaId]);
    useEffect(() => { 
        fetchCages();
        fetchAreas();
    },[])

    const fetchAreas = async () => {
        try {
            const response = await getArea();
            setAreas(response); 
        } catch (error) {
            message.error("Failed to fetch areas data.");
        }
    };

    const fetchCagesById = async () => {
        try {
            const response = await getCage();
           const filteredCages = response.filter(cage => cage.areaID === areaId);
           setCagesByAreaId(filteredCages);
        } catch (error) {
            message.error("Failed to fetch Cages data.");
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
        form.setFieldsValue({ areaId });
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
            const { cageName } = values;  // Sử dụng cageName và areaID từ form values

            if (editingCage) {
                // Update existing Cage
                await updateCage(editingCage.cageID, cageName,  editingCage.areaID);
                const updatedCages = cages.map((item) =>
                    item.cageID === editingCage.cageID ? { ...item, cageName } : item
                );
                setCages(updatedCages);
                message.success("Cage updated successfully.");
            } else {
                // Create new Cage
                const newCage = await createCage(cageName, areaId );
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
    const handleViewPig = (cageID) =>{ 
        navigate(`histories/${cageID}`);
    }
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
            render: (text, record) => (
                <Link to={`/histories/${record.cageID}`}>{text}</Link> // Điều hướng tới HistoryManagement
            ),
        },
        {
            title: "Area",
            dataIndex: ["area", "name"],
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
            render: (_, record) => role === "MANAGER"?  (
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
            ) : <Button type = "primary" onClick={() => navigate(`/histories/${record.cageID}`)}>
                View Pig In Cage
            </Button>,
        },
    ];

    return (
        <div>
             {role === "MANAGER" && (
            <Space style={{ margin: 15 }}>
                <Button type="primary" onClick={handleAdd}>
                    Add Cage
                </Button>
            </Space> )}

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
                    {!areaId && (
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
                       )}
                </Form>
                        
            </Modal>

            <Table dataSource={areaId ? cagesByAreId : cages} columns={columns} rowKey="cageID" pagination={{ pageSize: 7 }} />
        </div>
    );
};

export default CageManagement;
