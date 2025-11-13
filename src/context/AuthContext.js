import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Tarkista onko token localStoragessa kun sivu latautuu
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Voisit tässä hakea käyttäjän tiedot API:sta
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const response = await api.post('/auth/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const { access_token } = response.data;

            console.log('Token received:', access_token); // DEBUG
            localStorage.setItem('token', access_token);
            console.log('Token saved:', localStorage.getItem('token')); // DEBUG
            setUser({ token: access_token });
            return { success: true };
        } catch (error) {
            console.error('Login error:', error.response?.data);
            return {
                success: false,
                error: error.response?.data?.detail || 'Kirjautuminen epäonnistui'
            };
        }
    };

    const register = async (email, password, full_name) => {
        try {
            const response = await api.post('/auth/register', {
                email,
                password,
                name: full_name  // Muutettu: backend odottaa 'name' kenttää
            });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Rekisteröinti epäonnistui'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth täytyy käyttää AuthProviderin sisällä');
    }
    return context;
};