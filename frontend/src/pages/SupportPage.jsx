import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../Components/Navbar';
import { AuthContext } from '../context/AuthContext';
import styles from './SupportPage.module.css';

const SupportPage = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [formData, setFormData] = useState({ problemIdentifier: '', description: '' });
    const [errors, setErrors] = useState({});
    const [successToast, setSuccessToast] = useState('');

    const fetchTickets = async () => {
        if (!isLoggedIn) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/support`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setTickets(data);
            }
        } catch (e) {}
    };

    useEffect(() => {
        fetchTickets();
    }, [isLoggedIn]);

    const handleConfirmFix = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/support/${id}/status`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ status: 'closed' })
            });
            if (res.ok) fetchTickets();
        } catch (e) { console.error(e); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        // Validation TC_09: Empty Check
        if (!formData.problemIdentifier || formData.problemIdentifier.trim() === '') {
            newErrors.problemIdentifier = 'Problem Identifier is required';
        } 
        // Validation TC_08: Min Length Check
        else if (formData.problemIdentifier.trim().length < 5) {
            newErrors.problemIdentifier = 'TITLE_TOO_SHORT (MIN 5 CHARS)';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/support`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setSuccessToast('Ticket lodged securely.');
                setFormData({ problemIdentifier: '', description: '' });
                fetchTickets(); // Refresh the list
                setTimeout(() => setSuccessToast(''), 3000);
            } else {
                setErrors({ global: 'Network Auth Failure. Log in again.' });
            }
        } catch(e) {
            setErrors({ global: 'Server Offline.' });
        }
    };

    if (!isLoggedIn) {
        return (
            <div className={styles.supportContainer}>
                <Navbar />
                <h1 className={styles.title}>ACCESS <span className={styles.redSpan}>DENIED</span></h1>
                <div style={{textAlign:'center', color:'#888'}}>You must be logged in to raise Support Tickets.</div>
            </div>
        );
    }

    return (
        <div className={styles.supportContainer}>
            <Navbar />
            <h1 className={styles.title}>ALF <span className={styles.redSpan}>SUPPORT</span> TERMINAL</h1>

            <div className={styles.grid}>
                {/* RAISE A NEW TICKET - LEFT */}
                <div className={styles.leftSection}>
                    <h2 className={styles.sectionTitle}>Raise a New Ticket</h2>
                    {successToast && <div className={styles.successToast}>{successToast}</div>}
                    {errors.global && <div className={styles.errorText} style={{marginBottom: '15px', textAlign: 'center'}}>{errors.global}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Select Ticket Category</label>
                            <select 
                                className={styles.input} 
                                value={formData.problemIdentifier}
                                onChange={(e) => setFormData({...formData, problemIdentifier: e.target.value})}
                                required
                            >
                                <option value="" disabled>Choose a category...</option>
                                <option value="Technical Issue">Technical Issue</option>
                                <option value="Account Access">Account Access</option>
                                <option value="Billing Query">Billing Query</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Description</label>
                            <textarea 
                                className={styles.textarea} 
                                placeholder="Describe the problem accurately..."
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                required
                            />
                        </div>

                        <button className={styles.submitBtn} type="submit">TRANSMIT TICKET</button>
                    </form>
                </div>

                {/* TICKET HISTORY - RIGHT */}
                <div className={styles.rightSection}>
                    <h2 className={styles.sectionTitle}>My Support History</h2>
                    {tickets.length === 0 ? (
                        <div style={{color: '#666', textAlign: 'center', marginTop: '40px'}}>No active tickets found.</div>
                    ) : (
                        tickets.map(ticket => (
                            <div key={ticket._id} className={styles.ticketCard}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px'}}>
                                    <h3 className={styles.ticketTitle}>{ticket.problemIdentifier}</h3>
                                    <span className={`${styles.statusBadge} ${styles['status' + ticket.status] || styles.statusPending}`}>
                                        {ticket.status}
                                    </span>
                                </div>
                                <p className={styles.ticketDesc}>{ticket.description}</p>
                                
                                {ticket.adminNote && (
                                    <div style={{ background: 'rgba(255, 85, 64, 0.05)', borderLeft: '2px solid #ff5540', padding: '10px', margin: '10px 0', borderRadius: '2px' }}>
                                        <span style={{ fontSize: '9px', color: '#ff5540', fontWeight: 900, display: 'block', marginBottom: '3px' }}>ADMIN_RESPONSE:</span>
                                        <p style={{ fontSize: '0.8rem', color: '#ccc', margin: 0 }}>{ticket.adminNote}</p>
                                    </div>
                                )}

                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px'}}>
                                    <div style={{fontSize: '0.7rem', color: '#555'}}>{new Date(ticket.createdAt).toLocaleString()}</div>
                                    {ticket.status === 'resolved' && (
                                        <button 
                                            onClick={() => handleConfirmFix(ticket._id)}
                                            style={{ background: '#00c853', color: '#000', border: 'none', padding: '5px 10px', fontSize: '10px', fontWeight: 900, cursor: 'pointer' }}
                                        >
                                            CONFIRM RESOLUTION
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
