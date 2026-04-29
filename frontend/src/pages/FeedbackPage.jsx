import React from 'react';
import Navbar from '../Components/Navbar';
import FeedbackForm from '../Components/FeedbackForm';
import styles from './Consultations.module.css'; // Reusing similar layout style

const FeedbackPage = () => {
    return (
        <div className={styles.container} style={{ paddingTop: '100px' }}>
            <Navbar />
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
                <FeedbackForm />
            </div>
        </div>
    );
};

export default FeedbackPage;
