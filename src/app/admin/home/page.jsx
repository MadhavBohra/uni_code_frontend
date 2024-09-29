"use client"
// import React from 'react'
import React from 'react';
import styles from './home.module.css'

const page = () => {


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