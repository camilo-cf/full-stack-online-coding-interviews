/**
 * OutputPanel Component
 * 
 * Displays code execution output and errors.
 * Shows loading state when Python runtime is initializing.
 * Indicates when output is from a remote client (interviewer sees interviewee's output).
 */
import './OutputPanel.css';

/**
 * @param {Object} props
 * @param {string} props.output - Execution output
 * @param {string} props.error - Error message if any
 * @param {boolean} props.isRunning - Whether code is currently running
 * @param {boolean} props.isLoading - Whether runtime is loading
 * @param {string} props.loadingMessage - Loading status message
 * @param {boolean} props.isRemote - Whether this output came from another client
 * @param {Function} props.onClear - Callback to clear output
 */
function OutputPanel({ 
  output, 
  error, 
  isRunning, 
  isLoading, 
  loadingMessage,
  isRemote = false,
  onClear
}) {
  return (
    <div className="output-panel">
      <div className="output-panel__header">
        <span className="output-panel__title">
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <path d="M4 17L10 11L4 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Output
        </span>
        
        <div className="output-panel__header-right">
          {isRemote && (
            <span className="output-panel__remote-badge">
              <svg viewBox="0 0 24 24" fill="none" width="12" height="12">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Remote
            </span>
          )}
          
          {isRunning && (
            <span className="output-panel__status output-panel__status--running">
              <span className="output-panel__spinner"></span>
              Running...
            </span>
          )}
          
          {isLoading && (
            <span className="output-panel__status output-panel__status--loading">
              <span className="output-panel__spinner"></span>
              {loadingMessage || 'Loading...'}
            </span>
          )}
          
          {(output || error) && onClear && !isRunning && (
            <button 
              className="output-panel__clear-btn" 
              onClick={onClear}
              title="Clear output"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Clear
            </button>
          )}
        </div>
      </div>
      
      <div className="output-panel__content">
        {isLoading ? (
          <div className="output-panel__loading">
            <div className="output-panel__loading-spinner"></div>
            <p>{loadingMessage}</p>
            <p className="output-panel__loading-hint">
              First-time Python execution requires downloading the runtime (~15MB)
            </p>
          </div>
        ) : (
          <>
            {output && (
              <pre className="output-panel__output">{output}</pre>
            )}
            {error && (
              <pre className="output-panel__error">{error}</pre>
            )}
            {!output && !error && !isRunning && (
              <div className="output-panel__placeholder">
                Click "Run" to execute your code
                <br />
                <small>Output is shared with other session participants</small>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default OutputPanel;
