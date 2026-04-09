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

function Card({ short, title, description, onRemove, onReroll, showDescriptions }) {
  return (
    <div className="card-outer">
      <button className="card-reroll-btn" onClick={onReroll} title="Re-roll">&#x21BB;</button>
      <button className="card-remove-btn" onClick={onRemove} title="Exclude and re-roll">&#x2715;</button>
      <div className="card-inner">
        {ICON_SLUGS.has(short)
          ? <img src={process.env.PUBLIC_URL + "/ma-icons/" + short + ".png"} className="ma-logo" alt="" />
          : <p className="ma-title">{title}</p>
        }
        {showDescriptions && <p className="ma-description">{description}</p>}
      </div>
    </div>
  )
};

export default Card;
