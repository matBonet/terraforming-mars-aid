import { useState } from 'react';
import { useWindowSize } from '@uidotdev/usehooks';
import NavBar from './components/NavBar';
import MilestonesAwards from './components/MilestonesAwards';
import SettingsModal from './components/SettingsModal';
import useStore, { REQUIRED } from './store';
import milestonesData from './ma-data/milestones.json';
import awardsData from './ma-data/awards.json';

function getProperties(obj, arr) {
  return arr.reduce((result, prop) => (obj.hasOwnProperty(prop) ? { ...result, [prop]: obj[prop] } : result), {});
}

function App() {
  const size = useWindowSize();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { draw, availableMilestones, availableAwards, rerandomize } = useStore();

  const enoughMilestones = availableMilestones.length >= REQUIRED;
  const enoughAwards = availableAwards.length >= REQUIRED;

  const milestoneCards = getProperties(milestonesData, draw.milestones);
  const awardCards = getProperties(awardsData, draw.awards);

  const isHorizontal = size.width >= 1.3 * size.height;

  return (
    <div className='container'>
      <NavBar
        onRerandomize={rerandomize}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <div className={isHorizontal ? 'body-ma-h' : 'body-ma-v'}>
        <MilestonesAwards type='milestones' cards={milestoneCards} orient={isHorizontal ? 'h' : 'v'} tooFew={!enoughMilestones} />
        <MilestonesAwards type='awards' cards={awardCards} orient={isHorizontal ? 'h' : 'v'} tooFew={!enoughAwards} />
      </div>
      {settingsOpen && (
        <SettingsModal onClose={() => setSettingsOpen(false)} />
      )}
    </div>
  );
}

export default App;
