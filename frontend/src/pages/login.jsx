import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                localStorage.setItem('userId', data._id);
                
                navigate('/');
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            console.error("Login Error:", err);
            setError("Connection offline. Please try again.");
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <h1 className={styles.loginTitle}>ACCESS_PORTAL</h1>
                <p className={styles.loginSubtitle}>VERIFY CREDENTIALS</p>

                {error && <div style={{ color: '#ff5540', fontSize: '12px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleLogin}>
                    <input 
                        type="email" 
                        placeholder="EMAIL" 
                        className={styles.inputField} 
                        value={credentials.email}
                        onChange={e => setCredentials({...credentials, email: e.target.value})}
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="PASSWORD" 
                        className={styles.inputField} 
                        value={credentials.password}
                        onChange={e => setCredentials({...credentials, password: e.target.value})}
                        required 
                    />
                    <button type="submit" className={styles.loginBtn}>AUTHENTICATE</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
