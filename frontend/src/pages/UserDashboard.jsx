import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar.jsx';
import UserAuthModal from '../Components/UserAuthModal.jsx';
import styles from './UserDashboard.module.css';

const UserDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [program, setProgram] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Active View States
    const [weeksList, setWeeksList] = useState([]);
    const [activeWeek, setActiveWeek] = useState('');
    const [activeDayIndex, setActiveDayIndex] = useState(0);

    // Mobile Drawer & Feedback State
    const [drawerActive, setDrawerActive] = useState(false);
    const [activeExercise, setActiveExercise] = useState(null);
    const [logInputs, setLogInputs] = useState([]); // [{weight, reps}]
    const [coachingAlert, setCoachingAlert] = useState(null); // { message, isPlateau }
    const [exerciseAnalytics, setExerciseAnalytics] = useState({}); // Stores the fetched percentages

    // Auth & Logging States
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [historicalLogs, setHistoricalLogs] = useState([]); // from GET /api/logs/:id
    const [myAccessCodes, setMyAccessCodes] = useState([]);

    const token = localStorage.getItem('token');

    const fetchLogs = async () => {
        if (!token) return;
        try {
            const res = await fetch(`/api/logs/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const logs = await res.json();
                setHistoricalLogs(logs);
            }
        } catch (e) {
            console.error("Failed fetching ledger:", e);
        }
    };

    const fetchMyPayments = async () => {
        if (!token) return;
        try {
            const res = await fetch('/api/payments/my-payments', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                // To keep it relevant to the currently viewed dashboard
                // We only want to show payments associated with this specific program
                const programPayments = data.filter(p => p.programId && p.programId._id === id);
                setMyAccessCodes(programPayments);
            }
        } catch (e) {
            console.error("Failed fetching payments:", e);
        }
    };

    useEffect(() => {
        const isVerified = localStorage.getItem('alf_unlocked_' + id);
        if (!isVerified) {
            navigate('/programs/' + id);
            return;
        }

        fetch(`/api/digital-programs/${id}`)
            .then(res => res.json())
            .then(data => {
                if(data.message) {
                    setError('Program not found.');
                    return;
                }
                setProgram(data);
                
                const wks = [...new Set(data.sessions.map(s => s.weekBlock))];
                setWeeksList(wks);
                if(wks.length > 0) setActiveWeek(wks[0]);
                
                if (token) {
                    fetchLogs();
                    fetchMyPayments();

                    // Analytics Persistence Check: Batch fetch metrics for all mapped exercises
                    const uniqueExerciseIds = new Set();
                    data.sessions.forEach(s => {
                        s.exercises.forEach(ex => {
                            if (ex.exerciseId && ex.exerciseId._id) uniqueExerciseIds.add(ex.exerciseId._id);
                        });
                    });

                    Promise.all(Array.from(uniqueExerciseIds).map(exId => 
                        fetch(`/api/logs/analytics/${exId}`, { headers: { 'Authorization': `Bearer ${token}` }})
                            .then(r => r.ok ? r.json() : null)
                            .then(aData => ({ exId, aData }))
                    )).then(results => {
                        const newAnalyticsMap = {};
                        results.forEach(res => {
                            if (res && res.aData) newAnalyticsMap[res.exId] = res.aData;
                        });
                        setExerciseAnalytics(newAnalyticsMap);
                    }).catch(err => console.error("Batch analytics failed:", err));
                }

                setTimeout(() => setIsLoading(false), 1200);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to fetch protocol data.');
            });
    }, [id, navigate, token]);

    const handleClaimProgram = async () => {
        // Run claim sequence after successful auth
        try {
            await fetch('/api/users/claim', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ programId: id })
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleAuthSuccess = async () => {
        setShowAuthModal(false);
        await handleClaimProgram();
        fetchLogs(); // refresh ledger immediately after login
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

    const openLogger = (exerciseObj, customName) => {
        if (!localStorage.getItem('token')) {
            setShowAuthModal(true);
            return;
        }
        
        setActiveExercise({ ...exerciseObj, displayName: customName });
        // Generate blank log inputs based on the number of sets the coach programmed
        const targetSetsCount = parseInt(exerciseObj.sets) || 3;
        const freshInputs = Array.from({length: targetSetsCount}, () => ({ weight: '', reps: '' }));
        setLogInputs(freshInputs);
        setDrawerActive(true);
    };

    const handleLogChange = (index, field, value) => {
        const newInputs = [...logInputs];
        newInputs[index][field] = value;
        setLogInputs(newInputs);
    };

    const commitLog = async () => {
        if (!activeExercise) return;
        const validSets = logInputs.filter(inp => inp.weight && inp.reps);
        if (validSets.length === 0) {
            alert("No data provided");
            return;
        }

        try {
            const res = await fetch('/api/logs', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    programId: id,
                    exerciseId: activeExercise.exerciseId._id,
                    setsData: validSets.map((s, idx) => ({ setNumber: idx+1, weight: Number(s.weight), reps: Number(s.reps) }))
                })
            });
            if(res.ok) {
                setDrawerActive(false);
                fetchLogs(); // refresh latest performance metrics

                // Smart Overload Engine Hook
                try {
                    const analyticsUrl = `/api/logs/analytics/${activeExercise.exerciseId._id}`;
                    console.log('Fetching Analytics Data from:', analyticsUrl);
                    
                    const analyticsRes = await fetch(analyticsUrl, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    if (analyticsRes.ok) {
                        const data = await analyticsRes.json();
                        console.log('Analytics Data Received:', data);
                        
                        // Sync Analytics Arrow onto Dashboard
                        setExerciseAnalytics(prev => ({
                            ...prev,
                            [activeExercise.exerciseId._id]: data
                        }));

                        if (data.plateauStatus) {
                            setCoachingAlert({ 
                                message: (
                                    <>Growth flatlined (<strong style={{color: '#fff'}}>{data.volumeGrowthPercentage}%</strong>). It might be time to recalibrate your macros or periodization schema.</>
                                ), 
                                isPlateau: true 
                            });
                        } else if (data.volumeGrowthPercentage > 0) {
                            setCoachingAlert({
                                message: (
                                    <>Volume Up <strong style={{color: '#fff', fontSize: '1.1rem'}}>{data.volumeGrowthPercentage}%</strong>! Next week aim for <strong style={{color: '#fff', fontSize: '1.1rem'}}>{data.suggestedWeight}kg</strong> or push for +2 reps to force adaptation.</>
                                ),
                                isPlateau: false
                            });
                        } else {
                            setCoachingAlert({
                                message: (
                                    <>Solid baseline maintenance. Next session target: <strong style={{color: '#fff'}}>{data.suggestedWeight}kg</strong> to trigger overload.</>
                                ),
                                isPlateau: false
                            });
                        }
                    }
                } catch (aErr) {
                    console.error("Coaching Engine skipped:", aErr);
                }
            } else {
                alert("Failed to save ledger.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getPreviousSessionData = (exerciseId) => {
        if (!historicalLogs || historicalLogs.length === 0) return null;
        const logDoc = historicalLogs.find(log => log.exercise === exerciseId);
        if (!logDoc || !logDoc.sets || logDoc.sets.length === 0) return null;
        
        // Return latest set as an indicator. (Since we simply push, the last item is the most recent)
        const lastSet = logDoc.sets[logDoc.sets.length - 1];
        return `PREV: ${lastSet.weight}KG x ${lastSet.reps}`;
    };

    if (error) return <div style={{color:'white', padding: '100px'}}>{error}</div>;

    if (isLoading) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.loaderText}>System Booting...</div>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    const activeSessions = program.sessions.filter(s => s.weekBlock === activeWeek);
    const activeSession = activeSessions[activeDayIndex] || null;

    return (
        <div className={styles.container}>
            <Navbar />
            
            <div className={styles.header}>
                <h1 className={styles.title}>{program.title}</h1>
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
                    <div className={styles.subtitle}>SECURE PROTOCOL TERMINAL</div>
                    <div style={{display: 'flex', gap: '20px'}}>
                        <button 
                            style={{background: 'transparent', color: '#00ccff', border: 'none', cursor: 'pointer', fontWeight: 900, textTransform: 'uppercase'}}
                            onClick={() => navigate('/ai-coach')}
                        >
                            AI NUTRITION COACH →
                        </button>
                        <button 
                            style={{background: 'transparent', color: '#fff', border: '1px solid #444', padding: '4px 12px', cursor: 'pointer', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem'}}
                            onClick={() => navigate('/my-profile')}
                        >
                            MY PROFILE
                        </button>
                        <button 
                            style={{background: 'transparent', color: '#ff5540', border: '1px solid #ff5540', padding: '4px 12px', cursor: 'pointer', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem'}}
                            onClick={() => {
                                if (!token) setShowAuthModal(true);
                                else navigate('/locker');
                            }}
                        >
                            MY LOCKER
                        </button>
                    </div>
                </div>

                {myAccessCodes.length > 0 && (
                    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#1a1a1a', borderRadius: '8px', borderLeft: '4px solid #ff5540' }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#ff5540', fontSize: '1rem', textTransform: 'uppercase' }}>My Access Code (Verified)</h3>
                        {myAccessCodes.map(p => (
                            <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', padding: '8px 0' }}>
                                <span style={{ color: 'white', fontWeight: 'bold' }}>{p.programId?.title || 'Program'}</span>
                                <span style={{ color: '#00ccff', fontFamily: 'monospace', fontWeight: 'bold' }}>{p.accessVector || 'Pending Admin Vector'}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Week Selector */}
            <div className={styles.weekSelectorBar}>
                {weeksList.map((wk, idx) => (
                    <button 
                        key={idx}
                        className={`${styles.weekBtn} ${activeWeek === wk ? styles.weekBtnActive : ''}`}
                        onClick={() => { setActiveWeek(wk); setActiveDayIndex(0); }}
                    >
                        {wk}
                    </button>
                ))}
            </div>

            {/* Day Selector */}
            <div className={styles.daySelectorBar}>
                {activeSessions.map((s, idx) => (
                    <button 
                        key={idx}
                        className={`${styles.dayBtn} ${activeDayIndex === idx ? styles.dayBtnActive : ''}`}
                        onClick={() => setActiveDayIndex(idx)}
                    >
                        {s.dayName}
                    </button>
                ))}
            </div>

            {/* Exercises Flow */}
            <div className={styles.exercisesContainer}>
                {activeSession && activeSession.exercises.length > 0 ? (
                    activeSession.exercises.map((ex, eIdx) => {
                        const globalEx = ex.exerciseId; 
                        if(!globalEx) return null;

                        const prevData = getPreviousSessionData(globalEx._id);

                        return (
                            <div key={eIdx} className={styles.card}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #2a2a2a'}}>
                                    <h3 style={{margin: 0, fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase'}}>{globalEx.name}</h3>
                                    
                                    <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                                        {/* Dynamic Growth Arrows mapped from Analytics Pipe */}
                                        {exerciseAnalytics[globalEx._id] && exerciseAnalytics[globalEx._id].volumeGrowthPercentage != null && exerciseAnalytics[globalEx._id].volumeGrowthPercentage > 0 && (
                                            <span style={{color: '#00ff88', fontWeight: '900', fontSize: '0.9rem', backgroundColor: 'rgba(0, 255, 136, 0.1)', padding: '2px 8px', borderRadius: '4px'}}>
                                                ↑ +{exerciseAnalytics[globalEx._id].volumeGrowthPercentage}%
                                            </span>
                                        )}
                                        {exerciseAnalytics[globalEx._id] && exerciseAnalytics[globalEx._id].volumeGrowthPercentage != null && exerciseAnalytics[globalEx._id].volumeGrowthPercentage <= 0 && (
                                            <span style={{color: '#ff5540', fontWeight: '900', fontSize: '0.9rem', backgroundColor: 'rgba(255, 85, 64, 0.1)', padding: '2px 8px', borderRadius: '4px'}}>
                                                ↓ {exerciseAnalytics[globalEx._id].volumeGrowthPercentage}%
                                            </span>
                                        )}
                                        {prevData && <span style={{color: '#666', fontSize: '0.8rem', fontWeight: 700}}>{prevData}</span>}
                                    </div>
                                </div>
                                
                                {globalEx.videoUrl && (
                                    <div className={styles.videoBox}>
                                        <iframe 
                                            src={getEmbedUrl(globalEx.videoUrl)} 
                                            title="Protocol Video" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowFullScreen>
                                        </iframe>
                                    </div>
                                )}

                                <div className={styles.protocolGrid}>
                                    <div className={styles.protocolItem}>
                                        <div className={styles.protocolLabel}>Target</div>
                                        <div className={styles.protocolValue}>{ex.sets}x{ex.reps}</div>
                                    </div>
                                    <div className={styles.protocolItem}>
                                        <div className={styles.protocolLabel}>Rest</div>
                                        <div className={styles.protocolValue}>{ex.rest}s</div>
                                    </div>
                                    <div className={styles.protocolItem}>
                                        <div className={styles.protocolLabel}>Tempo</div>
                                        <div className={styles.protocolValue}>{ex.tempo}</div>
                                    </div>
                                    <div className={styles.protocolItem}>
                                        <div className={styles.protocolLabel}>RIR</div>
                                        <div className={styles.protocolValue}>{ex.rir}</div>
                                    </div>
                                </div>

                                {ex.notes && (
                                    <div className={styles.notesBox}>
                                        <strong>COACH NOTE: </strong> {ex.notes}
                                    </div>
                                )}

                                <button className={styles.logBtn} onClick={() => openLogger(ex, globalEx.name)}>
                                    LOG SETS
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <div style={{textAlign: 'center', padding: '50px 0', color: '#666'}}>
                        NO DATA FOUND FOR THIS PERIODIZATION
                    </div>
                )}
            </div>

            {/* Absolute Mobile App Drawer */}
            <div className={`${styles.drawerOverlay} ${drawerActive ? styles.active : ''}`}>
                <div className={styles.drawer}>
                    <div className={styles.drawerHeader}>
                        <div className={styles.drawerTitle}>{activeExercise ? activeExercise.displayName : 'LOG DATA'}</div>
                        <button className={styles.closeDrawerBtn} onClick={() => setDrawerActive(false)}>X</button>
                    </div>
                    
                    <div className={styles.logInputsContainer}>
                        {logInputs.map((inp, idx) => (
                            <div key={idx} className={styles.logRow}>
                                <span className={styles.setIndic}>S{idx+1}</span>
                                <input 
                                    type="number" 
                                    className={styles.logInput} 
                                    placeholder="Weight" 
                                    value={inp.weight} 
                                    onChange={(e) => handleLogChange(idx, 'weight', e.target.value)} 
                                />
                                <span style={{color: '#666', fontWeight: 900}}>X</span>
                                <input 
                                    type="number" 
                                    className={styles.logInput} 
                                    placeholder="Reps" 
                                    value={inp.reps} 
                                    onChange={(e) => handleLogChange(idx, 'reps', e.target.value)} 
                                />
                            </div>
                        ))}
                    </div>
                    
                    <button className={styles.logSubmitBtn} onClick={commitLog}>COMMIT LOG</button>
                </div>
            </div>

            {/* Adaptive Coaching Modal */}
            {coachingAlert && (
                <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: coachingAlert.isPlateau ? '#1a1a1a' : '#00ccff', color: coachingAlert.isPlateau ? '#ff5540' : '#000', padding: '25px', borderRadius: '12px', zIndex: 1000, border: `2px solid ${coachingAlert.isPlateau ? '#ff5540' : '#fff'}`, width: '90%', maxWidth: '400px', boxShadow: '0 10px 40px rgba(0,0,0,0.8)'}}>
                    <h3 style={{marginTop: 0, fontSize: '1.2rem'}}>{coachingAlert.isPlateau ? '⚠️ PLATEAU DETECTED' : '🚀 PROGRESS SECURED'}</h3>
                    <p style={{ fontWeight: 'bold', lineHeight: '1.5' }}>{coachingAlert.message}</p>
                    
                    {coachingAlert.isPlateau && (
                        <button onClick={() => navigate('/consultations')} style={{ marginTop: '15px', width: '100%', padding: '12px', backgroundColor: '#ff5540', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase' }}>
                            Contact Coach Alpha
                        </button>
                    )}
                    <button onClick={() => setCoachingAlert(null)} style={{ marginTop: '10px', width: '100%', padding: '12px', backgroundColor: 'transparent', color: coachingAlert.isPlateau ? '#aaa' : '#333', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}>
                        Dismiss Suggestion
                    </button>
                </div>
            )}

            {showAuthModal && <UserAuthModal onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />}
        </div>
    );
};

export default UserDashboard;
