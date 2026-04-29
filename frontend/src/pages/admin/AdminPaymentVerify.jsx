import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';

const AdminPaymentVerify = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/payments/pending', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setPayments(data);
        } catch (error) {
            console.error('Failed to fetch payments', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        const accessVector = prompt('Enter Access Vector for this payment :');
        if (!accessVector) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/payments/${id}/approve`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ accessVector })
            });

            if (res.ok) {
                alert('Payment approved successfully!');
                fetchPayments();
            } else {
                alert('Failed to approve payment.');
            }
        } catch (error) {
            console.error('Approval failed', error);
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm("Are you sure you want to REJECT this payment slip?")) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/payments/${id}/reject`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                alert('Payment has been rejected.');
                fetchPayments();
            } else {
                alert('Failed to reject payment.');
            }
        } catch (error) {
            console.error('Rejection failed', error);
        }
    };

    return (
        <div style={{ backgroundColor: '#111', minHeight: '100vh', color: 'white' }}>
            <Navbar />
            <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ borderBottom: '2px solid #ff5540', paddingBottom: '10px', marginBottom: '30px' }}>
                    Pending Payments Review
                </h1>
                
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1a1a1a' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #444', color: '#ff5540', textAlign: 'left' }}>
                                <th style={{ padding: '15px' }}>User</th>
                                <th style={{ padding: '15px' }}>Program</th>
                                <th style={{ padding: '15px' }}>Slip URL</th>
                                <th style={{ padding: '15px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                                        No pending payments found.
                                    </td>
                                </tr>
                            ) : (
                                payments.map(p => (
                                    <tr key={p._id} style={{ borderBottom: '1px solid #333' }}>
                                        <td style={{ padding: '15px' }}>{p.userId?.name || p.userId?.email || p.userId || 'Unknown'}</td>
                                        <td style={{ padding: '15px' }}>{p.programId?.title || p.programId || 'Unknown'}</td>
                                        <td style={{ padding: '15px' }}>
                                            <a 
                                                href={p.slipUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                style={{ color: '#00ccff', textDecoration: 'underline' }}
                                            >
                                                View Slip
                                            </a>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <button 
                                                onClick={() => handleApprove(p._id)} 
                                                style={{ 
                                                    padding: '8px 16px', 
                                                    background: '#ff5540', 
                                                    border: 'none', 
                                                    color: 'white', 
                                                    cursor: 'pointer', 
                                                    borderRadius: '4px',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => handleReject(p._id)} 
                                                style={{ 
                                                    padding: '8px 16px', 
                                                    background: 'transparent', 
                                                    border: '1px solid #ff5540', 
                                                    color: '#ff5540', 
                                                    cursor: 'pointer', 
                                                    borderRadius: '4px',
                                                    fontWeight: 'bold',
                                                    marginLeft: '10px'
                                                }}
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminPaymentVerify;
