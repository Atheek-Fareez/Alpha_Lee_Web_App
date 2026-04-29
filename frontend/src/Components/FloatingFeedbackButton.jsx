import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './FloatingFeedbackButton.module.css';

const FloatingFeedbackButton = () => {
    const location = useLocation();
    
    // Don't show the button on feedback, admin, or consultation routes (to prevent overlap with AI bot)
    if (location.pathname === '/feedback' || location.pathname.startsWith('/alpha-admin') || location.pathname === '/consultations') {
        return null;
    }

    return (
        <Link to="/feedback" className={styles.floatingBtn} title="Share Feedback">
            ★
        </Link>
    );
};

export default FloatingFeedbackButton;
