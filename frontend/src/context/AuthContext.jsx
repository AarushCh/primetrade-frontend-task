import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AuthContext = createContext();

const ADMIN_EMAIL = 'admin@primetrade.ai';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/auth/me', {
                        headers: { 'x-auth-token': token }
                    });

                    const isAdmin = res.data.email === ADMIN_EMAIL;

                    setUser({
                        ...res.data,
                        role: isAdmin ? 'admin' : 'member'
                    });
                } catch (err) {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkUser();
    }, []);

    const login = async (identifier, password) => {
        const res = await api.post('/auth/login', { identifier, password });

        localStorage.setItem('token', res.data.token);

        const isAdmin = res.data.user.email === ADMIN_EMAIL;

        setUser({
            ...res.data.user,
            role: isAdmin ? 'admin' : 'member'
        });

        navigate('/dashboard');
    };

    const registerUser = async (username, email, password) => {
        const res = await api.post('/auth/register', {
            username,
            email,
            password
        });

        localStorage.setItem('token', res.data.token);

        const isAdmin = email === ADMIN_EMAIL;

        setUser({
            ...res.data.user,
            role: isAdmin ? 'admin' : 'member'
        });

        navigate('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider
            value={{ user, login, registerUser, logout, loading }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;