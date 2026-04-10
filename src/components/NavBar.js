import { usePlatform } from '../hooks/usePlatform';
import NavBarMobile from './NavBar.mobile';
import NavBarDesktop from './NavBar.desktop';

function NavBar({ onRerandomize, onOpenSettings, onOpenHelp }) {
	const { isMobile } = usePlatform();
	return isMobile
		? <NavBarMobile onRerandomize={onRerandomize} onOpenSettings={onOpenSettings} onOpenHelp={onOpenHelp} />
		: <NavBarDesktop onOpenSettings={onOpenSettings} onOpenHelp={onOpenHelp} />;
}

export default NavBar;
