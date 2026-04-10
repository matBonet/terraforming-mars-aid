import { FaRotateRight, FaGear, FaCircleQuestion } from 'react-icons/fa6';

function NavBarMobile({ onRerandomize, onOpenSettings, onOpenHelp }) {
	return (
		<>
			<header className="mobile-top-bar">
				<span className="mobile-top-bar-title">M&amp;A Randomizer</span>
				<button className="mobile-top-bar-help-btn" onClick={onOpenHelp} title="Help">
					<FaCircleQuestion size={18} aria-hidden="true" />
				</button>
			</header>

			<div className="floating-bar">
				<button className="floating-btn floating-btn--primary" onClick={onRerandomize}>
					<FaRotateRight className="floating-btn-icon" aria-hidden="true" />
					<span className="floating-btn-label">Randomize</span>
				</button>
				<div className="floating-bar-divider" />
				<button className="floating-btn" onClick={onOpenSettings} title="Settings">
					<FaGear className="floating-btn-icon" aria-hidden="true" />
					<span className="floating-btn-label">Settings</span>
				</button>
			</div>
		</>
	);
}

export default NavBarMobile;
