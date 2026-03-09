import React, { createContext, useContext, useEffect, useState } from 'react';
import { THEMES } from '../constants/themes';

export const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
    const [themeId, setThemeId] = useState(() => {
        return localStorage.getItem('themeId') || 'vampire';
    });

    const theme = THEMES[themeId] || THEMES.vampire;

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme.id);
        localStorage.setItem('themeId', theme.id);

        // Update global CSS variables for legacy components if needed
        const root = document.documentElement;
        root.style.setProperty('--bg-body', theme.bg);
        root.style.setProperty('--bg-main', theme.surface);
        root.style.setProperty('--bg-card', theme.card);
        root.style.setProperty('--primary', theme.accent);
        root.style.setProperty('--text-primary', theme.text);
        root.style.setProperty('--text-secondary', theme.textMuted);
        root.style.setProperty('--border', theme.border);
    }, [theme]);

    const toggleTheme = () => {
        const ids = Object.keys(THEMES);
        const currentIndex = ids.indexOf(themeId);
        const nextIndex = (currentIndex + 1) % ids.length;
        setThemeId(ids[nextIndex]);
    };

    const setTheme = (newTheme) => {
        if (typeof newTheme === 'string') {
            setThemeId(newTheme);
        } else if (newTheme && newTheme.id) {
            setThemeId(newTheme.id);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, themeId, setTheme, toggleTheme, isLight: theme.id === 'cloud' }}>
            {children}
        </ThemeContext.Provider>
    );
};


