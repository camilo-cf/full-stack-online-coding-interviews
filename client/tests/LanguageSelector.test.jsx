/**
 * LanguageSelector Component Unit Tests
 * 
 * Tests the language dropdown selector component.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSelector from '../src/components/LanguageSelector.jsx';

describe('LanguageSelector Component Unit Tests', () => {
  const defaultProps = {
    value: 'javascript',
    onChange: vi.fn(),
    disabled: false
  };

  describe('Rendering', () => {
    it('should render a select element', () => {
      render(<LanguageSelector {...defaultProps} />);
      
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('should display "Language" label', () => {
      render(<LanguageSelector {...defaultProps} />);
      
      expect(screen.getByText('Language')).toBeInTheDocument();
    });

    it('should have all language options', () => {
      render(<LanguageSelector {...defaultProps} />);
      
      expect(screen.getByRole('option', { name: 'JavaScript' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Python' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Other' })).toBeInTheDocument();
    });

    it('should have JavaScript selected by default', () => {
      render(<LanguageSelector {...defaultProps} value="javascript" />);
      
      const select = screen.getByRole('combobox');
      expect(select.value).toBe('javascript');
    });

    it('should display correct icon for javascript', () => {
      const { container } = render(<LanguageSelector {...defaultProps} value="javascript" />);
      
      const icon = container.querySelector('.language-selector__icon');
      expect(icon.textContent).toBe('📜');
    });

    it('should display correct icon for python', () => {
      const { container } = render(<LanguageSelector {...defaultProps} value="python" />);
      
      const icon = container.querySelector('.language-selector__icon');
      expect(icon.textContent).toBe('🐍');
    });

    it('should display correct icon for other', () => {
      const { container } = render(<LanguageSelector {...defaultProps} value="other" />);
      
      const icon = container.querySelector('.language-selector__icon');
      expect(icon.textContent).toBe('📄');
    });
  });

  describe('Interaction', () => {
    it('should call onChange when selection changes', () => {
      const onChange = vi.fn();
      render(<LanguageSelector {...defaultProps} onChange={onChange} />);
      
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'python' } });
      
      expect(onChange).toHaveBeenCalledWith('python');
    });

    it('should be disabled when disabled prop is true', () => {
      render(<LanguageSelector {...defaultProps} disabled={true} />);
      
      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();
    });

    it('should not be disabled when disabled prop is false', () => {
      render(<LanguageSelector {...defaultProps} disabled={false} />);
      
      const select = screen.getByRole('combobox');
      expect(select).not.toBeDisabled();
    });
  });

  describe('Value Binding', () => {
    it('should reflect python value correctly', () => {
      render(<LanguageSelector {...defaultProps} value="python" />);
      
      const select = screen.getByRole('combobox');
      expect(select.value).toBe('python');
    });

    it('should reflect other value correctly', () => {
      render(<LanguageSelector {...defaultProps} value="other" />);
      
      const select = screen.getByRole('combobox');
      expect(select.value).toBe('other');
    });
  });
});
