import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import styles from './AdminBlogManager.module.css';

const AdminPackageManager = () => {
    const [packages, setPackages] = useState([]);
    const [formData, setFormData] = useState({ title: '', priceLKR: '', description: '', type: 'In-Person' });
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});

    const fetchPackages = () => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/consultations/packages`)
            .then(res => res.json())
            .then(data => setPackages(data))
            .catch(err => console.error(err));
    };

    useEffect(() => { fetchPackages(); }, []);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
        if (errors[e.target.name]) {
            setErrors({...errors, [e.target.name]: null});
        }
    };

    const handleSave = async () => {
        const newErrors = {};

        // TC_02: Title Validation (Min 10)
        if (!formData.title || formData.title.length < 10) {
            newErrors.title = 'VALIDATION_FAILED: Title must be at least 10 characters';
        }
        
        // TC_14: Unique Check
        if (packages.some(pkg => pkg.title.toLowerCase() === formData.title.toLowerCase() && pkg._id !== editingId)) {
            newErrors.title = 'Error: Duplicate title not allowed';
        }

        // TC_04: Price Validation (Min 0)
        if (formData.priceLKR === '' || Number(formData.priceLKR) < 0) {
            newErrors.priceLKR = 'VALIDATION_FAILED: Price cannot be negative';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});

        try {
            const token = localStorage.getItem('token');
            const endpoint = editingId 
                ? `${import.meta.env.VITE_API_BASE_URL}/api/consultations/packages/${editingId}`
                : `${import.meta.env.VITE_API_BASE_URL}/api/consultations/packages`;
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({...formData, priceLKR: Number(formData.priceLKR) })
            });

            if (res.ok) {
                setFormData({ title: '', priceLKR: '', description: '', type: 'In-Person' });
                setEditingId(null);
                fetchPackages(); // TC_06: Refresh UI after save
            } else {
                alert("Decryption failed.");
            }
        } catch(e) { console.error(e); }
    };

    const handleEdit = (pkg) => {
        setEditingId(pkg._id);
        setFormData({ title: pkg.title, priceLKR: pkg.priceLKR, description: pkg.description, type: pkg.type });
        setErrors({});
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Terminate Package?")) return;
        const token = localStorage.getItem('token');
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/consultations/packages/${id}`, {
            method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchPackages(); // TC_07: Refresh UI after delete
    };

    return (
        <div className={styles.container}>
            <Navbar />
            <h1 className={styles.title}>PACKAGE_CMS</h1>

            <div className={styles.cmsBuilder} style={{marginBottom: '40px'}}>
                <div className={styles.formGrid}>
                    <div className={styles.inputGroup} style={{flex: '1 1 calc(50% - 20px)'}}>
                        <label className={styles.label}>Identifier (Title)</label>
                        <input name="title" value={formData.title} onChange={handleChange} className={styles.input} />
                        {errors.title && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '5px'}}>{errors.title}</div>}
                    </div>
                    <div className={styles.inputGroup} style={{flex: '1 1 calc(25% - 20px)'}}>
                        <label className={styles.label}>Price (LKR)</label>
                        <input name="priceLKR" type="number" value={formData.priceLKR} onChange={handleChange} className={styles.input} />
                        {errors.priceLKR && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '5px'}}>{errors.priceLKR}</div>}
                    </div>
                    <div className={styles.inputGroup} style={{flex: '1 1 calc(25% - 20px)'}}>
                        <label className={styles.label}>Access Type</label>
                        <select name="type" value={formData.type} onChange={handleChange} className={styles.select}>
                            <option value="In-Person">In-Person</option>
                            <option value="Video">Video</option>
                            <option value="Voice">Voice</option>
                            <option value="WhatsApp">WhatsApp</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup} style={{flex: '1 1 100%'}}>
                        <label className={styles.label}>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className={styles.textarea} style={{minHeight: '80px'}}/>
                    </div>
                </div>
                <button className={styles.submitBtn} onClick={handleSave} style={{marginTop: '20px'}}>
                    {editingId ? 'COMMIT OVERWRITE' : 'GENERATE PACKAGE'}
                </button>
                {editingId && <button onClick={() => {setEditingId(null); setFormData({title:'', priceLKR:'', description:'', type:'In-Person'})}} style={{marginTop:'10px', background:'transparent', color:'#ff5540', border:'none', cursor:'pointer', fontWeight:900, fontSize:'0.8rem'}}>CANCEL EDIT</button>}
            </div>

            <div className={styles.formGrid}>
                {packages.map(pkg => (
                    <div key={pkg._id} className={styles.cmsBuilder} style={{flex: '1 1 100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                        <div>
                            <h2 style={{fontFamily: 'Space Grotesk', margin: '0 0 5px 0'}}>{pkg.title} <span style={{fontSize: '1rem', color:'#ff5540'}}>({pkg.priceLKR} LKR)</span></h2>
                            <div style={{color: '#888', fontSize: '0.8rem', fontWeight: 900}}>{pkg.type}</div>
                        </div>
                        <div style={{display: 'flex', gap: '15px'}}>
                            <button onClick={() => handleEdit(pkg)} className={styles.submitBtn} style={{ margin: 0, padding: '10px 20px', background: '#2a2a2a', color: '#fff' }}>EDIT</button>
                            <button onClick={() => handleDelete(pkg._id)} className={styles.submitBtn} style={{ margin: 0, padding: '10px 20px', background: '#111', color: '#ff5540', border: '1px solid #ff5540' }}>DELETE</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPackageManager;
