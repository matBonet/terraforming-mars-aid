import NavBar from './components/NavBar'
import MilestonesAwards from './components/MilestonesAwards'

function App() {
  return (
    <div className='container'>
      <NavBar />
      <MilestonesAwards title='milestones'/>
      <MilestonesAwards title='awards'/>
    </div>
  );
}

export default App;
