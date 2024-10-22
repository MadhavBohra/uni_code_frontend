"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import styles from './LogInPage.module.css';

const LogIn = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    roomNumber: '',
    seatNumber: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state

  const router = useRouter(); // Initialize the useRouter hook

  // Check if token exists on component mount
  useEffect(() => {
    const token = localStorage.getItem('StudentauthToken');
    if (token) {
      // Redirect to download page if token is found
      router.push('/DownloadPage');
    } else {
      setLoading(false); // If no token is found, stop loading
    }
  }, [router]);

  // Handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const params = new URLSearchParams();
      params.append('studentId', formData.studentId);
      params.append('studentName', formData.studentName);
      params.append('roomNumber', formData.roomNumber);
      params.append('seatNumber', formData.seatNumber);

      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      // Check if the token is present in the response
      if (data.token) {
        // Save token to localStorage
        localStorage.setItem('StudentauthToken', data.token);

        // Display success message
        setSuccessMessage('Login successful!');
        setErrorMessage('');

        // Redirect the user to the download question paper page using useRouter
        router.push('/DownloadPage');
      } else {
        throw new Error('No token found');
      }
    } catch (error) {
      setErrorMessage('Login failed. Please try again.');
      setSuccessMessage('');
      console.error('Login error:', error);
    }
  };

  if(loading)
  {
    return(
      <>
        <p>Loading....</p>
      </>
    )
  }
  
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <h2>Login</h2>

        <form id={styles.loginForm} onSubmit={handleSubmit}>
          <label htmlFor="studentId">Student ID:</label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            placeholder="Enter your Student ID"
            required
          />

          <label htmlFor="studentName">Name:</label>
          <input
            type="text"
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="Enter your Name"
            required
          />

          <label htmlFor="roomNumber">Room Number:</label>
          <select
            id="roomNumber"
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleChange}
            required
          >
            <option value="">Select your Room</option>
            <option value="A101">A101</option>
            <option value="A102">A102</option>
            <option value="B201">B201</option>
            <option value="B202">B202</option>
          </select>

          <label htmlFor="seatNumber">Seat Number:</label>
          <input
            type="number"
            id="seatNumber"
            name="seatNumber"
            value={formData.seatNumber}
            onChange={handleChange}
            placeholder="Enter your Seat Number"
            required
          />

          <button type="submit">Log In</button>
        </form>

        {successMessage && <div className={styles.messageSuccess}>{successMessage}</div>}
        {errorMessage && <div className={styles.messageError}>{errorMessage}</div>}
      </div>
    </div>
  );
};

export default LogIn;
