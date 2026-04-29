import React, { useState, useEffect } from 'react';
import styles from '../AdminDashboard.module.css';

const AdminTicketManager = () => {
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ problemIdentifier: '', description: '', adminNote: '', status: '' });

    const fetchAllTickets = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/api/support/admin', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setTickets(data);
                applyFilter(data, activeFilter);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchAllTickets();
    }, []);

    const applyFilter = (allTickets, filter) => {
        if (filter === 'all') {
            setFilteredTickets(allTickets);
        } else {
            setFilteredTickets(allTickets.filter(t => t.status === filter));
        }
    };

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        applyFilter(tickets, filter);
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/api/support/${id}/status`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) fetchAllTickets();
            else {
                const err = await res.json();
                alert(err.message);
            }
        } catch (e) { console.error(e); }
    };

    const startEditing = (ticket) => {
        setEditingId(ticket._id);
        setEditForm({ 
            problemIdentifier: ticket.problemIdentifier || '', 
            description: ticket.description || '',
            adminNote: ticket.adminNote || '',
            status: ticket.status
        });
    };

    const handleSaveEdit = async (id) => {
        try {
            const token = localStorage.getItem('token');
            // Consolidated Update (Content + Status + Note)
            const res = await fetch(`http://localhost:3000/api/support/${id}/admin-edit`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(editForm)
            });

            if (res.ok) {
                setEditingId(null);
                fetchAllTickets();
            } else {
                const err = await res.json();
                console.error("ADMIN_UPDATE_ERROR:", err);
                alert(`UPDATE_FAILED: ${err.message || 'Unknown Server Error'}`);
            }
        } catch (e) { console.error(e); }
    };

    const deleteTicket = async (id) => {
        if(!window.confirm("Permanently remove this ticket from the archives?")) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/api/support/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchAllTickets();
            else {
                const err = await res.json();
                alert(err.message);
            }
        } catch (e) { console.error(e); }
    };

    const getStatusColor = (s) => {
        switch(s) {
            case 'open': return '#ff5540';
            case 'in_progress': return '#ffab00';
            case 'resolved': return '#00c853';
            case 'closed': return '#666';
            default: return '#fff';
        }
    };

    return (
        <section style={{ width: '100%', gridColumn: '1 / -1' }}>
            <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginBottom: '30px', 
                background: '#111', 
                padding: '5px', 
                borderRadius: '4px',
                border: '1px solid #222'
            }}>
                {['all', 'open', 'in_progress', 'resolved', 'closed'].map(state => (
                    <button
                        key={state}
                        onClick={() => handleFilterChange(state)}
                        style={{
                            flex: 1,
                            padding: '12px',
                            background: activeFilter === state ? (getStatusColor(state) === '#fff' ? '#333' : getStatusColor(state)) : 'transparent',
                            color: activeFilter === state ? (state === 'in_progress' ? '#000' : '#fff') : '#666',
                            border: 'none',
                            fontSize: '10px',
                            fontWeight: 900,
                            letterSpacing: '1px',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            transition: 'all 0.2s'
                        }}
                    >
                        {state.replace('_', ' ')} 
                        <span style={{ marginLeft: '5px', opacity: 0.5 }}>
                            ({state === 'all' ? tickets.length : tickets.filter(t => t.status === state).length})
                        </span>
                    </button>
                ))}
            </div>

            <div className={styles.leadsList}>
                {filteredTickets.map(ticket => (
                    <div key={ticket._id} className={styles.card} style={{borderColor: getStatusColor(ticket.status)}}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h3 className={styles.leadName}>{ticket.user?.firstName} {ticket.user?.lastName}</h3>
                                {editingId !== ticket._id && (
                                    <button onClick={() => startEditing(ticket)} style={{ background: 'transparent', border: '1px solid #444', color: '#00ccff', fontSize: '10px', cursor: 'pointer', padding: '4px 8px' }}>EDIT CONTENT & REMARKS</button>
                                )}
                            </div>
                            
                            {editingId === ticket._id ? (
                                <div style={{ marginTop: '15px', background: '#1a1a1a', padding: '15px', border: '1px solid #333' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                        <div>
                                            <label style={{ fontSize: '10px', color: '#666', fontWeight: 900 }}>TICKET CATEGORY</label>
                                            <select 
                                                style={{ width: '100%', background: '#111', color: '#fff', border: '1px solid #444', padding: '10px', marginTop: '5px' }}
                                                value={editForm.problemIdentifier}
                                                onChange={(e) => setEditForm({...editForm, problemIdentifier: e.target.value})}
                                            >
                                                <option value="Technical Issue">Technical Issue</option>
                                                <option value="Account Access">Account Access</option>
                                                <option value="Billing Query">Billing Query</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '10px', color: '#666', fontWeight: 900 }}>CURRENT STATE (LIFECYCLE)</label>
                                            <select 
                                                style={{ width: '100%', background: '#111', color: getStatusColor(editForm.status), border: `1px solid ${getStatusColor(editForm.status)}`, padding: '10px', marginTop: '5px', fontWeight: 900 }}
                                                value={editForm.status}
                                                onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                                            >
                                                <option value="open">OPEN</option>
                                                <option value="in_progress">IN PROGRESS</option>
                                                <option value="resolved">RESOLVED</option>
                                                <option value="closed">CLOSED</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <label style={{ fontSize: '10px', color: '#666', fontWeight: 900 }}>USER DESCRIPTION</label>
                                    <textarea 
                                        style={{ width: '100%', background: '#111', color: '#fff', border: '1px solid #444', padding: '10px', minHeight: '80px', marginBottom: '15px', marginTop: '5px' }}
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                    />

                                    <label style={{ fontSize: '10px', color: '#ff5540', fontWeight: 900 }}>ADMIN REMARKS (VISIBLE TO USER)</label>
                                    <textarea 
                                        style={{ width: '100%', background: '#111', color: '#ff5540', border: '1px solid #ff5540', padding: '10px', minHeight: '80px', marginTop: '5px' }}
                                        placeholder="Add notes for the user here..."
                                        value={editForm.adminNote}
                                        onChange={(e) => setEditForm({...editForm, adminNote: e.target.value})}
                                    />

                                    <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                                        <button onClick={() => handleSaveEdit(ticket._id)} style={{ background: '#ff5540', color: '#fff', padding: '8px 20px', border: 'none', fontWeight: 900, cursor: 'pointer' }}>SAVE CHANGES</button>
                                        <button onClick={() => setEditingId(null)} style={{ background: 'transparent', color: '#888', border: '1px solid #444', padding: '8px 20px', cursor: 'pointer' }}>CANCEL</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className={styles.leadMeta} style={{color: '#fff', fontSize: '1.2rem', marginBottom: '10px'}}>
                                        {ticket.problemIdentifier}
                                    </div>
                                    <div style={{fontSize: '0.9rem', color: '#888', marginBottom: '15px', whiteSpace: 'pre-wrap'}}>
                                        {ticket.description}
                                    </div>

                                    {ticket.adminNote && (
                                        <div style={{ background: 'rgba(255, 85, 64, 0.05)', borderLeft: '3px solid #ff5540', padding: '10px 15px', marginBottom: '15px' }}>
                                            <span style={{ fontSize: '10px', color: '#ff5540', fontWeight: 900, display: 'block', marginBottom: '5px' }}>ADMIN_REMARK:</span>
                                            <p style={{ fontSize: '0.85rem', color: '#ccc', margin: 0 }}>{ticket.adminNote}</p>
                                        </div>
                                    )}
                                </>
                            )}
                            
                            <div style={{fontSize: '10px', color: getStatusColor(ticket.status), fontWeight: 900, letterSpacing: '1px', marginTop: '10px'}}>
                                STATUS: {ticket.status.toUpperCase()}
                            </div>
                        </div>

                        <div style={{display: 'flex', gap: '10px', flexDirection: 'column', alignItems: 'flex-end', marginLeft: '20px'}}>
                            {ticket.status === 'open' && (
                                <button onClick={() => updateStatus(ticket._id, 'in_progress')} className={styles.actionBtn} style={{background: '#ffab00', color: '#000'}}>START WORK</button>
                            )}
                            
                            {ticket.status === 'in_progress' && (
                                <>
                                    <button onClick={() => updateStatus(ticket._id, 'resolved')} className={styles.actionBtn} style={{background: '#00c853', color: '#000'}}>MARK RESOLVED</button>
                                    <button onClick={() => updateStatus(ticket._id, 'open')} className={styles.actionBtn} style={{background: 'transparent', border: '1px solid #444', color: '#666'}}>REVERT TO OPEN</button>
                                </>
                            )}

                            {ticket.status === 'resolved' && (
                                <>
                                    <button onClick={() => updateStatus(ticket._id, 'closed')} className={styles.actionBtn} style={{background: '#444', color: '#fff'}}>CLOSE TICKET</button>
                                    <button onClick={() => updateStatus(ticket._id, 'in_progress')} className={styles.actionBtn} style={{background: 'transparent', border: '1px solid #444', color: '#666'}}>RE-OPEN WORK</button>
                                </>
                            )}

                            {ticket.status === 'closed' && (
                                <>
                                    <button onClick={() => updateStatus(ticket._id, 'resolved')} className={styles.actionBtn} style={{background: '#4caf50', color: '#fff'}}>RE-OPEN TICKET</button>
                                    <button onClick={() => deleteTicket(ticket._id)} className={styles.actionBtn} style={{background: 'transparent', border: '1px solid #ff5540', color: '#ff5540'}}>DELETE ARCHIVE</button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
                {filteredTickets.length === 0 && <div style={{color: '#666', textAlign: 'center', padding: '40px'}}>No tickets found in this category.</div>}
            </div>
        </section>
    );
};

export default AdminTicketManager;
