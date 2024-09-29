"use client"
// import React from 'react'
import React, { useState } from 'react';
import styles from './home.module.css'

const page = () => {
  const [testName, setTestName] = useState('');
  const [students, setStudents] = useState([]);
  const [testStarted, setTestStarted] = useState(false);
  const [studentActivity, setStudentActivity] = useState({});

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n');
      const newStudents = lines.map(line => line.trim()).filter(line => line);
      setStudents(newStudents);
    };

    reader.readAsText(file);
  };

  const startTest = () => {
    setTestStarted(true);
    const initialActivity = {};
    students.forEach(student => {
      initialActivity[student] = { status: 'Not Started', time: 0 };
    });
    setStudentActivity(initialActivity);
  };
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <h1>Admin Dashboard</h1>
        <div style={{"alignItems":"center","justifyContent":"center"}}>
        <div className={styles.card}>
          <h2>Setup a Test</h2>
          <a href="test" className={styles.btn}>Go to Setup</a>
        </div>
        <div className={styles.card}>
          <h2>Start the Test</h2>
          <a href="testSetup" className={styles.btn}>Start Test</a>
        </div>
        </div>
      </div>
    </div>
  )
}

export default page