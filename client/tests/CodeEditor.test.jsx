/**
 * CodeEditor Component Unit Tests
 * 
 * Tests the code editor textarea component.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CodeEditor from '../src/components/CodeEditor.jsx';

describe('CodeEditor Component Unit Tests', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
    language: 'javascript',
    disabled: false
  };

  describe('Rendering', () => {
    it('should render a textarea', () => {
      render(<CodeEditor {...defaultProps} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    });

    it('should display the provided value', () => {
      const testCode = 'console.log("Hello!");';
      render(<CodeEditor {...defaultProps} value={testCode} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea.value).toBe(testCode);
    });

    it('should show correct filename for javascript', () => {
      render(<CodeEditor {...defaultProps} language="javascript" />);
      
      expect(screen.getByText('main.js')).toBeInTheDocument();
    });

    it('should show correct filename for python', () => {
      render(<CodeEditor {...defaultProps} language="python" />);
      
      expect(screen.getByText('main.py')).toBeInTheDocument();
    });

    it('should show correct filename for other languages', () => {
      render(<CodeEditor {...defaultProps} language="other" />);
      
      expect(screen.getByText('main.txt')).toBeInTheDocument();
    });

    it('should render line numbers', () => {
      const codeWithLines = 'line1\nline2\nline3';
      const { container } = render(<CodeEditor {...defaultProps} value={codeWithLines} />);
      
      const lineNumbers = container.querySelector('.code-editor__line-numbers');
      expect(lineNumbers.children.length).toBe(3);
    });
  });

  describe('Interaction', () => {
    it('should call onChange when text is typed', () => {
      const onChange = vi.fn();
      render(<CodeEditor {...defaultProps} onChange={onChange} />);
      
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'new code' } });
      
      expect(onChange).toHaveBeenCalledWith('new code');
    });

    it('should be disabled when disabled prop is true', () => {
      render(<CodeEditor {...defaultProps} disabled={true} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeDisabled();
    });

    it('should not be disabled when disabled prop is false', () => {
      render(<CodeEditor {...defaultProps} disabled={false} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).not.toBeDisabled();
    });
  });

  describe('Editor Header', () => {
    it('should render window control dots', () => {
      const { container } = render(<CodeEditor {...defaultProps} />);
      
      expect(container.querySelector('.code-editor__dot--red')).toBeInTheDocument();
      expect(container.querySelector('.code-editor__dot--yellow')).toBeInTheDocument();
      expect(container.querySelector('.code-editor__dot--green')).toBeInTheDocument();
    });
  });

  describe('Textarea Attributes', () => {
    it('should have spellCheck disabled', () => {
      render(<CodeEditor {...defaultProps} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('spellCheck', 'false');
    });

    it('should have autocomplete off', () => {
      render(<CodeEditor {...defaultProps} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('autoComplete', 'off');
    });
  });
});
