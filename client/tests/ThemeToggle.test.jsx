/**
 * ThemeToggle Component Unit Tests
 * 
 * Tests the theme toggle button component.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../src/components/ThemeToggle.jsx';

describe('ThemeToggle Component Unit Tests', () => {
  describe('Rendering', () => {
    it('should render a button', () => {
      render(<ThemeToggle theme="dark" onToggle={() => {}} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should have correct aria-label for dark theme', () => {
      render(<ThemeToggle theme="dark" onToggle={() => {}} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    });

    it('should have correct aria-label for light theme', () => {
      render(<ThemeToggle theme="light" onToggle={() => {}} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('should have correct title for dark theme', () => {
      render(<ThemeToggle theme="dark" onToggle={() => {}} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'Switch to light mode');
    });

    it('should have correct title for light theme', () => {
      render(<ThemeToggle theme="light" onToggle={() => {}} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'Switch to dark mode');
    });
  });

  describe('Interaction', () => {
    it('should call onToggle when clicked', () => {
      const onToggle = vi.fn();
      render(<ThemeToggle theme="dark" onToggle={onToggle} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(onToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('CSS Classes', () => {
    it('should have dark icons class when theme is dark', () => {
      const { container } = render(<ThemeToggle theme="dark" onToggle={() => {}} />);
      
      const iconsDiv = container.querySelector('.theme-toggle__icons');
      expect(iconsDiv).toHaveClass('theme-toggle__icons--dark');
    });

    it('should have light icons class when theme is light', () => {
      const { container } = render(<ThemeToggle theme="light" onToggle={() => {}} />);
      
      const iconsDiv = container.querySelector('.theme-toggle__icons');
      expect(iconsDiv).toHaveClass('theme-toggle__icons--light');
    });
  });
});
