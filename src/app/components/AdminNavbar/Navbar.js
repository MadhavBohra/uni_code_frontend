// app/components/Navbar.js
import React from 'react';
import styles from './navbar.module.css';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const router = useRouter(); // Initialize the router

    const handleLogout = () => {
        document.cookie = 'token=; Max-Age=0; path=/'; // Clear the token
        router.push('/admin'); // Redirect to the login page
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.navLeft}>
                <h1>Admin Dashboard</h1>
                {/* {!testStarted 
                    ? <a href="home" className={styles.navLink}>Test Setup</a> 
                    : <a href="test" className={styles.navLink}>Test Activity</a>}
                <a href="testHistory" className={styles.navLink}>Test History</a> */}
            </div>
            <div className={styles.navRight}>
                <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
