"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './EndTest.module.css'; // Optional: Import a CSS module for styling

const EndTestPage = () => {
    const [testStatus, setTestStatus] = useState(null);
    const router = useRouter(); // Hook to handle navigation

    useEffect(() => {
        // Fetch the test status from the backend
        const fetchTestStatus = async () => {
            try {
                const token = localStorage.getItem('StudentauthToken'); // Assuming token is saved in localStorage
                const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_BASE_URL}/api/my-test-status`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setTestStatus(data.testStatus); // Set the test status from the response

                    // If the test is ongoing, redirect to the home page
                    if (data.testStatus === "Test Ongoing") {
                        router.push('/DownloadPage'); // Redirect to home page (or adjust to your home page route)
                    }
                } else {
                    console.error('Error fetching test status:', response.statusText);
                    router.push("/");
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchTestStatus();
    }, [router]);

    if (testStatus === null) {
        // Show a loading message while the status is being fetched
        return <div>Loading...</div>;
    }
    if (testStatus === "Test Ended") {
        localStorage.removeItem('StudentauthToken');
        // router.push("/");
    }

    return (
        <div className={styles.container}>
            <h1>Thank You!</h1>
            <p>Thank you for appearing for the test. Your participation is greatly appreciated!</p>
            <p>We hope you had a great experience.</p>
        </div>
    );
};

export default EndTestPage;
