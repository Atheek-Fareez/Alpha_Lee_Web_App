import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import styles from './Quiz.module.css';

const Quiz = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [database, setDatabase] = useState([]);
    const navigate = useNavigate();

    const [answers, setAnswers] = useState({
        history: '',
        goal: '',
        time: '',
        gender: '',
        age: '',
        essentials: ''
    });

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/digital-programs`)
            .then(res => res.json())
            .then(data => setDatabase(Array.isArray(data) ? data : []))
            .catch(err => console.error(err));
    }, []);

    const questions = {
        1: {
            title: "What is your primary training history?",
            key: "history",
            options: ["Bodybuilding", "Powerlifting", "Powerbuilding", "CrossFit", "None"]
        },
        2: {
            title: "What is your primary objective?",
            key: "goal",
            options: ["Strength", "Muscle", "Fat Loss", "Combination"]
        },
        3: {
            title: "How much time per session do you have?",
            key: "time",
            options: ["Less than 60 min", "60-90 min"]
        },
        4: {
            title: "Select your gender identity.",
            key: "gender",
            options: ["Male", "Female", "Rather Not Say"]
        },
        5: {
            title: "What is your age bracket?",
            key: "age",
            options: ["Under 20", "20 - 30", "30 - 40", "40 - 60", "60+"]
        },
        6: {
            title: "Do you have access to essential gym equipment?",
            key: "essentials",
            options: ["Yes", "No"]
        }
    };

    const handleAnswer = (val) => {
        const currentQ = questions[step];
        setAnswers({ ...answers, [currentQ.key]: val });

        if (step < 6) {
            setStep(step + 1);
        } else {
            calculateResult({ ...answers, [currentQ.key]: val });
        }
    };

    const calculateResult = (finalParams) => {
        setLoading(true);

        setTimeout(() => {
            let match = database.find(p => p.targetGoal === finalParams.goal && p.idealTime === finalParams.time);
            
            if (!match) {
                // Failsafe mappings
                match = database.find(p => p.targetGoal === finalParams.goal) || database[0];
            }

            setResult(match);
            setLoading(false);
        }, 2500); // Faux analysis delay for UX
    };

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                {!loading && !result && (
                    <div className={styles.quizWrapper}>
                        <div className={styles.progressHeader}>
                            <span>Phase 0{step}</span>
                            <span>{Math.round(((step - 1) / 6) * 100)}% CLOCKED</span>
                        </div>
                        <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: `${((step - 1) / 6) * 100}%` }}></div>
                        </div>

                        <h2 className={styles.question}>{questions[step].title}</h2>
                        <div className={styles.optionsGrid}>
                            {questions[step].options.map((opt, idx) => (
                                <button key={idx} className={styles.optionBtn} onClick={() => handleAnswer(opt)}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {loading && (
                    <div className={styles.loaderWrapper}>
                        <div className={styles.loaderText}>SCANNING_DATABASE...</div>
                        <div className={styles.scanner}>
                            <div className={styles.scannerLine}></div>
                        </div>
                    </div>
                )}

                {result && !loading && (
                    <div className={styles.quizWrapper} style={{ padding: '0', background: 'transparent', border: 'none', boxShadow: 'none' }}>
                        <div className={styles.resultHeader}>
                            <div className={styles.resultSub}>TARGET ACQUIRED</div>
                            <h2 className={styles.resultTitle}>Optimal Solution</h2>
                        </div>
                        
                        <div className={styles.card}>
                            <div className={styles.imgWrapper}>
                                <img src={result.imageUrl || '/hero.jpg'} alt={result.title} className={styles.img} />
                            </div>
                            <div className={styles.content}>
                                <h3 className={styles.cardTitle}>{result.title}</h3>
                                <div className={styles.meta}>
                                    {result.experienceLevel || "ALL LEVELS"} | {result.trainingType || "HYBRID"}
                                </div>
                                <button 
                                    className={styles.ctaBtn} 
                                    onClick={() => navigate(`/programs/${result._id}`)}
                                >
                                    ACCESS PROTOCOL GATE
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Quiz;
