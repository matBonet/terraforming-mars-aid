function NavBarMobile({ onRerandomize, onOpenSettings }) {
	return (
		<>
			<header className="mobile-top-bar">
				<span className="mobile-top-bar-title">M&amp;A Randomizer</span>
			</header>

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
}

export default NavBarMobile;
