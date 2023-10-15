import { useWindowSize } from '@uidotdev/usehooks';
import NavBar from './components/NavBar'
import MilestonesAwards from './components/MilestonesAwards'
import milestones from './milestones.json'
import awards from './awards.json'


function pickRandomItems( obj, n ) {    
  var keys = Object.keys(obj)
  var selected_arr = [];
  var cards = {}

  while (selected_arr.length < n) {
    var rand = Math.floor(Math.random() * keys.length);
    var key = keys[rand];
    selected_arr.push(key);
    cards[key] = obj[key]
    keys.splice(rand, 1);
  }
  return cards;
};

var picked_milestones = pickRandomItems(milestones, 5)
var picked_awards = pickRandomItems(awards, 5)

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
          <MilestonesAwards type='milestones' cards={picked_milestones} orient='h'/>
          <MilestonesAwards type='awards' cards={picked_awards} orient='h'/>
        </div>
      }
      {
        size.width < 1.3*size.height &&
        <div className='body-ma-v'>
          <MilestonesAwards type='milestones' cards={picked_milestones} orient='v'/>
          <MilestonesAwards type='awards' cards={picked_awards} orient='v'/>
        </div>
      }
      
    </div>
  );
}
export default App;
