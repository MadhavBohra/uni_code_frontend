"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./test.module.css";
import Navbar from "@/app/components/Navbar";
import { useTestContext } from "@/app/context/TestContext"; // Make sure this path is correct

const TestPage = () => {
  const router = useRouter();
  const { setTestStarted, testStarted } = useTestContext(); // Assuming testStarted is provided by context
  const [roomNumbers, setRoomNumbers] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("login-time");

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
      method: "GET", // Specify the request method
      headers: {
        "Content-Type": "application/json", // Set the content type
        "Authorization": `Bearer ${token.split('=')[1]}` // Add the authorization header with the token
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
          console.warn(res);
        }
        console.warn(res);
        return res.json();
      })
      .then((data) => {
        setRoomNumbers(data.rooms); // Assuming the API response is { rooms: [...] }
      })
      .catch((err) => console.error("Error fetching room numbers:", err));
  }, [testStarted, router]);

  const handleRoomChange = (e) => {
    setSelectedRoom(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  return (
    <>
      <Navbar></Navbar>
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
              <option value="" disabled>Select Room</option>
              {/* {roomNumbers.map((room) => (
                <option key={room} value={room}>
                  Room {room}
                </option>
              ))} */}
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
                <th>Time Remaining</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>12345</td>
                <td>Taking Test</td>
                <td>45 minutes</td>
              </tr>
              {/* Other rows go here */}
              <tr>
                <td>Elijah Bell</td>
                <td>68902</td>
                <td>Finished</td>
                <td>N/A</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TestPage;
