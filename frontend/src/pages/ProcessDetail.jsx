import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import styles from './ProcessDetail.module.css';

const ProcessDetail = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={styles.processContainer}>
            <Navbar />
            
            {/* HERO SECTION */}
            <section className={styles.heroSection}>
                <h1 className={styles.heroHeadline}>
                    HOW OUR <span className={styles.heroHeadlineRed}>PROCESS</span> WORKS
                </h1>
                <p className={styles.heroText}>
                    A transparent, evidence-based roadmap designed to remove guesswork and engineer sustainable growth. Discover exactly what happens when you join the Alpha Lee Ecosystem.
                </p>
            </section>

            {/* ROADMAP GRID */}
            <div className={styles.roadmapGrid}>
                {/* PHASE 1 */}
                <div className={styles.phaseCard}>
                    <div className={styles.phaseNumber}>PHASE_01</div>
                    <h2 className={styles.phaseTitle}>Connect & Data Gathering</h2>
                    <div className={styles.phaseContent}>
                        <p>First, you select a package or bundle and submit your interest in joining our online coaching subscription service.</p>
                        <p>We will contact you directly through WhatsApp to initiate the setup process and securely process your payment. Apart from basic data gathering, you are required to submit:</p>
                        <ul>
                            <li>A <span className={styles.highlight}>physical assessment video</span> using our provided reference material.</li>
                            <li>Your <span className={styles.highlight}>current training plan</span> and cardio routine (if any).</li>
                            <li>Your <span className={styles.highlight}>current calorie/protein intake</span>. (If unknown, share a 24-hour photo diary of all food & drinks consumed).</li>
                        </ul>
                        <p style={{ marginTop: '15px', borderLeft: '2px solid #00ccff', paddingLeft: '15px' }}>
                            <em>Once the data is gathered, we begin orchestrating your starter plan. This blueprint is typically delivered within <strong>48 hours</strong>.</em>
                        </p>
                    </div>
                </div>

                {/* PHASE 2 */}
                <div className={styles.phaseCard}>
                    <div className={styles.phaseNumber}>PHASE_02</div>
                    <h2 className={styles.phaseTitle}>Starter Week Verification</h2>
                    <div className={styles.phaseContent}>
                        <p>Once built and handed over, you will review the plan and list your questions. Once your concerns are cleared, you begin execution.</p>
                        <p>During the first week, <strong style={{color: '#ff5540'}}>all clients are required to submit exercise recordings</strong> using a manageable weight. You are only authorized to use challenging weights once your technique is strictly cleared by the Coach. Your plan may be further customized based on this telemetry.</p>
                        <p style={{marginTop: '15px'}}><strong>Nutrition Subsystem:</strong></p>
                        <ul style={{marginTop: '5px'}}>
                            <li>You will start with a minimum of <strong>10 meal options</strong>.</li>
                            <li><em>Note: If you are a vegan living in Sri Lanka, expect fewer options due to local ingredient variance constraints.</em></li>
                            <li>If you face any dietary issues or require different options, this will be recalibrated during the Starter Week.</li>
                        </ul>
                    </div>
                </div>

                {/* PHASE 3 */}
                <div className={styles.phaseCard}>
                    <div className={styles.phaseNumber}>PHASE_03</div>
                    <h2 className={styles.phaseTitle}>The Ongoing Journey</h2>
                    <div className={styles.phaseContent}>
                        <p>Once the calibration week concludes, further customizations are handled strictly during formalized <strong>Assessments</strong> based on your tier:</p>
                        <ul style={{marginBottom: '20px'}}>
                            <li><span className={styles.highlight}>Package 1:</span> Weekly Assessments</li>
                            <li><span className={styles.highlight}>Package 2:</span> Bi-Weekly (Every two weeks)</li>
                        </ul>
                        <p><strong>Telemetry & Logging:</strong></p>
                        <ul>
                            <li>We expect all clients to submit a <strong>weekly progress update</strong> detailing protocol adherence. A dedicated form is provided for this submission.</li>
                            <li>We expect all clients to actively <strong>journal/log their lifting data</strong> during sessions. This dataset is critical for calculating future mathematical plan updates.</li>
                        </ul>
                    </div>
                </div>

                {/* PHASE 4 */}
                <div className={styles.phaseCard}>
                    <div className={styles.phaseNumber}>PHASE_04</div>
                    <h2 className={styles.phaseTitle}>Communication Standards</h2>
                    <div className={styles.phaseContent}>
                        <p><strong>Answering Questions:</strong></p>
                        <p>Questions that arise while following the plan must be submitted via WhatsApp text or voice note. They will be addressed within <strong>48-72 hours</strong> unless you have purchased a <span className={styles.highlight}>"24-hour reply guarantee"</span>.</p>
                        
                        <p style={{marginTop: '15px'}}><strong>Voice Calls:</strong></p>
                        <p>All voice calls must be scheduled beforehand. We offer structured call schedules to all clients across all packages.</p>
                    </div>
                </div>
            </div>

            {/* POLICY WARNING BOX */}
            <div className={styles.warningBox}>
                <div className={styles.warningTitle}>⚠ Official Service Policies</div>
                <p className={styles.warningText}>
                    <strong>Instant Access:</strong> Our service does not offer instant replies or call-on-demand services. Discussion dates and communication windows must be scheduled upon request.
                </p>
                <p className={styles.warningText}>
                    <strong>Data Retention:</strong> We do NOT provide permanent access to our Google Drive folders. Make absolutely sure to download and save a local copy of your protocols before or after you exit the service.
                </p>
            </div>

            {/* CTA */}
            <div className={styles.ctaWrapper}>
                <Link to="/consultations" className={styles.ctaButton}>
                    SELECT YOUR PACKAGE
                </Link>
            </div>
        </div>
    );
};

export default ProcessDetail;
