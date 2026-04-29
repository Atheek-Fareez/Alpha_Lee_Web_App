import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AdminDashboard.module.css'; // Reusing some admin styles

const AdminIntro = () => {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#0a0a0a',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            textAlign: 'center',
            fontFamily: 'Space Grotesk, sans-serif'
        }}>
            <h1 style={{
                fontSize: '4rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                marginBottom: '20px',
                letterSpacing: '-0.05em'
            }}>
                WELCOME, <span style={{ color: '#ff5540' }}>COMMANDER.</span>
            </h1>
            <p style={{
                fontSize: '1.2rem',
                color: '#aaa',
                maxWidth: '600px',
                marginBottom: '40px',
                lineHeight: 1.6
            }}>
                The Alpha Lee Fitness ecosystem is under your control. Access the command center to manage programs, users, and protocols.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
                <Link to="/alpha-admin" style={{
                    padding: '15px 30px',
                    backgroundColor: '#ff5540',
                    color: '#000',
                    textDecoration: 'none',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    fontSize: '1rem',
                    letterSpacing: '0.1em',
                    transition: 'all 0.3s'
                }}>
                    ENTER COMMAND CENTER
                </Link>
                <Link to="/" style={{
                    padding: '15px 30px',
                    border: '1px solid #ff5540',
                    color: '#ff5540',
                    textDecoration: 'none',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    fontSize: '1rem',
                    letterSpacing: '0.1em',
                    transition: 'all 0.3s'
                }}>
                    VIEW PUBLIC SITE
                </Link>
            </div>
        </div>
    );
};

export default AdminIntro;
