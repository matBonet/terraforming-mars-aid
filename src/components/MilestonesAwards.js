import useStore from '../store';
import Card from './Card';

function MilestonesAwards({ type, cards, orient, tooFew, warning }) {
	const { rerandomizeMilestones, rerandomizeAwards } = useStore();
	const onRerandomize = type === 'milestones' ? rerandomizeMilestones : rerandomizeAwards;
	const blocked = tooFew || !!warning;

	return (
		<div className={'ma-group-'+orient}>
			<div className="nav-bar-ma">
				<div
					className="nav-bar-ma-pill"
					onClick={!blocked ? onRerandomize : undefined}
					title={!blocked ? 'Re-roll ' + type : undefined}
					style={!blocked ? { cursor: 'pointer' } : {}}
				>
					<span>{type.toUpperCase()}</span>
					{!blocked && <span className="rerandomize-icon">&#x21BB;</span>}
				</div>
			</div>
			{tooFew ? (
				<div className="too-few-warning">
					At least 5 {type} must be available — enable more in Settings.
				</div>
			) : warning ? (
				<div className="too-few-warning">
					{warning}
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
							source={cards[key].source}
						/>;
					})}
				</div>
			)}
		</div>
	);
};

export default MilestonesAwards;
