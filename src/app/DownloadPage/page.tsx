"use client"

import React, { useEffect, useState } from 'react';
import styles from './DownloadPage.module.css'; // Assuming you're using CSS modules for styling
import Navbar from '../components/StudentNavbar/Navbar';
import { useRouter } from 'next/navigation';

const DownloadPage = () => {

    const [loading, setLoading] = useState(true);
    const router = useRouter();


    useEffect(() => {
        const token = localStorage.getItem('StudentauthToken');
        if (!token) {
            router.push('/LogInPage'); // Redirect to login if no token is found
            return;
        }

        setLoading(false); // Stop loading if token exists

        // Periodically check test status
        const intervalId = setInterval(() => {
            checkTestStatus();
        }, 5000); // Check every 5 seconds

        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, [router]);

    const checkTestStatus = async () => {
        try {
            const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get-test-status`, {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                if (data.testStatus === 'ENDED') {
                    localStorage.removeItem('StudentauthToken');
                    router.push('/EndTestPage');  // Redirect to end page if test has ended
                } else if (data.testStatus === 'SETTING_UP') {
                    localStorage.removeItem('StudentauthToken');
                    router.push('/LogInPage');
                }
                else {
                    setLoading(false);  // Stop loading if test is ongoing
                }
            } else {
                console.error('Failed to get test status');
                alert('Failed to get test status.');
            }
        } catch (error) {
            console.error('Error fetching test status:', error);
            alert('An error occurred while checking the test status.');
        }
    };

    const handleDownload = async () => {
        try {
            const token = localStorage.getItem('StudentauthToken');
            if (!token) {
                alert('User is not authenticated. Please log in.');
                return;
            }

            const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_BASE_URL}/api/download-question-paper`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'answer_file.zip';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
                alert('File downloaded successfully.');
            } else {
                const errorData = await response.json();
                alert(`Failed to download file: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error during file download:', error);
            alert('An error occurred while downloading the file.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Navbar />
            <div className={styles.background}>
                <div className={styles.container}>
                    <h1>Download Your Question Paper</h1>
                    <p>Click the button below to download the question paper for your exam.</p>
                    <button className={styles.downloadButton} onClick={handleDownload}>
                        Download Question Paper
                    </button>
                </div>
            </div>
        </>
    );
};

export default DownloadPage;
