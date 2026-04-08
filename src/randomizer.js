//import combinations from 'js-combinatorics'
import milestonesData from './ma-data/milestones.json'
import awardsData from './ma-data/awards.json'
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
};

function getSynergy(ma1, ma2, synergyMatrix) {
  const pair = ma1 > ma2 ? [ma2, ma1] : [ma1, ma2];
  const synergy = (synergyMatrix[pair[0]] && synergyMatrix[pair[0]][pair[1]]) || null;
  if (synergy === null) {
    return 0;
  }
  return synergy;
}

function generateMilestonesAwards(excludedMilestones, excludedAwards, maxIndividualSynergy, maxTotalSynergy) {
  const probCurve = makeLinearDecrease(maxIndividualSynergy);
  excludedMilestones = new Set(excludedMilestones) || new Set();
  excludedAwards = new Set(excludedAwards) || new Set();

  const milestonesNames = new Set(Object.keys(milestonesData));
  const awardsNames = new Set(Object.keys(awardsData));

  const availableMilestones = new Set([...milestonesNames].filter((m) => !excludedMilestones.has(m)));
  const availableAwards = new Set([...awardsNames].filter((a) => !excludedAwards.has(a)));
  let totalSynergy = 0;

  const selectedMilestones = new Set();
  const selectedAwards = new Set();

  var synergyLog = {};

  while (selectedMilestones.size + selectedAwards.size < 10) {
    const typeToPick = Math.random() < 0.5 ? 'm' : 'a';
    if (typeToPick === 'm') {
      const availableMilestonesArray = Array.from(availableMilestones);
      selectedMilestones.add(availableMilestonesArray[Math.floor(Math.random() * availableMilestonesArray.length)]);
    } else {
      const availableAwardsArray = Array.from(availableAwards);
      selectedAwards.add(availableAwardsArray[Math.floor(Math.random() * availableAwardsArray.length)]);
    }

    let mLen = selectedMilestones.size;
    let aLen = selectedAwards.size;

    while (mLen + aLen < 10) {
      let pool = [];
      if (mLen < aLen) {
        pool = Array.from(availableMilestones).filter((m) => !selectedMilestones.has(m));
      } else if (mLen > aLen) {
        pool = Array.from(availableAwards).filter((a) => !selectedAwards.has(a));
      } else {
        pool = Array.from(new Set([...availableMilestones, ...availableAwards])).filter(
          (item) => !selectedMilestones.has(item) && !selectedAwards.has(item)
        );
      }
      const draw = pool[Math.floor(Math.random() * pool.length)];
      let rejected = false;

      for (const item of [...selectedAwards, ...selectedMilestones]) {
        const pairSynergy = getSynergy(draw, item, synergyMatrix);
        if (Math.random() > probCurve(pairSynergy)) {
          // console.log(`${draw} was rejected by ${item} with synergy of ${pairSynergy}!`);
          rejected = true;
          break;
        }
      }

      if (rejected) {
        continue;
      }

      if (availableMilestones.has(draw)) {
        selectedMilestones.add(draw);
        mLen++;
      } else {
        selectedAwards.add(draw);
        aLen++;
      }
    }

    const result = [...selectedAwards, ...selectedMilestones].sort();
    synergyLog = {};
    for (const [ma1, ma2] of combinations(result, 2)) {
      const pairSynergy = getSynergy(ma1, ma2, synergyMatrix);
      synergyLog[ma1] = (synergyLog[ma1] || 0) + pairSynergy / 2;
      synergyLog[ma2] = (synergyLog[ma2] || 0) + pairSynergy / 2;
      synergyLog.total = (synergyLog.total || 0) + pairSynergy;
    }

    if (totalSynergy > maxTotalSynergy) {
      totalSynergy = 0;
      selectedAwards.clear();
      selectedMilestones.clear();
    }
  }

  return { milestones: [...selectedMilestones], awards: [...selectedAwards], synergies: synergyLog };
}

function generatePool(available, fixed, count, probCurve) {
  const selected = new Set();
  while (selected.size < count) {
    const pool = available.filter(m => !selected.has(m));
    const candidate = pool[Math.floor(Math.random() * pool.length)];
    let rejected = false;
    for (const item of [...fixed, ...selected]) {
      if (Math.random() > probCurve(getSynergy(candidate, item, synergyMatrix))) {
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
    const s = getSynergy(ma1, ma2, synergyMatrix);
    log[ma1] = (log[ma1] || 0) + s / 2;
    log[ma2] = (log[ma2] || 0) + s / 2;
    log.total = (log.total || 0) + s;
  }
  return log;
}

export function generateSingleMilestone(excludedMilestones, remainingMilestones, currentAwards, maxIndividualSynergy) {
  const probCurve = makeLinearDecrease(maxIndividualSynergy);
  const excluded = new Set(excludedMilestones);
  const remaining = new Set(remainingMilestones);
  const available = Object.keys(milestonesData).filter(m => !excluded.has(m) && !remaining.has(m));
  const fixed = [...remainingMilestones, ...currentAwards];
  const [picked] = generatePool(available, fixed, 1, probCurve);
  return picked;
}

export function generateSingleAward(excludedAwards, currentMilestones, remainingAwards, maxIndividualSynergy) {
  const probCurve = makeLinearDecrease(maxIndividualSynergy);
  const excluded = new Set(excludedAwards);
  const remaining = new Set(remainingAwards);
  const available = Object.keys(awardsData).filter(a => !excluded.has(a) && !remaining.has(a));
  const fixed = [...currentMilestones, ...remainingAwards];
  const [picked] = generatePool(available, fixed, 1, probCurve);
  return picked;
}

export function generateMilestonesOnly(excludedMilestones, currentAwards, maxIndividualSynergy, maxTotalSynergy) {
  const probCurve = makeLinearDecrease(maxIndividualSynergy);
  const available = Object.keys(milestonesData).filter(m => !new Set(excludedMilestones).has(m));
  let milestones, synergies;
  do {
    milestones = generatePool(available, currentAwards, 5, probCurve);
    synergies = computeSynergies(milestones, currentAwards);
  } while (synergies.total > maxTotalSynergy);
  return { milestones, awards: currentAwards, synergies };
}

export function generateAwardsOnly(excludedAwards, currentMilestones, maxIndividualSynergy, maxTotalSynergy) {
  const probCurve = makeLinearDecrease(maxIndividualSynergy);
  const available = Object.keys(awardsData).filter(a => !new Set(excludedAwards).has(a));
  let awards, synergies;
  do {
    awards = generatePool(available, currentMilestones, 5, probCurve);
    synergies = computeSynergies(currentMilestones, awards);
  } while (synergies.total > maxTotalSynergy);
  return { milestones: currentMilestones, awards, synergies };
}

export default generateMilestonesAwards;

if (require.main === module) {
  const excludedMilestones = new Set(['briber']);
  console.log(generateMilestonesAwards(excludedMilestones));
}
