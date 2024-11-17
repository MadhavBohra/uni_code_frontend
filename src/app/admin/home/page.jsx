"use client";
import React, { useState, useEffect } from 'react';
import styles from './home.module.css';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/AdminNavbar/Navbar';
import ConfirmationModal from '@/app/components/ConfirmationModal/ConfirmationModal';
import { useTestContext } from '@/app/context/TestContext'; // Make sure this path is correct


const AdminDashboard = () => {
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [questionPaper, setQuestionPaper] = useState(null);
  const [roomNumbers, setRoomNumbers] = useState([]);

  const [studentsList, setStudentsList] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setTestStarted, testStarted } = useTestContext(); // Assuming testStarted is provided by context
  const { setTestEnded } = useTestContext();
  const router = useRouter();

  const handleLogout = () => {
    // Clear token from cookies or any local storage if needed
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Redirect to login or home page
    router.push('/admin'); // Adjust this path to where you want to redirect the user after logout
  };

  const handleStartTest = async () => {
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='));
      if (!token) {
        handleLogout(); // Log out if no token is found
        return;
      }
      const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/start-test`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.split('=')[1]}`, // Send token in the headers
        }
      });

      if (!response.ok) {
        throw new Error('Failed to start the test');
      }

      setTestStarted(true);
      console.log('Test started');
    } catch (error) {
      console.error('Error starting the test:', error);
    }
  };


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

    try {
      const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/upload-student-list`, {
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

  const handleQuestionPaperDownload = async () => {
    try {
      // Get the token from localStorage (ensure it exists)
      const token = document.cookie.split('; ').find(row => row.startsWith('token='));
      if (!token) {
        handleLogout(); // Log out if no token is found
        return;
      }

      // Send the request with the Bearer token
      const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/download-question-paper`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.split('=')[1]}`,  // Add Bearer token to the headers
        },
      });

      if (response.ok) {
        // Create a blob from the response
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Create a link element
        const a = document.createElement('a');
        a.href = url;
        a.download = 'answer_file.zip'; // Set the desired file name here

        // Append to the document and trigger the download
        document.body.appendChild(a);
        a.click();

        // Clean up and remove the link
        a.remove();
        window.URL.revokeObjectURL(url);
        alert('File downloaded successfully.');
      } else {
        const errorData = await response.json();
        alert(`Failed to download file: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error during file download:', error);
      alert('An error occurred while downloading the file.');
    }
  }

  const handleStudentListDownload = async () => {
    try {
      // Retrieve the token from the cookies
      const token = document.cookie.split('; ').find(row => row.startsWith('token='));
      if (!token) {
        handleLogout(); // Log out if no token is found
        return;
      }

      // Send a GET request to download the student list
      const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/download-student-list`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.split('=')[1]}`,  // Add Bearer token to the headers
        },
      });

      if (response.ok) {
        // Create a blob from the response data
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Create a link element and set the download attributes
        const a = document.createElement('a');
        a.href = url;
        a.download = 'student_list.xlsx'; // Set the desired file name here

        // Trigger the download by appending and clicking the link
        document.body.appendChild(a);
        a.click();

        // Clean up the created URL and link element
        a.remove();
        window.URL.revokeObjectURL(url);
        alert('Student list downloaded successfully.');
      } else {
        // Parse and display the error message if the download fails
        const errorData = await response.json();
        alert(`Failed to download student list: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error during file download:', error);
      alert('An error occurred while downloading the student list.');
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

        const tokenRes = await fetch(`http://${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/is-token-valid`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token.split('=')[1]}`, // Extracting the token value
          },
        });

        if (!tokenRes.ok) {
          throw new Error('Token validation failed');
        }

        // Fetch test ID
        const testRes = await fetch(`http://${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/fetchTestSetup`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token.split('=')[1]}`,
          },
        });

        if (!testRes.ok) {
          throw new Error('Failed to fetch test ID');
        }

        const testData = await testRes.json();
        console.log(testData.Status);
        if (testData.Status === "SETTING_UP") {
          setTestStarted(false);
          setTestEnded(false);
        } else if (testData.Status === "ONGOING") {
          setTestStarted(true);
          setTestEnded(false);
        }
        else if (testData.Status === "ENDED") {
          setTestStarted(false);
          setTestEnded(true);
          router.replace("/admin/end");
        }
      } catch (error) {
        console.error(error);
        handleLogout(); // Log out if there's an error
      } finally {
        setLoading(false); // Set loading to false after API calls
      }
    };

    validateTokenAndFetchTestId(); // Call the function
  }, [router]);

  useEffect(() => {
    if (testStarted) {
      router.push('/admin/test'); // Adjust this route to your actual test page path
    }
  }, [testStarted, router]);

  useEffect(() => {
    // Fetch room numbers when the modal opens

    const fetchRoomNumbers = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (!token) {
          handleLogout(); // Log out if no token is found
          return;
        }
        const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/room-numbers`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token.split('=')[1]}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch room numbers');
        }
        const data = await response.json();
        console.log(data);
        setRoomNumbers(data.rooms); // Set room numbers from API response
        console.log(roomNumbers);
      } catch (error) {
        console.error('Error fetching room numbers:', error);
      }
    };

    if (showRoomModal) {
      fetchRoomNumbers(); // Only fetch when the modal is opened
    }
  }, [showRoomModal]);


  const toggleRoomModal = () => {
    setShowRoomModal(!showRoomModal); // Toggle modal visibility
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

    try {
      const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/upload-question-paper`, {
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





  if (loading) {
    return <div className={styles.loading}>Loading...</div>; // Show loader while loading
  }

  return (
    <>
      <Navbar></Navbar>

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


            </div>

            <div className={styles.line}></div>

            <div className={styles.containerRight}>
              <div style={{ backgroundColor: "white", padding: "10px", borderRadius: "10px" }}>
                <h2>Test Details:</h2>
                <div className={styles.detailRow}>
                </div>
                <div className={styles.detailRow}>
                  <p>See Test Paper: </p>
                  <button className={styles.btn} onClick={handleQuestionPaperDownload}>Open Test Paper</button>
                </div>
                <div className={styles.detailRow}>
                  <p>See Students List: </p>
                  <button className={styles.btn} onClick={handleStudentListDownload}>Open Students List</button>
                </div>
                <div className={styles.detailRow}>
                  <p>See Room/Lab Number:</p>
                  <button onClick={toggleRoomModal} className={styles.btn}>View Room Number</button>
                </div>
              </div>
              <div className={styles.card}>
                <h2>Start Test</h2>
                <p style={{ color: "red" }}>Once You Click on the Start Test there is NO GOING BACK:</p>
                <button
                  className={styles.btn}
                  style={{ background: "red" }}
                  onClick={() => setIsModalOpen(true)} // Open modal on click
                >
                  START TEST
                </button>

                <ConfirmationModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)} // Close modal
                  onConfirm={handleStartTest} // Confirm function
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Room Number Modal */}
      {showRoomModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Room Numbers</h2>
            <ul>
              {roomNumbers.map((roomNumber, index) => (
                <li key={index}>{roomNumber}</li>
              ))}
            </ul>
            <button onClick={toggleRoomModal} className={styles.btn} style={{ background: 'red' }}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminDashboard;
