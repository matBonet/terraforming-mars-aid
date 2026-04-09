import useStore from '../store';
import ExpansionIcon from './ExpansionIcon';

const ICON_SLUGS = new Set([
  'banker', 'benefactor', 'botanist', 'builder', 'celebrity', 'coastguard',
  'contractor', 'cultivator', 'diversifier', 'electrician', 'energizer',
  'engineer', 'estate_dealer', 'farmer', 'forester', 'founder', 'fundraiser',
  'gardener', 'generalist', 'geologist', 'highlander', 'hoverlord', 'investor',
  'landlord', 'landscaper', 'legend', 'magnate', 'mayor', 'metallurgist',
  'metropolist', 'miner', 'mogul', 'pioneer', 'planner', 'promoter',
  'researcher', 'rim_settler', 'scientist', 'space_baron', 'spacefarer',
  'suburbian', 'tactician', 'terraformer', 'thermalist', 'trader', 'traveller',
  'tycoon', 'venuphile', 'zoologist',
]);

function Card({ slug, type, title, description, source }) {
  const { showDescriptions, removeMilestone, removeAward, rerollMilestone, rerollAward } = useStore();
  const onRemove = type === 'milestones' ? () => removeMilestone(slug) : () => removeAward(slug);
  const onReroll = type === 'milestones' ? () => rerollMilestone(slug) : () => rerollAward(slug);

  return (
    <div className="card-outer">
      <button className="card-reroll-btn" onClick={onReroll} title="Re-roll">&#x21BB;</button>
      <button className="card-remove-btn" onClick={onRemove} title="Exclude and re-roll">&#x2715;</button>
      <div className="card-expansion-icon"><ExpansionIcon source={source} /></div>
      <div className="card-inner">
        {ICON_SLUGS.has(slug)
          ? <img src={process.env.PUBLIC_URL + "/ma-icons/" + slug + ".png"} className="ma-logo" alt="" />
          : <p className="ma-title">{title}</p>
        }
        {showDescriptions && <p className="ma-description">{description}</p>}
      </div>
    </div>
  );
};

export default Card;
