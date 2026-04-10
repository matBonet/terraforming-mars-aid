import useStore from "../store";
import ExpansionIcon from "./ExpansionIcon";

const ICON_SLUGS = new Set([
  "banker",
  "benefactor",
  "botanist",
  "builder",
  "celebrity",
  "coastguard",
  "contractor",
  "cultivator",
  "diversifier",
  "electrician",
  "energizer",
  "engineer",
  "estate_dealer",
  "farmer",
  "forester",
  "founder",
  "fundraiser",
  "gardener",
  "generalist",
  "geologist",
  "highlander",
  "hoverlord",
  "investor",
  "landlord",
  "landscaper",
  "legend",
  "magnate",
  "mayor",
  "metallurgist",
  "metropolist",
  "miner",
  "mogul",
  "pioneer",
  "planner",
  "promoter",
  "researcher",
  "rim_settler",
  "scientist",
  "space_baron",
  "spacefarer",
  "suburbian",
  "tactician",
  "terraformer",
  "thermalist",
  "trader",
  "traveller",
  "tycoon",
  "venuphile",
  "zoologist",
]);

function CardMobile({ slug, type, title, description, source }) {
  const { showDescriptions } = useStore();

  return (
    <div className="card-outer">
      <div className="card-expansion-icon">
        <ExpansionIcon source={source} />
      </div>
      <div className="card-inner">
        {ICON_SLUGS.has(slug) ? (
          <img
            src={process.env.PUBLIC_URL + "/ma-icons/" + slug + ".png"}
            className="ma-logo"
            alt=""
          />
        ) : (
          <p className="ma-title">{title}</p>
        )}
        {showDescriptions && <p className="ma-description">{description}</p>}
      </div>
    </div>
  );
}

export default CardMobile;
