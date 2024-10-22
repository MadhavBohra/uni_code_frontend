// app/components/Navbar.js
import React from 'react';

import styles from './navbar.module.css';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const router = useRouter(); // Initialize the router



    return (
        <nav className={styles.navbar}>
            <div className={styles.navLeft}>
                <h1>Student Dashboard</h1>
                {/* {!testStarted 
                    ? <a href="home" className={styles.navLink}>Test Setup</a> 
                    : <a href="test" className={styles.navLink}>Test Activity</a>}
                <a href="testHistory" className={styles.navLink}>Test History</a> */}
                <a href="DownloadPage" className={styles.navLink}>Download Page</a>
                <a href="UploadPage" className={styles.navLink}>Upload Page</a>

            </div>
            <div className={styles.navRight}>
                {/* <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button> */}
            </div>
        </nav>
    );
};

export default Navbar;
