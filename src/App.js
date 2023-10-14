import { useWindowSize } from '@uidotdev/usehooks';
import NavBar from './components/NavBar'
import MilestonesAwards from './components/MilestonesAwards'

function App() {
  const size = useWindowSize();

  return (
    <div className='container'>
      <NavBar />
      {
        size.width >= 1.3*size.height &&
        <div className='body-ma-h'>
          <MilestonesAwards title='milestones' cards={['mayor', 'terraformer', 'geologist', 'investor', 'forester']} orient='h'/>
          <MilestonesAwards title='awards' cards={['promoter', 'highlander', 'politician', 'celebrity', 'metallurgist']} orient='h'/>
        </div>
      }
      {
        size.width < 1.3*size.height &&
        <div className='body-ma-v'>
          <MilestonesAwards title='milestones' cards={['mayor', 'terraformer', 'geologist', 'investor', 'forester']} orient='v'/>
          <MilestonesAwards title='awards' cards={['promoter', 'highlander', 'politician', 'celebrity', 'metallurgist']} orient='v'/>
        </div>
      }
      
    </div>
  );
}
export default App;
