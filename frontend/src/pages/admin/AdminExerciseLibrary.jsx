import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminExerciseLibrary.module.css';
import Navbar from '../../Components/Navbar';

const AdminExerciseLibrary = () => {
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGroup, setFilterGroup] = useState('All');

    const [form, setForm] = useState({
        name: '', videoUrl: '', muscleGroup: 'Chest', equipment: 'Barbell'
    });

    const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];
    const equipmentTypes = ['Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight', 'Kettlebell', 'Other'];

    const token = localStorage.getItem('token');

    const fetchExercises = async () => {
        try {
            const res = await fetch('/api/exercises', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setExercises(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchExercises();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/exercises', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                setForm({ name: '', videoUrl: '', muscleGroup: 'Chest', equipment: 'Barbell' });
                fetchExercises();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this exercise from the global library?")) return;
        try {
            await fetch(`/api/exercises/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchExercises();
        } catch (err) {
            console.error(err);
        }
    };

    // Filter Logic
    const filteredExercises = exercises.filter(ex => {
        const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGroup = filterGroup === 'All' || ex.muscleGroup === filterGroup;
        return matchesSearch && matchesGroup;
    });

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleBox}>
                        <h1>Exercise Repository</h1>
                        <p>GLOBAL KINEMATIC DATABASE ({exercises.length} LOGGED)</p>
                    </div>
                    <button className={styles.backBtn} onClick={() => navigate('/alpha-admin')}>
                        RETURN TO COMMAND CENTER
                    </button>
                </div>

                {/* Entry Form */}
                <form onSubmit={handleCreate} className={styles.formSection}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Movement Name</label>
                        <input name="name" className={styles.input} value={form.name} onChange={handleChange} required placeholder="e.g. Incline DB Press" />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Muscle Group</label>
                        <select name="muscleGroup" className={styles.select} value={form.muscleGroup} onChange={handleChange}>
                            {muscleGroups.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Equipment Target</label>
                        <select name="equipment" className={styles.select} value={form.equipment} onChange={handleChange}>
                            {equipmentTypes.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Video Embed / Link</label>
                        <input name="videoUrl" className={styles.input} value={form.videoUrl} onChange={handleChange} placeholder="YouTube URL" />
                    </div>
                    <div className={styles.inputGroup}>
                        <button type="submit" className={styles.submitBtn}>ADD TO DATABASE</button>
                    </div>
                </form>

                {/* Controls */}
                <div className={styles.controlBar}>
                    <input 
                        className={styles.searchBar} 
                        placeholder="SEARCH LOCAL REPOSITORY..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select 
                        className={styles.filterSelect} 
                        value={filterGroup} 
                        onChange={(e) => setFilterGroup(e.target.value)}
                    >
                        <option value="All">ALL MUSCLE GROUPS</option>
                        {muscleGroups.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>

                {/* Dense Table */}
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Movement Name</th>
                                <th>Target Group</th>
                                <th>Equipment Vector</th>
                                <th>Media Log</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExercises.map(ex => (
                                <tr key={ex._id}>
                                    <td style={{fontWeight: 700, color: '#fff'}}>{ex.name}</td>
                                    <td>{ex.muscleGroup}</td>
                                    <td>{ex.equipment}</td>
                                    <td>
                                        {ex.videoUrl ? (
                                            <a href={ex.videoUrl} target="_blank" rel="noopener noreferrer" className={styles.previewLink}>
                                                ▶️ Verify Media
                                            </a>
                                        ) : (
                                            <span className={styles.noVideo}>UNTRACKED</span>
                                        )}
                                    </td>
                                    <td>
                                        <button className={styles.deleteBtn} onClick={() => handleDelete(ex._id)}>DELETE</button>
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

export default AdminExerciseLibrary;
