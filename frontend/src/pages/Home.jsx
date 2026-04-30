import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Home.module.css';
import Navbar from '../Components/Navbar';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const { isLoggedIn, role, userId } = useContext(AuthContext);
    const navigate = useNavigate();
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        if (isLoggedIn) {
            if (role === 'admin') {
                navigate('/alpha-admin');
            } else if (userId) {
                navigate(`/dashboard/${userId}`);
            }
        }
    }, [isLoggedIn, role, userId, navigate]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/feedback/featured`)
            .then(res => res.json())
            .then(data => { if(Array.isArray(data)) setTestimonials(data); })
            .catch(err => console.error("Feedback DB Offline", err));
    }, []);

    return (
        <div className={styles.homeContainer}>
            <Navbar />
            
            {/* 01. HERO SECTION */}
            <section className={styles.heroSection}>
                <div className={styles.heroBackground}>
                    <img src="/hero.jpg" alt="Fitness Training" className={styles.heroImage} />
                    <div className={styles.heroOverlay}></div>
                </div>

                <div className={styles.heroContent}>
                    <h1 className={styles.heroHeadline}>
                        ALPHA LEE<br/>
                        <span>FITNESS</span>
                    </h1>
                    <p className={styles.heroSubtext}>
                        The ultimate hybrid training system. We combine elite-level coaching with 
                        proprietary AI protocols to unlock your biological potential.
                    </p>
                    <div className={styles.ctaGroup}>
                        {isLoggedIn ? (
                            <Link 
                                to={role === 'admin' ? '/alpha-admin' : '/locker'} 
                                className={styles.primaryButton}
                            >
                                GO_TO_LOCKER
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className={styles.primaryButton}>LOGIN_ACCESS</Link>
                                <Link to="/register" className={styles.secondaryButton}>CREATE_ACCOUNT</Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* 02. FITNESS INTRO */}
            <section className={styles.sectionPadding}>
                <span className={styles.sectionLabel}>CORE PHILOSOPHY</span>
                <h2 className={styles.sectionTitle}>WHERE SCIENCE MEETS <span style={{color: '#ff5540'}}>HYPERTROPHY</span>.</h2>
                <div className={styles.trainingGrid}>
                    <div className={styles.featureCard}>
                        <span className={styles.cardIcon}>01</span>
                        <h3 className={styles.cardTitle}>ADAPTIVE PROTOCOLS</h3>
                        <p className={styles.cardText}>
                            Training plans that learn from your recovery. If your bio-feedback shows high fatigue, 
                            the system scales back. If you're peaking, it pushes for a new PR.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <span className={styles.cardIcon}>02</span>
                        <h3 className={styles.cardTitle}>BIO-FEEDBACK LOOPS</h3>
                        <p className={styles.cardText}>
                            Integrate your sleep, stress, and nutrition data to create a 360-degree 
                            view of your performance capabilities every single day.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <span className={styles.cardIcon}>03</span>
                        <h3 className={styles.cardTitle}>EVIDENCE BASED</h3>
                        <p className={styles.cardText}>
                            No fluff. No influencers. Just raw data and proven exercise mechanics 
                            designed for maximum muscle recruitment and skeletal safety.
                        </p>
                    </div>
                </div>
            </section>

            {/* 03. AI COACH HIGHLIGHT */}
            <section className={`${styles.sectionPadding} ${styles.aiSection}`}>
                <div className={styles.aiImageContainer}>
                    <img src="/herobanner 2.jpg" alt="AI Coaching" className={styles.aiImage} />
                </div>
                <div className={styles.aiTextContent}>
                    <span className={styles.sectionLabel}>TECHNOLOGY</span>
                    <h2 className={styles.sectionTitle}>THE <span className={styles.aiHighlight}>AI COACH</span> EXPERIENCE.</h2>
                    <p className={styles.heroSubtext} style={{textAlign: 'left', margin: '0 0 30px 0'}}>
                        Our AI engine processes thousands of data points to generate your "Optimal Training Window." 
                        It predicts plateau patterns before they happen, ensuring you never stop progressing.
                    </p>
                    <Link 
                        to={isLoggedIn ? (role === 'admin' ? '/alpha-admin' : `/dashboard/${userId}`) : "/register"} 
                        className={styles.primaryButton}
                    >
                        {isLoggedIn ? 'VIEW_PROTOCOLS' : 'UNLEASH_POTENTIAL'}
                    </Link>
                </div>
            </section>

            {/* 04. TRANSFORMATIONS (TRANSITIONS) */}
            <section className={styles.sectionPadding}>
                <span className={styles.sectionLabel}>THE EVIDENCE</span>
                <h2 className={styles.sectionTitle}>PHYSICAL <span style={{color: '#ff5540'}}>TRANSITIONS</span>.</h2>
                <div className={styles.transformationGrid}>
                    {['r1.jpg', 'r2.jpg', 'r3.jpg'].map((img, idx) => (
                        <div key={idx} className={styles.transformCard}>
                            <img src={`/${img}`} alt={`Transformation ${idx}`} className={styles.transformImg} />
                            <div className={styles.transformLabel}>PROTOCOL_PHASE_0{idx + 1}</div>
                        </div>
                    ))}
                </div>
            </section>

      

            {/* FINAL CTA */}
            <section className={styles.sectionPadding} style={{ textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                <h2 className={styles.heroHeadline}>READY TO <br/><span>EVOLVE?</span></h2>
                <div className={styles.ctaGroup} style={{ marginTop: '50px' }}>
                    <Link 
                        to={isLoggedIn ? (role === 'admin' ? '/alpha-admin' : `/dashboard/${userId}`) : "/register"} 
                        className={styles.primaryButton}
                    >
                        {isLoggedIn ? 'RESUME_EVOLUTION' : 'START TRANSFORMATION'}
                    </Link>
                </div>
            </section>

            {/* FOOTER */}
            <footer className={styles.footer}>
            
                <div className={styles.footerBottom}>
                    <p>&copy; 2026 ALPHA LEE FITNESS. ALL RIGHTS RESERVED.</p>
                    <div style={{display: 'flex', gap: '30px'}}>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
