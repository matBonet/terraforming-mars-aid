import { useWindowSize } from '@uidotdev/usehooks';
import NavBar from './components/NavBar'
import MilestonesAwards from './components/MilestonesAwards'

function App() {
  const size = useWindowSize();

  return (
    <div className='container'>
      <NavBar />
      {
        size.width >= size.height &&
        <div className='body-ma-h'>
          <MilestonesAwards title='milestones' orient='h'/>
          <MilestonesAwards title='awards' orient='h'/>
        </div>
      }
      {
        size.width < size.height &&
        <div className='body-ma-v'>
          <MilestonesAwards title='milestones' orient='v'/>
          <MilestonesAwards title='awards' orient='v'/>
        </div>
      }
      
    </div>
  );
}
export default App;
