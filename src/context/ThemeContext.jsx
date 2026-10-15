import React, { createContext, useState, useEffect } from 'react';
import { lightTheme, darkTheme } from '../styles/theme';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    // YouTube style: default to true dark mode unless explicitly set to light
    return true;
  });

  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.body.style.backgroundColor = theme.background;
    document.body.style.color = theme.text;
  }, [isDark, theme]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
