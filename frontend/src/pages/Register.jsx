import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserAuthModal from '../Components/UserAuthModal';

const Register = () => {
    const navigate = useNavigate();

    // The modal inherently handles the state and requests. 
    // We render it over a solid #0a0a0a background to act as a standalone page wrapper on the /register path
    return (
        <div style={{ minHeight: '100dvh', backgroundColor: '#0a0a0a' }}>
            <UserAuthModal 
                onClose={() => navigate(-1)} 
                onSuccess={() => navigate('/programs')} 
            />
        </div>
    );
};

export default Register;
