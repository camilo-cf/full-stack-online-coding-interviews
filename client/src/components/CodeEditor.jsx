/**
 * CodeEditor Component - Monaco Editor Integration
 * 
 * A professional code editor with syntax highlighting powered by Monaco Editor.
 * Features:
 * - Syntax highlighting for JavaScript and Python
 * - Real-time collaborative editing via Socket.IO
 * - Dark theme matching the app design
 * - Language switching
 */
import Editor from '@monaco-editor/react';
import './CodeEditor.css';

/**
 * Map our language names to Monaco language identifiers
 */
const languageMap = {
  javascript: 'javascript',
  python: 'python',
  other: 'plaintext'
};

/**
 * @param {Object} props
 * @param {string} props.value - Current code content
 * @param {Function} props.onChange - Callback when code changes
 * @param {string} props.language - Current language for syntax highlighting
 * @param {boolean} props.disabled - Whether the editor is disabled
 */
function CodeEditor({ value, onChange, language, disabled = false }) {
  /**
   * Handle editor content changes
   * This is called on every keystroke - we pass it up to parent
   * which triggers the Socket.IO emit for real-time sync
   */
  const handleEditorChange = (newValue) => {
    if (!disabled && newValue !== undefined) {
      onChange(newValue);
    }
  };

  /**
   * Configure editor options when it mounts
   */
  const handleEditorMount = (editor, monaco) => {
    // Focus the editor when mounted
    editor.focus();
    
    // Define custom theme to match our app
    monaco.editor.defineTheme('codecollab-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: 'C586C0' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'function', foreground: 'DCDCAA' },
      ],
      colors: {
        'editor.background': '#1a1a24',
        'editor.foreground': '#f8fafc',
        'editorLineNumber.foreground': '#64748b',
        'editorLineNumber.activeForeground': '#94a3b8',
        'editor.selectionBackground': '#3b82f640',
        'editor.lineHighlightBackground': '#22222e',
        'editorCursor.foreground': '#8b5cf6',
        'editorIndentGuide.background': '#2a2a36',
      }
    });
    
    monaco.editor.setTheme('codecollab-dark');
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
        <Editor
          height="100%"
          language={languageMap[language] || 'plaintext'}
          value={value}
          onChange={handleEditorChange}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{
            // Editor appearance
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            fontLigatures: true,
            lineHeight: 1.6,
            
            // UI options
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            renderLineHighlight: 'line',
            lineNumbers: 'on',
            glyphMargin: false,
            folding: true,
            
            // Layout & UX
            fixedOverflowWidgets: true, // Crucial for clean widget rendering
            codeLens: false, // Remove "Run | Debug" noise
            lightbulb: { enabled: false }, // Remove quick fix lightbulb noise
            overviewRulerBorder: false, // Cleaner UI
            
            // Behavior
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            
            // Accessibility
            readOnly: disabled,
            
            // Performance
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            
            // Scrollbar styling
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
            
            // Padding
            padding: {
              top: 16,
              bottom: 16,
            },
          }}
          loading={
            <div className="code-editor__loading">
              <div className="code-editor__loading-spinner"></div>
              <span>Loading editor...</span>
            </div>
          }
        />
      </div>
    </div>
  );
}

export default CodeEditor;
