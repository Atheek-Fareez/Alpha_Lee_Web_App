import React from 'react';
import Navbar from '../../Components/Navbar';
import AdminTicketManager from './AdminTicketManager';
import styles from './AdminSupportTerminal.module.css';

const AdminSupportTerminal = () => {
    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.headerRow}>
                    <h1 className={styles.title}>SUPPORT TICKET CENTER</h1>
                    
                    <div className={styles.statusLegend}>
                        <div className={styles.legendItem}><span className={styles.dot} style={{backgroundColor: '#ff5540'}}></span> OPEN</div>
                        <div className={styles.legendItem}><span className={styles.dot} style={{backgroundColor: '#ffab00'}}></span> IN_PROGRESS</div>
                        <div className={styles.legendItem}><span className={styles.dot} style={{backgroundColor: '#00c853'}}></span> RESOLVED</div>
                        <div className={styles.legendItem}><span className={styles.dot} style={{backgroundColor: '#666'}}></span> CLOSED</div>
                    </div>
                </div>

                <div className={styles.mainGrid}>
                    <AdminTicketManager />
                </div>
            </div>
        </>
    );
};

export default AdminSupportTerminal;
