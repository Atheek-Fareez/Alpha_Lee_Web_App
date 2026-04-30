import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import styles from './AdminProgramManager.module.css';

const AdminProgramManager = () => {
    const [activeTab, setActiveTab] = useState('digital'); // 'digital' | 'coaching'
    
    // States
    const [digitalPrograms, setDigitalPrograms] = useState([]);
    const [coachingPackages, setCoachingPackages] = useState([]);
    const [globalExercises, setGlobalExercises] = useState([]);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Initial States
    const initialDigital = {
        title: '', shortTagline: '', price: '', discountPrice: '', targetGoal: '', experienceLevel: '',
        idealTime: '', trainingType: '', imageUrl: '', videoPreviewUrl: '', accessCode: '', 
        resultsCount: '', longDescription: '', equipmentNeeded: '', sessions: []
    };
    
    const initialCoaching = {
        title: '', subtitle: '', price: '', features: '', tier: ''
    };

    const [digitalForm, setDigitalForm] = useState(initialDigital);
    const [coachingForm, setCoachingForm] = useState(initialCoaching);

    const getAuthHeaders = () => {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        };
    };

    const fetchAllData = () => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/digital-programs`)
            .then(res => res.json())
            .then(data => setDigitalPrograms(Array.isArray(data) ? data : []));
            
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/coaching`)
            .then(res => res.json())
            .then(data => setCoachingPackages(Array.isArray(data) ? data : []));

        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/exercises`, { headers: getAuthHeaders() })
            .then(res => res.json())
            .then(data => setGlobalExercises(Array.isArray(data) ? data : []));
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // Tab Handlers
    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
        setIsEditing(false);
        setEditingId(null);
        setDigitalForm(initialDigital);
        setCoachingForm(initialCoaching);
    };

    const handleDigitalChange = (e) => setDigitalForm({...digitalForm, [e.target.name]: e.target.value});
    const handleCoachingChange = (e) => setCoachingForm({...coachingForm, [e.target.name]: e.target.value});

    const generateCode = (e) => {
        e.preventDefault();
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = 'ALF-';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setDigitalForm({ ...digitalForm, accessCode: result });
    };

    // Workout Architect Logic (Session & Exercise 3-Tier Handlers)
    const addSession = () => {
        setDigitalForm({
            ...digitalForm,
            sessions: [...digitalForm.sessions, { dayName: '', weekBlock: 'Weeks 1-4', exercises: [] }]
        });
    };

    const removeSession = (index) => {
        if(!window.confirm("Delete this entire session block?")) return;
        const newSessions = [...digitalForm.sessions];
        newSessions.splice(index, 1);
        setDigitalForm({ ...digitalForm, sessions: newSessions });
    };

    const cloneSession = (index) => {
        const cloned = JSON.parse(JSON.stringify(digitalForm.sessions[index]));
        cloned.weekBlock = cloned.weekBlock + " (Copy)";
        const newSessions = [...digitalForm.sessions, cloned];
        setDigitalForm({ ...digitalForm, sessions: newSessions });
    };

    const handleSessionChange = (index, field, value) => {
        const newSessions = [...digitalForm.sessions];
        newSessions[index][field] = value;
        setDigitalForm({ ...digitalForm, sessions: newSessions });
    };

    const addExerciseToSession = (sIndex) => {
        const newSessions = [...digitalForm.sessions];
        newSessions[sIndex].exercises.push({
            exerciseId: '', sets: '', reps: '', tempo: '', rir: '', rest: '', notes: ''
        });
        setDigitalForm({ ...digitalForm, sessions: newSessions });
    };

    const removeExercise = (sIndex, eIndex) => {
        const newSessions = [...digitalForm.sessions];
        newSessions[sIndex].exercises.splice(eIndex, 1);
        setDigitalForm({ ...digitalForm, sessions: newSessions });
    };

    const moveExercise = (sIndex, eIndex, direction) => {
        const newSessions = [...digitalForm.sessions];
        const exercises = newSessions[sIndex].exercises;
        
        if (direction === 'up' && eIndex > 0) {
            [exercises[eIndex - 1], exercises[eIndex]] = [exercises[eIndex], exercises[eIndex - 1]];
        } else if (direction === 'down' && eIndex < exercises.length - 1) {
            [exercises[eIndex + 1], exercises[eIndex]] = [exercises[eIndex], exercises[eIndex + 1]];
        }
        
        setDigitalForm({ ...digitalForm, sessions: newSessions });
    };

    const handleExerciseChange = (sIndex, eIndex, field, value) => {
        const newSessions = [...digitalForm.sessions];
        newSessions[sIndex].exercises[eIndex][field] = value;
        setDigitalForm({ ...digitalForm, sessions: newSessions });
    };

    // Submitter
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const isDigital = activeTab === 'digital';
        const baseUrl = isDigital ? `${import.meta.env.VITE_API_BASE_URL}/api/digital-programs` : `${import.meta.env.VITE_API_BASE_URL}/api/coaching`;
        const url = isEditing ? `${baseUrl}/${editingId}` : baseUrl;
        const method = isEditing ? 'PUT' : 'POST';

        let payload = isDigital ? { ...digitalForm } : { ...coachingForm };
        
        if (isDigital) {
            payload.price = Number(payload.price);
            payload.discountPrice = payload.discountPrice ? Number(payload.discountPrice) : payload.price;
            payload.resultsCount = payload.resultsCount ? Number(payload.resultsCount) : 0;
            
            // Clean unselected exercises from mapping
            payload.sessions = payload.sessions.map(s => ({
                ...s,
                exercises: s.exercises.filter(ex => ex.exerciseId && ex.exerciseId.trim() !== '')
            }));
        }

        if (!isDigital && typeof payload.features === 'string') {
            payload.features = payload.features.split(',').map(f => f.trim());
        }

        try {
            const res = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(payload) });
            if (res.ok) {
                isDigital ? setDigitalForm(initialDigital) : setCoachingForm(initialCoaching);
                setIsEditing(false);
                setEditingId(null);
                fetchAllData();
            } else {
                alert("Failed to save Protocol. Ensure all required fields are correctly formatted.");
            }
        } catch (err) {
            console.error("Submission Error:", err);
        }
    };

    const handleEdit = (item, type) => {
        setIsEditing(true);
        setEditingId(item._id);
        if (type === 'digital') {
            setDigitalForm({ 
                ...item,
                sessions: item.sessions || []
            });
        } else {
            setCoachingForm({ ...item, features: item.features.join(', ') });
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id, type) => {
        if(window.confirm("Permanently delete this entire model element?")) {
            const baseUrl = type === 'digital' ? `${import.meta.env.VITE_API_BASE_URL}/api/digital-programs` : `${import.meta.env.VITE_API_BASE_URL}/api/coaching`;
            try {
                const res = await fetch(`${baseUrl}/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
                if(res.ok) fetchAllData();
            } catch(e) { console.error(e); }
        }
    };

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <h1 className={styles.header}>Protocol_Manager</h1>
                
                <div className={styles.tabContainer}>
                    <button type="button" className={`${styles.tabBtn} ${activeTab === 'digital' ? styles.activeTab : ''}`} onClick={() => handleTabSwitch('digital')}>
                        DIGITAL STOREFRONT
                    </button>
                    <button type="button" className={`${styles.tabBtn} ${activeTab === 'coaching' ? styles.activeTab : ''}`} onClick={() => handleTabSwitch('coaching')}>
                        PERSONAL COACHING
                    </button>
                </div>

                <form className={styles.formGrid} onSubmit={handleSubmit}>
                    {activeTab === 'digital' ? (
                        <>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Protocol Title</label>
                                <input name="title" className={styles.input} value={digitalForm.title} onChange={handleDigitalChange} required placeholder="e.g. The Alpha Mass Program" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Short Tagline</label>
                                <input name="shortTagline" className={styles.input} value={digitalForm.shortTagline} onChange={handleDigitalChange} placeholder="e.g. Build dense muscle mass in 90 days." />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Standard Price (Rs.)</label>
                                <input name="price" type="number" className={styles.input} value={digitalForm.price} onChange={handleDigitalChange} required placeholder="5000" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Discounted Price (Rs.)</label>
                                <input name="discountPrice" type="number" className={styles.input} value={digitalForm.discountPrice} onChange={handleDigitalChange} placeholder="2500" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Results Tracker Count</label>
                                <input name="resultsCount" type="number" className={styles.input} value={digitalForm.resultsCount} onChange={handleDigitalChange} placeholder="e.g. 1500" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Primary Goal (Quiz Map)</label>
                                <select name="targetGoal" className={styles.select} value={digitalForm.targetGoal} onChange={handleDigitalChange} required>
                                    <option value="">Select Target Objective</option>
                                    <option value="Muscle">Muscle</option>
                                    <option value="Strength">Strength</option>
                                    <option value="Fat Loss">Fat Loss</option>
                                    <option value="Combination">Combination</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Session Time (Quiz Map)</label>
                                <select name="idealTime" className={styles.select} value={digitalForm.idealTime} onChange={handleDigitalChange} required>
                                    <option value="">Select Duration</option>
                                    <option value="Less than 60 min">Less than 60 min</option>
                                    <option value="60-90 min">60-90 min</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Experience Level</label>
                                <select name="experienceLevel" className={styles.select} value={digitalForm.experienceLevel} onChange={handleDigitalChange} required>
                                    <option value="">Select Level</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Training Style</label>
                                <input name="trainingType" className={styles.input} value={digitalForm.trainingType} onChange={handleDigitalChange} required placeholder="e.g. Powerbuilding" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Cover Image URL</label>
                                <input name="imageUrl" className={styles.input} value={digitalForm.imageUrl} onChange={handleDigitalChange} required placeholder="/r1.jpg" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Video Embed URL</label>
                                <input name="videoPreviewUrl" className={styles.input} value={digitalForm.videoPreviewUrl} onChange={handleDigitalChange} placeholder="e.g. https://youtube.com/embed/..." />
                            </div>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.label}>Overview / Long Description</label>
                                <textarea name="longDescription" className={styles.input} style={{height: '100px'}} value={digitalForm.longDescription} onChange={handleDigitalChange} placeholder="Detailed protocol breakdown..." />
                            </div>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.label}>Equipment Needed</label>
                                <input name="equipmentNeeded" className={styles.input} value={digitalForm.equipmentNeeded} onChange={handleDigitalChange} placeholder="e.g. Full Commercial Gym Setup" />
                            </div>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.label}>Security Access Code (OTP)</label>
                                <div className={styles.otpGroup}>
                                    <input name="accessCode" className={styles.input} value={digitalForm.accessCode} onChange={handleDigitalChange} required placeholder="ALF-XXXXXX" />
                                    <button type="button" className={styles.otpBtn} onClick={generateCode}>GENERATE CODE</button>
                                </div>
                            </div>

                            {/* PROGRAM WORKOUT BUILDER */}
                            <div className={styles.builderSection}>
                                <div className={styles.builderHeader}>
                                    <h2>PROGRAM WORKOUT BUILDER</h2>
                                    <button type="button" className={styles.addBtn} onClick={addSession}>+ ADD DAY</button>
                                </div>

                                {digitalForm.sessions.map((session, sIdx) => (
                                    <div key={sIdx} className={styles.sessionBox}>
                                        <div className={styles.sessionHeader}>
                                            <div style={{display: 'flex', gap: '15px', flex: 1}}>
                                                <input 
                                                    className={styles.input} 
                                                    placeholder="Day Name (e.g. Day 1: Upper Body)" 
                                                    value={session.dayName} 
                                                    onChange={(e) => handleSessionChange(sIdx, 'dayName', e.target.value)}
                                                    required
                                                />
                                                <input 
                                                    className={styles.input} 
                                                    placeholder="Week Block (e.g. Weeks 1-4)" 
                                                    value={session.weekBlock} 
                                                    onChange={(e) => handleSessionChange(sIdx, 'weekBlock', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                                                <button type="button" className={styles.cloneBtn} onClick={() => cloneSession(sIdx)}>CLONE</button>
                                                <button type="button" className={`${styles.actionBtn} ${styles.deleteBtn}`} style={{margin: 0}} onClick={() => removeSession(sIdx)}>DEL</button>
                                            </div>
                                        </div>

                                        <div className={styles.exercisesList}>
                                            {session.exercises.map((ex, eIdx) => {
                                                const selectedExercise = globalExercises.find(g => g._id === ex.exerciseId);
                                                return (
                                                    <div key={eIdx} className={styles.exerciseRow}>
                                                        <div className={styles.exTopRow}>
                                                            <div style={{display: 'flex', width: '100%', gap: '15px'}}>
                                                                <select 
                                                                    className={styles.select}
                                                                    style={{flex: 1}}
                                                                    value={ex.exerciseId}
                                                                    onChange={(e) => handleExerciseChange(sIdx, eIdx, 'exerciseId', e.target.value)}
                                                                >
                                                                    <option value="">-- Search & Assign Exercise --</option>
                                                                    {globalExercises.map(gEx => (
                                                                        <option key={gEx._id} value={gEx._id}>{gEx.name} ({gEx.muscleGroup})</option>
                                                                    ))}
                                                                </select>
                                                                {selectedExercise && selectedExercise.videoUrl && (
                                                                    <a href={selectedExercise.videoUrl} target="_blank" rel="noreferrer" className={styles.videoIcon}>▶️</a>
                                                                )}
                                                            </div>
                                                            <div className={styles.exControls}>
                                                                <button type="button" onClick={() => moveExercise(sIdx, eIdx, 'up')}>↑</button>
                                                                <button type="button" onClick={() => moveExercise(sIdx, eIdx, 'down')}>↓</button>
                                                                <button type="button" className={styles.removeExBtn} onClick={() => removeExercise(sIdx, eIdx)}>X</button>
                                                            </div>
                                                        </div>

                                                        <div className={styles.exParamsGrid}>
                                                            <input className={styles.inputSmall} placeholder="Sets x Reps" value={ex.sets} onChange={(e) => handleExerciseChange(sIdx, eIdx, 'sets', e.target.value)} />
                                                            <input className={styles.inputSmall} placeholder="Rest (Secs)" value={ex.rest} onChange={(e) => handleExerciseChange(sIdx, eIdx, 'rest', e.target.value)} />
                                                            <input className={styles.inputSmall} placeholder="Tempo" value={ex.tempo} onChange={(e) => handleExerciseChange(sIdx, eIdx, 'tempo', e.target.value)} />
                                                            <input className={styles.inputSmall} placeholder="RIR / RPE" value={ex.rir} onChange={(e) => handleExerciseChange(sIdx, eIdx, 'rir', e.target.value)} />
                                                            <input className={styles.inputSmall} placeholder="Notes / Cues" style={{gridColumn: '1 / -1', textAlign: 'left'}} value={ex.notes} onChange={(e) => handleExerciseChange(sIdx, eIdx, 'notes', e.target.value)} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <button type="button" className={styles.addExBtn} onClick={() => addExerciseToSession(sIdx)}>+ APPEND EXERCISE TIER</button>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Package Title</label>
                                <input name="title" className={styles.input} value={coachingForm.title} onChange={handleCoachingChange} required placeholder="e.g. Protocol 01" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Subtitle / Tagline</label>
                                <input name="subtitle" className={styles.input} value={coachingForm.subtitle} onChange={handleCoachingChange} placeholder="e.g. The Gold Standard" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Price (Rs.)</label>
                                <input name="price" type="number" className={styles.input} value={coachingForm.price} onChange={handleCoachingChange} required placeholder="5000" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Tier Indicator</label>
                                <input name="tier" className={styles.input} value={coachingForm.tier} onChange={handleCoachingChange} required placeholder="e.g. Tier 1" />
                            </div>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.label}>Features (Comma Separated)</label>
                                <textarea name="features" className={styles.input} style={{height: '100px'}} value={coachingForm.features} onChange={handleCoachingChange} required placeholder="Custom Diet, Weekly Check-ins, Macro adjustments" />
                            </div>
                        </>
                    )}

                    <button type="submit" className={styles.submitBtn}>
                        {isEditing ? 'COMMIT OVERWRITE' : 'DEPLOY PROTOCOL'}
                    </button>
                    {isEditing && (
                        <button type="button" className={styles.cancelBtn} onClick={() => {
                            setIsEditing(false);
                            setEditingId(null);
                            activeTab === 'digital' ? setDigitalForm(initialDigital) : setCoachingForm(initialCoaching);
                        }}>
                            ABORT OVERWRITE
                        </button>
                    )}
                </form>

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Title</th>
                                <th className={styles.th}>{activeTab === 'digital' ? 'Goal Map' : 'Tier'}</th>
                                <th className={styles.th}>Price</th>
                                <th className={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(activeTab === 'digital' ? digitalPrograms : coachingPackages).map(item => (
                                <tr key={item._id}>
                                    <td className={styles.td} style={{fontWeight: 900, color: '#fff'}}>{item.title}</td>
                                    <td className={styles.td} style={{ color: '#666' }}>{activeTab === 'digital' ? item.targetGoal : item.tier}</td>
                                    <td className={styles.td} style={{ color: '#ff5540' }}>Rs.{item.price}</td>
                                    <td className={styles.td}>
                                        <button type="button" className={styles.actionBtn} onClick={() => handleEdit(item, activeTab)}>Edit</button>
                                        <button type="button" className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(item._id, activeTab)}>Del</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default AdminProgramManager;
