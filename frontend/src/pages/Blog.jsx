import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import styles from './Blog.module.css';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [activeFilter, setActiveFilter] = useState('All');
    
    useEffect(() => {
        fetch('http://localhost:3000/api/blogs')
            .then(res => res.json())
            .then(data => setBlogs(data))
            .catch(err => console.error("CMS Connection Offline:", err));
    }, []);

    const categories = ['All', 'Nutrition', 'Training', 'Supplements'];
    
    const filteredBlogs = activeFilter === 'All' 
        ? blogs 
        : blogs.filter(b => b.category === activeFilter);

    return (
        <div className={styles.container}>
            <Navbar />
            
            <header className={styles.header}>
                <h1 className={styles.title}>THE ALPHA MAGAZINE</h1>
                <p className={styles.subtitle}>HIGH-PERFORMANCE DATA & PROTOCOLS</p>
            </header>

            <div className={styles.filterBar}>
                {categories.map(cat => (
                    <button 
                        key={cat} 
                        className={`${styles.filterBtn} ${activeFilter === cat ? styles.activeFilter : ''}`}
                        onClick={() => setActiveFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className={styles.grid}>
                {filteredBlogs.map(blog => (
                    <Link to={`/blog/${blog.slug}`} key={blog._id} className={styles.card}>
                        <div className={styles.imageBox}>
                            {blog.thumbnailImage ? (
                                <img src={blog.thumbnailImage} alt={blog.title} className={styles.image} />
                            ) : (
                                <div className={styles.imagePlaceholder}>ALPHA_DATA</div>
                            )}
                            <div className={styles.categoryBadge}>{blog.category}</div>
                        </div>
                        <div className={styles.cardBody}>
                            <h2 className={styles.cardTitle}>{blog.title}</h2>
                            <div className={styles.cardMeta}>
                                <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                                <span style={{color: '#ff5540'}}>///</span>
                                <span>By {blog.author}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            {filteredBlogs.length === 0 && (
                <div style={{textAlign: 'center', color: '#666', padding: '50px'}}>NO DIRECTIVES FOUND IN THIS CATEGORY.</div>
            )}
        </div>
    );
};

export default Blog;
