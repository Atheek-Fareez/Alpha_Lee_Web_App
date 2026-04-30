import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import styles from './AdminFeedbackManager.module.css';

const AdminFeedbackManager = () => {
    const [feedback, setFeedback] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All');

    const fetchFeedback = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/feedback/admin`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setFeedback(data);
            }
            setIsLoading(false);
        } catch (err) {
            console.error("Moderation Fetch Error:", err);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    const handleAction = async (id, newStatus, isFeatured = null) => {
        try {
            const token = localStorage.getItem('token');
            const current = feedback.find(f => f._id === id);
            
            const payload = { 
                status: newStatus,
                isFeatured: isFeatured !== null ? isFeatured : current.isFeatured 
            };

            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/feedback/${id}/moderate`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                fetchFeedback();
            }
        } catch (err) {
            console.error("Moderation Update Error:", err);
        }
    };

    const filteredFeedback = feedback.filter(f => statusFilter === 'All' || f.status === statusFilter);

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.headerRow}>
                    <h1 className={styles.title}>MODERATION_TERMINAL</h1>
                    <div className={styles.filterGroup}>
                        {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
                            <button 
                                key={s} 
                                className={`${styles.filterBtn} ${statusFilter === s ? styles.activeFilter : ''}`}
                                onClick={() => setStatusFilter(s)}
                            >
                                {s.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className={styles.loading}>SCANNING DATABASE...</div>
                ) : (
                    <div className={styles.feedbackGrid}>
                        {filteredFeedback.length > 0 ? (
                            filteredFeedback.map(f => (
                                <div key={f._id} className={`${styles.card} ${styles[f.status.toLowerCase()]}`}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.userInfo}>
                                            <span className={styles.userName}>{f.userId?.firstName} {f.userId?.lastName}</span>
                                            <span className={styles.userEmail}>{f.userId?.email}</span>
                                        </div>
                                        <div className={styles.statusBadge}>{f.status}</div>
                                    </div>
                                    
                                    <div className={styles.ratingRow}>
                                        {"★".repeat(f.rating)}{"☆".repeat(5 - f.rating)}
                                        <span className={styles.date}>{new Date(f.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    <p className={styles.comment}>"{f.comment}"</p>

                                    <div className={styles.actionRow}>
                                        <div className={styles.mainActions}>
                                            {f.status !== 'Approved' && (
                                                <button onClick={() => handleAction(f._id, 'Approved')} className={styles.approveBtn}>APPROVE</button>
                                            )}
                                            {f.status !== 'Rejected' && (
                                                <button onClick={() => handleAction(f._id, 'Rejected')} className={styles.rejectBtn}>REJECT</button>
                                            )}
                                        </div>
                                        <div className={styles.featureToggle}>
                                            <label className={styles.switch}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={f.isFeatured} 
                                                    onChange={(e) => handleAction(f._id, f.status, e.target.checked)}
                                                />
                                                <span className={styles.slider}></span>
                                            </label>
                                            <span className={styles.featureLabel}>FEATURE ON HOME</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.noData}>NO FEEDBACK MATCHES THE CURRENT FILTER.</div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminFeedbackManager;
