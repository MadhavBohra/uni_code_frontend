import React from 'react';
import styles from './EndTest.module.css'; // Optional: Import a CSS module for styling

const EndTestPage = () => {
    return (
        <div className={styles.container}>
            <h1>Thank You!</h1>
            <p>Thank you for appearing for the test. Your participation is greatly appreciated!</p>
            <p>We hope you had a great experience.</p>
        </div>
    );
};

export default EndTestPage;