/**
 * CodeEditor Component
 * 
 * A styled textarea-based code editor for the initial implementation.
 * Features:
 * - Monospace font for code
 * - Tab key handling
 * - Premium dark theme styling
 * 
 * Note: Syntax highlighting will be added in a future iteration.
 */
import './CodeEditor.css';

/**
 * @param {Object} props
 * @param {string} props.value - Current code content
 * @param {Function} props.onChange - Callback when code changes
 * @param {string} props.language - Current language (for future syntax highlighting)
 * @param {boolean} props.disabled - Whether the editor is disabled
 */
function CodeEditor({ value, onChange, language, disabled = false }) {
  /**
   * Handle keyboard events for better coding experience
   */
  const handleKeyDown = (e) => {
    // Handle Tab key - insert 2 spaces instead of changing focus
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      // Insert 2 spaces at cursor position
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // Move cursor after the inserted spaces
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      });
    }
  };

  return (
    <div className="code-editor">
      <div className="code-editor__header">
        <div className="code-editor__dots">
          <span className="code-editor__dot code-editor__dot--red"></span>
          <span className="code-editor__dot code-editor__dot--yellow"></span>
          <span className="code-editor__dot code-editor__dot--green"></span>
        </div>
        <span className="code-editor__filename">
          main.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'txt'}
        </span>
      </div>
      
      <div className="code-editor__body">
        <div className="code-editor__line-numbers">
          {value.split('\n').map((_, index) => (
            <span key={index}>{index + 1}</span>
          ))}
        </div>
        
        <textarea
          className="code-editor__textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="// Start coding here..."
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>
    </div>
  );
}

export default CodeEditor;
