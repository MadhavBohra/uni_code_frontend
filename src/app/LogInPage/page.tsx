"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './LogInPage.module.css';

const LogIn: React.FC = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    roomNumber: '',
    seatNumber: ''
  });
  const [roomNumbers, setRoomNumbers] = useState<string[]>([]); // State to store room numbers
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('StudentauthToken');
    if (token) {
      router.push('/DownloadPage');
    } else {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // Fetch room numbers from the API
    const fetchRoomNumbers = async () => {
      try {
        const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_BASE_URL}/api/student-room-numbers`); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch room numbers');
        }
        const data = await response.json();
        setRoomNumbers(data.rooms); // Assuming API returns { roomNumbers: ["A101", "A102", ...] }
      } catch (error) {
        console.error('Error fetching room numbers:', error);
        setRoomNumbers([]); // Set empty array in case of error
      }
    };

    fetchRoomNumbers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const params = new URLSearchParams();
      params.append('studentId', formData.studentId);
      params.append('studentName', formData.studentName);
      params.append('roomNumber', formData.roomNumber);
      params.append('seatNumber', formData.seatNumber);

      const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Login error:', data.error);
        throw new Error(data.error);
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('StudentauthToken', data.token);
        setSuccessMessage('Login successful!');
        setErrorMessage('');
        router.push('/DownloadPage');
      } else {
        throw new Error('No token found');
      }
    } catch (error) {
      setErrorMessage('Login failed. Please try again.');
      setSuccessMessage('');
      alert(`Login failed with error: ${error}`);
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading....</p>;
  }

  return (
    <div className={styles.background}>
      {isSubmitting && <div className={styles.loadingOverlay}>Processing...</div>}
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
            {roomNumbers.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
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

          <button type="submit" disabled={isSubmitting}>Log In</button>
        </form>

        {successMessage && <div className={styles.messageSuccess}>{successMessage}</div>}
        {errorMessage && <div className={styles.messageError}>{errorMessage}</div>}
      </div>
    </div>
  );
};

export default LogIn;
