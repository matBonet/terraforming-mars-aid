import { useBackButton } from '../hooks/useBackButton';

function CardActionSheet({ title, description, onReroll, onExclude, onClose }) {
  useBackButton(onClose);

  return (
    <>
      <div className="action-sheet-backdrop" onClick={onClose} />
      <div className="action-sheet">
        <div className="action-sheet-main">
          <div className="action-sheet-handle" />
          <p className="action-sheet-card-title">{title}</p>
          {description && <p className="action-sheet-card-description">{description}</p>}
          <button
            className="action-sheet-btn action-sheet-btn--reroll"
            onClick={() => { onReroll(); onClose(); }}
          >
            <span className="action-sheet-btn-icon">&#x21BB;</span>
            Reroll
          </button>
          <button
            className="action-sheet-btn action-sheet-btn--exclude"
            onClick={() => { onExclude(); onClose(); }}
          >
            <span className="action-sheet-btn-icon">&#x2715;</span>
            Exclude &amp; Reroll
          </button>
        </div>
      </div>
    </>
  );
}

export default CardActionSheet;
