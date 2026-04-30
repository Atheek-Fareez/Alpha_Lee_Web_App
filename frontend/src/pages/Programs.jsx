import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import styles from './Programs.module.css';

const Programs = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/digital-programs`)
            .then(res => res.json())
            .then(data => {
                setPrograms(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Storefront API failed:", err);
                setLoading(false);
            });
    }, []);

    return (
        <>
            <Navbar />

            {/* ── Hero Banner ── */}
            <section className={styles.programsHero}>
                {/* Left — Text Content */}
                <div className={styles.heroLeft}>
                    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
                        <Link to="/">Home</Link>
                        <span className={styles.breadcrumbSep}>›</span>
                        <span>Programs</span>
                    </nav>
                    <h1 className={styles.heroHeadline}>
                        STAY ALPHA.<br />BE ALPHA.
                    </h1>
                    <p className={styles.heroSub}>Select your objective and initialize the protocol.</p>
                    <div className={styles.heroDivider} />
                    <span className={styles.heroBrand}>ALPHA LEE FITNESS</span>
                </div>

                {/* Right — Emblem */}
                <div className={styles.heroRight}>
                    <img
                        src="/herobanner1.png"
                        alt="Alpha Lee Fitness Emblem"
                        className={styles.heroImage}
                    />
                </div>
            </section>

            <div className={styles.container}>

                {loading ? (
                    <div style={{ textAlign: 'center', color: '#ff5540', fontWeight: '900', marginTop: '100px' }}>
                        INITIALIZING STOREFRONT...
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {programs.map(p => (
                            <div key={p._id} className={styles.card}>
                                {p.goal && <div className={styles.goalBadge}>{p.goal}</div>}

                                <div className={styles.imgWrapper}>
                                    <img
                                        src={p.imageUrl || '/hero.jpg'}
                                        alt={p.title}
                                        className={styles.img}
                                        loading="lazy"
                                    />
                                    <div className={styles.imgOverlay}></div>
                                </div>

                                <div className={styles.content}>
                                    <h2 className={styles.title}>{p.title}</h2>

                                    <div className={styles.metaRow}>
                                        <span className={styles.metaItem}>{p.experienceLevel || 'ALL LEVELS'}</span>
                                        <span className={styles.metaItem}>{p.frequency ? `${p.frequency} DAYS/WK` : 'ANY FREQUENCY'}</span>
                                    </div>

                                    <div className={styles.priceWrapper}>
                                        {p.discountPrice && p.discountPrice !== p.price ? (
                                            <>
                                                <span className={styles.originalPrice}>Rs.{p.price}</span>
                                                <span className={styles.activePrice}>Rs.{p.discountPrice}</span>
                                            </>
                                        ) : (
                                            <span className={styles.activePrice}>Rs.{p.price}</span>
                                        )}
                                    </div>

                                    <Link to={`/programs/${p._id}`} className={styles.ctaBtn}>
                                        VIEW PROTOCOL
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Programs;
