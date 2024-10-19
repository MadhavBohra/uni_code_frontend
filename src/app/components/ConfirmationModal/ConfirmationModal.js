// app/components/ConfirmationModal.js
import React, { useState } from 'react';
import styles from './ConfirmationModal.module.css'; // Create a CSS file for styling

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'yourAdminPassword') { // Replace with your actual password check
      onConfirm(); // Call the onConfirm function to start the test
      onClose(); // Close the modal
    } else {
      alert('Incorrect password.'); // Show an alert for incorrect password
    }
  };

  if (!isOpen) return null; // Don't render anything if not open

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Are you sure you want to start the test?</h3>
        <p>If Yes, Enter the admin Password : </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            required
          />
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.confirmbtn}>Confirm</button>
            <button type="button" onClick={onClose} className={styles.closebtn}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmationModal;
