import { useState } from "react";
import useStore from "../store";
import ExpansionIcon from "./ExpansionIcon";
import CardActionSheet from "./CardActionSheet";

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
  const [sheetOpen, setSheetOpen] = useState(false);
  const {
    showDescriptions,
    removeMilestone,
    removeAward,
    rerollMilestone,
    rerollAward,
  } = useStore();

  const onRemove = type === "milestones" ? () => removeMilestone(slug) : () => removeAward(slug);
  const onReroll = type === "milestones" ? () => rerollMilestone(slug) : () => rerollAward(slug);

  return (
    <>
      <div
        className="card-outer"
        onClick={() => setSheetOpen(true)}
      >
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

      {sheetOpen && (
        <CardActionSheet
          title={title}
          description={description}
          onReroll={onReroll}
          onExclude={onRemove}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </>
  );
}

export default CardMobile;
