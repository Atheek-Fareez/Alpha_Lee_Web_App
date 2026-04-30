import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import styles from './ProgramDetail.module.css';

const ProgramDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [program, setProgram] = useState(null);
    const [accessCodeInput, setAccessCodeInput] = useState('');
    const [error, setError] = useState('');
    const [apiFailed, setApiFailed] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('alf_unlocked_' + id) === 'true') {
            navigate(`/dashboard/${id}`);
            return;
        }

        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/digital-programs/${id}`)
            .then(async (res) => {
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.message || `API routing failed with status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => setProgram(data))
            .catch(err => {
                console.error("ALF_SYSTEM_ERROR:", err.message);
                setError(err.message);
                setApiFailed(true);
            });
    }, [id, navigate]);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (accessCodeInput.trim().toUpperCase() === program.accessCode) {
            localStorage.setItem('alf_unlocked_' + program._id, 'true');
            
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/claim`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ programId: program._id })
                    });
                } catch(err) {
                    console.log("Silent claim error:", err);
                }
            }
            
            navigate(`/dashboard/${program._id}`);
        } else {
            setError('ACCESS DENIED: INCORRECT PROTOCOL KEY');
        }
    };

    const getEmbedUrl = (url) => {
        if (!url) return '';
        if (url.includes('youtube.com/watch?v=')) {
            const videoId = url.split('v=')[1].split('&')[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        if (url.includes('youtu.be/')) {
            const videoId = url.split('youtu.be/')[1].split('?')[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        return url;
    };

    if (apiFailed) return <div style={{padding: '100px', textAlign: 'center', color: '#ff5540', fontWeight: '900', fontSize: '1.5rem'}}>Warning: Connect to Server</div>;
    if (!program) return <div style={{padding: '100px', textAlign: 'center', color: '#ff5540', fontWeight: '900', fontSize: '1.5rem'}}>INITIALIZING PROTOCOL...</div>;

    const hasDiscount = program.discountPrice && program.discountPrice !== program.price;
    const finalPrice = hasDiscount ? program.discountPrice : program.price;

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    
                    {/* TOP FOLD - 2 COLUMN SPLIT */}
                    <div className={styles.splitLayout}>
                        {/* LEFT: Sticky Media */}
                        <div className={styles.leftCol}>
                            <img src={program.imageUrl || '/hero.jpg'} alt={program.title} className={styles.heroImage} />
                            
                            {program.videoPreviewUrl && (
                                <div className={styles.videoPreview}>
                                    <div className={styles.videoResponsive}>
                                        <iframe 
                                            src={getEmbedUrl(program.videoPreviewUrl)} 
                                            title="Protocol Overview" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowFullScreen>
                                        </iframe>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Main Data & Gate */}
                        <div className={styles.rightCol}>
                            <h1 className={styles.title}>{program.title}</h1>
                            {program.shortTagline && <p className={styles.tagline}>{program.shortTagline}</p>}

                            <div className={styles.priceBlock}>
                                {hasDiscount ? (
                                    <>
                                        <span className={styles.discountPrice}>Rs.{program.discountPrice}</span>
                                        <span className={styles.standardPrice}>Rs.{program.price}</span>
                                    </>
                                ) : (
                                    <span className={styles.discountPrice}>Rs.{program.price}</span>
                                )}

                                {program.resultsCount > 0 && (
                                    <div className={styles.resultsBadge}>
                                        <span>{program.resultsCount}+</span> PROTOCOLS COMPLETED
                                    </div>
                                )}
                            </div>

                            <div className={styles.statsGrid}>
                                <div className={styles.statBox}>
                                    <div className={styles.statLabel}>Target Pathway</div>
                                    <div className={styles.statValue}>{program.targetGoal}</div>
                                </div>
                                <div className={styles.statBox}>
                                    <div className={styles.statLabel}>Exp. Requirement</div>
                                    <div className={styles.statValue}>{program.experienceLevel}</div>
                                </div>
                                <div className={styles.statBox}>
                                    <div className={styles.statLabel}>Time Committment</div>
                                    <div className={styles.statValue}>{program.idealTime}</div>
                                </div>
                                <div className={styles.statBox}>
                                    <div className={styles.statLabel}>Modality</div>
                                    <div className={styles.statValue}>{program.trainingType}</div>
                                </div>
                            </div>

                            {/* AUTHENTICATION GATE */}
                            <div className={styles.lockBox}>
                                <h2 className={styles.lockHeader}>Protocol Verification</h2>
                                <p style={{color: '#666', fontSize: '0.9rem', marginBottom: '20px'}}>Enter generated access vector to enter the Training Dashboard.</p>
                                <form onSubmit={handleVerify} className={styles.inputGroup}>
                                    <input 
                                        className={styles.authInput}
                                        placeholder="ALF-XXXXXX"
                                        value={accessCodeInput}
                                        onChange={(e) => setAccessCodeInput(e.target.value)}
                                        required
                                    />
                                    <button type="submit" className={styles.authBtn}>DECRYPT</button>
                                </form>
                                {error && <div className={styles.authError}>{error}</div>}
                            </div>

                        </div>
                    </div>

                    {/* BELOW FOLD: OVERVIEWS */}
                    {program.longDescription && (
                        <div className={styles.sectionBlock}>
                            <h2 className={styles.sectionHeader}>Program Overview</h2>
                            <p className={styles.overviewText}>
                                {program.longDescription}
                            </p>
                        </div>
                    )}

                    <div className={styles.sectionBlock}>
                        <h2 className={styles.sectionHeader}>What Is Included</h2>
                        <div className={styles.includedGrid}>
                            <div className={styles.includeCard}>
                                <div className={styles.includeIcon}>📋</div>
                                <h3 className={styles.includeTitle}>Master PDF Guide</h3>
                                <p style={{color: '#666', fontSize: '0.9rem'}}>Comprehensive phase breakdown and nutrition logic.</p>
                            </div>
                            <div className={styles.includeCard}>
                                <div className={styles.includeIcon}>📊</div>
                                <h3 className={styles.includeTitle}>Tracking Spreadsheets</h3>
                                <p style={{color: '#666', fontSize: '0.9rem'}}>Log progressive overload metrics seamlessly.</p>
                            </div>
                            <div className={styles.includeCard}>
                                <div className={styles.includeIcon}>🎥</div>
                                <h3 className={styles.includeTitle}>Form Embeds</h3>
                                <p style={{color: '#666', fontSize: '0.9rem'}}>Secure links to technique optimizations.</p>
                            </div>
                            <div className={styles.includeCard}>
                                <div className={styles.includeIcon}>🧬</div>
                                <h3 className={styles.includeTitle}>Science Based</h3>
                                <p style={{color: '#666', fontSize: '0.9rem'}}>100% evidence-backed hypertrophic protocols.</p>
                            </div>
                        </div>
                    </div>

                    {program.equipmentNeeded && (
                        <div className={styles.sectionBlock}>
                            <h2 className={styles.sectionHeader}>Equipment Required</h2>
                            <p className={styles.overviewText} style={{fontWeight: 700, color: '#e2e2e2'}}>
                                {program.equipmentNeeded}
                            </p>
                        </div>
                    )}

                    {/* FEEDBACK SECTION */}
                    <div className={styles.sectionBlock} style={{marginBottom: '60px'}}>
                        <h2 className={styles.sectionHeader}>Client Transformations</h2>
                        <div className={styles.testimonialGrid}>
                            <div className={styles.testimonialCard}>
                                <div className={styles.stars}>★★★★★</div>
                                <div className={styles.quote}>"The structural programming here completely shifted how I approach my splits. I put on 4lbs of sheer density in phase 1."</div>
                                <div className={styles.author}>— J. ANDERSON, COLOMBO</div>
                            </div>
                            <div className={styles.testimonialCard}>
                                <div className={styles.stars}>★★★★★</div>
                                <div className={styles.quote}>"Highest ROI digital product I've acquired. Periodization is flawless and the recovery metrics actually work."</div>
                                <div className={styles.author}>— N. PERERA, KANDY</div>
                            </div>
                            <div className={styles.testimonialCard}>
                                <div className={styles.stars}>★★★★★</div>
                                <div className={styles.quote}>"Better than hiring a local coach. The PDF explains the exact science behind the RPE scales making it foolproof."</div>
                                <div className={styles.author}>— ALPHA_USER_928</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default ProgramDetail;
