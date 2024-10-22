"use client"

import React, { useEffect, useState } from 'react';
import styles from './UploadPage.module.css';
import Navbar from '../components/StudentNavbar/Navbar';
import { useRouter } from 'next/navigation';


const UploadPage = () => {
  const [idNumber, setIdNumber] = useState('');
  const [labNumber, setLabNumber] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [commonPassword, setCommonPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [Loading,setLoading] = useState(true);


  const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('StudentauthToken');
      if (!token) {
        // Redirect to download page if token is found
        router.push('/LogInPage');
      } else {
        setLoading(false); // If no token is found, stop loading
      }
    }, [router]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('No file selected. Please choose a file before uploading.');
      return;
    }
  
    // Prepare the form data
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      // Get the token from localStorage (ensure it exists)
      const token = localStorage.getItem('StudentauthToken');
      if (!token) {
        alert('User is not authenticated. Please log in.');
        return;
      }
  
      // Send the request with the Bearer token
      const response = await fetch('http://localhost:8080/api/upload-answer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,  // Add Bearer token to the headers
        },
        body: formData, // The form data with the file
      });
  
      if (response.ok) {
        alert('File uploaded successfully.');
      } else {
        const errorData = await response.json();
        alert(`Failed to upload file: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error during file upload:', error);
      alert('An error occurred while uploading the file.');
    }
  };

  const handleDownload = async () => {
    try {
        // Get the token from localStorage (ensure it exists)
        const token = localStorage.getItem('StudentauthToken');
        if (!token) {
            alert('User is not authenticated. Please log in.');
            return;
        }

        // Send the request with the Bearer token
        const response = await fetch('http://localhost:8080/api/download-answer', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Add Bearer token to the headers
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
};


  const handleSubmit = async () => {


    try {
      // Get the token from localStorage (ensure it exists)
      const token = localStorage.getItem('StudentauthToken');
      if (!token) {
        alert('User is not authenticated. Please log in.');
        return;
      }

      if (!file) {
        alert('No file selected. Please choose the final file before submitting.');
        return;
      }

      if (!idNumber || !labNumber || !commonPassword) {
        alert('Please fill in all fields.');
        return;
      }
    
      // Prepare the form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('commonPassword',commonPassword);

      // Prepare the payload


      // Send the request to end the test
      const response = await fetch('http://localhost:8080/api/end-test', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,  // Add Bearer token to the headers
        },
        body: formData
      });

      if (response.ok) {
        // Clear the auth token from local storage
        localStorage.removeItem('StudentauthToken');
        

        // Redirect to the end test page
        router.push('/EndTestPage'); // Navigate to the end-test page
      } else {
        const errorData = await response.json();
        alert(`Failed to end test: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error ending the test:', error);
      alert('An error occurred while ending the test.');
    }
  };

  if(Loading)
  {
    return(
      <>
        <p>Loading....</p>
      </>
    );
  }

  return (
    <>
    <Navbar></Navbar>
    <div className={styles.background}>
    <div className={styles.container}>
      <h2>Upload Test Material</h2>
      <div className={styles.subContainer}>
        <div className={styles.card}>
          <form>
            <label htmlFor="fileUpload">Upload File:</label>
              <input
                type="file"
                id="fileUpload"
                name="file"
                accept=".zip,.rar"
                onChange={handleFileChange}
                required
              />
              
              <div className={styles.uploadedFile}>
                  <p>Uploaded File: {uploadedFileName}</p>
                  <button
                    type="button"
                    onClick={handleUpload}  // Trigger the file upload
                    className={styles.uploadButton}
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}  // Trigger the file upload
                    className={styles.uploadButton}
                  >
                    Download Uploaded File
                  </button>
              </div>
          </form>
        </div>
        <div className={styles.card}>
          <form>
            <label htmlFor="idNumber">ID Number:</label>
            <input
              type="text"
              id="idNumber"
              name="idNumber"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="Enter your ID Number"
              required
            />

            <label htmlFor="labNumber">Lab Number:</label>
            <input
              type="text"
              id="labNumber"
              name="labNumber"
              value={labNumber}
              onChange={(e) => setLabNumber(e.target.value)}
              placeholder="Enter your Lab Number"
              required
            />

            <label htmlFor="commonPassword">Common Password:</label>
            <input
              type="password"
              id="commonPassword"
              name="commonPassword"
              value={commonPassword}
              onChange={(e) => {
                setCommonPassword(e.target.value);
                setIsPasswordValid(e.target.value.length > 0); // Assuming password length > 0 is valid
              }}
              placeholder="Enter the Common Password"
              required
            />

            <button
              type="button"
              onClick={handleSubmit}
              className={styles.endTestButton}

            >
              End Test
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
    </>
  );
};

export default UploadPage;
