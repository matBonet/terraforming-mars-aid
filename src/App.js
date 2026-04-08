import { useState } from 'react';
import { useWindowSize } from '@uidotdev/usehooks';
import NavBar from './components/NavBar';
import MilestonesAwards from './components/MilestonesAwards';
import SettingsModal from './components/SettingsModal';

import generateMilestonesAwards, { generateMilestonesOnly, generateAwardsOnly, generateSingleMilestone, generateSingleAward } from './randomizer';
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

  function rerandomizeMilestones() {
    setDraw(prev => generateMilestonesOnly(excludeMilestones, prev.awards, initialMaxPairSynergy, initialMaxTotalSynergy));
  }

  function rerandomizeAwards() {
    setDraw(prev => generateAwardsOnly(excludeAwards, prev.milestones, initialMaxPairSynergy, initialMaxTotalSynergy));
  }

  function removeMilestone(slug) {
    const newExclM = [...excludeMilestones, slug];
    setExcludeMilestones(newExclM);
    syncURL(newExclM, excludeAwards);
    setDraw(prev => {
      const remaining = prev.milestones.filter(m => m !== slug);
      const replacement = generateSingleMilestone(newExclM, remaining, prev.awards, initialMaxPairSynergy);
      return { ...prev, milestones: [...remaining, replacement] };
    });
  }

  function removeAward(slug) {
    const newExclA = [...excludeAwards, slug];
    setExcludeAwards(newExclA);
    syncURL(excludeMilestones, newExclA);
    setDraw(prev => {
      const remaining = prev.awards.filter(a => a !== slug);
      const replacement = generateSingleAward(newExclA, prev.milestones, remaining, initialMaxPairSynergy);
      return { ...prev, awards: [...remaining, replacement] };
    });
  }

  function handleSettingsChange(newExclM, newExclA) {
    setExcludeMilestones(newExclM);
    setExcludeAwards(newExclA);
    syncURL(newExclM, newExclA);
    const exclMSet = new Set(newExclM);
    const exclASet = new Set(newExclA);
    const affectsDraw =
      draw.milestones.some(slug => exclMSet.has(slug)) ||
      draw.awards.some(slug => exclASet.has(slug));
    if (affectsDraw) rerandomize(newExclM, newExclA);
  }

  function handleSettingsClose() {
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
          <MilestonesAwards type='milestones' cards={getProperties(milestonesData, draw.milestones)} orient='h' onRerandomize={rerandomizeMilestones} onRemove={removeMilestone} />
          <MilestonesAwards type='awards' cards={getProperties(awardsData, draw.awards)} orient='h' onRerandomize={rerandomizeAwards} onRemove={removeAward} />
        </div>
      }
      {
        size.width < 1.3 * size.height &&
        <div className='body-ma-v'>
          <MilestonesAwards type='milestones' cards={getProperties(milestonesData, draw.milestones)} orient='v' onRerandomize={rerandomizeMilestones} onRemove={removeMilestone} />
          <MilestonesAwards type='awards' cards={getProperties(awardsData, draw.awards)} orient='v' onRerandomize={rerandomizeAwards} onRemove={removeAward} />
        </div>
      }
      {settingsOpen && (
        <SettingsModal
          excludeMilestones={excludeMilestones}
          excludeAwards={excludeAwards}
          onChange={handleSettingsChange}
          onClose={handleSettingsClose}
        />
      )}
    </div>
  );
}

export default App;
