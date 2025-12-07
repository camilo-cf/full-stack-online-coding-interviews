/**
 * useTheme Hook - Theme Toggle Management
 * 
 * Manages dark/light theme preference with:
 * - localStorage persistence
 * - System preference detection
 * - Smooth theme transitions
 */
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for theme management
 * @returns {Object} { theme, toggleTheme, setTheme }
 */
export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('codecollab-theme');
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    }
    return 'dark'; // Default to dark
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    
    // Save to localStorage
    localStorage.setItem('codecollab-theme', theme);
  }, [theme]);

  // Toggle between themes
  const toggleTheme = useCallback(() => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  // Set specific theme
  const setTheme = useCallback((newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setThemeState(newTheme);
    }
  }, []);

  return { theme, toggleTheme, setTheme };
}
