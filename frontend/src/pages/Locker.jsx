import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import styles from './Locker.module.css';

const Locker = () => {
    const navigate = useNavigate();
    const [lockerData, setLockerData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchAllData = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/locker`, { 
                    headers: { 'Authorization': `Bearer ${token}` } 
                });
                
                if (!res.ok) throw new Error("Auth Failed");
                
                const lockerJson = await res.json();
                setLockerData(lockerJson);
                setIsLoading(false);
            } catch (err) {
                console.error(err);
                navigate('/login');
            }
        };

        fetchAllData();
    }, [navigate]);

    return (
        <div className={styles.container}>
            <Navbar />
            <div className={styles.wrapper}>
                <h1 className={styles.headerTitle}>MY LOCKER</h1>
                <div className={styles.headerSubtitle}>SECURE PROTOCOL VAULT</div>

                {isLoading ? (
                    <div style={{color: '#ff5540', fontWeight: 900, textAlign: 'center', marginTop: '100px'}}>DECRYPTING...</div>
                ) : (

                    <div style={{ marginTop: '50px' }}>
                        <h2 style={{ color: '#ff5540', borderBottom: '1px solid #333', paddingBottom: '10px', fontSize: '1.2rem', textTransform: 'uppercase' }}>Claimed Protocols</h2>
                        <div className={styles.grid}>
                            {lockerData.length > 0 ? (
                                lockerData.map((prog, idx) => (
                                    <div key={idx} className={styles.card}>
                                        <img src={prog.imageUrl || '/hero.jpg'} alt={prog.title} className={styles.cardImage} />
                                        <div className={styles.cardBody}>
                                            <h3 className={styles.programTitle}>{prog.title}</h3>
                                            <div className={styles.programTag}>{prog.shortTagline || "Active Phase Execution"}</div>
                                            <button 
                                                className={styles.resumeBtn}
                                                onClick={() => navigate(`/dashboard/${prog._id}`)}
                                            >
                                                RESUME TRAINING
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{color: '#444', gridColumn: '1 / -1', textAlign: 'center', padding: '30px', fontStyle: 'italic'}}>
                                    Once you verify an access vector, your protocol will be tracked here.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Locker;
