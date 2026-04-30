import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import styles from './AboutPage.module.css';

const coreValues = [
    { title: "Evidence-Based Practices", desc: "Grounding coaching approach in scientific research and knowledge." },
    { title: "Supportive Communication", desc: "Fostering strong coach-client relationships through open and reliable communication." },
    { title: "Flexibility & Adaptability", desc: "Offering a pause-resume service and dynamic plan changes to suit individual needs." },
    { title: "Nourishment & Enjoyment", desc: "Providing a rich meal database for delicious and nutritious food choices." },
    { title: "Resilience & Contingency", desc: "Overcoming challenges and ensuring unwavering progress." }
];

const teamData = [
    { name: "Lalitha Epaarachchi", role: "Head Coach" },
    { name: "Monali Nawarathna", role: "Documentation Administrator" }
];

const AboutPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        position: 'Coaching',
        expectedSalary: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recruitment/apply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            
            if (res.ok) {
                setStatus({ type: 'success', msg: 'Application submitted securely! Our team will review it shortly.' });
                setFormData({ name: '', email: '', position: 'Coaching', expectedSalary: '', message: '' });
            } else {
                setStatus({ type: 'error', msg: data.error || 'Failed to submit application.' });
            }
        } catch (error) {
            setStatus({ type: 'error', msg: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Navbar />
            
            <div className={styles.hero}>
                <h1 className={styles.title}>Alpha Lee Fitness</h1>
                <div className={styles.subtitle}>Empowering Sri Lankans Globally</div>
                <p style={{ maxWidth: '800px', margin: '20px auto', fontSize: '1.2rem', lineHeight: '1.6', color: '#ccc' }}>
                    Welcome to Alpha Lee Fitness, where we believe in health and fitness as the cornerstone of the Sri Lankan community. I'm Lalitha Epaarachchi, a former software engineer turned self-educated fitness coach and a small business owner since 2018. I am thrilled to have you here!
                </p>
            </div>

            <section className={styles.section}>
                <div className={styles.storyCard}>
                    <h2 className={styles.storyHeader}>Our Purpose and Direction</h2>
                    <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <h3 style={{ color: '#ff5540', fontSize: '1.5rem', marginBottom: '10px' }}>VISION</h3>
                            <p>Empowering Sri Lankans Globally with useful health and fitness information and services.</p>
                        </div>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <h3 style={{ color: '#00ccff', fontSize: '1.5rem', marginBottom: '10px' }}>MISSION</h3>
                            <p>Guiding Sri Lankans worldwide through evidence-based fitness coaching for holistic wellbeing.</p>
                        </div>
                    </div>
                </div>

                <h2 className={styles.storyHeader} style={{ marginTop: '50px' }}>Our Core Values</h2>
                <div className={styles.valuesGrid}>
                    {coreValues.map((val, idx) => (
                        <div key={idx} className={styles.valueBox}>
                            <h3 className={styles.valueTitle}>{val.title}</h3>
                            <div className={styles.valueDesc}>{val.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.storyCard}>
                    <h2 className={styles.storyHeader}>The Birth of Alpha Lee Fitness</h2>
                    <p>
                        In 2015, I embarked on a life-changing journey, co-founding "Natty Muscle," which eventually led to the birth of Alpha Lee Fitness Pvt Limited. By day, I was a dedicated software engineer, but by night, my true passion as a trainer emerged. From personal training sessions to leading invigorating group classes at Independence Square and even conducting a successful workshop at a leading tech company in Sri Lanka, Direct Fn, I had the opportunity to witness the profound impact of fitness on lives. That experience solidified my transition from a software engineer to a self-educated fitness trainer.
                    </p>
                    <p>
                        It also put me face to face with a new problem: the fitness trainer career was quite an underpaid profession. If I were to shoulder my family responsibilities and keep helping people make sustainable changes, I needed a more scalable method of doing business. In 2017-2018, I took on a solitary quest, working tirelessly to crack the code for an online coaching model that could revolutionize the Sri Lankan fitness industry, making a significant impact while also being profitable. Drawing upon my software engineering background, I was determined and unstoppable.
                    </p>
                    <p>
                        And then, in 2018, Alpha Lee Fitness Pvt Limited was born – a beacon of hope and knowledge, transcending borders and time zones, poised to reshape the world of Sri Lankan fitness. From 2019 onwards, I pursued my passion with unwavering dedication. As I recruited and scaled operations, I empowered Sri Lankans worldwide with evidence-based fitness knowledge. This is only the beginning of my story, where innovation, passion, and the desire to transform lives takes precedence. Join me at Alpha Lee Fitness Pvt Limited, where we redefine fitness possibilities and inspire a healthier, happier existence together.
                    </p>
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.storyHeader}>The Core Team</h2>
                <p style={{ color: '#ccc' }}>Our team is working tirelessly everyday to help ensure you get the best services.</p>
                <div className={styles.teamGrid}>
                    {teamData.map((member, idx) => (
                        <div key={idx} className={styles.teamCard}>
                            <div className={styles.teamName}>{member.name}</div>
                            <div className={styles.teamRole}>{member.role}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.formBox}>
                    <h2 className={styles.storyHeader} style={{borderBottom: 'none'}}>Interested in Joining Our Team?</h2>
                    <p style={{color: '#aaa', marginTop: '-10px', marginBottom: '20px'}}>
                        We are rapidly expanding our ecosystem. If you are deeply obsessed with performance and scale, submit your application directly to the Admin Hub.
                    </p>

                    {status.msg && (
                        <div style={{ padding: '15px', marginBottom: '20px', backgroundColor: status.type === 'error' ? 'rgba(255,85,64,0.1)' : 'rgba(0,255,136,0.1)', border: `1px solid ${status.type === 'error' ? '#ff5540' : '#00ff88'}`, color: status.type === 'error' ? '#ff5540' : '#00ff88', borderRadius: '4px', fontWeight: 'bold' }}>
                            {status.msg}
                        </div>
                    )}

                    <form className={styles.formGrid} onSubmit={handleSubmit}>
                        <div style={{display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '20px'}}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Full Name</label>
                                <input type="text" name="name" className={styles.input} value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Email Address</label>
                                <input type="email" name="email" className={styles.input} value={formData.email} onChange={handleChange} required />
                            </div>
                        </div>

                        <div style={{display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '20px'}}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Position</label>
                                <select name="position" className={styles.input} value={formData.position} onChange={handleChange} required>
                                    <option value="Coaching">Elite Coaching</option>
                                    <option value="Sales">High-Ticket Sales</option>
                                    <option value="Development">Full-Stack Development</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Expected Salary ($ USD)</label>
                                <input type="number" name="expectedSalary" className={styles.input} value={formData.expectedSalary} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Why Alpha Lee Fitness?</label>
                            <textarea name="message" className={`${styles.input} ${styles.textarea}`} value={formData.message} onChange={handleChange} required placeholder="Tell us why your skill matrix belongs here..."></textarea>
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? 'UPLOADING...' : 'SUBMIT DIRECT APPLICATION'}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
