import React, { useState, useEffect } from 'react';
import styles from '../AdminDashboard.module.css';

const AdminConsultationManager = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formError, setFormError] = useState('');
    
    const [formData, setFormData] = useState({
        title: '',
        priceLKR: '',
        description: '',
        type: 'Video'
    });

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/consultations/packages`);
            if (res.ok) {
                const data = await res.json();
                setPackages(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/consultations/packages`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    priceLKR: Number(formData.priceLKR)
                })
            });

            if (res.ok) {
                setShowAddForm(false);
                setFormData({ title: '', priceLKR: '', description: '', type: 'Video' });
                fetchPackages();
            } else {
                const err = await res.json();
                setFormError(err.message || "Failed to create package.");
            }
        } catch (err) {
            setFormError("Network error.");
        }
    };

    const handleEditSave = async (id) => {
        setFormError('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/consultations/packages/${id}`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    priceLKR: Number(formData.priceLKR)
                })
            });

            if (res.ok) {
                setEditingId(null);
                setFormData({ title: '', priceLKR: '', description: '', type: 'Video' });
                fetchPackages();
            } else {
                const err = await res.json();
                setFormError(err.message || "Failed to update package.");
            }
        } catch (err) {
            setFormError("Network error.");
        }
    };

    const startEdit = (pkg) => {
        setEditingId(pkg._id);
        setShowAddForm(false);
        setFormError('');
        setFormData({
            title: pkg.title,
            priceLKR: pkg.priceLKR,
            description: pkg.description,
            type: pkg.type
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ title: '', priceLKR: '', description: '', type: 'Video' });
        setFormError('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this package?")) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/consultations/packages/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchPackages();
            } else {
                alert("Failed to delete package.");
            }
        } catch (err) {
            alert("Network error.");
        }
    };

    return (
        <div className={styles.dashboardContainer} style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div className={styles.mainContent}>
                <h1 className={styles.dashboardTitle}>
                    CONSULTATION <span className={styles.accentText}>PACKAGES</span>
                </h1>

                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                    <button 
                        style={{
                            padding: '12px 25px',
                            backgroundColor: !showAddForm && !editingId ? '#ff5540' : '#111',
                            color: !showAddForm && !editingId ? '#000' : '#888',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: '900',
                            fontFamily: "'Space Grotesk', sans-serif",
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            letterSpacing: '1px'
                        }}
                        onClick={() => { setShowAddForm(false); cancelEdit(); }}
                    >
                        VIEW PACKAGES
                    </button>
                    <button 
                        style={{
                            padding: '12px 25px',
                            backgroundColor: showAddForm ? '#ff5540' : '#111',
                            color: showAddForm ? '#000' : '#888',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: '900',
                            fontFamily: "'Space Grotesk', sans-serif",
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            letterSpacing: '1px'
                        }}
                        onClick={() => { setShowAddForm(true); setEditingId(null); setFormData({ title: '', priceLKR: '', description: '', type: 'Video' }); setFormError(''); }}
                    >
                        + ADD NEW PACKAGE
                    </button>
                </div>

                {formError && <div style={{ color: '#ff5540', marginBottom: '15px', fontWeight: '900', padding: '10px', backgroundColor: 'rgba(255,85,64,0.1)', borderLeft: '4px solid #ff5540' }}>{formError}</div>}

                {/* ADD / EDIT FORM */}
                {(showAddForm || editingId) && (
                    <div style={{ backgroundColor: '#0d0d0d', padding: '30px', borderRadius: '8px', border: '1px solid #1a1a1a', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                        <h3 style={{ color: '#fff', marginBottom: '25px', fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', borderBottom: '1px solid #1a1a1a', paddingBottom: '15px' }}>
                            {editingId ? 'EDIT PACKAGE CONFIGURATION' : 'INITIALIZE NEW PACKAGE'}
                        </h3>
                        <form onSubmit={editingId ? (e) => { e.preventDefault(); handleEditSave(editingId); } : handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ color: '#888', display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>Package Title</label>
                                <input 
                                    type="text" 
                                    name="title" 
                                    value={formData.title} 
                                    onChange={handleInputChange} 
                                    required 
                                    style={{ width: '100%', padding: '15px', backgroundColor: '#070707', color: '#fff', border: '1px solid #1a1a1a', borderRadius: '4px', outline: 'none', transition: 'border-color 0.3s' }}
                                    onFocus={(e) => e.target.style.borderColor = '#ff5540'}
                                    onBlur={(e) => e.target.style.borderColor = '#1a1a1a'}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ color: '#888', display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>Price (LKR)</label>
                                    <input 
                                        type="number" 
                                        name="priceLKR" 
                                        value={formData.priceLKR} 
                                        onChange={handleInputChange} 
                                        required 
                                        min="0"
                                        style={{ width: '100%', padding: '15px', backgroundColor: '#070707', color: '#fff', border: '1px solid #1a1a1a', borderRadius: '4px', outline: 'none', transition: 'border-color 0.3s' }}
                                        onFocus={(e) => e.target.style.borderColor = '#ff5540'}
                                        onBlur={(e) => e.target.style.borderColor = '#1a1a1a'}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ color: '#888', display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>Communication Type</label>
                                    <select 
                                        name="type" 
                                        value={formData.type} 
                                        onChange={handleInputChange} 
                                        required
                                        style={{ width: '100%', padding: '15px', backgroundColor: '#070707', color: '#fff', border: '1px solid #1a1a1a', borderRadius: '4px', outline: 'none', cursor: 'pointer' }}
                                    >
                                        <option value="In-Person">In-Person Coaching</option>
                                        <option value="Video">Video Call</option>
                                        <option value="Voice">Voice Call</option>
                                        <option value="WhatsApp">WhatsApp Support</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label style={{ color: '#888', display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>Package Description</label>
                                <textarea 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleInputChange} 
                                    required 
                                    rows="5"
                                    style={{ width: '100%', padding: '15px', backgroundColor: '#070707', color: '#fff', border: '1px solid #1a1a1a', borderRadius: '4px', resize: 'vertical', outline: 'none', transition: 'border-color 0.3s' }}
                                    onFocus={(e) => e.target.style.borderColor = '#ff5540'}
                                    onBlur={(e) => e.target.style.borderColor = '#1a1a1a'}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                <button type="submit" style={{ backgroundColor: '#ff5540', color: '#000', border: 'none', padding: '15px 30px', fontWeight: '900', cursor: 'pointer', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px', transition: '0.3s', boxShadow: '0 4px 15px rgba(255,85,64,0.3)' }}
                                    onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                                >
                                    {editingId ? 'SAVE PACKAGE CONFIGURATION' : 'DEPLOY NEW PACKAGE'}
                                </button>
                                {editingId && (
                                    <button type="button" onClick={cancelEdit} style={{ backgroundColor: 'transparent', color: '#888', border: '1px solid #333', padding: '15px 30px', fontWeight: '900', cursor: 'pointer', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px', transition: '0.3s' }}
                                        onMouseOver={(e) => e.target.style.color = '#fff'}
                                        onMouseOut={(e) => e.target.style.color = '#888'}
                                    >
                                        CANCEL
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                {/* PACKAGES LIST */}
                {!showAddForm && !editingId && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {loading ? (
                            <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>Loading packages...</p>
                        ) : packages.length === 0 ? (
                            <p style={{ color: '#888', textAlign: 'center', padding: '40px', border: '1px dashed #333', borderRadius: '8px' }}>No consultation packages found. Deploy your first package to begin.</p>
                        ) : (
                            packages.map(pkg => (
                                <div key={pkg._id} style={{ backgroundColor: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.3s', cursor: 'default' }}
                                    onMouseOver={(e) => e.currentTarget.style.borderColor = '#333'}
                                    onMouseOut={(e) => e.currentTarget.style.borderColor = '#1a1a1a'}
                                >
                                    <div>
                                        <h3 style={{ color: '#fff', margin: '0 0 8px 0', fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.4rem' }}>
                                            {pkg.title} <span style={{ fontSize: '0.7rem', backgroundColor: 'rgba(255,85,64,0.1)', padding: '4px 10px', borderRadius: '20px', marginLeft: '12px', verticalAlign: 'middle', color: '#ff5540', border: '1px solid rgba(255,85,64,0.3)', textTransform: 'uppercase', letterSpacing: '1px' }}>{pkg.type}</span>
                                        </h3>
                                        <p style={{ color: '#888', margin: '0 0 15px 0', fontSize: '0.95rem', maxWidth: '600px', lineHeight: '1.5' }}>{pkg.description}</p>
                                        <p style={{ color: '#ff5540', margin: 0, fontWeight: '900', fontSize: '1.2rem', fontFamily: "'Space Grotesk', sans-serif" }}>LKR {pkg.priceLKR.toLocaleString()}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <button 
                                            onClick={() => startEdit(pkg)}
                                            style={{ backgroundColor: '#222', color: '#fff', border: 'none', padding: '10px 20px', fontWeight: '900', cursor: 'pointer', borderRadius: '4px', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', transition: '0.2s' }}
                                            onMouseOver={(e) => e.target.style.backgroundColor = '#333'}
                                            onMouseOut={(e) => e.target.style.backgroundColor = '#222'}
                                        >
                                            EDIT PACKAGE
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(pkg._id)}
                                            style={{ backgroundColor: 'transparent', color: '#ff5540', border: '1px solid rgba(255,85,64,0.5)', padding: '10px 20px', fontWeight: '900', cursor: 'pointer', borderRadius: '4px', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', transition: '0.2s' }}
                                            onMouseOver={(e) => { e.target.style.backgroundColor = '#ff5540'; e.target.style.color = '#000'; }}
                                            onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#ff5540'; }}
                                        >
                                            TERMINATE
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminConsultationManager;
