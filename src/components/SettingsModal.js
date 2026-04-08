import { useState } from 'react';
import milestonesData from '../ma-data/milestones.json';
import awardsData from '../ma-data/awards.json';

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
      onChange([...localExclM], [...next]);  // localExclM is stable between renders here
      return next;
    });
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content">
        <h2>Settings</h2>
        <div className="modal-sections">
          <div className="modal-section">
            <h3>Milestones</h3>
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
          <div className="modal-section">
            <h3>Awards</h3>
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
  );
}

export default SettingsModal;
