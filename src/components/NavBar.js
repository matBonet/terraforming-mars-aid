import { usePlatform } from '../hooks/usePlatform';
import NavBarMobile from './NavBar.mobile';
import NavBarDesktop from './NavBar.desktop';

function NavBar(props) {
	const { isMobile } = usePlatform();
	return isMobile ? <NavBarMobile {...props} /> : <NavBarDesktop {...props} />;
}

export default NavBar;
