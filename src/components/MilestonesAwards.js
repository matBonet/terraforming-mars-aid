import Card from './Card'

function MilestonesAwards({ type, cards, orient, onRerandomize, onRemove, tooFew }) {
	return (
		<div className={'ma-group-'+orient}>
			<div className="nav-bar-ma" onClick={!tooFew ? onRerandomize : undefined} title={!tooFew ? 'Re-roll ' + type : undefined} style={tooFew ? { cursor: 'default' } : {}}>
				<div className="nav-bar-ma-pill">
					<span>{type.toUpperCase()}</span>
					{!tooFew && <span className="rerandomize-icon">&#x21BB;</span>}
				</div>
			</div>
			{tooFew ? (
				<div className="too-few-warning">
					At least 5 {type} must be available — enable more in Settings.
				</div>
			) : (
				<div className={"ma-cards-" + orient}>
					{Object.keys(cards).map(function(key) {
						return <Card
							key={key}
							short={key}
							title={cards[key].name.toUpperCase()}
							description={cards[key].description}
							onRemove={() => onRemove(key)}
						/>;
					})}
				</div>
			)}
		</div>
	);
};

export default MilestonesAwards;
