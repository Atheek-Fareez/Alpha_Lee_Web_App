import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { isLoggedIn, role, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const isAuthPage = location.pathname === '/';

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/');
    };

    const showLinks = isLoggedIn || !isAuthPage;

    return (
        <nav className={`${styles.navContainer} ${scrolled ? styles.navScrolled : ''}`}>
            <Link to={isLoggedIn ? (role === 'admin' ? '/admin-dashboard' : '/user-dashboard') : '/'} className={styles.logo}>
                ALPHA LEE <span className={styles.logoAccent}>FITNESS</span>
            </Link>

            {/* Desktop Links */}
            {showLinks && (
                <div className={styles.navLinks}>
                    <Link to="/programs" className={`${styles.link} ${location.pathname === '/programs' ? styles.activeLink : ''}`}>Training Programs</Link>
                    <Link to="/consultations" className={`${styles.link} ${location.pathname === '/consultations' ? styles.activeLink : ''}`}>Consultations</Link>
                    <a href="#results" className={styles.link}>Protocol</a>
                    <Link to="/quiz" className={`${styles.link} ${location.pathname === '/quiz' ? styles.activeLink : ''}`}>Quiz</Link>
                    <Link to="/process" className={`${styles.link} ${location.pathname === '/process' ? styles.activeLink : ''}`}>Process Details</Link>
                    <Link to="/ai-coach" className={`${styles.link} ${location.pathname === '/ai-coach' ? styles.activeLink : ''}`}>Alpha AI Coach</Link>
                    <a href="#challenges" className={styles.link}>Alpha Challengers</a>
                    <Link to="/blog" className={`${styles.link} ${location.pathname === '/blog' ? styles.activeLink : ''}`}>Fitness Blogs</Link>
                    <Link to="/about" className={`${styles.link} ${location.pathname === '/about' ? styles.activeLink : ''}`}>About Us</Link>
                    <Link to="/support" className={`${styles.link} ${location.pathname === '/support' ? styles.activeLink : ''}`}>Support</Link>
                    
                    {isLoggedIn ? (
                        <>
                            {role === 'admin' && (
                                <Link to="/admin-dashboard" className={`${styles.link} ${location.pathname.startsWith('/alpha-admin') || location.pathname === '/admin-dashboard' ? styles.activeLink : ''}`}>COMMAND_CENTER</Link>
                            )}
                            <button onClick={handleLogout} className={styles.navBtn}>LOGOUT</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={`${styles.lockerLink} ${location.pathname === '/login' ? styles.activeLink : ''}`}>MEMBER LOGIN</Link>
                            <Link to="/register" className={styles.navBtn}>REGISTER</Link>
                        </>
                    )}
                </div>
            )}

            {/* Mobile Hamburger Icon */}
            {showLinks && (
                <div className={styles.hamburger} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <span className={`${styles.line} ${isMenuOpen ? styles.open : ''}`}></span>
                    <span className={`${styles.line} ${isMenuOpen ? styles.open : ''}`}></span>
                    <span className={`${styles.line} ${isMenuOpen ? styles.open : ''}`}></span>
                </div>
            )}

            {/* Mobile Dropdown Menu */}
            {showLinks && (
                <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
                    <Link to="/programs" className={`${styles.mobileLink} ${location.pathname === '/programs' ? styles.activeLink : ''}`} onClick={() => setIsMenuOpen(false)}>Training Programs</Link>
                    <Link to="/consultations" className={`${styles.mobileLink} ${location.pathname === '/consultations' ? styles.activeLink : ''}`} onClick={() => setIsMenuOpen(false)}>Consultations</Link>
                    <a href="#results" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Protocol</a>
                    <Link to="/quiz" className={`${styles.mobileLink} ${location.pathname === '/quiz' ? styles.activeLink : ''}`} onClick={() => setIsMenuOpen(false)}>Quiz</Link>
                    <Link to="/process" className={`${styles.mobileLink} ${location.pathname === '/process' ? styles.activeLink : ''}`} onClick={() => setIsMenuOpen(false)}>Process Details</Link>
                    <Link to="/ai-coach" className={`${styles.mobileLink} ${location.pathname === '/ai-coach' ? styles.activeLink : ''}`} onClick={() => setIsMenuOpen(false)}>Alpha AI Coach</Link>
                    <a href="#challenges" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Alpha Challengers</a>
                    <Link to="/blog" className={`${styles.mobileLink} ${location.pathname === '/blog' ? styles.activeLink : ''}`} onClick={() => setIsMenuOpen(false)}>Fitness Blogs</Link>
                    <Link to="/about" className={`${styles.mobileLink} ${location.pathname === '/about' ? styles.activeLink : ''}`} onClick={() => setIsMenuOpen(false)}>About Us</Link>
                    <Link to="/support" className={`${styles.mobileLink} ${location.pathname === '/support' ? styles.activeLink : ''}`} onClick={() => setIsMenuOpen(false)}>Support</Link>
                    
                    <hr className={styles.menuDivider} />

                    {isLoggedIn ? (
                        <>
                            {role === 'admin' && (
                                <Link to="/admin-dashboard" className={`${styles.mobileLink} ${location.pathname.startsWith('/alpha-admin') || location.pathname === '/admin-dashboard' ? styles.activeLink : ''}`} onClick={() => setIsMenuOpen(false)}>COMMAND_CENTER</Link>
                            )}
                            <button onClick={handleLogout} className={styles.mobileNavBtn}>LOGOUT</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={`${styles.mobileLockerLink} ${location.pathname === '/login' ? styles.activeLink : ''}`} onClick={() => setIsMenuOpen(false)}>MEMBER LOGIN</Link>
                            <Link to="/register" className={styles.mobileNavBtn} onClick={() => setIsMenuOpen(false)}>REGISTER</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
