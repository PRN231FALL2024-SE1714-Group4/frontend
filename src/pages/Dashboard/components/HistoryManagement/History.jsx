

// import React, { useState, useEffect } from "react";
// import { Table, Button, Modal, Form, Input, message, Space, Select,Popconfirm, DatePicker } from "antd";
// import moment from "moment";

// import { createHistory, deleteHistory, getHistory } from "../../../../services/api/History";

// import { getAnimal, updateAnimal } from "../../../../services/api/Animal";
// import { getCage } from "../../../../services/api/CageApi";
// import { useNavigate, useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { addHealthReport } from "../../../../services/api/HealthAPI";
// import TextArea from "antd/es/input/TextArea";

// const HistoryManagement = () => {
//     const { cageId } = useParams(); // Lấy areaId từ params
//     const [histories, setHistories] = useState([]);
//     const [cages, setCages] = useState([]);
//     const [animals, setAnimals] = useState([]);
    
//     const [animalsById, setAnimalByCageId] = useState([]);
//     const [healths, setHealths] = useState([]);
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [isModalWriteReportVisible, setIsModalWriteReportVisible] = useState(false);
//     const [editingHistory, setEditingHistory] = useState(null);
//     const [form] = Form.useForm();
//     const role = useSelector((state) => state.auth.role);

//     // Define fromDate and toDate in state
//     const [fromDate, setFromDate] = useState(null);
//     const [toDate, setToDate] = useState(null);

//     const formattedFromDate = fromDate ? moment(fromDate).format("YYYY-MM-DD") : null;
//     const formattedToDate = toDate ? moment(toDate).format("YYYY-MM-DD") : null;
//     const navigate = useNavigate();
//     useEffect(() => {
//         fetchHistoriesById();
//     }, [cageId]);
  
//     useEffect(() => {
//         fetchHistory();
//         fetchAnimal();
//         fetchCage();
//     }, []);



//     const fetchHistoriesById = async () => {
//         try {
//             const response = await getHistory();
//             console.log(response); // Kiểm tra dữ liệu phản hồi
//            const filteredHistories  = response.filter(history => history.cageID === cageId);
//            console.log("check filter: ",filteredHistories )
//            setAnimalByCageId(filteredHistories);
//         } catch (error) {
//             message.error("Failed to fetch HistoryById data.");
//         }
//     };
//     const fetchHistory = async () => {
//         try {
//             const response = await getHistory();
//             setHistories(response); // Set histories data into state
//         } catch (error) {
//             message.error("Failed to fetch histories data.");
//         }
//     };
//     const fetchAnimal = async () => {
//         try {
//             const response = await getAnimal();

//             setAnimals(response); // Set animals data into state
//         } catch (error) {
//             message.error("Failed to fetch animals data.");
//         }
//     };

//     const fetchCage = async () => {
//         try {
//             const response = await getCage();
//             setCages(response); // Set cages data into state
//         } catch (error) {
//             message.error("Failed to fetch cages data.");
//         }
//     };


//     //         setAnimals(response); // Set histories data into state
//     //     } catch (error) {
//     //         message.error("Failed to fetch histories data.");
//     //     }
//     // };
//     // const fetchCage = async () => {
//     //     try {
//     //         const response = await getCage();
//     //         setCages(response); // Set histories data into state
//     //     } catch (error) {
//     //         message.error("Failed to fetch histories data.");
//     //     }
//     // };

//     const handleAdd = () => {
//         setEditingHistory(null);
//         setIsModalVisible(true);
//         form.setFieldsValue({ cageID: cageId });
//     };
//     const handleOpenModalWriteReport = () => {
//         // setEditingHistory(null);
//         setIsModalWriteReportVisible(true);
//         form.resetFields();
//     };
//     const handleOk = async () => {
//         try {
//             const values = await form.validateFields();
//             const { animalID, cageID, description, fromDate, toDate } = values;    
//             const formattedFromDate = fromDate ? moment(fromDate).format("YYYY-MM-DD") : null;
//             const formattedToDate = toDate ? moment(toDate).format("YYYY-MM-DD") : null;
//             const historyData = {
//                 animalID,
//                 cageID,
//                 description,
               
//                 fromDate: formattedFromDate,
//                 toDate: formattedToDate
//             };
//             if (editingHistory) {
//                 await updateHistory(editingHistory.historyID, historyData);
//                 // Update UI state
//             } else {
//                 await createHistory(historyData);  // Pass the historyData object to the API
//                 // Update UI state

//             const values = await form.validateFields();
//             const { animalID, cageID, description, status, formattedFromDate, formattedToDate} = values;
//             if (editingHistory) {
//                 // Update existing animal
//                 await updateAnimal(editingHistory.animalID, cageID, description, status,formattedFromDate, formattedToDate);
//                 const updatedAnimals = histories.map((item) =>
//                     item.animalID === editingHistory.animalID ? { ...item, breed, gender, age, source } : item
//                 );
//                 setHistories(updatedAnimals);
//                 message.success("Animal updated successfully.");
//             } else {
//                 // Add new animal
//                 const newAnimal = await createHistory(animalID, cageID, description, status,formattedFromDate, formattedToDate);
//                 setHistories([newAnimal, ...histories]);
//                 message.success("Animal added successfully.");
//             }
//             setIsModalVisible(false);
//             form.resetFields();
//             fetchHistory();
//         }
//     } 
//         catch (error) {
//             message.error("Validation failed: " + error.message);
//         }
//     }


//     const handleCancel = () => {
//         setIsModalVisible(false);
//         form.resetFields();
//     };




//  const handleEdit = (record) => {

//         setEditingHistory(record);
//         setIsModalVisible(true);
//         form.setFieldsValue({
//             ...record,

//             fromDate: record.fromDate ? moment(record.fromDate) : null,
//             toDate: record.toDate ? moment(record.toDate) : null,

//             // createdDate: record.createdDate ? new Date(record.createdDate) : null,
//             // updatedDate: record.updatedDate ? new Date(record.updatedDate) : null,
//         });
//     };

//     const handleDelete = async (id) => {
//         try {
//             // Delete area by id from API (implement deleteArea function)
//             await deleteHistory(id);
//             setHistories(histories.filter((item) => item.historyID !== id));
//             message.success("History deleted successfully.");
//         } catch (error) {
//             message.error("Failed to delete History.");
//         }
//     };

//     const handleWriteReport= async (values) => {
//         try {
//             const formattedValues = {
//                 ...values,
//                 dateTime: values.dateTime ? values.dateTime.format("YYYY-MM-DD") : null, // Format dateTime
//             };
//              // Add new Health Report
//                 const newAnimal = await addHealthReport(formattedValues);
//                 setHealths([newAnimal, ...healths]);
//                 message.success("Health Report wrote successfully.");
            
//             setIsModalVisible(false);
//             form.resetFields();
    
//         } catch (error) {
//             message.error("Validation failed: " + error.message);
//         }
//     }
//     const columns = [
//         {
//             title: "No",
//             key: "id",
//             render: (text, record, index) => index + 1, // Display serial number based on index
//         },
//         {
//             title: "Animal",
//             dataIndex: "animalID",
//             key: "animalID",
//             render: (animalID) => {
//                 const animal = animals.find(animal => animal.animalID === animalID);
//                 return animal ? animal.breed : "Unknown";
//             },
//         },
//         {
//             title: "Cage",
//             dataIndex: "cageID",
//             key: "cageID",
//             render: (cageID) => {
//                 const cage = cages.find(cage => cage.cageID === cageID);
//                 return cage ? cage.cageName : "Unknown";
//             }
//         },
//         {
//             title: "Description",
//             dataIndex: "description",
//             key: "description",
//         },
//         {
//             title: "Status",
//             dataIndex: "status",
//             key: "status",
//         },
//         {
//             title: "From Date",
//             dataIndex: "fromDate",
//             key: "fromDate",
//             render: (text) => moment(text).format("YYYY-MM-DD"),
//         },
//         {
//             title: "To Date",
//             dataIndex: "toDate",
//             key: "toDate",
//             render: (text) => text? moment(text).format("YYYY-MM-DD") : "",
//         },
//         {
//             title: "Action",
//             key: "action",
//             render: (_, record) => role === "MANAGER" ? (
//                 <Space size="middle">
    
//                     <Button type="primary" onClick={() => handleEdit(record)}>
//                         Edit
//                     </Button>
//                     <Popconfirm

//                         title="Are you sure to delete animal?"
//                         onConfirm={() => handleDelete(record.animalID)}

//                         okText="Yes"
//                         cancelText="No"
//                     >
//                         <Button type="primary" danger>
//                             Delete
//                         </Button>
//                     </Popconfirm>
//                 </Space>
//             ) :
//             <Space size="middle"> 
//                  <Button color="default" variant="solid" onClick={handleOpenModalWriteReport}>
//             Write Report
//         </Button>
//             <Button type = "primary" onClick={() => navigate(`/healths/${record.cageID}`)}>
//                 View Report
//             </Button>
       
//         </Space>,
//         },
//     ];

//     return (
//         <div>
//             <Space style={{ margin: 15 }}>
//                 <Button type="primary" onClick={handleAdd}>
//                     Add Animal
//                 </Button>
//             </Space>
//             <Modal

//                 title={editingHistory ? "Edit Animal" : "Add Animal"}
//                 open={isModalVisible}
//                 onOk={handleOk}
//                 onCancel={handleCancel}
//             >
//                 <Form form={form} layout="vertical">
//                     <Form.Item
//                         name="animalID"
//                         label="Animal"
//                         rules={[{ required: true, message: "Please select an animal!" }]}
//                     >
                      
//                             <Select placeholder="Select an animal">
//                             {animals.map((animal) => (
//                                 <Option key={animal.animalID} value={animal.animalID}>
//                                     {animal.breed}
//                                 </Option>
//                             ))}
//                         </Select>
//                     </Form.Item>
//                     {!cageId && (
//                     <Form.Item
//                         name="cageID"
//                         label="Cage"
//                         rules={[{ required: true, message: "Please select a cage!" }]}                
//                     >
//                                <Select placeholder="Select a Cage">
//                             {cages.map((cage) => (
//                                 <Option key={cage.cageID} value={cage.cageID}>
//                                     {cage.cageName}
//                                 </Option>
//                             ))}
//                              </Select>

//                     </Form.Item>
//                 )}

//                     <Form.Item
//                         name="description"
//                         label="Description"
//                         rules={[{ required: true, message: "Please input the description!" }]}
//                     >
//                         <Input />
//                     </Form.Item>
               
//                     <Form.Item
//                         name="fromDate"
//                         label="From Date"
//                         rules={[{ required: true, message: "Please choose the from date!" }]}
//                     >
//                         <DatePicker onChange={(date) => setFromDate(date)} />
               
//                     </Form.Item>
//                     <Form.Item
//                         name="toDate"
//                         label="To Date"
                        
//                     >
//                         <DatePicker onChange={(date) => setToDate(date)} />
//                     </Form.Item>
//                 </Form>
//             </Modal>

//             <Modal
//                 // title={editingHealth ? "Edit Health Report" : "Add Health Report"}
//                 title={ "Write Health Report"}
//                 open={isModalVisible}
//                 onOk={()=> form.submit()}
//                 onCancel={handleCancel}
//             >
//                 <Form onFinish={handleWriteReport} form={form} layout="vertical">
//                     {/* <Form.Item
//                         name="cageID"
//                         label="Cage"
//                         rules={[{ required: true, message: "Please select the cage!" }]}
//                     >
//                          <Select placeholder="Select an cage">
//                             {cages.map((cage) => (
//                                 <Option key={cage.cageID} value={cage.cageID}>
//                                     {cage.cageName}
//                                 </Option>
//                             ))}
//                         </Select>
//                     </Form.Item> */}
//                     <Form.Item
//                         name="description"
//                         label="Description"
//                         rules={[{ required: true, message: "Please select the description!" }]}
//                     >
//                        <TextArea/>
//                     </Form.Item>
             
//                     <Form.Item
//                         name="dateTime"
//                         label="Date Time"
//                         rules={[{ required: true, message: "Please input the dateTime!" }]}
//                     >
//                         <DatePicker/>
//                     </Form.Item>
//                     <Form.Item
//                         name="status"
//                         label="Status"
//                         rules={[{ required: true, message: "Please select the status!" }]}
//                     >
//                     <Select>
//                         <Option value = "GOOD">Good</Option>
//                         <Option value = "WARNING">WARNING</Option>
//                         <Option value = "BAD">BAD</Option>
//                     </Select>
//                     </Form.Item>
                    
//                 </Form>
//             </Modal>






//             <Table
//                 dataSource={cageId ? animalsById : histories }
//                 columns={columns}
//                 rowKey="historyID"
//                 pagination={{ pageSize: 7 }}
//             />
//         </div>
//     );
// };

// export default HistoryManagement;
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Space, Select, Popconfirm, DatePicker } from "antd";
import moment from "moment";
import { createHistory, deleteHistory, getHistory } from "../../../../services/api/History";
import { getAnimal, updateAnimal } from "../../../../services/api/Animal";
import { getCage } from "../../../../services/api/CageApi";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { addHealthReport } from "../../../../services/api/HealthAPI";
import TextArea from "antd/es/input/TextArea";

const HistoryManagement = () => {
    const { cageId } = useParams();
    const [histories, setHistories] = useState([]);
    const [cages, setCages] = useState([]);
    const [animals, setAnimals] = useState([]);
    const [animalsById, setAnimalByCageId] = useState([]);
    const [healths, setHealths] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalWriteReportVisible, setIsModalWriteReportVisible] = useState(false);
    const [editingHistory, setEditingHistory] = useState(null);
    const [form] = Form.useForm();
    const role = useSelector((state) => state.auth.role);

    const navigate = useNavigate();
  
    useEffect(() => {
        fetchHistoriesById();
    }, [cageId]);
  
    useEffect(() => {
        fetchHistory();
        fetchAnimal();
        fetchCage();
    }, []);

    const fetchHistoriesById = async () => {
        try {
            const response = await getHistory();
            const filteredHistories = response.filter(history => history.cageID === cageId);
            setAnimalByCageId(filteredHistories);
        } catch (error) {
            message.error("Failed to fetch HistoryById data.");
        }
    };

    const fetchHistory = async () => {
        try {
            const response = await getHistory();
            setHistories(response);
        } catch (error) {
            message.error("Failed to fetch histories data.");
        }
    };

    const fetchAnimal = async () => {
        try {
            const response = await getAnimal();
            setAnimals(response);
        } catch (error) {
            message.error("Failed to fetch animals data.");
        }
    };

    const fetchCage = async () => {
        try {
            const response = await getCage();
            setCages(response);
        } catch (error) {
            message.error("Failed to fetch cages data.");
        }
    };

    const handleAdd = () => {
        setEditingHistory(null);
        setIsModalVisible(true);
        form.setFieldsValue({ cageID: cageId });
    };

    const handleOpenModalWriteReport = () => {
        setIsModalWriteReportVisible(true);
        form.resetFields();
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const { animalID, cageID, description, fromDate, toDate } = values;
            const formattedFromDate = fromDate ? moment(fromDate).format("YYYY-MM-DD") : null;
            const formattedToDate = toDate ? moment(toDate).format("YYYY-MM-DD") : null;
            const historyData = { animalID, cageID, description, fromDate: formattedFromDate, toDate: formattedToDate };

            if (editingHistory) {
                await updateHistory(editingHistory.historyID, historyData);
            } else {
                await createHistory(historyData);
            }

            setIsModalVisible(false);
            form.resetFields();
            fetchHistory();
        } catch (error) {
            message.error("Validation failed: " + error.message);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsModalWriteReportVisible(false);
        form.resetFields();
    };

    const handleWriteReport = async (values) => {
        try {
            const formattedValues = {
                ...values,
                cageID: cageId,  // Thêm cageId vào giá trị cần gửi
                dateTime: values.dateTime ? values.dateTime.format("YYYY-MM-DD") : null,
            };
            const newHealthReport = await addHealthReport(formattedValues);
            setHealths([newHealthReport, ...healths]);
            message.success("Health Report wrote successfully.");
            setIsModalWriteReportVisible(false);
            form.resetFields();
        } catch (error) {
            message.error("Failed to wrote Health Report.");
        }
    };

    const columns = [
        { title: "No", key: "id", render: (text, record, index) => index + 1 },
        {
            title: "Animal",
            dataIndex: "animalID",
            key: "animalID",
            render: (animalID) => animals.find(animal => animal.animalID === animalID)?.breed || "Unknown",
        },
        {
            title: "Cage",
            dataIndex: "cageID",
            key: "cageID",
            render: (cageID) => cages.find(cage => cage.cageID === cageID)?.cageName || "Unknown",
        },
        { title: "Description", dataIndex: "description", key: "description" },
        { title: "Status", dataIndex: "status", key: "status" },
        {
            title: "From Date",
            dataIndex: "fromDate",
            key: "fromDate",
            render: (text) => moment(text).format("YYYY-MM-DD"),
        },
        {
            title: "To Date",
            dataIndex: "toDate",
            key: "toDate",
            render: (text) => text ? moment(text).format("YYYY-MM-DD") : "",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => role === "MANAGER" ? (
                <Space size="middle">
                    <Button type="primary" onClick={() => handleEdit(record)}>Edit</Button>
                    <Popconfirm title="Are you sure to delete this history?" onConfirm={() => handleDelete(record.historyID)} okText="Yes" cancelText="No">
                        <Button type="primary" danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ) : (
                <Space size="middle">
                    {/* <Button onClick={handleOpenModalWriteReport}>Write Report</Button> */}
                    <Button type="primary" onClick={() => navigate(`/healths/${record.cageID}`)}>View Report</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Space style={{ margin: 15 }}>
                <Button type="primary" onClick={handleAdd}>Add Animal</Button>
            </Space>
            <Modal title={editingHistory ? "Edit Animal" : "Add Animal"} open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item name="animalID" label="Animal" rules={[{ required: true, message: "Please select an animal!" }]}>
                        <Select placeholder="Select an animal">
                            {animals.map((animal) => (
                                <Select.Option key={animal.animalID} value={animal.animalID}>{animal.breed}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    {!cageId && (
                        <Form.Item name="cageID" label="Cage" rules={[{ required: true, message: "Please select a cage!" }]}>
                            <Select placeholder="Select a Cage">
                                {cages.map((cage) => (
                                    <Select.Option key={cage.cageID} value={cage.cageID}>{cage.cageName}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}
                    <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please input the description!" }]}><Input /></Form.Item>
                    <Form.Item name="fromDate" label="From Date" rules={[{ required: true, message: "Please choose the from date!" }]}><DatePicker /></Form.Item>
                    <Form.Item name="toDate" label="To Date"><DatePicker /></Form.Item>
                </Form>
            </Modal>

            <Modal title="Write Health Report" open={isModalWriteReportVisible} onOk={() => form.submit()} onCancel={handleCancel}>
                <Form onFinish={handleWriteReport} form={form} layout="vertical">
                    <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please input the description!" }]}><TextArea /></Form.Item>
                    <Form.Item name="dateTime" label="Date Time" rules={[{ required: true, message: "Please input the dateTime!" }]}><DatePicker /></Form.Item>
                    <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please input the status!" }]}><Input /></Form.Item>
                </Form>
            </Modal>
            <Table columns={columns} dataSource={animalsById} rowKey="historyID" pagination={{ pageSize: 5 }} />
        </div>
    );
};

export default HistoryManagement;
