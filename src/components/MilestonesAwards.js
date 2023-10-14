import Card from './Card'

function MilestonesAwards({ title, cards, orient }) {
	return (
		<div className={'ma-group-'+orient}>
			<div className="nav-bar-ma">
				<h3>{title.toUpperCase()}</h3>
			</div>
			<div className={"ma-cards-" + orient}>
				<Card name='landlord'/>
				<Card name='landlord'/>
				<Card name='landlord'/>
				<Card name='landlord'/>
				<Card name='landlord'/>
			</div>
		</div>
	);
};

export default MilestonesAwards;