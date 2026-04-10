import { usePlatform } from "../hooks/usePlatform";
import CardMobile from "./Card.mobile";
import CardDesktop from "./Card.desktop";

function Card(props) {
  const { isMobile } = usePlatform();
  return isMobile ? <CardMobile {...props} /> : <CardDesktop {...props} />;
}

export default Card;
