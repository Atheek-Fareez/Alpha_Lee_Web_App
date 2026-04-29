import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import styles from './BlogPost.module.css';

const BlogPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:3000/api/blogs/${slug}`)
            .then(res => {
                if(!res.ok) throw new Error("Article Offline");
                return res.json();
            })
            .then(data => {
                setBlog(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                navigate('/blog');
            });
    }, [slug, navigate]);

    if (loading) return <div className={styles.loading}>DECRYPTING ARTICLE...</div>;

    const renderBlock = (block, idx) => {
        switch (block.type) {
            case 'heading':
                return <h2 key={idx} className={styles.heading}>{block.text}</h2>;
            case 'paragraph':
                return <p key={idx} className={styles.paragraph}>{block.text}</p>;
            case 'warning':
                return (
                    <div key={idx} className={styles.warningBlock}>
                        <div className={styles.warningHeader}>CRITICAL PROTOCOL WARNING</div>
                        <p>{block.text}</p>
                    </div>
                );
            case 'list':
                // Break \n into array if we use flat text inputs, or map over listItems if they exist
                const itemsList = block.listItems && block.listItems.length > 0 
                    ? block.listItems 
                    : block.text.split('\n').filter(t => t.trim());
                    
                return (
                    <ul key={idx} className={styles.list}>
                        {itemsList.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                );
            case 'video':
                const getEmbed = (url) => {
                    if(url.includes('v=')) return `https://www.youtube.com/embed/${url.split('v=')[1].split('&')[0]}`;
                    if(url.includes('youtu.be/')) return `https://www.youtube.com/embed/${url.split('youtu.be/')[1]}`;
                    return url;
                };
                return (
                    <div key={idx} className={styles.videoBox}>
                        <iframe 
                            src={getEmbed(block.text)} 
                            title="Video Header" 
                            allowFullScreen>
                        </iframe>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
            <Navbar />
            
            <div className={styles.splitLayout}>
                <article className={styles.article}>
                    {/* Header Section */}
                    <header className={styles.header}>
                        <div className={styles.categoryBadge}>{blog.category}</div>
                        <h1 className={styles.title}>{blog.title}</h1>
                        <div className={styles.meta}>
                            <span>By {blog.author}</span>
                            <span className={styles.slash}>///</span>
                            <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                        </div>
                    </header>

                    {/* Hero Image */}
                    {blog.thumbnailImage && (
                        <div className={styles.heroBox}>
                            <img src={blog.thumbnailImage} alt={blog.title} className={styles.heroImg} />
                        </div>
                    )}

                    {/* Modular Content Matrix */}
                    <section className={styles.contentBody}>
                        {blog.content.map((block, i) => renderBlock(block, i))}
                    </section>
                </article>

                <aside className={styles.sidebar}>
                    <div className={styles.sidebarWidget}>
                        <h3 className={styles.widgetTitle}>ALPHA CATEGORIES</h3>
                        <ul className={styles.widgetList}>
                            <li>Training Protocols <span style={{color: '#ff5540'}}>[+]</span></li>
                            <li>Advanced Nutrition <span style={{color: '#ff5540'}}>[+]</span></li>
                            <li>Supplement Science <span style={{color: '#ff5540'}}>[+]</span></li>
                        </ul>
                    </div>
                    
                    <div className={styles.sidebarWidget}>
                        <h3 className={styles.widgetTitle}>TRENDING NOW</h3>
                        <div className={styles.trendingItem}>
                            <div className={styles.trendNum}>1</div>
                            <div className={styles.trendText}>The Overload Principle: How to Force Adaptation</div>
                        </div>
                        <div className={styles.trendingItem}>
                            <div className={styles.trendNum}>2</div>
                            <div className={styles.trendText}>Why You Need To Stop Stretching Before Squats</div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default BlogPost;
