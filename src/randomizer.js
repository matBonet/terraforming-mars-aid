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

export default generateMilestonesAwards;

if (require.main === module) {
  const excludedMilestones = new Set(['briber']);
  console.log(generateMilestonesAwards(excludedMilestones));
}
