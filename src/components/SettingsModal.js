import { useState } from 'react';
import milestonesData from '../ma-data/milestones.json';
import awardsData from '../ma-data/awards.json';

function SettingsModal({ excludeMilestones, excludeAwards, onClose }) {
  const [localExclM, setLocalExclM] = useState(new Set(excludeMilestones));
  const [localExclA, setLocalExclA] = useState(new Set(excludeAwards));

  function toggleMilestone(slug) {
    setLocalExclM(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function toggleAward(slug) {
    setLocalExclA(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose([...localExclM], [...localExclA]); }}>
      <div className="modal-content">
        <h2>Settings</h2>
        <div className="modal-sections">
          <div className="modal-section">
            <h3>Milestones</h3>
            {Object.entries(milestonesData).map(([slug, data]) => (
              <label key={slug} className="modal-item">
                <input
                  type="checkbox"
                  checked={!localExclM.has(slug)}
                  onChange={() => toggleMilestone(slug)}
                />
                {data.name}
              </label>
            ))}
          </div>
          <div className="modal-section">
            <h3>Awards</h3>
            {Object.entries(awardsData).map(([slug, data]) => (
              <label key={slug} className="modal-item">
                <input
                  type="checkbox"
                  checked={!localExclA.has(slug)}
                  onChange={() => toggleAward(slug)}
                />
                {data.name}
              </label>
            ))}
          </div>
        </div>
        <button className="nav-btn modal-done-btn" onClick={() => onClose([...localExclM], [...localExclA])}>
          Done
        </button>
      </div>
    </div>
  );
}

export default SettingsModal;
