import useStore from "../store";
import { usePlatform } from "../hooks/usePlatform";
import Card from "./Card";
import { FaRotateRight } from 'react-icons/fa6';

function MilestonesAwards({ type, cards, orient, warning }) {
  const { isMobile } = usePlatform();
  const { rerandomizeMilestones, rerandomizeAwards, requestAction } =
    useStore();
  const rerandomize =
    type === "milestones" ? rerandomizeMilestones : rerandomizeAwards;
  const onRerandomize = () => requestAction(rerandomize);
  const blocked = !!warning;

  return (
    <div className={"ma-group-" + orient}>
      {!isMobile && (
        <div className="nav-bar-ma">
          <div
            className="nav-bar-ma-pill"
            onClick={!blocked ? onRerandomize : undefined}
            title={!blocked ? "Re-roll " + type : undefined}
            style={!blocked ? { cursor: "pointer" } : {}}
          >
            <span>{type.toUpperCase()}</span>
            {!blocked && <FaRotateRight className="rerandomize-icon" aria-hidden="true" />}
          </div>
        </div>
      )}
      {blocked ? (
        <div className="too-few-warning">{warning}</div>
      ) : (
        <div className={"ma-cards-" + orient}>
          {Object.keys(cards).map(function (key) {
            return (
              <Card
                key={key}
                slug={key}
                type={type}
                title={cards[key].name.toUpperCase()}
                description={cards[key].description}
                source={cards[key].source}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MilestonesAwards;
