import { FaGear, FaCircleQuestion } from 'react-icons/fa6';

function NavBarDesktop({ onOpenSettings, onOpenHelp }) {
	return (
		<header className="top-bar">
			<span className="top-bar-title">M&amp;A Randomizer</span>
			<div className="top-bar-actions">
				<button className="top-bar-icon-btn" title="Help" onClick={onOpenHelp}>
					<FaCircleQuestion size={20} aria-hidden="true" />
				</button>
				<button className="top-bar-settings-btn" onClick={onOpenSettings}>
					<FaGear size={24} aria-hidden="true" />
					Settings
				</button>
			</div>
		</header>
	);
}

export default NavBarDesktop;
