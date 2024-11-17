"use client"
import React, { useEffect, useState } from 'react';
import styles from './UploadPage.module.css';
import Navbar from '../components/StudentNavbar/Navbar';
import { useRouter } from 'next/navigation';


const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [commonPassword, setCommonPassword] = useState('use client');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [Loading, setLoading] = useState(true);
  const [isTestOngoing, setIsTestOngoing] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('StudentauthToken');
    if (!token) {
      router.push('/LogInPage'); // Redirect to login if no token is found
      return;
    }

    setLoading(false); // Stop loading if token exists

    // Periodically check test status
    const intervalId = setInterval(() => {
      fetchTestStatus();
    }, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [router]);
  const fetchTestStatus = async () => {
    try {
      const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get-test-status`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        const testEnded = data.testStatus === 'ENDED';
        setIsTestOngoing(!testEnded);
        console.log(isTestOngoing);

        if (testEnded) {
          router.push('/EndTestPage'); // Redirect if test has ended
        }
      } else {
        console.error('Failed to fetch test status:', response.status);
      }
    } catch (error) {
      console.error('Error checking test status:', error);
    }
  };

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

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('StudentauthToken');
      if (!token) {
        alert('User is not authenticated. Please log in.');
        return;
      }

      const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload-answer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
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
      const token = localStorage.getItem('StudentauthToken');
      if (!token) {
        alert('User is not authenticated. Please log in.');
        return;
      }

      const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_BASE_URL}/api/download-answer`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'answer_file.zip';

        document.body.appendChild(a);
        a.click();

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
      const token = localStorage.getItem('StudentauthToken');
      if (!token) {
        alert('User is not authenticated. Please log in.');
        return;
      }

      if (!file) {
        alert('No file selected. Please choose the final file before submitting.');
        return;
      }

      if (!commonPassword) {
        alert('Please fill in the common password.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('commonPassword', commonPassword);

      const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_BASE_URL}/api/end-test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        // localStorage.removeItem('StudentauthToken');
        router.push('/EndTestPage');
      } else {
        const errorData = await response.json();
        alert(`Failed to end test: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error ending the test:', error);
      alert('An error occurred while ending the test.');
    }
  };

  if (Loading) {
    return <p>Loading....</p>;
  }

  return (
    <>
      <Navbar />
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
                  <button type="button" onClick={handleUpload} className={styles.uploadButton}>
                    Upload
                  </button>
                  <button type="button" onClick={handleDownload} className={styles.uploadButton}>
                    Download Uploaded File
                  </button>
                </div>
              </form>
            </div>
            <div className={styles.card}>
              <form>
                <label htmlFor="commonPassword">Common Password:</label>
                <input
                  type="password"
                  id="commonPassword"
                  name="commonPassword"
                  value={commonPassword}
                  onChange={(e) => {
                    setCommonPassword(e.target.value);
                  }}
                  placeholder="Enter the Common Password"
                  required
                />
                <button type="button" onClick={handleSubmit} className={styles.endTestButton}>
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
