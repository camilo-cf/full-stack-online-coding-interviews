/**
 * CodeEditor Component Unit Tests
 * 
 * Tests the Monaco-based code editor component.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CodeEditor from '../src/components/CodeEditor.jsx';

// Mock Monaco Editor since it doesn't work well in jsdom
vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange, language, options }) => (
    <div data-testid="monaco-editor" data-language={language}>
      <textarea
        data-testid="monaco-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={options?.readOnly}
      />
    </div>
  )
}));

describe('CodeEditor Component Unit Tests', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
    language: 'javascript',
    disabled: false
  };

  describe('Rendering', () => {
    it('should render the Monaco editor', () => {
      render(<CodeEditor {...defaultProps} />);
      
      expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
    });

    it('should display the provided value', () => {
      const testCode = 'console.log("Hello!");';
      render(<CodeEditor {...defaultProps} value={testCode} />);
      
      const textarea = screen.getByTestId('monaco-textarea');
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

    it('should pass correct language to Monaco', () => {
      render(<CodeEditor {...defaultProps} language="python" />);
      
      const editor = screen.getByTestId('monaco-editor');
      expect(editor).toHaveAttribute('data-language', 'python');
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

  describe('Language Mapping', () => {
    it('should map javascript to javascript', () => {
      render(<CodeEditor {...defaultProps} language="javascript" />);
      
      const editor = screen.getByTestId('monaco-editor');
      expect(editor).toHaveAttribute('data-language', 'javascript');
    });

    it('should map python to python', () => {
      render(<CodeEditor {...defaultProps} language="python" />);
      
      const editor = screen.getByTestId('monaco-editor');
      expect(editor).toHaveAttribute('data-language', 'python');
    });

    it('should map other to plaintext', () => {
      render(<CodeEditor {...defaultProps} language="other" />);
      
      const editor = screen.getByTestId('monaco-editor');
      expect(editor).toHaveAttribute('data-language', 'plaintext');
    });
  });
});
