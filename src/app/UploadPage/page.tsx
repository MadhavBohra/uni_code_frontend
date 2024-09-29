"use client"

import React, { useState } from 'react';
import styles from './UploadPage.module.css';

const UploadPage = () => {
  const [idNumber, setIdNumber] = useState('');
  const [labNumber, setLabNumber] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [commonPassword, setCommonPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !idNumber || !labNumber || !commonPassword) {
      alert('Please fill in all fields and upload a file.');
      return;
    }

    const confirmEndTest = window.confirm('Are you sure you want to end the test?');
    if (!confirmEndTest) return;

    // Handle file upload and password submission
    const formData = new FormData();
    formData.append('idNumber', idNumber);
    formData.append('labNumber', labNumber);
    formData.append('file', file);
    formData.append('commonPassword', commonPassword);

    try {
      const response = await fetch('http://localhost:8080/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('File uploaded and test ended successfully.');
      } else {
        alert('Failed to upload file.');
      }
    } catch (error) {
      alert('An error occurred while uploading the file.');
    }
  };

  return (
    <div className={styles.background}>
    <div className={styles.container}>
      <h2>Upload Test Material</h2>
      <form onSubmit={handleSubmit}>
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

        <label htmlFor="fileUpload">Upload File:</label>
        <input
          type="file"
          id="fileUpload"
          name="file"
          accept=".zip,.rar"
          onChange={handleFileChange}
          required
        />
        
        {uploadedFileName && (
            <div className={styles.uploadedFile}>
                <p>Uploaded File: {uploadedFileName}</p>
                <button
                type="button"
                onClick={() => {
                    setFile(null);
                    setUploadedFileName(null);
                }}
                className={styles.deleteButton}
                >
                Delete
                </button>
            </div>
        )}

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
          type="submit"
          disabled={!isPasswordValid}
          className={`${styles.endTestButton} ${!isPasswordValid ? styles.disabled : ''}`}
        >
          End Test
        </button>
      </form>
    </div>
    </div>
  );
};

export default UploadPage;
