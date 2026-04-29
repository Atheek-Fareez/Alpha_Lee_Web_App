import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ConsultationChatbot.module.css';

const ConsultationChatbot = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const fetchHistory = async () => {
        if (!isLoggedIn) {
            setMessages([{ role: 'assistant', content: "Hello! I am Alpha. Please LOG IN to access my elite consultation protocols." }]);
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/api/chat', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.messages && data.messages.length > 0) {
                    setMessages(data.messages);
                } else {
                    setMessages([{ role: 'assistant', content: "Hello! I am Alpha, your elite fitness consultation AI. How can I help you optimize your training today?" }]);
                }
            }
        } catch (e) {
            console.error("Chat history fetch failed", e);
        }
    };

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            fetchHistory();
        }
    }, [isOpen, isLoggedIn]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        if (!isLoggedIn) {
            setMessages(prev => [...prev, { role: 'user', content: input }, { role: 'assistant', content: "SYSTEM LOG: You must be logged in to consult with Alpha AI." }]);
            setInput('');
            return;
        }

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: userMsg })
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages); // Update with full history from server
            } else {
                const errData = await res.json();
                setMessages(prev => [...prev, { role: 'assistant', content: `SYSTEM ERROR: ${errData.message || 'Connection severed.'}` }]);
            }
        } catch (e) {
            setMessages(prev => [...prev, { role: 'assistant', content: "SYSTEM ERROR: Offline." }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isLoggedIn) return null;

    return (
        <div className={styles.chatbotWrapper}>
            {isOpen && (
                <div className={styles.chatWindow}>
                    <div className={styles.chatHeader}>
                        <h3 className={styles.headerTitle}>ALPHA <span className={styles.headerAccent}>AI</span></h3>
                        <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>&times;</button>
                    </div>
                    
                    <div className={styles.chatBody}>
                        {messages.filter(m => m.role !== 'system').map((msg, idx) => {
                            const isRedirect = msg.content.includes('[REDIRECT_AICOACH]');
                            const displayContent = msg.content.replace('[REDIRECT_AICOACH]', '').trim();
                            
                            return (
                                <div key={idx} className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.aiMessage}`}>
                                    {displayContent}
                                    {isRedirect && (
                                        <div style={{ marginTop: '15px' }}>
                                            <button 
                                                onClick={() => { setIsOpen(false); navigate('/ai-coach'); }}
                                                style={{
                                                    backgroundColor: '#ff5540',
                                                    color: '#000',
                                                    border: 'none',
                                                    padding: '8px 15px',
                                                    fontWeight: '900',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontFamily: "'Space Grotesk', sans-serif",
                                                    textTransform: 'uppercase',
                                                    fontSize: '0.8rem',
                                                    width: '100%',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ff705c'}
                                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ff5540'}
                                            >
                                                <span>Launch AI Meal Planner</span>
                                                <span>→</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {isLoading && <div className={styles.loadingIndicator}>Alpha is computing...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className={styles.chatInputArea} onSubmit={handleSend}>
                        <input 
                            type="text" 
                            className={styles.chatInput}
                            placeholder="Ask about protocols, bookings..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <button type="submit" className={styles.sendBtn} disabled={isLoading || !input.trim()}>
                            &uarr;
                        </button>
                    </form>
                </div>
            )}

            {!isOpen && (
                <button className={styles.floatingBtn} onClick={() => setIsOpen(true)} title="Alpha AI Consultation">
                    ⚡
                </button>
            )}
        </div>
    );
};

export default ConsultationChatbot;
