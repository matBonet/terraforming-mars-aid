import Card from './Card'

function MilestonesAwards({ title, cards, orient }) {
	return (
		<div className={'ma-group-'+orient}>
			<div className="nav-bar-ma">
				<h3>{title.toUpperCase()}</h3>
			</div>
			<div className={"ma-cards-" + orient}>
				{
					cards.map((item, index)=>{
						return <Card name={item} key={item}/>
				})}
			</div>
		</div>
	);
};

export default MilestonesAwards;