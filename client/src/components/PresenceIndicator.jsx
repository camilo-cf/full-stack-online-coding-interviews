/**
 * PresenceIndicator Component
 * 
 * Displays the number of active users in the session and their status.
 * Helps monitor if participants are active in the tab or away.
 */
import './PresenceIndicator.css';

/**
 * @param {Object} props
 * @param {number} props.userCount - Total users connected
 * @param {number} props.activeCount - Users with tab focused
 * @param {Array} props.users - List of user objects { id, isActive, joinedAt }
 */
function PresenceIndicator({ userCount = 0, activeCount = 0 }) {
  const isAllActive = userCount > 0 && userCount === activeCount;
  
  return (
    <div className="presence-indicator" title={`${activeCount} of ${userCount} users active`}>
      <div className="presence-indicator__count">
        <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>{userCount}</span>
      </div>
      
      <div className={`presence-indicator__status ${isAllActive ? 'presence-indicator__status--all-active' : 'presence-indicator__status--some-inactive'}`}>
        <span className="presence-indicator__dot"></span>
      </div>
    </div>
  );
}

export default PresenceIndicator;
