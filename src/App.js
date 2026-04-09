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

const REQUIRED = 5;

function countAvailable(data, excluded) {
  const exclSet = new Set(excluded);
  return Object.keys(data).filter(k => !exclSet.has(k)).length;
}

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
  const [draw, setDraw] = useState(() => {
    if (countAvailable(milestonesData, initialExcludeMilestones) < REQUIRED ||
        countAvailable(awardsData, initialExcludeAwards) < REQUIRED) {
      return { milestones: [], awards: [], synergies: {} };
    }
    return generateMilestonesAwards(initialExcludeMilestones, initialExcludeAwards, initialMaxPairSynergy, initialMaxTotalSynergy);
  });
  const [settingsOpen, setSettingsOpen] = useState(false);

  const enoughMilestones = countAvailable(milestonesData, excludeMilestones) >= REQUIRED;
  const enoughAwards = countAvailable(awardsData, excludeAwards) >= REQUIRED;

  function rerandomize(exclM, exclA) {
    if (countAvailable(milestonesData, exclM) < REQUIRED || countAvailable(awardsData, exclA) < REQUIRED) return;
    setDraw(generateMilestonesAwards(exclM, exclA, initialMaxPairSynergy, initialMaxTotalSynergy));
  }

  function rerandomizeMilestones() {
    if (!enoughMilestones) return;
    setDraw(prev => generateMilestonesOnly(excludeMilestones, prev.awards, initialMaxPairSynergy, initialMaxTotalSynergy));
  }

  function rerandomizeAwards() {
    if (!enoughAwards) return;
    setDraw(prev => generateAwardsOnly(excludeAwards, prev.milestones, initialMaxPairSynergy, initialMaxTotalSynergy));
  }

  function rerollMilestone(slug) {
    setDraw(prev => {
      const idx = prev.milestones.indexOf(slug);
      const remaining = prev.milestones.filter(m => m !== slug);
      const replacement = generateSingleMilestone(excludeMilestones, remaining, prev.awards, initialMaxPairSynergy);
      const next = [...remaining];
      next.splice(idx, 0, replacement);
      return { ...prev, milestones: next };
    });
  }

  function rerollAward(slug) {
    setDraw(prev => {
      const idx = prev.awards.indexOf(slug);
      const remaining = prev.awards.filter(a => a !== slug);
      const replacement = generateSingleAward(excludeAwards, prev.milestones, remaining, initialMaxPairSynergy);
      const next = [...remaining];
      next.splice(idx, 0, replacement);
      return { ...prev, awards: next };
    });
  }

  function removeMilestone(slug) {
    const newExclM = [...excludeMilestones, slug];
    setExcludeMilestones(newExclM);
    syncURL(newExclM, excludeAwards);
    if (countAvailable(milestonesData, newExclM) < REQUIRED) {
      setDraw(prev => ({ ...prev, milestones: prev.milestones.filter(m => m !== slug) }));
      return;
    }
    setDraw(prev => {
      const idx = prev.milestones.indexOf(slug);
      const remaining = prev.milestones.filter(m => m !== slug);
      const replacement = generateSingleMilestone(newExclM, remaining, prev.awards, initialMaxPairSynergy);
      const next = [...remaining];
      next.splice(idx, 0, replacement);
      return { ...prev, milestones: next };
    });
  }

  function removeAward(slug) {
    const newExclA = [...excludeAwards, slug];
    setExcludeAwards(newExclA);
    syncURL(excludeMilestones, newExclA);
    if (countAvailable(awardsData, newExclA) < REQUIRED) {
      setDraw(prev => ({ ...prev, awards: prev.awards.filter(a => a !== slug) }));
      return;
    }
    setDraw(prev => {
      const idx = prev.awards.indexOf(slug);
      const remaining = prev.awards.filter(a => a !== slug);
      const replacement = generateSingleAward(newExclA, prev.milestones, remaining, initialMaxPairSynergy);
      const next = [...remaining];
      next.splice(idx, 0, replacement);
      return { ...prev, awards: next };
    });
  }

  function handleSettingsChange(newExclM, newExclA) {
    setExcludeMilestones(newExclM);
    setExcludeAwards(newExclA);
    syncURL(newExclM, newExclA);

    const nowEnoughM = countAvailable(milestonesData, newExclM) >= REQUIRED;
    const nowEnoughA = countAvailable(awardsData, newExclA) >= REQUIRED;
    const recoveredM = !enoughMilestones && nowEnoughM;
    const recoveredA = !enoughAwards && nowEnoughA;

    const exclMSet = new Set(newExclM);
    const exclASet = new Set(newExclA);
    const affectsDraw =
      draw.milestones.some(slug => exclMSet.has(slug)) ||
      draw.awards.some(slug => exclASet.has(slug));

    if (!affectsDraw && !recoveredM && !recoveredA) return;

    if (nowEnoughM && nowEnoughA) {
      rerandomize(newExclM, newExclA);
    } else {
      // Not enough for at least one category — strip any newly-excluded items without replacing
      setDraw(prev => ({
        ...prev,
        milestones: prev.milestones.filter(m => !exclMSet.has(m)),
        awards: prev.awards.filter(a => !exclASet.has(a)),
      }));
    }
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
          <MilestonesAwards type='milestones' cards={getProperties(milestonesData, draw.milestones)} orient='h' onRerandomize={rerandomizeMilestones} onRemove={removeMilestone} onReroll={rerollMilestone} tooFew={!enoughMilestones} />
          <MilestonesAwards type='awards' cards={getProperties(awardsData, draw.awards)} orient='h' onRerandomize={rerandomizeAwards} onRemove={removeAward} onReroll={rerollAward} tooFew={!enoughAwards} />
        </div>
      }
      {
        size.width < 1.3 * size.height &&
        <div className='body-ma-v'>
          <MilestonesAwards type='milestones' cards={getProperties(milestonesData, draw.milestones)} orient='v' onRerandomize={rerandomizeMilestones} onRemove={removeMilestone} onReroll={rerollMilestone} tooFew={!enoughMilestones} />
          <MilestonesAwards type='awards' cards={getProperties(awardsData, draw.awards)} orient='v' onRerandomize={rerandomizeAwards} onRemove={removeAward} onReroll={rerollAward} tooFew={!enoughAwards} />
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
