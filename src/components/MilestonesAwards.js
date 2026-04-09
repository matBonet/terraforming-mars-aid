import useStore from '../store';
import Card from './Card';

function MilestonesAwards({ type, cards, orient, tooFew }) {
	const { rerandomizeMilestones, rerandomizeAwards } = useStore();
	const onRerandomize = type === 'milestones' ? rerandomizeMilestones : rerandomizeAwards;

	return (
		<div className={'ma-group-'+orient}>
			<div className="nav-bar-ma">
				<div
					className="nav-bar-ma-pill"
					onClick={!tooFew ? onRerandomize : undefined}
					title={!tooFew ? 'Re-roll ' + type : undefined}
					style={!tooFew ? { cursor: 'pointer' } : {}}
				>
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
							slug={key}
							type={type}
							title={cards[key].name.toUpperCase()}
							description={cards[key].description}
						/>;
					})}
				</div>
			)}
		</div>
	);
};

export default MilestonesAwards;
