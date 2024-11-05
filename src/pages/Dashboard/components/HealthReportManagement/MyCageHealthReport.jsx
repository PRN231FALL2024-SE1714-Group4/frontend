
import React, { useState, useEffect } from "react";
import { Table, Button, Tag } from "antd";
import moment from "moment";
import { getMyHealthReport } from "../../../../services/api/HealthAPI";




const MyCageHealthReport = () => {
    const [myReport, setMyReport] = useState([])

    useEffect(() => {
        // fetchHealths();
        fetchMyReportedCage();
    
    }, []);

const fetchMyReportedCage = async () => {
        try { 
            const response = await getMyHealthReport() ; 
            console.log("Fetched My Health Reports:", response);
            setMyReport(response); 
        }catch (error) { 
            message.warning("Failed To Fetched My Health Reports");
        }
    }

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
            render: (status) => {
                let color;
                switch (status) {
                    case "GOOD":
                        color = "green";
                        break;
                    case "WARNING":
                        color = "yellow";
                        break;
                    case "BAD":
                        color = "red";
                        break;
                    default:
                        color = "default";
                }
                return <Tag color={color}>{status}</Tag>;
            },
        },       
        {
            title: "Date Time",
            dataIndex: "dateTime",
            key: "dateTime",
            render: (text) => moment(text).format("YYYY-MM-DD"),
        },
       
    ];

    return (
        <div>
      
         
            <Table
                dataSource={myReport}
                columns={columns}
                rowKey="helthReportID"
                pagination={{ pageSize: 7 }}
            />
        </div>
    );
};

export default MyCageHealthReport;
