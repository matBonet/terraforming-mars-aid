import { useBackButton } from '../hooks/useBackButton';
import { usePlatform } from '../hooks/usePlatform';

function HelpModal({ onClose }) {
  useBackButton(onClose);
  const { isMobile } = usePlatform();

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content">
        {!isMobile && (
          <div className="modal-header">
            <h2>Help</h2>
            <button className="modal-close-btn" onClick={onClose} title="Close">&#x2715;</button>
          </div>
        )}
        <div className="modal-sections">
          <div className="modal-section">
            <div className="modal-section-header">
              <div className="nav-bar-ma-pill modal-pill"><span>WHAT IS THIS?</span></div>
            </div>
            <p className="help-text">
              This tool randomly selects 5 Milestones and 5 Awards for a game of Terraforming Mars,
              avoiding combinations that are too synergistic with each other.
            </p>
          </div>
          <div className="modal-section">
            <div className="modal-section-header">
              <div className="nav-bar-ma-pill modal-pill"><span>HOW TO USE</span></div>
            </div>
            {isMobile ? (
              <ul className="help-list">
                <li>Tap <strong>Randomize</strong> to get a new set of Milestones &amp; Awards.</li>
                <li>Tap any card to reroll it or exclude it from the pool.</li>
                <li>Open <strong>Settings</strong> to choose which expansions and cards are available.</li>
              </ul>
            ) : (
              <ul className="help-list">
                <li>Click <strong>Randomize</strong> on a section header to reroll that group.</li>
                <li>Hover a card to reveal the <strong>↻ reroll</strong> and <strong>✕ exclude</strong> buttons.</li>
                <li>Open <strong>Settings</strong> to choose which expansions and cards are available.</li>
              </ul>
            )}
          </div>
          <div className="modal-section">
            <div className="modal-section-header">
              <div className="nav-bar-ma-pill modal-pill"><span>SOURCE</span></div>
            </div>
            <p className="help-text">
              Open source.{' '}
              <a
                className="help-link"
                href="https://github.com/matBonet/terraforming-mars-aid"
                target="_blank"
                rel="noreferrer"
              >
                View on GitHub ↗
              </a>
            </p>
            <p className="help-disclaimer">
              Unaffiliated with FryxGames or Terraforming Mars.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpModal;
