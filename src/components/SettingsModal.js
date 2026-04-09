import useStore, { REQUIRED } from '../store';
import milestonesData from '../ma-data/milestones.json';
import awardsData from '../ma-data/awards.json';

const allMilestoneSlugs = Object.keys(milestonesData);
const allAwardSlugs = Object.keys(awardsData);

function SettingsModal({ onClose }) {
  const {
    availableMilestones, availableAwards, error, showDescriptions,
    setAvailable, setShowDescriptions,
  } = useStore();

  const tooFewMilestones = availableMilestones.length < REQUIRED;
  const tooFewAwards = availableAwards.length < REQUIRED;
  const synergyError = !!error && !tooFewMilestones && !tooFewAwards;
  const milestoneOk = !tooFewMilestones && !synergyError;
  const awardOk = !tooFewAwards && !synergyError;

  const availMSet = new Set(availableMilestones);
  const availASet = new Set(availableAwards);

  function toggleMilestone(slug) {
    const newAvailM = availMSet.has(slug)
      ? availableMilestones.filter(m => m !== slug)
      : [...availableMilestones, slug];
    setAvailable(newAvailM, availableAwards);
  }

  function toggleAward(slug) {
    const newAvailA = availASet.has(slug)
      ? availableAwards.filter(a => a !== slug)
      : [...availableAwards, slug];
    setAvailable(availableMilestones, newAvailA);
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="modal-close-btn" onClick={onClose} title="Close">&#x2715;</button>
        </div>
        <div className="modal-sections">
          <div className="modal-section">
            <div className="modal-section-header">
              <div className="nav-bar-ma-pill modal-pill"><span>GENERAL</span></div>
            </div>
            <div className="modal-section-items">
              <button
                className={`settings-toggle ${showDescriptions ? 'settings-toggle--on' : 'settings-toggle--off'}`}
                onClick={() => setShowDescriptions(!showDescriptions)}
              >
                <span className="settings-toggle-dot" />
                Card descriptions
              </button>
            </div>
          </div>
          <div className="modal-section">
            <div className="modal-section-header">
              <div className="nav-bar-ma-pill modal-pill">
                <span>MILESTONES</span>
                <span className={milestoneOk ? 'modal-pill-ok' : 'modal-pill-err'}>{milestoneOk ? '✓' : '✕'}</span>
              </div>
              <div className="modal-section-actions">
                <button className="modal-action-btn" onClick={() => setAvailable(allMilestoneSlugs, availableAwards)}>Select all</button>
                <button className="modal-action-btn" onClick={() => setAvailable([], availableAwards)}>Unselect all</button>
              </div>
            </div>
            <div className="modal-section-items">
              {Object.entries(milestonesData).map(([slug, data]) => (
                <button
                  key={slug}
                  className={`toggle-btn ${availMSet.has(slug) ? 'toggle-btn--on' : 'toggle-btn--off'}`}
                  onClick={() => toggleMilestone(slug)}
                  title={data.description}
                >
                  {data.name}
                </button>
              ))}
            </div>
          </div>
          <div className="modal-section">
            <div className="modal-section-header">
              <div className="nav-bar-ma-pill modal-pill">
                <span>AWARDS</span>
                <span className={awardOk ? 'modal-pill-ok' : 'modal-pill-err'}>{awardOk ? '✓' : '✕'}</span>
              </div>
              <div className="modal-section-actions">
                <button className="modal-action-btn" onClick={() => setAvailable(availableMilestones, allAwardSlugs)}>Select all</button>
                <button className="modal-action-btn" onClick={() => setAvailable(availableMilestones, [])}>Unselect all</button>
              </div>
            </div>
            <div className="modal-section-items">
              {Object.entries(awardsData).map(([slug, data]) => (
                <button
                  key={slug}
                  className={`toggle-btn ${availASet.has(slug) ? 'toggle-btn--on' : 'toggle-btn--off'}`}
                  onClick={() => toggleAward(slug)}
                  title={data.description}
                >
                  {data.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
