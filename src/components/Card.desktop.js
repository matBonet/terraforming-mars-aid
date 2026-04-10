import useStore from "../store";
import ExpansionIcon from "./ExpansionIcon";
import IsoCube, { CUBE_COLORS } from "./IsoCube";

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

function CardDesktop({ slug, type, title, description, source }) {
  const {
    showDescriptions,
    draw,
    markers,
    setMarker,
    clearMarker,
    requestAction,
    removeMilestone,
    removeAward,
    rerollMilestone,
    rerollAward,
  } = useStore();

  const claimedCount = draw[type].filter((s) => markers[s]).length;
  const marker = markers[slug];
  const isGreyed = !marker && claimedCount >= 3;

  const onRemove =
    type === "milestones"
      ? () => removeMilestone(slug)
      : () => removeAward(slug);
  const onReroll =
    type === "milestones"
      ? () => rerollMilestone(slug)
      : () => rerollAward(slug);

  return (
    <div className={"card-outer" + (isGreyed ? " card-outer--greyed" : "")}>
      <button
        className="card-reroll-btn"
        onClick={() => requestAction(onReroll)}
        title="Re-roll"
      >
        &#x21BB;
      </button>
      <button
        className="card-remove-btn"
        onClick={() => requestAction(onRemove)}
        title="Exclude and re-roll"
      >
        &#x2715;
      </button>
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
        <div className="card-marker-row">
          {marker ? (
            <button
              className="card-marker-btn card-marker-btn--claimed"
              onClick={() => clearMarker(slug)}
              title="Remove marker"
            >
              <IsoCube color={marker} size={35} />
            </button>
          ) : !isGreyed ? (
            CUBE_COLORS.map((color) => (
              <button
                key={color}
                className="card-marker-btn"
                onClick={() => setMarker(slug, color, type)}
                title={`Claim with ${color} cube`}
              >
                <IsoCube color={color} size={25} />
              </button>
            ))
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default CardDesktop;
