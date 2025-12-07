/**
 * useTheme Hook Unit Tests
 * 
 * Tests the theme management hook in isolation.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../src/hooks/useTheme.js';

describe('useTheme Hook Unit Tests', () => {
  beforeEach(() => {
    // Reset document attribute
    document.documentElement.removeAttribute('data-theme');
    // Reset localStorage mock
    localStorage.getItem.mockReturnValue(null);
    // Reset matchMedia to prefer dark by default
    global.matchMedia.mockImplementation(() => ({
      matches: false, // prefers-color-scheme: light = false means dark
    }));
  });

  describe('Initial State', () => {
    it('should default to dark theme when no preference is saved', () => {
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('dark');
    });

    it('should load saved theme from localStorage', () => {
      localStorage.getItem.mockReturnValue('light');
      
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('light');
    });

    it('should respect system preference when no saved theme', () => {
      global.matchMedia.mockImplementation(() => ({
        matches: true, // prefers-color-scheme: light
      }));

      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('light');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from dark to light', () => {
      const { result } = renderHook(() => useTheme());
      
      expect(result.current.theme).toBe('dark');
      
      act(() => {
        result.current.toggleTheme();
      });
      
      expect(result.current.theme).toBe('light');
    });

    it('should toggle from light to dark', () => {
      localStorage.getItem.mockReturnValue('light');
      
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.toggleTheme();
      });
      
      expect(result.current.theme).toBe('dark');
    });

    it('should save theme to localStorage when toggled', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.toggleTheme();
      });
      
      expect(localStorage.setItem).toHaveBeenCalledWith('codecollab-theme', 'light');
    });
  });

  describe('setTheme', () => {
    it('should set theme to light', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setTheme('light');
      });
      
      expect(result.current.theme).toBe('light');
    });

    it('should set theme to dark', () => {
      localStorage.getItem.mockReturnValue('light');
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setTheme('dark');
      });
      
      expect(result.current.theme).toBe('dark');
    });

    it('should ignore invalid theme values', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setTheme('invalid');
      });
      
      expect(result.current.theme).toBe('dark');
    });
  });

  describe('DOM Updates', () => {
    it('should set data-theme attribute for light theme', () => {
      localStorage.getItem.mockReturnValue('light');
      
      renderHook(() => useTheme());
      
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('should remove data-theme attribute for dark theme', () => {
      document.documentElement.setAttribute('data-theme', 'light');
      
      renderHook(() => useTheme());
      
      expect(document.documentElement.getAttribute('data-theme')).toBeNull();
    });
  });
});
