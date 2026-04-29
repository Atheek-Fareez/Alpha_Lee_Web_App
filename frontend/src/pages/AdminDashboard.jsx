import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './AdminDashboard.module.css';
import Modal from '../Components/Modal';
import AdminFeedbackManager from './admin/AdminFeedbackManager';
import AdminTicketManager from './admin/AdminTicketManager';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    
    const [leads, setLeads] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: '',
        id: '',
        title: '',
        message: ''
    });

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    const fetchAllData = async () => {
        try {
            const headers = getAuthHeaders();
            
            // Fetch Leads
            const leadRes = await fetch('/api/admin/leads', { headers });
            if (leadRes.ok) setLeads(await leadRes.json());

            // Fetch Bookings
            const bookRes = await fetch('/api/consultations/bookings', { headers });
            if (bookRes.ok) setBookings(await bookRes.json());

            // Fetch Feedback
            const feedRes = await fetch('/api/feedback/admin', { headers });
            if (feedRes.ok) setFeedbacks(await feedRes.json());

            // Fetch Tickets
            const tickRes = await fetch('/api/support/admin', { headers });
            if (tickRes.ok) setTickets(await tickRes.json());

        } catch (err) {
            console.error("Dashboard Sync Error:", err);
        }
    };

    useEffect(() => {
        fetchAllData();
        const interval = setInterval(fetchAllData, 30000); // Auto-refresh every 30s
        return () => clearInterval(interval);
    }, []);

    const openTerminalModal = (type, id, name) => {
        setModalConfig({
            isOpen: true,
            type,
            id,
            title: "CONFIRM_TERMINATION",
            message: `Are you sure you want to permanently delete ${name}? This action cannot be undone.`
        });
    };

    const confirmTermination = async () => {
        const { id } = modalConfig;
        try {
            const res = await fetch(`/api/admin/leads/${id}`, { 
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                setModalConfig({ ...modalConfig, isOpen: false });
                fetchAllData();
            }
        } catch (err) { console.error(err); }
    };

    const markConsultationContacted = async (id) => {
        try {
            const res = await fetch(`/api/consultations/bookings/${id}/contacted`, {
                method: 'PUT',
                headers: getAuthHeaders()
            });
            if (res.ok) fetchAllData();
        } catch(e) { console.error(e); }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const renderSidebar = () => {
        const pendingLeadsCount = leads.length + bookings.filter(b => b.status === 'Pending').length;
        const pendingFeedbackCount = feedbacks.filter(f => f.status === 'Pending').length;
        const activeTicketsCount = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;

        return (
            <aside className={styles.sidebar}>
                <div className={styles.sidebarTop}>
                    <div className={styles.sidebarLogo}>ALPHA <span>ADMIN</span></div>
                    
                    <nav className={styles.navGroup}>
                        <span className={styles.navLabel}>CORE ANALYTICS</span>
                        <div 
                            className={`${styles.navItem} ${activeTab === 'overview' ? styles.navItemActive : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            <span>EXECUTIVE SUMMARY</span>
                        </div>
                    </nav>

                    <nav className={styles.navGroup}>
                        <span className={styles.navLabel}>OPERATIONAL FLOW</span>
                        <div 
                            className={`${styles.navItem} ${activeTab === 'coaching' ? styles.navItemActive : ''}`}
                            onClick={() => setActiveTab('coaching')}
                        >
                            <span>PROGRAM SALES</span>
                            {leads.length > 0 && <span className={styles.badge}>{leads.length}</span>}
                        </div>
                        <div 
                            className={`${styles.navItem} ${activeTab === 'consultations' ? styles.navItemActive : ''}`}
                            onClick={() => setActiveTab('consultations')}
                        >
                            <span>CONSULTATION LEADS</span>
                            {bookings.filter(b => b.status === 'Pending').length > 0 && <span className={styles.badge}>{bookings.filter(b => b.status === 'Pending').length}</span>}
                        </div>
                    </nav>

                    <nav className={styles.navGroup}>
                        <span className={styles.navLabel}>USER SENTIMENT</span>
                        <div 
                            className={`${styles.navItem} ${activeTab === 'feedback' ? styles.navItemActive : ''}`}
                            onClick={() => setActiveTab('feedback')}
                        >
                            <span>FEEDBACK ARCHIVES</span>
                            {pendingFeedbackCount > 0 && <span className={styles.badge}>{pendingFeedbackCount}</span>}
                        </div>
                        <div 
                            className={`${styles.navItem} ${activeTab === 'support' ? styles.navItemActive : ''}`}
                            onClick={() => setActiveTab('support')}
                        >
                            <span>SUPPORT TICKETS</span>
                            {activeTicketsCount > 0 && <span className={styles.badge} style={{background: '#ff5540'}}>{activeTicketsCount}</span>}
                        </div>
                    </nav>

                    <nav className={styles.navGroup}>
                        <span className={styles.navLabel}>INFRASTRUCTURE</span>
                        <div 
                            className={`${styles.navItem} ${activeTab === 'management' ? styles.navItemActive : ''}`}
                            onClick={() => setActiveTab('management')}
                        >
                            <span>COMMAND HUB</span>
                        </div>
                    </nav>
                </div>

                <div className={styles.sidebarFooter}>
                    <div className={styles.navItem} onClick={handleLogout} style={{ color: '#ff5540', borderLeft: 'none', background: 'rgba(255, 85, 64, 0.05)' }}>
                        <span>SECURE LOGOUT</span>
                    </div>
                </div>
            </aside>
        );
    };

    const renderOverview = () => (
        <div className={styles.sectionContainer}>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Active Leads</div>
                    <div className={styles.statValue}>{leads.length + bookings.length}</div>
                    <div className={styles.statTrend}>LIVE PIPELINE VOLUME</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>User Satisfaction</div>
                    <div className={styles.statValue}>
                        {(feedbacks.reduce((acc, f) => acc + f.rating, 0) / (feedbacks.length || 1)).toFixed(1)} <span style={{fontSize: '1rem', color: '#ffbd00'}}>★</span>
                    </div>
                    <div className={styles.statTrend} style={{ color: '#2e7d32' }}>AGGREGATE PERFORMANCE</div>
                </div>
                
            </div>

           
        </div>
    );

    const renderSystemHub = () => {
        const pendingFeedbackCount = feedbacks.filter(f => f.status === 'Pending').length;
        const activeTicketsCount = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;

        return (
            <div className={styles.hubGrid}>
                <div className={styles.hubCard} onClick={() => navigate('/alpha-admin/programs')}>
                    <div className={styles.hubTitle}>MANAGE PROTOCOLS</div>
                    <div className={styles.hubSub}>Training Program Management</div>
                </div>
                <div className={styles.hubCard} onClick={() => navigate('/alpha-admin/exercises')}>
                    <div className={styles.hubTitle}>EXERCISE LIBRARY</div>
                    <div className={styles.hubSub}>Global Kinematic Database</div>
                </div>
                <div className={styles.hubCard} onClick={() => navigate('/alpha-admin/blogs')}>
                    <div className={styles.hubTitle}>BLOG MANAGER</div>
                    <div className={styles.hubSub}>Content Management System</div>
                </div>
                <div className={styles.hubCard} onClick={() => navigate('/alpha-admin/feedback')}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className={styles.hubTitle}>FEEDBACK HUB</div>
                        {pendingFeedbackCount > 0 && <span className={styles.badge}>{pendingFeedbackCount}</span>}
                    </div>
                    <div className={styles.hubSub}>Member Verification & Wall Control</div>
                </div>
                <div className={styles.hubCard} onClick={() => navigate('/alpha-admin/support-hub')}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className={styles.hubTitle}>SUPPORT HUB</div>
                        {activeTicketsCount > 0 && <span className={styles.badge} style={{background: '#ff5540'}}>{activeTicketsCount}</span>}
                    </div>
                    <div className={styles.hubSub}>Ticket Management & Archiving</div>
                </div>
                <div className={styles.hubCard} onClick={() => navigate('/alpha-admin/consultation-packages')}>
                    <div className={styles.hubTitle}>CONSULTATION PACKAGES</div>
                    <div className={styles.hubSub}>Add, Edit, or Delete Packages</div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.adminLayout}>
            {renderSidebar()}
            <main className={styles.mainContent}>
                <Modal
                    isOpen={modalConfig.isOpen}
                    title={modalConfig.title}
                    message={modalConfig.message}
                    onConfirm={confirmTermination}
                    onCancel={() => setModalConfig({ ...modalConfig, isOpen: false })}
                />
                <header className={styles.header}>
                    <h1 className={styles.title}>{activeTab.replace('_', ' ')}</h1>
                </header>
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'coaching' && (
                    <div className={styles.sectionContainer}>
                        {leads.map(l => (
                            <div key={l._id} className={styles.card}>
                                <div className={styles.leadInfo}>
                                    <h3 className={styles.leadName}>{l.full_name}</h3>
                                    <div className={styles.leadMeta}>
                                        <span>{l.program_choice}</span>
                                        <span style={{color: '#444'}}>|</span>
                                        <span>{l.whatsapp_number}</span>
                                    </div>
                                </div>
                                <div className={styles.actionGroup}>
                                    <a href={`https://wa.me/${l.whatsapp_number.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className={`${styles.actionBtn} ${styles.whatsappBtn}`}>WhatsApp</a>
                                    <button onClick={() => openTerminalModal('lead', l._id, l.full_name)} className={`${styles.actionBtn} ${styles.resolveBtn}`}>Resolve</button>
                                </div>
                            </div>
                        ))}
                        {leads.length === 0 && <div style={{color: '#444', textAlign: 'center', padding: '40px'}}>No active program leads.</div>}
                    </div>
                )}
                {activeTab === 'consultations' && (
                    <div className={styles.sectionContainer}>
                        {bookings.map(b => (
                            <div key={b._id} className={styles.card}>
                                <div className={styles.leadInfo}>
                                    <h3 className={styles.leadName}>{b.fullName}</h3>
                                    <div className={styles.leadMeta}>
                                        <span>{b.selectedPackage?.title}</span>
                                        <span style={{color: '#444'}}>|</span>
                                        <span>{b.whatsappNumber}</span>
                                    </div>
                                    <div style={{ fontSize: '10px', color: b.status === 'Contacted' ? '#2e7d32' : '#ff5540', marginTop: '8px', fontWeight: 900 }}>STATUS: {b.status.toUpperCase()}</div>
                                </div>
                                <div className={styles.actionGroup}>
                                    <a href={`https://wa.me/${b.whatsappNumber.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className={`${styles.actionBtn} ${styles.whatsappBtn}`}>WhatsApp</a>
                                    {b.status === 'Pending' && <button onClick={() => markConsultationContacted(b._id)} className={styles.actionBtn} style={{ border: '1px solid #ff5540', color: '#ff5540', background: 'transparent' }}>Mark Contacted</button>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'feedback' && <div className={styles.sectionContainer}><AdminFeedbackManager /></div>}
                {activeTab === 'support' && <div className={styles.sectionContainer}><AdminTicketManager /></div>}
                {activeTab === 'management' && renderSystemHub()}
            </main>
        </div>
    );
};

export default AdminDashboard;
