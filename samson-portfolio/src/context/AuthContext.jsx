import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE } from '../constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/auth/me`, {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setIsAdmin(data.isAdmin);
            } else {
                setIsAdmin(false);
            }
        } catch (err) {
            console.error("Auth check failed", err);
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async () => {
        await checkAuth();
    };

    const logout = async () => {
        try {
            await fetch(`${API_BASE}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            setIsAdmin(false);
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <AuthContext.Provider value={{ isAdmin, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
