import { useWindowSize } from '@uidotdev/usehooks';
import NavBar from './components/NavBar'
import MilestonesAwards from './components/MilestonesAwards'

import generateMilestonesAwards from './randomizer';
import awardsData from './ma-data/awards.json'
import milestonesData from './ma-data/milestones.json'

var draw = generateMilestonesAwards(null, null, 6, 35);

function getProperties(obj, arr) {
  return arr.reduce((result, prop) => (obj.hasOwnProperty(prop) ? { ...result, [prop]: obj[prop] } : result), {});
}

console.log(getProperties(milestonesData, draw.milestones));

const queryParameters = new URLSearchParams(window.location.search)
const excludeMilestones = (queryParameters.get("exclude_milestones") || "").split(',');
const excludeAwards = (queryParameters.get("exclude_awards") || "").split(',');
const max_pair_synergy = parseInt(queryParameters.get("max_pair_synergy") || 6);
const max_total_synergy = parseInt(queryParameters.get("max_total_synergy") || 30) ;

function App() {
  const size = useWindowSize();
  return (
    <div className='container'>
      <NavBar />
      {
        size.width >= 1.3*size.height &&
        <div className='body-ma-h'>
          <MilestonesAwards type='milestones' cards={getProperties(milestonesData, draw.milestones)} orient='h'/>
          <MilestonesAwards type='awards' cards={getProperties(awardsData, draw.awards)} orient='h'/>
        </div>
      }
      {
        size.width < 1.3*size.height &&
        <div className='body-ma-v'>
          <MilestonesAwards type='milestones' cards={getProperties(milestonesData, draw.milestones)} orient='v'/>
          <MilestonesAwards type='awards' cards={getProperties(awardsData, draw.awards)} orient='v'/>
        </div>
      }
      
    </div>
  );
}
export default App;
