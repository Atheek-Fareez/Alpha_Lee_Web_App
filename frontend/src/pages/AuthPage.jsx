import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { AuthContext } from '../context/AuthContext';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '', role: 'user'
    });
    const [error, setError] = useState('');
    const { isLoggedIn, role, userId } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
        try {
            const res = await fetch(`http://localhost:3000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok) {
                if (isLogin) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('role', data.role);
                    localStorage.setItem('userId', data._id);
                    
                    navigate('/');
                } else {
                    // Redirect to login after successful register as per requirement
                    setIsLogin(true);
                    alert("PROTOCOL INITIALIZED. PLEASE LOG IN TO ACCESS YOUR PORTAL.");
                }
            } else {
                setError(data.message || 'Authentication failed');
            }
        } catch (err) {
            setError('Server connection error. Try again.');
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.infoSection}>
                <div className={styles.infoContent}>
                    <h1 className={styles.mainTitle}>ALPHA LEE <span className={styles.accent}>FITNESS</span></h1>
                    <p className={styles.tagline}>ENGINEERING HUMAN EXCELLENCE.</p>
                    
                    <div className={styles.featureBox}>
                        <h2 className={styles.featureTitle}>THE ALPHA SYSTEM</h2>
                        <p className={styles.featureText}>
                            Our system is built on Precision Nutrition, Adaptive Periodization, and Bio-Feedback loops. 
                            We provide a biological roadmap to your ultimate form.
                        </p>
                    </div>

                    <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>100%</span>
                            <span className={styles.statLabel}>EVIDENCE BASED</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>AI</span>
                            <span className={styles.statLabel}>DRIVEN PROTOCOLS</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.formSection}>
                <div className={styles.formBox}>
                    <h2 className={styles.formHeader}>{isLogin ? 'ACCESS_PORTAL' : 'INITIALIZE_PROTOCOL'}</h2>
                    <p className={styles.formSubtext}>
                        {isLogin ? 'ENTER YOUR CREDENTIALS TO SYNC' : 'REGISTER YOUR BIOMETRICS TO START'}
                    </p>

                    {error && <div className={styles.errorMessage}>{error}</div>}

                    <form onSubmit={handleSubmit} className={styles.authForm}>
                        {!isLogin && (
                            <div className={styles.nameRow}>
                                <input 
                                    name="firstName" 
                                    placeholder="FIRST NAME" 
                                    className={styles.inputField} 
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required 
                                />
                                <input 
                                    name="lastName" 
                                    placeholder="LAST NAME" 
                                    className={styles.inputField} 
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                        )}
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="EMAIL ADDRESS" 
                            className={styles.inputField} 
                            value={formData.email}
                            onChange={handleChange}
                            required 
                        />
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="PASSWORD" 
                            className={styles.inputField} 
                            value={formData.password}
                            onChange={handleChange}
                            required 
                        />

                        {!isLogin && (
                            <div className={styles.roleSelection}>
                                <label className={styles.roleLabel}>SELECT OPERATIONAL ROLE:</label>
                                <div className={styles.radioGroup}>
                                    <label className={styles.radioItem}>
                                        <input 
                                            type="radio" 
                                            name="role" 
                                            value="user" 
                                            checked={formData.role === 'user'}
                                            onChange={handleChange} 
                                        />
                                        <span>ALPHA_USER</span>
                                    </label>
                                    <label className={styles.radioItem}>
                                        <input 
                                            type="radio" 
                                            name="role" 
                                            value="admin" 
                                            checked={formData.role === 'admin'}
                                            onChange={handleChange} 
                                        />
                                        <span>SYSTEM_ADMIN</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        <button type="submit" className={styles.submitButton}>
                            {isLogin ? 'AUTHENTICATE' : 'GENERATE_ID'}
                        </button>
                    </form>

                    <div className={styles.toggleText}>
                        {isLogin ? "NEW TO THE ECOSYSTEM?" : "ALREADY REGISTERED?"}
                        <button className={styles.toggleButton} onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'REGISTER_NOW' : 'LOGIN_NOW'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
