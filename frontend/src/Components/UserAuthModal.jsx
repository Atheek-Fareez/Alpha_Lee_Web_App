import React, { useState } from 'react';

const UserAuthModal = ({ onClose, onSuccess }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                // Also trigger logic to claim program
                onSuccess();
            } else {
                setError(data.message || 'Authentication failed');
            }
        } catch (err) {
            setError('Server connection error. Try again.');
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modalBody}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                    <h2 style={styles.header}>{isLogin ? 'MEMBERS LOG IN' : 'BECOME AN ALPHA'}</h2>
                    <button onClick={onClose} style={styles.closeBtn}>X</button>
                </div>
                
                <p style={styles.subtext}>Join to track your sets permanently and build your customized workout locker natively.</p>

                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    {!isLogin && (
                        <div style={{display: 'flex', gap: '15px'}}>
                            <input name="firstName" placeholder="First Name" required value={formData.firstName} onChange={handleChange} style={styles.input} />
                            <input name="lastName" placeholder="Last Name" required value={formData.lastName} onChange={handleChange} style={styles.input} />
                        </div>
                    )}
                    <input type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} style={styles.input} />
                    <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange} style={styles.input} />
                    
                    {error && <div style={{color: '#ff5540', fontSize: '12px', fontWeight: 900}}>{error}</div>}

                    <button type="submit" style={styles.submitBtn}>
                        {isLogin ? 'AUTHENTICATE' : 'INITIALIZE PROTOCOL'}
                    </button>
                </form>

                <div style={styles.toggleText}>
                    {isLogin ? "Don't have an ID? " : "Already an Alpha? "}
                    <span style={styles.toggleLink} onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'REGISTER' : 'LOG IN'}
                    </span>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
        display: 'flex', justifyContent: 'center', alignItems: 'center'
    },
    modalBody: {
        background: '#111', borderTop: '4px solid #ff5540',
        padding: '30px', width: '90%', maxWidth: '400px', borderRadius: '8px'
    },
    header: { color: '#ff5540', margin: 0, fontSize: '1.2rem', fontWeight: 900, fontFamily: 'Space Grotesk' },
    subtext: { color: '#666', fontSize: '0.9rem', marginBottom: '25px', lineHeight: 1.5 },
    closeBtn: { background: 'transparent', border: 'none', color: '#666', fontSize: '1.2rem', fontWeight: 900, cursor: 'pointer' },
    input: { background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '15px', width: '100%', outline: 'none' },
    submitBtn: { background: '#ff5540', border: 'none', color: '#000', padding: '15px', fontWeight: 900, cursor: 'pointer', marginTop: '10px' },
    toggleText: { color: '#666', textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' },
    toggleLink: { color: '#fff', fontWeight: 900, cursor: 'pointer', textDecoration: 'underline' }
};

export default UserAuthModal;
