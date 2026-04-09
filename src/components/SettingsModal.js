import { useState } from 'react';
import milestonesData from '../ma-data/milestones.json';
import awardsData from '../ma-data/awards.json';

const allMilestoneSlugs = Object.keys(milestonesData);
const allAwardSlugs = Object.keys(awardsData);

function SettingsModal({ excludeMilestones, excludeAwards, onChange, onClose }) {
  const [localExclM, setLocalExclM] = useState(new Set(excludeMilestones));
  const [localExclA, setLocalExclA] = useState(new Set(excludeAwards));

  function toggleMilestone(slug) {
    setLocalExclM(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      onChange([...next], [...localExclA]);
      return next;
    });
  }

  function toggleAward(slug) {
    setLocalExclA(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      onChange([...localExclM], [...next]);
      return next;
    });
  }

  function selectAllMilestones() {
    setLocalExclM(prev => {
      const next = new Set();
      onChange([], [...localExclA]);
      return next;
    });
  }

  function unselectAllMilestones() {
    setLocalExclM(prev => {
      const next = new Set(allMilestoneSlugs);
      onChange([...next], [...localExclA]);
      return next;
    });
  }

  function selectAllAwards() {
    setLocalExclA(prev => {
      const next = new Set();
      onChange([...localExclM], []);
      return next;
    });
  }

  function unselectAllAwards() {
    setLocalExclA(prev => {
      const next = new Set(allAwardSlugs);
      onChange([...localExclM], [...next]);
      return next;
    });
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
              <div className="nav-bar-ma-pill modal-pill">
                <span>MILESTONES</span>
              </div>
              <div className="modal-section-actions">
                <button className="modal-action-btn" onClick={selectAllMilestones}>Select all</button>
                <button className="modal-action-btn" onClick={unselectAllMilestones}>Unselect all</button>
              </div>
            </div>
            <div className="modal-section-items">
              {Object.entries(milestonesData).map(([slug, data]) => (
                <button
                  key={slug}
                  className={`toggle-btn ${localExclM.has(slug) ? 'toggle-btn--off' : 'toggle-btn--on'}`}
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
              </div>
              <div className="modal-section-actions">
                <button className="modal-action-btn" onClick={selectAllAwards}>Select all</button>
                <button className="modal-action-btn" onClick={unselectAllAwards}>Unselect all</button>
              </div>
            </div>
            <div className="modal-section-items">
              {Object.entries(awardsData).map(([slug, data]) => (
                <button
                  key={slug}
                  className={`toggle-btn ${localExclA.has(slug) ? 'toggle-btn--off' : 'toggle-btn--on'}`}
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
