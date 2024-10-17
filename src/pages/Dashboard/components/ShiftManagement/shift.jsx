
import React, { useEffect, useState } from "react";
import { Alert, Calendar, List, Button, Space, Checkbox, message, DatePicker, Modal, Badge } from "antd";
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { getAvailableUsers, getMyShift, getWorkerInShift, registerShift } from "../../../../services/api/ShiftApi";
import { useSelector } from "react-redux";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const ShiftManagement = () => {
  const [workerInShifts, setWorkerInShifts] = useState([]);
  const [workerInShiftsMonth, setWorkerInShiftsMonth] = useState([]);
  const [availableWorker, setAvailableWorker] = useState([]);
  const [myShift, setMyShift] = useState([]);
  
  const [value, setValue] = useState(dayjs());
  const [selectedValue, setSelectedValue] = useState(dayjs());
  const [selectedWorkShift, setSelectedWorkShift] = useState(""); 
  const [isModalVisible, setIsModalVisible] = useState(false);  
  const [startDate, setStartDate] = useState(null);  
  const [endDate, setEndDate] = useState(null);  

  const role = useSelector((state) => state.auth.role);
  const dataSource = role === "STAFF" ? workerInShifts : workerInShiftsMonth;


  useEffect(() => {
    const startOfWeek = dayjs().startOf('week'); // Gets the Monday of the current week
    const endOfWeek = dayjs().endOf('week'); // Gets the Sunday of the current week
    const startOfMonth = dayjs().startOf('month'); // Gets the Monday of the current week
    const endOfMonth = dayjs().endOf('month'); // Gets the Sunday of the current week
    setStartDate(startOfWeek);
    setEndDate(endOfWeek);
    if(role === "STAFF") {
      fetchMyShift(startOfWeek.format('YYYY-MM-DD'), endOfWeek.format('YYYY-MM-DD'));
    }
    else {
      setStartDate(startOfMonth);
      setEndDate(endOfMonth);
      fetchWorkerInShift(startOfMonth.format('YYYY-MM-DD'), endOfMonth.format('YYYY-MM-DD'))
    }
  }, []);
  const fetchAvailAbleWorker = async () => { 
    try { 
      const response = await getAvailableUsers(); 
      setAvailableWorker(response); 
    } catch (error) { 
      message.error("Failed to fetch available worker data");
    }
  };

  const fetchMyShift = async (start, end) => {
    try {
      const response = await getMyShift(start, end);
      setMyShift(response);
    } catch (error) {
      message.error("No shifts found for the specified date range.");
    }
  };

  const fetchWorkerInShift = async (startDate, endDate) => {
    try {
        const response = await getWorkerInShift(startDate, endDate); // Pass the start and end dates
        setWorkerInShifts(response);
    } catch (error) {
        message.error("Failed to fetch worker in shift data.");
    }
};

  const onSelect = async (newValue) => {
    setValue(newValue);
    setSelectedValue(newValue);
    const startDate = newValue.format('YYYY-MM-DD');
    const endDate = newValue.format('YYYY-MM-DD');

    if(role === "STAFF"){
      await fetchWorkerInShift(startDate, endDate); // Call API to fetch workers in shifts
    }
    // Fetch worker shifts for the selected date
 
  };

  const onCheckboxChange = (workShift) => {
    setSelectedWorkShift(prevShift => (prevShift === workShift ? "" : workShift));
  };

  const handleRegisterShift = async () => {
    if (!selectedWorkShift) {
      message.warning("Please select a shift to register.");
      return;
    }

    const data = [{
      workShift: selectedWorkShift,
      startDate: selectedValue.format('YYYY-MM-DD'),
      endDate: selectedValue.format('YYYY-MM-DD'),
    }];
    
    try {
      await registerShift(data);
      message.success("Shift registered successfully.");
       // Update workerInShifts state
       setWorkerInShifts(prevShifts =>
        prevShifts.map(item =>
            item.workShift === selectedWorkShift
                ? { ...item, countOfWorker: item.countOfWorker + 1 } // Increment count
                : item
        )
    );
      // Calculate start and end dates for fetching shifts for the next week
      const startOfWeek = selectedValue.startOf('week'); // Gets the Monday of the selected week
      const endOfWeek = startOfWeek.add(6, 'day'); // Gets the Sunday of that week
      const startOfMonth = selectedValue.startOf('month'); // Gets the Monday of the selected week
      const endOfMonth = startOfWeek.add(31, 'month'); // Gets the Sunday of that week
      await fetchMyShift(startOfWeek.format('YYYY-MM-DD'), endOfWeek.format('YYYY-MM-DD'));

      setSelectedWorkShift(""); // Reset selection if needed
    } catch (error) {
      message.error("Failed to register shift - Duplicated Shift!");
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (startDate && endDate) {
      if (role === "MANAGER") {
        // Fetch worker shifts for the given date range (week) for Manager role
        await fetchWorkerInShift(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
    } else {
        // Fetch the user's own shifts if the role is not Manager
        await fetchMyShift(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
    }
      setIsModalVisible(false);
    } else {
      message.warning("Please select both start and end dates.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getShiftsForDate = (date) => {
    const dateStr = date.format('YYYY-MM-DD');
    if (role === "MANAGER") {
      // Filter worker shifts for Managers
      return workerInShifts.filter(shift => {
          const shiftDate = dayjs(shift.date); // Assuming each shift has a 'shiftDate'
          return shiftDate.isSame(dateStr, 'day');
      });
  } else {
      // Filter my shifts for non-Managers
      return myShift.filter(shift => {
          const start = dayjs(shift.startDate);
          const end = dayjs(shift.endDate);
          return date.isSameOrAfter(start) && date.isSameOrBefore(end);
      });
  }
  };

  const dateCellRender = (current) => {
    const shiftsForDate = getShiftsForDate(current);
    if (shiftsForDate.length === 0) return null;

    return (
      <ul className="events">
        {shiftsForDate.map(shift => (
          <li key={shift.userShiftId}>
          {role === "MANAGER" ? (
      <>
      {/* Display each worker's name*/}
      {shift.users.map(user => (
        <Badge
          key={user.userID}
          status="success"
          text={`${user.fullName} - ${shift.workShift}`}
        />
      ))}
    </>
  ) : (
    <Badge status="success" text={shift.workShift} />
  )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <Button type="default" onClick={showModal}>
          Filter Shift
        </Button>
      <Alert message={`You selected date: ${selectedValue.format('YYYY-MM-DD')}`} />
      <Calendar
        value={value}
        onSelect={onSelect}
        dateCellRender={dateCellRender}
      />

      <Space style={{ marginTop: 16 }}>
        {/* <h3>Workers in Shift for {selectedValue.format('YYYY-MM-DD')}:</h3> */}
      
        <Button type="primary" onClick={handleRegisterShift}
        hidden= {role ==="MANAGER"}>
          Register
        </Button>
  
      </Space>
      {workerInShifts.length > 0 ? (
  <List
    bordered
    dataSource={workerInShifts}
    renderItem={(item) => {
      // Only render for STAFF role
      if (role === "STAFF") {
        return (
          <List.Item>
            {item.countOfWorker} worker - {item.workShift}
            <Checkbox
              checked={selectedWorkShift === item.workShift}
              onChange={() => onCheckboxChange(item.workShift)}
              disabled={item.countOfWorker === 5 || (item.workShift === "SHIFT_THREE" && item.countOfWorker === 2)}
            />
          </List.Item>
        );
      }
      // For MANAGER role, do not render anything
      return null; // Or you can return <></> for an empty fragment
    }}
  />
) : (
  ""
)}

      <Modal
        title="Filter by Date Range"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Space direction="vertical" size={12}>
          <DatePicker
            showTime
            placeholder="Select Start Date"
            onChange={(date) => setStartDate(date)}
          />
          <DatePicker
            showTime
            placeholder="Select End Date"
            onChange={(date) => setEndDate(date)}
          />
        </Space>
      </Modal>
    </>
  );
};

export default ShiftManagement;
