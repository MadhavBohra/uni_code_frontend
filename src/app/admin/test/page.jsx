"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./test.module.css";
import Navbar from "@/app/components/AdminNavbar/Navbar";
import { useTestContext } from "@/app/context/TestContext"; // Ensure this path is correct

const TestPage = () => {
  const router = useRouter();
  const { setTestStarted, testStarted } = useTestContext();
  const { setTestEnded, testEnded } = useTestContext();
  const [roomNumbers, setRoomNumbers] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("login-time");
  const [studentData, setStudentData] = useState([]);
  const [adminPassword, setAdminPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  const statusOptions = ["login-time", "download-time", "upload-time", "submit-time"];

  useEffect(() => {
    if (!testStarted) {
      router.push("/admin/home");
    }
    if (testEnded) {
      router.push("/admin/end")
    }

    const token = document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];
    if (!token) {
      handleLogout();
      return;
    }

    fetch(`http://${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/room-numbers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => setRoomNumbers(data.rooms || []))
      .catch((err) => console.error("Error fetching room numbers:", err));
  }, [testStarted, router]);

  useEffect(() => {
    const fetchStudentData = () => {
      const token = document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];
      if (!token) return;

      let apiUrl = `http://${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/${selectedStatus}`;
      if (selectedRoom) apiUrl += `/${selectedRoom}`;

      fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then((data) => setStudentData(data || []))
        .catch((err) => console.error("Error fetching student data:", err));
    };

    fetchStudentData();
    const interval = setInterval(fetchStudentData, 30000);
    return () => clearInterval(interval);
  }, [selectedRoom, selectedStatus]);

  const handleRoomChange = (e) => setSelectedRoom(e.target.value);
  const handleStatusChange = (e) => setSelectedStatus(e.target.value);

  const handleEndTest = () => setShowModal(true);

  const handlePasswordSubmit = () => {
    const pwd = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    console.log(pwd);
    if (adminPassword === pwd) {
      // Extract the token from cookies
      const token = document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];
      if (!token) return;

      // Define the API URL
      const apiUrl = `http://${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/end-test`;

      fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          setStudentData(data || []);
          setTestStarted(false);
          setTestEnded(true);
          setShowModal(false);
          router.push("/admin/end");
        })
        .catch((err) => console.error("Error fetching student data:", err));
    } else {
      alert("Incorrect password. Try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.background}>
        <div className={styles.container}>
          <h1>Test Activity</h1>

          <div className={styles.controlsContainer}>
            <select
              className={styles.dropdown}
              value={selectedRoom}
              onChange={handleRoomChange}
            >
              <option value="">All Rooms</option>
              {roomNumbers.map((room) => (
                <option key={room} value={room}>Room {room}</option>
              ))}
            </select>

            <select
              className={styles.dropdown}
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.replace("-", " ")}
                </option>
              ))}
            </select>

            <button className={styles.endTestBtn} onClick={handleEndTest}>
              End Test
            </button>
          </div>

          {showModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h2>Enter Admin Password</h2>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Password"
                  className={styles.modalInput}
                />
                <div className={styles.modalButtons}>
                  <button className={styles.btn} onClick={handlePasswordSubmit}>
                    Submit
                  </button>
                  <button className={styles.btn} onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

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
                      {student.status ? (
                        <span style={{ color: "green" }}>&#10003;</span>
                      ) : (
                        <span style={{ color: "red" }}>&#10007;</span>
                      )}
                    </td>
                    <td>{student.time ? new Date(student.time).toLocaleTimeString() : "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4">No data available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TestPage;
