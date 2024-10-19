"use client";

import React, { useState } from 'react';
import styles from './LogInPage.module.css';

const LogIn = () => {
  const [formData, setFormData] = useState({
    bitsId: '',
    name: '',
    roomNumber: '',
    systemNumber: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle change with explicit typing for input and select elements
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission with explicit typing
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      // Handle successful login (e.g., store token, redirect, etc.)
      setSuccessMessage('Login successful!');
      setErrorMessage('');
      console.log('Login successful:', data);

      // You might want to redirect the user to another page or clear the form here.
      // Example: window.location.href = '/dashboard';
    } catch (error) {
      setErrorMessage('Login failed. Please try again.');
      setSuccessMessage('');
      console.error('Login error:', error);
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <h2>Login</h2>

        <form id={styles.loginForm} onSubmit={handleSubmit}>
          <label htmlFor="bitsId">BITS ID:</label>
          <input
            type="text"
            id="bitsId"
            name="bitsId"
            value={formData.bitsId}
            onChange={handleChange}
            placeholder="Enter your BITS ID"
            required
          />

          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
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

          <label htmlFor="systemNumber">System Number:</label>
          <input
            type="number"
            id="systemNumber"
            name="systemNumber"
            value={formData.systemNumber}
            onChange={handleChange}
            placeholder="Enter your System Number"
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
