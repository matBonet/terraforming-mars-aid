import useStore from '../store';
import { useBackButton } from '../hooks/useBackButton';

function ConfirmModal() {
  const { confirmAction, cancelAction } = useStore();

  useBackButton(cancelAction);

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) cancelAction(); }}>
      <div className="modal-content confirm-modal-content">
        <p className="confirm-modal-message">
          A game is in progress. Rerolling will clear player markers on the affected cards.
        </p>
        <div className="confirm-modal-actions">
          <button className="confirm-btn confirm-btn--cancel" onClick={cancelAction}>
            Cancel
          </button>
          <button className="confirm-btn confirm-btn--confirm" onClick={confirmAction}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
