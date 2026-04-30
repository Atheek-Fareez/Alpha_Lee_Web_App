import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar';
import styles from './AdminBlogManager.module.css'; // Reuse existing CSS

const EditBlog = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const isEditing = !!slug;

    const [blogId, setBlogId] = useState(null);
    const [formData, setFormData] = useState({
        title: '', slug: '', category: 'Training', author: 'Alpha Protocol', thumbnailImage: ''
    });
    
    const [contentBlocks, setContentBlocks] = useState([
        { type: 'paragraph', text: '' }
    ]);
    const [isPublishing, setIsPublishing] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(isEditing);

    useEffect(() => {
        if (isEditing) {
            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blogs/${slug}`)
                .then(res => {
                    if(!res.ok) throw new Error("Article Offline");
                    return res.json();
                })
                .then(data => {
                    setBlogId(data._id);
                    setFormData({
                        title: data.title,
                        slug: data.slug,
                        category: data.category,
                        author: data.author,
                        thumbnailImage: data.thumbnailImage || ''
                    });
                    
                    // Recover active elements directly binding mapping formats
                    if (data.content && data.content.length > 0) {
                        setContentBlocks(data.content);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Editor Boot Error:", err);
                    navigate('/alpha-admin/blogs');
                });
        }
    }, [slug, isEditing, navigate]);

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value });

    const generateSlug = () => {
        const generated = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        setFormData({...formData, slug: generated});
    };

    const addBlock = () => {
        setContentBlocks([...contentBlocks, { type: 'paragraph', text: '' }]);
    };
    const handleRemoveBlock = (index) => {
        const newBlocks = [...contentBlocks];
        newBlocks.splice(index, 1);
        setContentBlocks(newBlocks);
    };
    const handleBlockChange = (index, field, value) => {
        const newBlocks = [...contentBlocks];
        newBlocks[index][field] = value;
        setContentBlocks(newBlocks);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title || formData.title.trim() === '') newErrors.title = 'Title is required';
        
        const validBlocks = contentBlocks.filter(b => b.text.trim() !== '');
        if (validBlocks.length === 0) newErrors.content = 'Content is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const saveArticle = async () => {
        if (!validateForm()) return;
        setIsPublishing(true);
        try {
            const token = localStorage.getItem('token');
            const validBlocks = contentBlocks.filter(b => b.text.trim() !== '');
            const payload = { ...formData, content: validBlocks };

            const endpoint = isEditing ? `${import.meta.env.VITE_API_BASE_URL}/api/blogs/${blogId}` : `${import.meta.env.VITE_API_BASE_URL}/api/blogs`;
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('Blog published successfully');
                navigate('/blog');
            } else {
                const err = await res.json();
                alert(`Decryption failed: ${err.message}`);
            }
        } catch(e) {
            console.error(e);
            alert("Alpha Servers Offline");
        } finally {
            setIsPublishing(false);
        }
    };

    if (loading) return <div style={{color:'#ff5540', padding: '100px', textAlign:'center', fontFamily:'Space Grotesk', fontSize:'2rem'}}>FETCHING DATA...</div>;

    return (
        <div className={styles.container}>
            <Navbar />
            <h1 className={styles.title}>{isEditing ? 'EDIT_PROTOCOL' : 'PUBLISHING_CMS'}</h1>

            <div className={styles.formGrid}>
                <div className={styles.inputGroup} style={{flex: '1 1 100%'}}>
                    <label className={styles.label}>Article Title</label>
                    <input name="title" value={formData.title} onChange={handleChange} className={styles.input} placeholder="E.g. The Overload Principle" />
                    {errors.title && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '5px'}}>{errors.title}</div>}
                </div>
                
                <div className={styles.inputGroup} style={{flex: '1 1 calc(50% - 20px)'}}>
                    <label className={styles.label}>URL Slug (Unique)</label>
                    <div style={{display: 'flex', gap: '10px'}}>
                        <input name="slug" value={formData.slug} onChange={handleChange} className={styles.input} placeholder="the-overload-principle" style={{flex: 1}} />
                        <button className={styles.addBlockBtn} onClick={generateSlug}>GENERATE</button>
                    </div>
                </div>

                <div className={styles.inputGroup} style={{flex: '1 1 calc(25% - 20px)'}}>
                    <label className={styles.label}>Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className={styles.select}>
                        <option value="Training">Training</option>
                        <option value="Nutrition">Nutrition</option>
                        <option value="Supplements">Supplements</option>
                    </select>
                </div>
                <div className={styles.inputGroup} style={{flex: '1 1 calc(25% - 20px)'}}>
                    <label className={styles.label}>Author</label>
                    <input name="author" value={formData.author} onChange={handleChange} className={styles.input} />
                </div>
                <div className={styles.inputGroup} style={{flex: '1 1 100%'}}>
                    <label className={styles.label}>Cover Image URL</label>
                    <input name="thumbnailImage" value={formData.thumbnailImage} onChange={handleChange} className={styles.input} placeholder="https://..." />
                </div>
            </div>

            <div className={styles.cmsBuilder}>
                <div className={styles.builderHeader}>
                    <div className={styles.builderTitle}>MODULAR CONTENT ARRAY</div>
                    <button className={styles.addBlockBtn} onClick={addBlock}>+ ADD SECTION</button>
                </div>
                {errors.content && <div style={{color: 'red', fontSize: '0.8rem', marginBottom: '15px'}}>{errors.content}</div>}

                {contentBlocks.map((block, idx) => (
                    <div key={idx} className={styles.blockItem}>
                        <div className={styles.blockHeader}>
                            <select 
                                className={styles.blockTypeSelect} 
                                value={block.type} 
                                onChange={(e) => handleBlockChange(idx, 'type', e.target.value)}
                            >
                                <option value="heading">Heading</option>
                                <option value="paragraph">Paragraph</option>
                                <option value="warning">Warning Block</option>
                                <option value="list">Bulleted List</option>
                                <option value="video">Video Embed</option>
                            </select>
                            <button className={styles.removeBtn} onClick={() => handleRemoveBlock(idx)}>X REMOVE</button>
                        </div>

                        {block.type === 'list' && (
                            <div style={{fontSize: '10px', color: '#ff5540'}}>* Each new line will be parsed as a separate bullet point.</div>
                        )}

                        <textarea 
                            className={styles.textarea}
                            placeholder={block.type === 'video' ? 'Paste YouTube URL here...' : 'Enter precise block text...'}
                            value={block.text}
                            onChange={(e) => handleBlockChange(idx, 'text', e.target.value)}
                        />
                    </div>
                ))}
            </div>

            <button className={styles.submitBtn} onClick={saveArticle} disabled={isPublishing}>
                {isPublishing ? 'PROCESSING...' : (isEditing ? 'COMMIT UPDATES' : 'EXECUTE PUBLISH ROUTINE')}
            </button>
        </div>
    );
};

export default EditBlog;
