"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/AdminNavbar/Navbar"; // Ensure path is correct
import styles from "./end.module.css";
import { useTestContext } from "@/app/context/TestContext";

// TypeScript interface for student data
interface Student {
  student_id: string;
  student_name: string;
  login_status: boolean;
  login_time: string;
  last_upload_time: string;
  first_upload_time: string;
  end_time: string;
  download_time: string;
  anomaly_status: boolean;
  anomaly_description: string;
}

const EndTestPage = () => {
  const router = useRouter();
  const [studentData, setStudentData] = useState<Student[]>([]);
  const { setTestStarted, testStarted } = useTestContext();
  const { setTestEnded, testEnded } = useTestContext();

  useEffect(() => {
    // Redirect based on test status
    if (!testEnded && !testStarted) { // true && 
      router.push("/admin/home");
      console.log(testStarted);
      console.log(testEnded);
      return;
    } else if (testStarted) {
      router.push("/admin/test");
      return;
    }

    // Fetch student data from the backend for display if allowed to stay on the page
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (!token) {
      router.push("/admin/home");
      return;
    }

    fetch(`http://${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/student-data`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.split("=")[1]}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => setStudentData(data))
      .catch((err) => console.error("Error fetching student data:", err));
  }, [router, testStarted, testEnded]);




  const handleDownloadData = () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (!token) {
      router.push("/admin/home");
      return;
    }

    fetch(`http://${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/download-student-activity-list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.split("=")[1]}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.blob();
        } else {
          throw new Error("Failed to fetch file");
        }
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "student-activity-list.xlsx");
        document.body.appendChild(link);
        link.click();
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      })
      .catch((err) => console.error("Error downloading data:", err));
  };

  const handleClearDatabase = () => {
    // Trigger database clear
    if (confirm("Are you sure you want to clear the test database?")) {
      fetch(`http://${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/clear-database`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${document.cookie.split("=")[1]}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to clear database");
          alert("Database cleared successfully");
          setStudentData([]); // Clear the table data
        })
        .catch((err) => console.error("Error clearing database:", err));
    }
  };

  const handleStartNewTest = async () => {
    // Redirect to new test page or reinitialize state
    handleDownloadData();
    handleClearDatabase();

    // Extract token from cookies
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (!token) {
      router.push("/admin/home");
      return;
    }

    try {
      // Send fetch request to start a new test
      const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/start-new-test`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.split('=')[1]}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to start new test:", response.status, response.statusText);
        return;
      }

      console.log("New test started successfully");

    } catch (error) {
      console.error("Error during fetch:", error);
    }

    // Redirect to admin home after fetch completes
    setTestEnded(false);
    setTestStarted(false);
    router.push("/admin/home");
  };


  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1>End Test - Summary</h1>

        {/* Table displaying student data */}
        <table className={styles.studentTable}>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Login Time</th>
              <th>First Upload Time</th>
              <th>Last Upload Time</th>
              <th>End Time</th>
              <th>Download Time</th>
              <th>Anomaly Status</th>
              <th>Anomaly Description</th>
            </tr>
          </thead>
          <tbody>
            {studentData.length > 0 ? (
              studentData.map((student) => (
                <tr key={student.student_id}>
                  <td>{student.student_id}</td>
                  <td>{student.student_name}</td>
                  <td>{new Date(student.login_time).toLocaleTimeString()}</td>
                  <td>{student.download_time ? new Date(student.download_time).toLocaleTimeString() : "N/A"}</td>
                  <td>{student.first_upload_time ? new Date(student.first_upload_time).toLocaleTimeString() : "N/A"}</td>
                  <td>{student.last_upload_time ? new Date(student.last_upload_time).toLocaleTimeString() : "N/A"}</td>
                  <td>{student.end_time ? new Date(student.end_time).toLocaleTimeString() : "N/A"}</td>
                  <td>{student.anomaly_status ? <span style={{ color: 'red' }}>Yes</span> : "No"}</td>
                  <td>{student.anomaly_description || "None"}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={10}>No data available</td></tr>
            )}
          </tbody>
        </table>

        {/* Action buttons */}
        <div className={styles.buttonContainer}>
          <button className={styles.actionButton} onClick={handleDownloadData}>
            Download Test Data
          </button>
          <button className={styles.actionButton} onClick={handleClearDatabase}>
            Clear Test Database
          </button>
          <button className={styles.actionButton} onClick={handleStartNewTest}>
            Start New Test
          </button>
        </div>
      </div>
    </>
  );
};

export default EndTestPage;
