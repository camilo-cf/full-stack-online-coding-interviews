/**
 * LanguageSelector Component
 * 
 * Dropdown for selecting the programming language.
 * Features:
 * - Styled select with custom appearance
 * - Language icons
 * - Shared across all connected clients
 */
import './LanguageSelector.css';

// Available languages
const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', icon: '📜' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'other', label: 'Other', icon: '📄' }
];

/**
 * @param {Object} props
 * @param {string} props.value - Currently selected language
 * @param {Function} props.onChange - Callback when language changes
 * @param {boolean} props.disabled - Whether the selector is disabled
 */
function LanguageSelector({ value, onChange, disabled = false }) {
  const currentLang = LANGUAGES.find(l => l.value === value) || LANGUAGES[0];

  return (
    <div className="language-selector">
      <label className="language-selector__label">
        Language
      </label>
      <div className="language-selector__wrapper">
        <span className="language-selector__icon">{currentLang.icon}</span>
        <select
          className="language-selector__select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
        <svg 
          className="language-selector__arrow" 
          viewBox="0 0 24 24" 
          fill="none"
        >
          <path 
            d="M6 9L12 15L18 9" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

export default LanguageSelector;
