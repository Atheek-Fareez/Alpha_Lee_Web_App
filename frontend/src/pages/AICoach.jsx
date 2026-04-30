import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Navbar from '../Components/Navbar';
import styles from './AICoach.module.css';

const AICoach = () => {
    const [formData, setFormData] = useState({
        current_w: '',
        target_w: '',
        duration: '',
        workout_type: 'Cardio'
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // Chat States
    const [chatHistory, setChatHistory] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatting, setIsChatting] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);
        setChatHistory([]); // Clear chat for new plan

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/predict-fitness`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                setResult(data.data);
                // Initialize chat with the first response
                setChatHistory([
                    { role: 'assistant', content: `Protocol Generated. I've designed a ${data.data.goal} plan targeting ${data.data.dailyCalorieTarget} kcal. How can I help you optimize this?` }
                ]);
            } else {
                setError(data.message || "Failed to generate plan.");
            }
        } catch (err) {
            setError("Server is offline. Ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!chatInput.trim() || isChatting) return;

        const userMessage = chatInput.trim();
        setChatInput('');
        setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsChatting(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    history: chatHistory,
                    activePlan: result?.mealPlan
                })
            });

            const data = await response.json();
            if (data.success) {
                setChatHistory(prev => [...prev, { role: 'assistant', content: data.reply }]);
            } else {
                setChatHistory(prev => [...prev, { role: 'assistant', content: "Error communicating with the neural link. Try again." }]);
            }
        } catch (err) {
            setChatHistory(prev => [...prev, { role: 'assistant', content: "Connection lost. Re-establishing link..." }]);
        } finally {
            setIsChatting(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <Navbar />
            
            <div className={styles.content}>
                <header className={styles.header}>
                    <h1 className={styles.title}>ALPHA <span className={styles.accent}>AI COACH</span></h1>
                    <p className={styles.subtitle}>Precision Nutrition & Metabolic Forecasting</p>
                </header>

                <div className={styles.mainGrid}>
                    {/* Input Section */}
                    <div className={styles.inputCard}>
                        <h2 className={styles.cardTitle}>BIOMETRIC DATA</h2>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label>CURRENT WEIGHT (KG)</label>
                                <input 
                                    type="number" 
                                    name="current_w" 
                                    placeholder="e.g. 85" 
                                    value={formData.current_w} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>TARGET WEIGHT (KG)</label>
                                <input 
                                    type="number" 
                                    name="target_w" 
                                    placeholder="e.g. 75" 
                                    value={formData.target_w} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>SESSION DURATION (MINS)</label>
                                <input 
                                    type="number" 
                                    name="duration" 
                                    placeholder="e.g. 60" 
                                    value={formData.duration} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>WORKOUT TYPE</label>
                                <select name="workout_type" value={formData.workout_type} onChange={handleChange}>
                                    <option value="Cardio">Cardio</option>
                                    <option value="HIIT">HIIT</option>
                                    <option value="Strength">Strength</option>
                                </select>
                            </div>
                            <button type="submit" className={styles.submitBtn} disabled={loading}>
                                {loading ? "INITIALIZING AI..." : "GENERATE MEAL PLAN"}
                            </button>
                        </form>
                    </div>

                    {/* Result Section */}
                    <div className={styles.resultCard}>
                        {loading && (
                            <div className={styles.loadingState}>
                                <div className={styles.spinner}></div>
                                <p>Analyzing metabolic variables...</p>
                            </div>
                        )}

                        {!loading && !result && !error && (
                            <div className={styles.placeholderState}>
                                <p>Enter your biometrics to generate your custom AI nutrition protocol.</p>
                            </div>
                        )}

                        {error && (
                            <div className={styles.errorState}>
                                <h3>SYSTEM ERROR</h3>
                                <p>{error}</p>
                            </div>
                        )}

                        {result && (
                            <div className={styles.resultContent}>
                                <div className={styles.statsGrid}>
                                    <div className={styles.statBox}>
                                        <label>GOAL</label>
                                        <div className={styles.statValue}>{result.goal}</div>
                                    </div>
                                    <div className={styles.statBox}>
                                        <label>DAILY CALORIE TARGET</label>
                                        <div className={styles.statValue}>{result.dailyCalorieTarget} kcal</div>
                                    </div>
                                    <div className={styles.statBox}>
                                        <label>EST. WORKOUT BURN</label>
                                        <div className={styles.statValue}>{result.gymWorkoutBurn} kcal</div>
                                    </div>
                                </div>

                                <div className={styles.mealPlanBox}>
                                    <h3>NUTRITION PROTOCOL</h3>
                                    <div className={styles.mealPlanText}>
                                        <ReactMarkdown>{result.mealPlan}</ReactMarkdown>
                                    </div>
                                </div>

                                {/* Chat Interface */}
                                <div className={styles.chatSection}>
                                    <div className={styles.chatHeader}>
                                        <span>AI COACH COMMAND LINE</span>
                                        <div className={styles.pulse}></div>
                                    </div>
                                    <div className={styles.chatWindow}>
                                        {chatHistory.map((msg, i) => (
                                            <div key={i} className={`${styles.chatMessage} ${msg.role === 'user' ? styles.userMsg : styles.aiMsg}`}>
                                                <span className={styles.msgRole}>{msg.role === 'user' ? 'USER > ' : 'COACH > '}</span>
                                                <div className={styles.msgContent}>
                                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                </div>
                                            </div>
                                        ))}
                                        {isChatting && (
                                            <div className={styles.aiMsg}>
                                                <span className={styles.msgRole}>COACH </span>
                                                <span className={styles.typing}>Thinking...</span>
                                            </div>
                                        )}
                                        <div ref={chatEndRef} />
                                    </div>
                                    <form onSubmit={handleChatSubmit} className={styles.chatForm}>
                                        <input 
                                            type="text" 
                                            placeholder="Type a follow-up question..." 
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            disabled={isChatting}
                                        />
                                        <button type="submit" disabled={isChatting}>SEND</button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AICoach;
