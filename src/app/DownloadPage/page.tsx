"use client"

import React, { useEffect, useState } from 'react';
import styles from './DownloadPage.module.css'; // Assuming you're using CSS modules for styling
import Navbar from '../components/StudentNavbar/Navbar';
import { useRouter } from 'next/navigation';


const DownloadPage = () => {

    const [Loading,setLoading] = useState(true);
    const router = useRouter();

  // This function will handle the download of the question paper
  useEffect(() => {
    const token = localStorage.getItem('StudentauthToken');
    if (!token) {
      // Redirect to download page if token is found
      router.push('/LogInPage');
    } else {
      setLoading(false); // If no token is found, stop loading
    }
  }, [router]);
  const handleDownload = async () => {
    try {
        // Get the token from localStorage (ensure it exists)
        const token = localStorage.getItem('StudentauthToken');
        if (!token) {
            alert('User is not authenticated. Please log in.');
            return;
        }

        // Send the request with the Bearer token
        const response = await fetch('http://localhost:8080/api/download-question-paper', {
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
      <h1>Download Your Question Paper</h1>
      <p>Click the button below to download the question paper for your exam.</p>
      <button className={styles.downloadButton} onClick={handleDownload}>
        Download Question Paper
      </button>
    </div>
    </div>
    </>
  );
};

export default DownloadPage;
