import useStore from "../store";
import ExpansionIcon from "./ExpansionIcon";
import IsoCube, { CUBE_COLORS } from "./IsoCube";
import { FaRotateRight, FaXmark } from 'react-icons/fa6';

const ICON_SLUGS = new Set([
  "_administrator",
  "_banker",
  "_benefactor",
  "_biologist",
  "_botanist",
  "_celebrity",
  "_collector",
  "_constructor",
  "_cultivator",
  "_electrician",
  "_estate_dealer",
  "_excentric",
  "_forecaster",
  "_founder",
  "_highlander",
  "_landscaper",
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
        <FaRotateRight aria-hidden="true" />
      </button>
      <button
        className="card-remove-btn"
        onClick={() => requestAction(onRemove)}
        title="Exclude and re-roll"
      >
        <FaXmark aria-hidden="true" />
      </button>
      <div className="card-expansion-icon">
        <ExpansionIcon source={source} />
      </div>
      <div className="card-inner">
        {ICON_SLUGS.has(slug) && (
          <img
            src={process.env.PUBLIC_URL + "/ma-icons/" + slug.slice(1) + ".svg"}
            className="ma-logo"
            alt=""
          />
        )}
        <p className="ma-title">{title}</p>
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
