import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../Components/Navbar';
import { AuthContext } from '../context/AuthContext';
import ConsultationChatbot from '../Components/ConsultationChatbot';
import styles from './Consultations.module.css';

const Consultations = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const [packages, setPackages] = useState([]);
    const [selectedPkg, setSelectedPkg] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        whatsappNumber: ''
    });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetch('http://localhost:3000/api/consultations/packages')
            .then(res => res.json())
            .then(data => setPackages(data))
            .catch(err => console.error(err));

        if (isLoggedIn) {
            // Auto inject User identity to forms natively
            const fetchProfile = async () => {
                try {
                    const token = localStorage.getItem('token');
                    // We don't have a distinct GET /me route active, but we can decode tokens, 
                    // or just rely on them typing if they log out, but we actually do have token parsing
                } catch(e){}
            };
            fetchProfile();
        }
    }, [isLoggedIn]);

    const handleSelect = (pkgId) => {
        const target = document.getElementById('intake-form');
        setSelectedPkg(pkgId);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    };

    const submitBooking = async (e) => {
        e.preventDefault();
        const newErrors = {};

        // TC_11: Email Handshake '@' match
        if (!formData.email || !formData.email.includes('@')) {
            newErrors.email = 'Missing @ in email';
        }

        // TC_12: exact 9 digits WhatsApp match
        if (!/^\d{9}$/.test(formData.whatsappNumber)) {
            newErrors.whatsappNumber = 'ENTER EXACTLY 9 DIGITS';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setStatus('PROCESSING...');

        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            // Clean exactly
            const formattedPayload = {
                ...formData,
                whatsappNumber: '+94 ' + formData.whatsappNumber,
                selectedPackage: selectedPkg
            };

            const res = await fetch('http://localhost:3000/api/consultations/bookings', {
                method: 'POST',
                headers,
                body: JSON.stringify(formattedPayload)
            });

            if (res.ok) {
                setStatus('BOOKING SECURED. WE WILL CONTACT YOU SHORTLY.');
                setFormData({ fullName: '', email: '', whatsappNumber: '' });
                setSelectedPkg(null);
            } else {
                const err = await res.json();
                setStatus(`ERROR: ${err.message}`);
            }
        } catch (e) {
            setStatus('NETWORK OFFLINE.');
        }
    };

    return (
        <div className={styles.container}>
            <Navbar />
            
            <header className={styles.header}>
                <h1 className={styles.title}>1-ON-1 CONSULTATIONS</h1>
                <p className={styles.subtitle}>SECURE DIRECT ACCESS TO ALPHA COACHES</p>
            </header>

            <div className={styles.grid}>
                {packages.length === 0 ? <div style={{textAlign:'center', width:'100%', color:'#666'}}>Fetching Pricing Database...</div> : null}
                {packages.map(pkg => (
                    <div key={pkg._id} className={styles.card} data-active={selectedPkg === pkg._id}>
                        <div><span className={styles.pkgType}>{pkg.type}</span></div>
                        <h2 className={styles.pkgTitle}>{pkg.title}</h2>
                        <h3 className={styles.pkgPrice}>{pkg.priceLKR.toLocaleString()}<span> LKR</span></h3>
                        <p className={styles.pkgDesc}>{pkg.description}</p>
                        <button className={styles.selectBtn} onClick={() => handleSelect(pkg._id)}>
                            {selectedPkg === pkg._id ? 'SELECTED' : 'SELECT TIER'}
                        </button>
                    </div>
                ))}
            </div>

            <div id="intake-form" className={styles.intakeSection}>
                <h2 className={styles.intakeTitle}>BOOKING_INTAKE</h2>
                <form onSubmit={submitBooking}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Full Name</label>
                        <input 
                            required className={styles.input} 
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Email Address</label>
                        <input 
                            className={styles.input} 
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => { setFormData({...formData, email: e.target.value}); setErrors({...errors, email: null}); }}
                        />
                        {errors.email && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '5px'}}>{errors.email}</div>}
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>WhatsApp Number</label>
                        <div className={styles.whatsappWrapper}>
                            <div className={styles.prefix}>+94</div>
                            <input 
                                className={`${styles.input} ${styles.waInput}`} 
                                placeholder="77 123 4567"
                                value={formData.whatsappNumber}
                                onChange={(e) => { setFormData({...formData, whatsappNumber: e.target.value}); setErrors({...errors, whatsappNumber: null}); }}
                            />
                        </div>
                        {errors.whatsappNumber && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '5px'}}>{errors.whatsappNumber}</div>}
                    </div>
                    
                    <button 
                        type="submit" 
                        className={styles.submitBtn} 
                        disabled={!selectedPkg}
                    >
                        {selectedPkg ? (status || 'INITIATE PROTOCOL') : 'SELECT A PACKAGE ABOVE'}
                    </button>
                    
                    {status && <div style={{marginTop: '15px', color: '#ff5540', textAlign: 'center', fontWeight: '900'}}>{status}</div>}
                </form>
            </div>
            
            <ConsultationChatbot isLoggedIn={isLoggedIn} />
        </div>
    );
};

export default Consultations;
