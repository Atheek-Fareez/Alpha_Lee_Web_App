import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../Components/Navbar';

const MyProfile = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Core Interactivity States
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Profile Data Map
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    
    // Security Pass
    const [deletePass, setDeletePass] = useState('');
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Native Data Fetch Lifecycle
    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem('token');
            if(!token) {
                navigate('/login');
                return;
            }
            try {
                // Attempt to fetch from the generic user profile route
                const res = await fetch('/api/users/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if(res.ok) {
                    const data = await res.json();
                    setProfile({
                        firstName: data.firstName || '',
                        lastName: data.lastName || '',
                        email: data.email || '',
                        phone: data.phone || ''
                    });
                } else {
                    // Pre-fill local mock data for staging testing while endpoints align
                    const locallySavedEmail = localStorage.getItem('userEmail') || 'alphamember@example.com';
                    setProfile(prev => ({ ...prev, email: locallySavedEmail, firstName: 'Alpha', lastName: 'Member', phone: '+1 000 000 0000' }));
                }
            } catch (err) {
                // Fallback to offline display
                setProfile(prev => ({ ...prev, firstName: 'Offline', lastName: 'Mode' }));
            }
        };
        fetchProfileData();
    }, [navigate]);

    const handleProfileChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(profile)
            });
            const data = await res.json();
            if (res.ok) {
                setIsEditing(false);
                alert("Personal Details Uploaded Successfully");
            } else {
                alert(data.message || "Failed to update profile");
            }
        } catch (err) {
            console.error(err);
            alert("Network connection offline.");
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert("New passwords do not match.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/users/change-password', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                })
            });
            const data = await res.json();
            
            if (res.ok) {
                alert('Password updated successfully'); // TC_11
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                if (data.message === "Current password incorrect") {
                    alert('Error: Incorrect current password'); // TC_12
                } else {
                    alert(data.message || 'Failed to update password');
                }
            }
        } catch (err) {
            console.error(err);
            alert("Network Error");
        }
    };

    const handleDeleteAccount = async () => {
        if(!deletePass) {
            alert("Security Protocol: Enter your credentials to verify deletion.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/users/profile', {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ password: deletePass })
            });

            const data = await res.json();
            if (res.ok) {
                alert("Account Successfully Terminated from Application.");
                logout();
                navigate('/');
            } else {
                alert(data.message || "Invalid password. Termination aborted.");
                setDeletePass('');
            }
        } catch (err) {
            console.error(err);
            alert("Failed to reach termination endpoint.");
        }
    };

    return (
        <div style={{ backgroundColor: '#111', minHeight: '100vh', color: 'white', fontFamily: 'Inter, sans-serif', paddingTop: '100px' }}>
            <Navbar />
            <div style={{ display: 'flex', maxWidth: '1200px', margin: '40px auto', padding: '0 20px', gap: '30px', flexWrap: 'wrap' }}>
                
                {/* SIDEBAR NAVIGATION TAB BRIDGE */}
                <div style={{ flex: '1 1 250px', maxWidth: '300px', backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '20px', border: '1px solid #333', height: 'fit-content' }}>
                    <h2 style={{ color: '#ff5540', marginBottom: '30px', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Personal Hub</h2>
                    
                    {/* PROFILE OVERVIEW TAB CACHE */}
                    <button 
                        onClick={() => setActiveTab('profile')}
                        style={{ width: '100%', textAlign: 'left', padding: '15px', background: activeTab === 'profile' ? 'rgba(255, 85, 64, 0.1)' : 'transparent', border: 'none', borderLeft: activeTab === 'profile' ? '3px solid #ff5540' : '3px solid transparent', color: activeTab === 'profile' ? '#ff5540' : '#888', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', marginBottom: '10px', transition: 'all 0.2s' }}>
                        Profile Overview
                    </button>

                    {/* PASSWORD / SECURITY TAB CACHE */}
                    <button 
                        onClick={() => setActiveTab('password')}
                        style={{ width: '100%', textAlign: 'left', padding: '15px', background: activeTab === 'password' ? 'rgba(255, 85, 64, 0.1)' : 'transparent', border: 'none', borderLeft: activeTab === 'password' ? '3px solid #ff5540' : '3px solid transparent', color: activeTab === 'password' ? '#ff5540' : '#888', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', marginBottom: '10px', transition: 'all 0.2s' }}>
                        Security & Privacy
                    </button>
                    
                    {/* CROSS-MODULE SYNERGY LINK */}
                    <button 
                        onClick={() => navigate('/locker')}
                        style={{ width: '100%', textAlign: 'left', padding: '15px', background: 'transparent', border: 'none', borderLeft: '3px solid transparent', color: '#00ccff', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', marginBottom: '10px', transition: '0.3s' }}>
                        Access Training
                    </button>
                    
                    <button 
                        onClick={() => { logout(); navigate('/'); }}
                        style={{ width: '100%', textAlign: 'left', padding: '15px', background: 'transparent', border: 'none', borderLeft: '3px solid transparent', color: '#ff5540', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold', marginTop: '60px' }}>
                        LOGOUT →
                    </button>
                </div>
                
                {/* DYNAMIC CONTENT MODAL */}
                <div style={{ flex: '3 1 600px', backgroundColor: '#131313', borderRadius: '8px', padding: '40px', border: '1px solid #333' }}>
                    
                    {activeTab === 'profile' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
                                <h2 style={{ color: '#fff', fontSize: '1.8rem', margin: 0 }}>Personal Hub</h2>
                                {!isEditing ? (
                                    <button 
                                        onClick={() => setIsEditing(true)} 
                                        style={{ backgroundColor: 'transparent', color: '#00ccff', border: '1px solid #00ccff', padding: '8px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                                        EDIT MODE
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => setIsEditing(false)} 
                                        style={{ backgroundColor: 'transparent', color: '#666', border: '1px solid #666', padding: '8px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                                        ABORT EDIT
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleProfileSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label style={{ color: '#888', marginBottom: '8px', fontSize: '0.9rem' }}>First Name</label>
                                    {isEditing ? (
                                        <input type="text" name="firstName" value={profile.firstName} onChange={handleProfileChange} required style={{ backgroundColor: '#0a0a0a', border: '1px solid #00ccff', color: 'white', padding: '12px', borderRadius: '4px', outline: 'none' }} />
                                    ) : (
                                        <div style={{ color: 'white', padding: '12px', border: '1px solid transparent', fontWeight: 600 }}>{profile.firstName || '—'}</div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label style={{ color: '#888', marginBottom: '8px', fontSize: '0.9rem' }}>Last Name</label>
                                    {isEditing ? (
                                        <input type="text" name="lastName" value={profile.lastName} onChange={handleProfileChange} required style={{ backgroundColor: '#0a0a0a', border: '1px solid #00ccff', color: 'white', padding: '12px', borderRadius: '4px', outline: 'none' }} />
                                    ) : (
                                        <div style={{ color: 'white', padding: '12px', border: '1px solid transparent', fontWeight: 600 }}>{profile.lastName || '—'}</div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
                                    <label style={{ color: '#888', marginBottom: '8px', fontSize: '0.9rem' }}>Primary Email Vector</label>
                                    {isEditing ? (
                                        <input type="email" name="email" value={profile.email} onChange={handleProfileChange} required style={{ backgroundColor: '#0a0a0a', border: '1px solid #00ccff', color: 'white', padding: '12px', borderRadius: '4px', outline: 'none' }} />
                                    ) : (
                                        <div style={{ color: 'white', padding: '12px', border: '1px solid transparent', fontWeight: 600 }}>{profile.email || '—'}</div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
                                    <label style={{ color: '#888', marginBottom: '8px', fontSize: '0.9rem' }}>Phone</label>
                                    {isEditing ? (
                                        <input type="text" name="phone" value={profile.phone} onChange={handleProfileChange} style={{ backgroundColor: '#0a0a0a', border: '1px solid #00ccff', color: 'white', padding: '12px', borderRadius: '4px', outline: 'none' }} />
                                    ) : (
                                        <div style={{ color: 'white', padding: '12px', border: '1px solid transparent', fontWeight: 600 }}>{profile.phone || '—'}</div>
                                    )}
                                </div>
                                
                                {isEditing && (
                                    <button type="submit" style={{ gridColumn: '1 / -1', backgroundColor: '#00ccff', color: '#000', border: 'none', padding: '15px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', borderRadius: '4px', marginTop: '20px' }}>
                                        UPDATE INFORMATION
                                    </button>
                                )}
                            </form>
                        </div>
                    )}

                    {activeTab === 'password' && (
                        <div>
                            <h2 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>Security Protocols</h2>
                            
                            {/* CHANGE PASSWORD FORM */}
                            <div style={{ marginBottom: '40px' }}>
                                <h3 style={{ color: '#00ccff', marginBottom: '20px' }}>Update Access Credentials</h3>
                                <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <label style={{ color: '#888', marginBottom: '8px', fontSize: '0.9rem' }}>Current Password</label>
                                        <input 
                                            type="password" 
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                            required 
                                            style={{ backgroundColor: '#0a0a0a', border: '1px solid #333', color: 'white', padding: '12px', borderRadius: '4px', outline: 'none' }} 
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <label style={{ color: '#888', marginBottom: '8px', fontSize: '0.9rem' }}>New Password</label>
                                        <input 
                                            type="password" 
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                            required 
                                            style={{ backgroundColor: '#0a0a0a', border: '1px solid #00ccff', color: 'white', padding: '12px', borderRadius: '4px', outline: 'none' }} 
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <label style={{ color: '#888', marginBottom: '8px', fontSize: '0.9rem' }}>Confirm New Password</label>
                                        <input 
                                            type="password" 
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                            required 
                                            style={{ backgroundColor: '#0a0a0a', border: '1px solid #00ccff', color: 'white', padding: '12px', borderRadius: '4px', outline: 'none' }} 
                                        />
                                    </div>
                                    <button type="submit" style={{ backgroundColor: '#00ccff', color: '#000', border: 'none', padding: '12px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px', marginTop: '10px' }}>
                                        UPDATE PASSWORD 
                                    </button>
                                </form>
                            </div>

                            <p style={{ color: '#aaa', marginBottom: '20px', borderTop: '1px solid #333', paddingTop: '20px' }}>Manage your critical infrastructure here. Account deletions are irreversible.</p>
                            
                            <div style={{ padding: '30px', border: '1px solid rgba(255, 85, 64, 0.3)', borderRadius: '8px', backgroundColor: 'rgba(255, 85, 64, 0.02)' }}>
                                <h3 style={{ color: '#ff5540', marginBottom: '10px' }}>Danger Zone</h3>
                                <p style={{ color: '#888', marginBottom: '20px', fontSize: '0.9rem' }}>Purge your account, logs, parameters, and unlocked programs entirely from the network.</p>
                                
                                {!isDeleting ? (
                                    <button 
                                        onClick={() => setIsDeleting(true)}
                                        style={{ backgroundColor: 'transparent', color: '#ff5540', border: '1px solid #ff5540', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}>
                                        INITIATE ACCOUNT DELETION
                                    </button>
                                ) : (
                                    <div style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
                                        <input 
                                            type="password" 
                                            placeholder="Verify Password to Confirm" 
                                            value={deletePass}
                                            onChange={(e) => setDeletePass(e.target.value)}
                                            style={{ backgroundColor: '#0a0a0a', border: '1px solid #ff5540', color: 'white', padding: '12px', borderRadius: '4px', outline: 'none' }} 
                                        />
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <button 
                                                onClick={handleDeleteAccount}
                                                style={{ backgroundColor: '#ff5540', color: 'white', border: 'none', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}>
                                                CONFIRM 
                                            </button>
                                            <button 
                                                onClick={() => setIsDeleting(false)}
                                                style={{ backgroundColor: 'transparent', color: '#888', border: '1px solid #555', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}>
                                                ABORT
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
