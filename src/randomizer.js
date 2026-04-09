import synergyMatrix from './ma-data/synergies.json';

const REQUIRED = 5;

function getSynergy(ma1, ma2) {
  const [a, b] = ma1 < ma2 ? [ma1, ma2] : [ma2, ma1];
  return (synergyMatrix[a] && synergyMatrix[a][b]) || 0;
}

function makeLinearDecrease(max) {
  return (n) => 1 - n / (max + 1);
}

// Returns a random slug from candidates that is not hard-rejected by any already-selected item,
// using probCurve for weighted selection. Returns null only if no viable candidate exists.
function trySelect(candidates, already, probCurve) {
  // A candidate is viable if its acceptance probability with every already-selected item is > 0.
  const viable = candidates.filter(c => already.every(item => probCurve(getSynergy(c, item)) > 0));
  if (viable.length === 0) return null;

  // Use the joint probability as a weight. Retry up to 200 times, then fall back to a random viable pick.
  for (let i = 0; i < 200; i++) {
    const candidate = viable[Math.floor(Math.random() * viable.length)];
    if (already.every(item => Math.random() < probCurve(getSynergy(candidate, item)))) {
      return candidate;
    }
  }
  return viable[Math.floor(Math.random() * viable.length)];
}

// Returns a milestone slug, or null if no valid candidate can be selected.
export function selectMilestone(availableMilestones, selectedMilestones, selectedAwards, maxIndividualSynergy) {
  const probCurve = makeLinearDecrease(maxIndividualSynergy);
  const candidates = availableMilestones.filter(m => !selectedMilestones.includes(m));
  return trySelect(candidates, [...selectedMilestones, ...selectedAwards], probCurve);
}

// Returns an award slug, or null if no valid candidate can be selected.
export function selectAward(availableAwards, selectedMilestones, selectedAwards, maxIndividualSynergy) {
  const probCurve = makeLinearDecrease(maxIndividualSynergy);
  const candidates = availableAwards.filter(a => !selectedAwards.includes(a));
  return trySelect(candidates, [...selectedMilestones, ...selectedAwards], probCurve);
}

export function generateMilestonesAwards(availableMilestones, availableAwards, maxIndividualSynergy) {
  const probCurve = makeLinearDecrease(maxIndividualSynergy);
  const milestones = [];
  const awards = [];

  while (milestones.length + awards.length < REQUIRED * 2) {
    const mNeeded = REQUIRED - milestones.length;
    const aNeeded = REQUIRED - awards.length;
    const pickMilestone = Math.random() < mNeeded / (mNeeded + aNeeded);

    if (pickMilestone) {
      const m = trySelect(availableMilestones.filter(m => !milestones.includes(m)), [...milestones, ...awards], probCurve);
      if (m === null) throw new Error('Not enough milestones satisfy synergy constraints. Enable more milestones.');
      milestones.push(m);
    } else {
      const a = trySelect(availableAwards.filter(a => !awards.includes(a)), [...milestones, ...awards], probCurve);
      if (a === null) throw new Error('Not enough awards satisfy synergy constraints. Enable more awards.');
      awards.push(a);
    }
  }

  return { milestones, awards };
}

export function generateMilestonesOnly(availableMilestones, currentAwards, maxIndividualSynergy) {
  const probCurve = makeLinearDecrease(maxIndividualSynergy);
  const milestones = [];

  while (milestones.length < REQUIRED) {
    const m = trySelect(availableMilestones.filter(m => !milestones.includes(m)), [...milestones, ...currentAwards], probCurve);
    if (m === null) throw new Error('Not enough milestones satisfy synergy constraints. Enable more milestones.');
    milestones.push(m);
  }

  return { milestones, awards: currentAwards };
}

export function generateAwardsOnly(availableAwards, currentMilestones, maxIndividualSynergy) {
  const probCurve = makeLinearDecrease(maxIndividualSynergy);
  const awards = [];

  while (awards.length < REQUIRED) {
    const a = trySelect(availableAwards.filter(a => !awards.includes(a)), [...currentMilestones, ...awards], probCurve);
    if (a === null) throw new Error('Not enough awards satisfy synergy constraints. Enable more awards.');
    awards.push(a);
  }

  return { milestones: currentMilestones, awards };
}
