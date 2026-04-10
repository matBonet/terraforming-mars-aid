import { IoSettingsSharp } from 'react-icons/io5';

function NavBarDesktop({ onOpenSettings }) {
	return (
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
	);
}

export default NavBarDesktop;
