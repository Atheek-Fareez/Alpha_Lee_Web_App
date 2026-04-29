import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';

const RecruitmentManager = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/recruitment/applications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setApplications(data);
        } catch (error) {
            console.error('Failed to fetch applications', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this application?")) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/recruitment/applications/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                alert('Application purged.');
                setApplications(applications.filter(app => app._id !== id));
            } else {
                alert('Failed to delete application.');
            }
        } catch (error) {
            console.error('Deletion failed', error);
        }
    };

    return (
        <div style={{ backgroundColor: '#111', minHeight: '100vh', color: 'white' }}>
            <Navbar />
            <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ borderBottom: '2px solid #00ccff', paddingBottom: '10px', marginBottom: '30px' }}>
                    Recruitment Intelligence Matrix
                </h1>
                
                {loading ? (
                    <p style={{color: '#00ccff', fontWeight: 'bold'}}>Decrypting applications...</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1a1a1a', borderRadius: '8px', overflow: 'hidden' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #444', color: '#00ccff', textAlign: 'left', backgroundColor: '#0a0a0a' }}>
                                    <th style={{ padding: '15px' }}>Candidate Name</th>
                                    <th style={{ padding: '15px' }}>Position</th>
                                    <th style={{ padding: '15px' }}>Expected Salary</th>
                                    <th style={{ padding: '15px' }}>Email</th>
                                    <th style={{ padding: '15px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
                                            No pending recruitment applications.
                                        </td>
                                    </tr>
                                ) : (
                                    applications.map(app => (
                                        <tr key={app._id} style={{ borderBottom: '1px solid #333', transition: 'background-color 0.3s' }}>
                                            <td style={{ padding: '15px', fontWeight: 'bold' }}>{app.name}</td>
                                            <td style={{ padding: '15px', color: '#ff5540', fontWeight: '900' }}>{app.position}</td>
                                            <td style={{ padding: '15px', fontFamily: 'monospace', fontSize: '1.1rem' }}>${app.expectedSalary.toLocaleString()}</td>
                                            <td style={{ padding: '15px' }}>{app.email}</td>
                                            <td style={{ padding: '15px', display: 'flex', gap: '10px' }}>
                                                <button 
                                                    onClick={() => alert(`Applicant Message:\n\n${app.message}`)} 
                                                    style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #00ccff', color: '#00ccff', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}
                                                >
                                                    Read Pitch
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(app._id)} 
                                                    style={{ padding: '6px 12px', background: '#222', border: '1px solid #ff5540', color: '#ff5540', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecruitmentManager;
