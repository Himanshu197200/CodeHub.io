import { createContext, useState, useEffect, useContext } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import api, { setAuthToken } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
    const { signOut, getToken } = useClerkAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const syncUser = async () => {
            if (clerkLoaded && clerkUser) {
                try {
                    const token = await getToken();
                    setAuthToken(token);

                    // Try to get user from our backend
                    const { data } = await api.get('/auth/me');
                    setUser(data);
                } catch (error) {
                    console.error('Failed to fetch user from backend', error);
                    // If backend fetch fails, we might need to sync
                    try {
                        const token = await getToken();
                        setAuthToken(token);
                        const { data } = await api.post('/auth/sync', {
                            clerkId: clerkUser.id,
                            email: clerkUser.emailAddresses[0].emailAddress,
                            name: clerkUser.fullName,
                        });
                        setUser(data);
                    } catch (syncError) {
                        console.error('Sync failed', syncError);
                        setUser(null);
                    }
                } finally {
                    setLoading(false);
                }
            } else if (clerkLoaded && !clerkUser) {
                setAuthToken(null);
                setUser(null);
                setLoading(false);
            }
        };

        syncUser();
    }, [clerkUser, clerkLoaded, getToken]);

    const logout = async () => {
        await signOut();
        setAuthToken(null);
        setUser(null);
    };

    const refreshUser = async () => {
        if (clerkUser) {
            try {
                const token = await getToken();
                setAuthToken(token);
                const { data } = await api.get('/auth/me');
                setUser(data);
            } catch (error) {
                console.error('Failed to refresh user', error);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, logout, refreshUser, loading: loading || !clerkLoaded }}>
            {children}
        </AuthContext.Provider>
    );
};
