import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('modern');

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('blog-theme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (themeId) => {
    document.documentElement.setAttribute('data-theme', themeId);
  };

  const changeTheme = (themeId) => {
    setCurrentTheme(themeId);
    applyTheme(themeId);
    localStorage.setItem('blog-theme', themeId);
  };

  const value = {
    currentTheme,
    changeTheme,
    applyTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};