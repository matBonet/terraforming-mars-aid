import Card from './Card'

function MilestonesAwards({ type, cards, orient }) {
	return (
		<div className={'ma-group-'+orient}>
			<div className="nav-bar-ma">
				<h3>{type.toUpperCase()}</h3>
			</div>
			<div className={"ma-cards-" + orient}>				
				{
					Object.keys(cards).map( function(key, index) {
						return <Card 
							key={key}
							short={key}
							title={cards[key].name.toUpperCase()}
							description={cards[key].description}
						/>;
					})}
			</div>
		</div>
	);
};

export default MilestonesAwards;