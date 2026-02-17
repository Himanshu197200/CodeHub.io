import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// This component handles post-login redirects for the "Host Event" flow
const PostLoginHandler = () => {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handlePostLogin = async () => {
            if (user) {
                const intent = localStorage.getItem('postLoginIntent');

                if (intent === 'host') {
                    localStorage.removeItem('postLoginIntent');

                    if (user.role === 'STUDENT') {
                        try {
                            await api.post('/auth/become-organizer');
                            await refreshUser();
                            // Small delay to ensure state updates
                            setTimeout(() => {
                                navigate('/host-dashboard');
                            }, 200);
                        } catch (error) {
                            console.error('Failed to upgrade to organizer:', error);
                            navigate('/host-dashboard');
                        }
                    } else {
                        navigate('/host-dashboard');
                    }
                }
            }
        };

        handlePostLogin();
    }, [user, navigate, refreshUser]);

    return null; // This component doesn't render anything
};

export default PostLoginHandler;
