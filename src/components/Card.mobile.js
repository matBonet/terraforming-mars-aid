import { useState } from "react";
import useStore from "../store";
import ExpansionIcon from "./ExpansionIcon";
import CardActionSheet from "./CardActionSheet";

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

function CardMobile({ slug, type, title, description, source }) {
  const [sheetOpen, setSheetOpen] = useState(false);
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
    <>
      <div
        className={"card-outer" + (isGreyed ? " card-outer--greyed" : "")}
        onClick={() => setSheetOpen(true)}
      >
        {marker && (
          <div className="card-mobile-marker">
            <IsoCubeInline color={marker} />
          </div>
        )}
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
        </div>
      </div>

      {sheetOpen && (
        <CardActionSheet
          title={title}
          description={description}
          marker={marker}
          isGreyed={isGreyed}
          onSetMarker={(color) => setMarker(slug, color, type)}
          onClearMarker={() => clearMarker(slug)}
          onReroll={() => requestAction(onReroll)}
          onExclude={() => requestAction(onRemove)}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </>
  );
}

// Small inline cube shown on the card face when claimed (avoids import cycle issues with IsoCube)
function IsoCubeInline({ color }) {
  const COLORS = {
    red: { top: "#FF6B6B", left: "#E53935", right: "#B71C1C" },
    yellow: { top: "#FFF176", left: "#FDD835", right: "#F9A825" },
    green: { top: "#81C784", left: "#43A047", right: "#1B5E20" },
    black: { top: "#757575", left: "#424242", right: "#212121" },
    blue: { top: "#64B5F6", left: "#1E88E5", right: "#0D47A1" },
  };
  const { top, left, right } = COLORS[color];
  return (
    <svg
      viewBox="-1 -1 18 16"
      width="28"
      height="24.5"
      style={{ display: "block" }}
    >
      <polygon points="8,0 16,4 8,7 0,4" fill={top} />
      <polygon points="0,4 8,7 8,14 0,10" fill={left} />
      <polygon points="16,4 16,10 8,14 8,7" fill={right} />
    </svg>
  );
}

export default CardMobile;
