// app/admin/login/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // For navigation in client components
import styles from './login.module.css';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Loader state
  const router = useRouter();

  // Check for the token on component mount
  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));

    // Simulate token validation delay
    setTimeout(() => {
      if (token) {
        // If token exists, redirect to admin dashboard
        router.push('/admin/home');
      } else {
        setLoading(false); // Stop loading if no token
      }
    }, 1000); // Adjust the timeout as needed (1 second in this case)
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/login`, { // Replace with your actual backend URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        // Store the JWT token securely
        document.cookie = `token=${data.token}; path=/`;

        // Redirect to admin dashboard after successful login
        router.push('/admin/home');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred while logging in');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div> {/* Add your loader styles here */}
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
