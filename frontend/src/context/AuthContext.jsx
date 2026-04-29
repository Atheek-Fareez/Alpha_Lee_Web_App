import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(null);
    const [userId, setUserId] = useState(null);

    const checkAuth = () => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            setRole(localStorage.getItem('role'));
            setUserId(localStorage.getItem('userId'));
        } else {
            setIsLoggedIn(false);
            setRole(null);
            setUserId(null);
        }
    };

    useEffect(() => {
        checkAuth();
        
        // Listen for standard storage events from identical tabs
        window.addEventListener('storage', checkAuth);
        
        // Polling interval wrapper to catch local JS mutations safely without massive App rewrites
        const interval = setInterval(checkAuth, 1000);

        return () => {
            window.removeEventListener('storage', checkAuth);
            clearInterval(interval);
        };
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        setRole(null);
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, role, userId, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
