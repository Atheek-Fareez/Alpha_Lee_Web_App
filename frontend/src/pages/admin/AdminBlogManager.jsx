import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar';
import Modal from '../../Components/Modal';
import styles from './AdminBlogManager.module.css';

const AdminBlogManager = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);

    // Alpha Red Modal logic
    const [modal, setModal] = useState({ isOpen: false, id: null, title: '' });

    const fetchBlogs = () => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blogs`)
            .then(res => res.json())
            .then(data => setBlogs(data))
            .catch(err => console.error("Failed to fetch blog matrix:", err));
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDeleteClick = (id, title) => {
        setModal({ isOpen: true, id, title });
    };

    const confirmDeletion = async () => {
        if (!modal.id) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blogs/${modal.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setModal({ isOpen: false, id: null, title: '' });
                fetchBlogs();
            } else {
                alert("Decryption termination failed.");
            }
        } catch(e) {
            console.error(e);
        }
    };

    return (
        <div className={styles.container}>
            <Navbar />
            
            <Modal 
                isOpen={modal.isOpen}
                title="CONFIRM DELETION"
                message={`Are you absolutely sure you want to permanently delete "${modal.title}"? This cannot be undone.`}
                onConfirm={confirmDeletion}
                onCancel={() => setModal({ ...modal, isOpen: false })}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 className={styles.title} style={{ marginBottom: 0 }}>BLOG_ARCHIVES</h1>
                <button 
                    className={styles.addBlockBtn} 
                    style={{ padding: '15px 30px' }}
                    onClick={() => navigate('/alpha-admin/blogs/new')}
                >
                    + CREATE NEW ARTICLE
                </button>
            </div>

            <div className={styles.formGrid}>
                {blogs.length === 0 ? (
                    <div style={{color: '#666', padding: '30px'}}>NO PUBLICATIONS FOUND.</div>
                ) : (
                    blogs.map(blog => (
                        <div key={blog._id} className={styles.cmsBuilder} style={{flex: '1 1 100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                            <div>
                                <h2 style={{fontFamily: 'Space Grotesk', margin: '0 0 5px 0', textTransform: 'uppercase'}}>{blog.title}</h2>
                                <div style={{color: '#888', fontSize: '0.8rem', fontWeight: 900}}>
                                    {blog.category} | {new Date(blog.publishedAt).toLocaleDateString()}
                                </div>
                            </div>
                            <div style={{display: 'flex', gap: '15px'}}>
                                <button 
                                    className={styles.submitBtn} 
                                    style={{ margin: 0, padding: '10px 20px', background: '#2a2a2a', color: '#fff' }}
                                    onClick={() => navigate(`/alpha-admin/blogs/edit/${blog.slug}`)}
                                >
                                    EDIT
                                </button>
                                <button 
                                    className={styles.submitBtn}
                                    style={{ margin: 0, padding: '10px 20px', background: '#111', color: '#ff5540', border: '1px solid #ff5540' }}
                                    onClick={() => handleDeleteClick(blog._id, blog.title)}
                                >
                                    DELETE
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminBlogManager;
