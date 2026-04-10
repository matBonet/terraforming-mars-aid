import { useBackButton } from "../hooks/useBackButton";
import IsoCube, { CUBE_COLORS } from "./IsoCube";
import { FaRotateRight, FaXmark } from 'react-icons/fa6';

function CardActionSheet({
  title,
  description,
  marker,
  isGreyed,
  onSetMarker,
  onClearMarker,
  onReroll,
  onExclude,
  onClose,
}) {
  useBackButton(onClose);

  function handleSetMarker(color) {
    onSetMarker(color);
    onClose();
  }

  return (
    <>
      <div className="action-sheet-backdrop" onClick={onClose} />
      <div className="action-sheet">
        <div className="action-sheet-main">
          <div className="action-sheet-handle" />
          <p className="action-sheet-card-title">{title}</p>
          {description && (
            <p className="action-sheet-card-description">{description}</p>
          )}

          {/* Marker section */}
          <div className="action-sheet-marker-section">
            {marker ? (
              <div className="action-sheet-marker-claimed">
                <IsoCube color={marker} size={32} />
                <button
                  className="action-sheet-unclaim-btn"
                  onClick={onClearMarker}
                >
                  Remove marker
                </button>
              </div>
            ) : isGreyed ? (
              <p className="action-sheet-marker-limit">3 already claimed</p>
            ) : (
              <div className="action-sheet-marker-row">
                {CUBE_COLORS.map((color) => (
                  <button
                    key={color}
                    className="action-sheet-marker-btn"
                    onClick={() => handleSetMarker(color)}
                    title={`Claim with ${color} cube`}
                  >
                    <IsoCube color={color} size={28} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className="action-sheet-btn action-sheet-btn--reroll"
            onClick={() => {
              onReroll();
              onClose();
            }}
          >
            <FaRotateRight className="action-sheet-btn-icon" aria-hidden="true" />
            Reroll
          </button>
          <button
            className="action-sheet-btn action-sheet-btn--exclude"
            onClick={() => {
              onExclude();
              onClose();
            }}
          >
            <FaXmark className="action-sheet-btn-icon" aria-hidden="true" />
            Exclude &amp; Reroll
          </button>
        </div>
      </div>
    </>
  );
}

export default CardActionSheet;
