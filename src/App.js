import { useState } from 'react';
import { useWindowSize } from '@uidotdev/usehooks';
import NavBar from './components/NavBar';
import MilestonesAwards from './components/MilestonesAwards';
import SettingsModal from './components/SettingsModal';

import generateMilestonesAwards from './randomizer';
import awardsData from './ma-data/awards.json';
import milestonesData from './ma-data/milestones.json';

const queryParameters = new URLSearchParams(window.location.search);
const initialExcludeMilestones = (queryParameters.get("exclude_milestones") || "").split(',').filter(Boolean);
const initialExcludeAwards = (queryParameters.get("exclude_awards") || "").split(',').filter(Boolean);
const initialMaxPairSynergy = parseInt(queryParameters.get("max_pair_synergy") || 6);
const initialMaxTotalSynergy = parseInt(queryParameters.get("max_total_synergy") || 30);

function syncURL(exclMilestones, exclAwards) {
  const params = new URLSearchParams(window.location.search);
  if (exclMilestones.length) params.set('exclude_milestones', exclMilestones.join(','));
  else params.delete('exclude_milestones');
  if (exclAwards.length) params.set('exclude_awards', exclAwards.join(','));
  else params.delete('exclude_awards');
  const search = params.toString();
  window.history.replaceState(null, '', search ? '?' + search : window.location.pathname);
}

function getProperties(obj, arr) {
  return arr.reduce((result, prop) => (obj.hasOwnProperty(prop) ? { ...result, [prop]: obj[prop] } : result), {});
}

function App() {
  const size = useWindowSize();
  const [excludeMilestones, setExcludeMilestones] = useState(initialExcludeMilestones);
  const [excludeAwards, setExcludeAwards] = useState(initialExcludeAwards);
  const [draw, setDraw] = useState(() =>
    generateMilestonesAwards(initialExcludeMilestones, initialExcludeAwards, initialMaxPairSynergy, initialMaxTotalSynergy)
  );
  const [settingsOpen, setSettingsOpen] = useState(false);

  function rerandomize(exclM, exclA) {
    setDraw(generateMilestonesAwards(exclM, exclA, initialMaxPairSynergy, initialMaxTotalSynergy));
  }

  function handleSettingsClose(newExclM, newExclA) {
    setExcludeMilestones(newExclM);
    setExcludeAwards(newExclA);
    syncURL(newExclM, newExclA);
    rerandomize(newExclM, newExclA);
    setSettingsOpen(false);
  }

  return (
    <div className='container'>
      <NavBar
        onRerandomize={() => rerandomize(excludeMilestones, excludeAwards)}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      {
        size.width >= 1.3 * size.height &&
        <div className='body-ma-h'>
          <MilestonesAwards type='milestones' cards={getProperties(milestonesData, draw.milestones)} orient='h' />
          <MilestonesAwards type='awards' cards={getProperties(awardsData, draw.awards)} orient='h' />
        </div>
      }
      {
        size.width < 1.3 * size.height &&
        <div className='body-ma-v'>
          <MilestonesAwards type='milestones' cards={getProperties(milestonesData, draw.milestones)} orient='v' />
          <MilestonesAwards type='awards' cards={getProperties(awardsData, draw.awards)} orient='v' />
        </div>
      }
      {settingsOpen && (
        <SettingsModal
          excludeMilestones={excludeMilestones}
          excludeAwards={excludeAwards}
          onClose={handleSettingsClose}
        />
      )}
    </div>
  );
}

export default App;
