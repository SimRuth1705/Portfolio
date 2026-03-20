import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE } from '../constants';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/settings/theme`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && typeof data.value === 'string') {
                        setIsDark(data.value === 'dark');
                    }
                }
            } catch (err) {
                console.error('Failed to load theme:', err);
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        const next = !isDark;
        setIsDark(next);
        try {
            const response = await fetch(`${API_BASE}/api/settings/theme`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ key: 'theme', value: next ? 'dark' : 'light' })
            });
        } catch (err) {
            console.error('Failed to save theme:', err);
        }
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
