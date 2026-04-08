function NavBar({ onRerandomize, onOpenSettings }) {
	return (
		<nav className="nav-bar">
			<h3>Milestones & Awards Randomizer</h3>
			<h4>by: matBonet</h4>
			<button className="nav-btn" onClick={onRerandomize}>&#x21BB; Randomize</button>
			<button className="nav-btn" onClick={onOpenSettings}>⚙ Settings</button>
		</nav>
	);
};

export default NavBar;
