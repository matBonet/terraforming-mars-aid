import synergyMatrix from './ma-data/synergies.json'

function* combinations(arr, k) {
  function* helper(sub, index) {
    if (sub.length === k) {
      yield sub;
      return;
    }
    if (index >= arr.length) return;
    yield* helper([...sub, arr[index]], index + 1);
    yield* helper(sub, index + 1);
  }
  yield* helper([], 0);
}

function makeLinearDecrease(max) {
  return (n) => 1 - n / (max + 1);
}

function getSynergy(ma1, ma2) {
  const [a, b] = ma1 < ma2 ? [ma1, ma2] : [ma2, ma1];
  return (synergyMatrix[a] && synergyMatrix[a][b]) || 0;
}

function generatePool(available, fixed, count, probCurve) {
  const selected = new Set();
  while (selected.size < count) {
    const pool = available.filter(m => !selected.has(m));
    const candidate = pool[Math.floor(Math.random() * pool.length)];
    let rejected = false;
    for (const item of [...fixed, ...selected]) {
      if (Math.random() > probCurve(getSynergy(candidate, item))) {
        rejected = true;
        break;
      }
    }
    if (!rejected) selected.add(candidate);
  }
  return [...selected];
}

function computeSynergies(milestones, awards) {
  const all = [...milestones, ...awards].sort();
  const log = {};
  for (const [ma1, ma2] of combinations(all, 2)) {
    const s = getSynergy(ma1, ma2);
    log[ma1] = (log[ma1] || 0) + s / 2;
    log[ma2] = (log[ma2] || 0) + s / 2;
    log.total = (log.total || 0) + s;
  }
  return log;
}

function generateMilestonesAwards(availableMilestones, availableAwards, maxIndividualSynergy, maxTotalSynergy) {
  const probCurve = makeLinearDecrease(maxIndividualSynergy);
  const availM = Array.from(availableMilestones);
  const availA = Array.from(availableAwards);

  const selectedMilestones = new Set();
  const selectedAwards = new Set();
  let synergyLog = {};

  while (selectedMilestones.size + selectedAwards.size < 10) {
    if (Math.random() < 0.5) {
      selectedMilestones.add(availM[Math.floor(Math.random() * availM.length)]);
    } else {
      selectedAwards.add(availA[Math.floor(Math.random() * availA.length)]);
    }

    let mLen = selectedMilestones.size;
    let aLen = selectedAwards.size;

    while (mLen + aLen < 10) {
      let pool;
      if (mLen < aLen) {
        pool = availM.filter(m => !selectedMilestones.has(m));
      } else if (mLen > aLen) {
        pool = availA.filter(a => !selectedAwards.has(a));
      } else {
        pool = [
          ...availM.filter(m => !selectedMilestones.has(m)),
          ...availA.filter(a => !selectedAwards.has(a)),
        ];
      }

      const candidate = pool[Math.floor(Math.random() * pool.length)];
      let rejected = false;
      for (const item of [...selectedAwards, ...selectedMilestones]) {
        if (Math.random() > probCurve(getSynergy(candidate, item))) {
          rejected = true;
          break;
        }
      }
      if (rejected) continue;

      if (availM.includes(candidate)) {
        selectedMilestones.add(candidate);
        mLen++;
      } else {
        selectedAwards.add(candidate);
        aLen++;
      }
    }

    const all = [...selectedAwards, ...selectedMilestones].sort();
    synergyLog = {};
    for (const [ma1, ma2] of combinations(all, 2)) {
      const s = getSynergy(ma1, ma2);
      synergyLog[ma1] = (synergyLog[ma1] || 0) + s / 2;
      synergyLog[ma2] = (synergyLog[ma2] || 0) + s / 2;
      synergyLog.total = (synergyLog.total || 0) + s;
    }

    if (synergyLog.total > maxTotalSynergy) {
      selectedMilestones.clear();
      selectedAwards.clear();
      synergyLog = {};
    }
  }

  return { milestones: [...selectedMilestones], awards: [...selectedAwards], synergies: synergyLog };
}

export function generateSingleMilestone(availableMilestones, remainingMilestones, currentAwards, maxIndividualSynergy) {
  const probCurve = makeLinearDecrease(maxIndividualSynergy);
  const remaining = new Set(remainingMilestones);
  const available = availableMilestones.filter(m => !remaining.has(m));
  const [picked] = generatePool(available, [...remainingMilestones, ...currentAwards], 1, probCurve);
  return picked;
}

export function generateSingleAward(availableAwards, currentMilestones, remainingAwards, maxIndividualSynergy) {
  const probCurve = makeLinearDecrease(maxIndividualSynergy);
  const remaining = new Set(remainingAwards);
  const available = availableAwards.filter(a => !remaining.has(a));
  const [picked] = generatePool(available, [...currentMilestones, ...remainingAwards], 1, probCurve);
  return picked;
}

export function generateMilestonesOnly(availableMilestones, currentAwards, maxIndividualSynergy, maxTotalSynergy) {
  const probCurve = makeLinearDecrease(maxIndividualSynergy);
  let milestones, synergies;
  do {
    milestones = generatePool(availableMilestones, currentAwards, 5, probCurve);
    synergies = computeSynergies(milestones, currentAwards);
  } while (synergies.total > maxTotalSynergy);
  return { milestones, awards: currentAwards, synergies };
}

export function generateAwardsOnly(availableAwards, currentMilestones, maxIndividualSynergy, maxTotalSynergy) {
  const probCurve = makeLinearDecrease(maxIndividualSynergy);
  let awards, synergies;
  do {
    awards = generatePool(availableAwards, currentMilestones, 5, probCurve);
    synergies = computeSynergies(currentMilestones, awards);
  } while (synergies.total > maxTotalSynergy);
  return { milestones: currentMilestones, awards, synergies };
}

export default generateMilestonesAwards;
