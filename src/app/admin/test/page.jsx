"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./test.module.css";
import Navbar from "@/app/components/AdminNavbar/Navbar";
import { useTestContext } from "@/app/context/TestContext"; // Make sure this path is correct

const TestPage = () => {
  const router = useRouter();
  const { setTestStarted, testStarted } = useTestContext(); // Assuming testStarted is provided by context
  const [roomNumbers, setRoomNumbers] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("login-time");
  const [studentData, setStudentData] = useState([]); // State to hold student data

  const statusOptions = ["login-time", "download-time", "upload-time", "submit-time"];

  useEffect(() => {
    // Check if the test has started
    if (!testStarted) {
      // Redirect to the home page if the test has not started
      router.push("/admin/home"); // Adjust the path as necessary
    }

    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (!token) {
      handleLogout(); // Log out if no token is found
      return;
    }

    // Fetch room numbers from the backend
    fetch("http://localhost:8080/admin/room-numbers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.split('=')[1]}` // Add the authorization header with the token
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setRoomNumbers(data.rooms); // Assuming the API response is { rooms: [...] }
      })
      .catch((err) => console.error("Error fetching room numbers:", err));
  }, [testStarted, router]);

  useEffect(() => {
    // Function to fetch student data based on room selection and status
    const fetchStudentData = () => {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='));
      if (!token) return;

      let apiUrl = `http://localhost:8080/admin/${selectedStatus}`;
      if (selectedRoom) {
        apiUrl += `/${selectedRoom}`; // Append room query if a room is selected
      }

      fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token.split('=')[1]}`
        }
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setStudentData(data); // Assuming API returns { students: [...] }
          console.log(data);
        })
        .catch((err) => console.error("Error fetching student data:", err));
    };

    // Call fetchStudentData immediately and then every 30 seconds
    fetchStudentData(); // Initial call

    const interval = setInterval(() => {
      fetchStudentData(); // Fetch every 30 seconds
    }, 30000); // 30000 ms = 30 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(interval);

  }, [selectedRoom, selectedStatus]); // Re-fetch data whenever room or status changes

  const handleRoomChange = (e) => {
    setSelectedRoom(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  return (
    <>
      <Navbar />
      <div className={styles.background}>
        <div className={styles.container}>
          <h1>Test Activity</h1>
          {/* Dropdowns */}
          <div className={styles.dropdownContainer}>
            <label htmlFor="roomDropdown">Select Room:</label>
            <select
              id="roomDropdown"
              value={selectedRoom}
              onChange={handleRoomChange}
            >
              <option value="">All Rooms</option>
              {roomNumbers.map((room) => (
                <option key={room} value={room}>
                  Room {room}
                </option>
              ))}
            </select>

            <label htmlFor="statusDropdown">Select Status:</label>
            <select
              id="statusDropdown"
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.replace("-", " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {studentData.length > 0 ? (
                studentData.map((student) => (
                  <tr key={student.student_id}>
                    <td>{student.student_name}</td>
                    <td>{student.student_id}</td>
                    <td>
                      {student.login_status ? (
                        <span style={{ color: 'green' }}>&#10003;</span> // Green tick
                      ) : (
                        <span style={{ color: 'red' }}>&#10007;</span>   // Red cross
                      )}
                    </td>
                    <td>
                      {new Date(student.login_time).toLocaleTimeString('en-GB', { 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        second: '2-digit' 
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TestPage;
