"use client";
import React, { useState, useEffect } from 'react';
import styles from './home.module.css';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
  const [showRoomModal, setShowRoomModal] = useState(false); // For modal visibility
  const [testTimer, setTestTimer] = useState({ hours: '', minutes: '' }); // For test timer
  const [testId, setTestId] = useState(null); // State for storing test ID
  const [loading, setLoading] = useState(true); // Loading state
  const [questionPaper, setQuestionPaper] = useState(null); // State for storing the question paper file
  const [roomNumbers, setRoomNumbers] = useState([]); // State for storing room numbers
  const [newRoomNumber, setNewRoomNumber] = useState(''); // State for new room number input

  
  const router = useRouter();


  const [studentsList, setStudentsList] = useState(null); // State for storing the students list file

  const handleStudentsListChange = (e) => {
    setStudentsList(e.target.files[0]); // Set the selected students list file
  };

  const handleUploadStudentsList = async () => {
    if (!studentsList) {
      alert('Please select a students list file to upload.');
      return;
    }

    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (!token) {
      handleLogout(); // Log out if no token is found
      return;
    }

    const formData = new FormData();
    formData.append('file', studentsList); // Append the students list file
    formData.append('testId', testId); // Append the test ID

    try {
      const response = await fetch('http://localhost:8080/admin/upload-student-list', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.split('=')[1]}`, // Send token in the headers
        },
        body: formData, // Send the form data
      });

      if (!response.ok) {
        throw new Error('Failed to upload students list');
      }

      const result = await response.json();
      alert('Students list uploaded successfully!'); // Handle success
      console.log(result);
    } catch (error) {
      console.error(error);
      alert('An error occurred while uploading the students list.'); // Handle error
    }
  };

  useEffect(() => {
    const validateTokenAndFetchTestId = async () => {
      try {
        // Validate JWT token
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (!token) {
          throw new Error('No token found');
        }

        const tokenRes = await fetch('http://localhost:8080/admin/is-token-valid', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token.split('=')[1]}`, // Extracting the token value
          },
        });

        if (!tokenRes.ok) {
          throw new Error('Token validation failed');
        }

        // Fetch test ID
        const testRes = await fetch('http://localhost:8080/admin/fetchTestSetup', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token.split('=')[1]}`,
          },
        });

        if (!testRes.ok) {
          throw new Error('Failed to fetch test ID');
        }

        const testData = await testRes.json();
        setTestId(testData.testId); // Set the test ID from the response
      } catch (error) {
        console.error(error);
        handleLogout(); // Log out if there's an error
      } finally {
        setLoading(false); // Set loading to false after API calls
      }
    };

    validateTokenAndFetchTestId(); // Call the function
  }, [router]);

  const handleLogout = () => {
    // Clear the token
    document.cookie = 'token=; Max-Age=0; path=/'; // Clear the token
    router.push('/admin'); // Redirect to the login page
  };

  const toggleRoomModal = () => {
    setShowRoomModal(!showRoomModal); // Toggle modal visibility
  };

  const handleTimerChange = (e) => {
    const { name, value } = e.target;
    setTestTimer((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const saveTimer = () => {
    // Save test timer logic (can be implemented as needed)
    alert(`Test timer set to ${testTimer.hours} hours and ${testTimer.minutes} minutes.`);
  };

  const handleFileChange = (e) => {
    setQuestionPaper(e.target.files[0]); // Set the selected file
  };

  const handleUploadQuestionPaper = async () => {
    if (!questionPaper) {
      alert('Please select a question paper file to upload.');
      return;
    }

    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (!token) {
      handleLogout(); // Log out if no token is found
      return;
    }

    const formData = new FormData();
    formData.append('file', questionPaper); // Append the question paper file
    formData.append('testId', testId); // Append the test ID

    try {
      const response = await fetch('http://localhost:8080/admin/upload-question-paper', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.split('=')[1]}`, // Send token in the headers
        },
        body: formData, // Send the form data
      });

      if (!response.ok) {
        throw new Error('Failed to upload question paper');
      }

      const result = await response.json();
      alert('Question paper uploaded successfully!'); // Handle success
      console.log(result);
    } catch (error) {
      console.error(error);
      alert('An error occurred while uploading the question paper.'); // Handle error
    }
  };

  const addRoomNumber = () => {
    if (newRoomNumber.trim() === '') {
      alert('Please enter a valid room number.');
      return;
    }
    setRoomNumbers([...roomNumbers, newRoomNumber]);
    setNewRoomNumber(''); // Clear input after adding
  };

  // Function to delete a room number
  const deleteRoomNumber = (roomNumber) => {
    setRoomNumbers(roomNumbers.filter((number) => number !== roomNumber));
  };


  if (loading) {
    return <div className={styles.loading}>Loading...</div>; // Show loader while loading
  }

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <h1>Admin Dashboard</h1>
          <a href="testSetup" className={styles.navLink}>Test Setup</a>
          <a href="testHistory" className={styles.navLink}>Test History</a>
        </div>
        <div className={styles.navRight}>
          <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className={styles.background}>
        <div className={styles.container}>
          <h1>Test Setup</h1>
          <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'center', width: '100%', height: "100%" }}>
            <div className={styles.containerLeft}>
              <div className={styles.card}>
                <h2>Upload Question Paper</h2>
                <p>Uploaded the zip file:</p>
                <input type="file" onChange={handleFileChange} accept=".zip" className={styles.fileInput} />
                <button onClick={handleUploadQuestionPaper} className={styles.btn}>Upload Question Paper</button>
              </div>
              <div className={styles.card}>
                <h2>Upload Students List</h2>
                <p>Upload an Excel file with the students appearing for the exam:</p>
                <input 
                  type="file" 
                  onChange={handleStudentsListChange} 
                  accept=".xlsx, .xls" // Specify accepted formats
                  className={styles.fileInput} 
                />
                <button onClick={handleUploadStudentsList} className={styles.btn}>Upload Students List</button>
              </div>
              <div className={styles.card}>
                <h2>Add or Remove Lab Numbers</h2>
                <p>Delete or Add lab numbers for the students:</p>
                <button onClick={toggleRoomModal} className={styles.btn}>Manage Lab Numbers</button>
              </div>

            </div>

            <div className={styles.line}></div>

            <div className={styles.containerRight}>
              <div style={{ backgroundColor: "white", padding: "10px", borderRadius: "10px" }}>
                <h2>Test Details:</h2>
                <div className={styles.detailRow}>
                  <p>Test ID: {testId}</p> {/* Display the fetched Test ID */}
                </div>
                <div className={styles.detailRow}>
                  <p>See Test Paper: </p>
                  <button className={styles.btn}>Open Test Paper</button>
                </div>
                <div className={styles.detailRow}>
                  <p>See Students List: </p>
                  <button className={styles.btn}>Open Students List</button>
                </div>
                <div className={styles.detailRow}>
                  <p>See Room/Lab Number:</p>
                  <button onClick={toggleRoomModal} className={styles.btn}>View Room Number</button>
                </div>
              </div>
              <div className={styles.card}>
                <h2>Start Test</h2>
                <p style={{ color: "red" }}>Once You Click on the Start Test there is NO GOING BACK:</p>
                <a href="addLabNumbers" className={styles.btn} style={{ background: "red" }}>START TEST</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Room Number Modal */}
      {showRoomModal && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <h2>Edit Room Numbers</h2>
                  <input
                    type="text"
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    placeholder="Enter new room number"
                    className={styles.modalInput}
                  />
                  <button onClick={addRoomNumber} className={styles.btn}>Add Room Number</button>
                  <button onClick={toggleRoomModal} className={styles.btn} style={{ background: 'red' }}>Close</button>
                </div>
              </div>
            )}
    </>
  );
}

export default AdminDashboard;
