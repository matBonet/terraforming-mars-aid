import { IoSettingsSharp } from 'react-icons/io5';

function NavBar({ onRerandomize, onOpenSettings }) {
	return (
		<>
			{/* Desktop top bar */}
			<header className="top-bar">
				<span className="top-bar-title">M&amp;A Randomizer</span>
				<div className="top-bar-actions">
					<button className="top-bar-icon-btn" title="Help">?</button>
					<button className="top-bar-settings-btn" onClick={onOpenSettings}>
						<IoSettingsSharp size={24} aria-hidden="true" />
						Settings
					</button>
				</div>
			</header>

			{/* Mobile floating pill */}
			<div className="floating-bar">
				<button className="floating-btn floating-btn--primary" onClick={onRerandomize}>
					<span className="floating-btn-icon">&#x21BB;</span>
					<span className="floating-btn-label">Randomize</span>
				</button>
				<div className="floating-bar-divider" />
				<button className="floating-btn" onClick={onOpenSettings} title="Settings">
					<span className="floating-btn-icon">⚙</span>
					<span className="floating-btn-label">Settings</span>
				</button>
			</div>
		</>
	);
};

export default NavBar;
