/**
 * ThemeToggle Component
 * 
 * A button to toggle between dark and light themes.
 * Displays sun/moon icons based on current theme.
 */
import './ThemeToggle.css';

/**
 * @param {Object} props
 * @param {string} props.theme - Current theme ('dark' or 'light')
 * @param {Function} props.onToggle - Callback to toggle theme
 */
function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';

  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className={`theme-toggle__icons ${isDark ? 'theme-toggle__icons--dark' : 'theme-toggle__icons--light'}`}>
        {/* Sun icon */}
        <svg 
          className="theme-toggle__icon theme-toggle__icon--sun" 
          viewBox="0 0 24 24" 
          fill="none"
        >
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        
        {/* Moon icon */}
        <svg 
          className="theme-toggle__icon theme-toggle__icon--moon" 
          viewBox="0 0 24 24" 
          fill="none"
        >
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </button>
  );
}

export default ThemeToggle;
