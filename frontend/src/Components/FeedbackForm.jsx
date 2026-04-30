import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from './FeedbackForm.module.css';

const FeedbackForm = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [status, setStatus] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        // TC_06: Global Summary Error Handshake
        if (rating === 0 && comment.trim() === '') {
            newErrors.global = 'VALIDATION_FAILED: Check highlighted fields';
            newErrors.rating = 'Please select a star rating';
            newErrors.comment = 'Description cannot be empty';
        } else {
            // TC_02: Native Star Rating Lock
            if (rating === 0) newErrors.rating = 'Please select a star rating';
            
            // TC_03, TC_04, TC_05: Description Restrictions
            if (comment.trim() === '') {
                newErrors.comment = 'Description cannot be empty';
            } else if (comment.length > 500) {
                newErrors.comment = 'Description must be between 1 and 500 characters';
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rating, comment })
            });

            if (res.ok) {
                setStatus('SUCCESS: Review submitted for moderation.'); // Clearer expectation
                setRating(0);
                setComment('');
            } else {
                setStatus('FAILED TO SUBMIT REVIEW.');
            }
        } catch (err) {
            setStatus('NETWORK OFFLINE.');
        }
    };

    if (!isLoggedIn) {
        return (
            <div className={styles.container}>
                <div className={styles.loginPrompt}>
                    <h2>AUTHENTICATION REQUIRED</h2>
                    <p>You must be a verified Member to submit a review to the Wall of Love.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>LOG YOUR EXPERIENCE</h2>
            <p className={styles.subtitle}>Help others discover the Alpha Protocol</p>
            
            {status && <div className={styles.toast} style={{background: status.includes('FAILED') ? '#ff5540' : '#2e7d32'}}>{status}</div>}
            {errors.global && <div style={{color: 'red', textAlign: 'center', marginBottom: '15px'}}>{errors.global}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span 
                            key={star}
                            className={`${styles.star} ${star <= (hover || rating) ? styles.active : ''}`}
                            onClick={() => { setRating(star); setErrors({...errors, rating: null, global: null}); }}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                        >
                            ★
                        </span>
                    ))}
                </div>
                {errors.rating && <div style={{color: 'red', fontSize: '0.8rem', textAlign: 'center', marginTop: '-10px', marginBottom: '10px'}}>{errors.rating}</div>}
                
                <div style={{position: 'relative'}}>
                    <textarea 
                        className={styles.textarea}
                        placeholder="Share the details of your transformation..."
                        value={comment}
                        onChange={(e) => { setComment(e.target.value); setErrors({...errors, comment: null, global: null}); }}
                        maxLength={500}
                    />
                    <div style={{position: 'absolute', bottom: '15px', right: '15px', fontSize: '0.8rem', color: comment.length > 480 ? '#ff5540' : '#666'}}>
                        {comment.length}/500
                    </div>
                </div>
                {errors.comment && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '5px', marginBottom: '15px'}}>{errors.comment}</div>}
                
                <button type="submit" className={styles.submitBtn}>
                    SUBMIT REVIEW
                </button>
            </form>
        </div>
    );
};

export default FeedbackForm;
