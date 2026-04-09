import { create } from 'zustand';
import generateMilestonesAwards, {
  generateMilestonesOnly, generateAwardsOnly,
  generateSingleMilestone, generateSingleAward,
} from './randomizer';
import milestonesData from './ma-data/milestones.json';
import awardsData from './ma-data/awards.json';

export const REQUIRED = 5;
export const allMilestoneSlugs = Object.keys(milestonesData);
export const allAwardSlugs = Object.keys(awardsData);

const MAX_PAIR_SYNERGY = 6;
const MAX_TOTAL_SYNERGY = 30;

const useStore = create((set, get) => ({
  availableMilestones: allMilestoneSlugs,
  availableAwards: allAwardSlugs,
  draw: generateMilestonesAwards(allMilestoneSlugs, allAwardSlugs, MAX_PAIR_SYNERGY, MAX_TOTAL_SYNERGY),
  showDescriptions: true,

  rerandomize: () => {
    const { availableMilestones, availableAwards } = get();
    if (availableMilestones.length < REQUIRED || availableAwards.length < REQUIRED) return;
    set({ draw: generateMilestonesAwards(availableMilestones, availableAwards, MAX_PAIR_SYNERGY, MAX_TOTAL_SYNERGY) });
  },

  rerandomizeMilestones: () => {
    const { availableMilestones, draw } = get();
    if (availableMilestones.length < REQUIRED) return;
    set({ draw: generateMilestonesOnly(availableMilestones, draw.awards, MAX_PAIR_SYNERGY, MAX_TOTAL_SYNERGY) });
  },

  rerandomizeAwards: () => {
    const { availableAwards, draw } = get();
    if (availableAwards.length < REQUIRED) return;
    set({ draw: generateAwardsOnly(availableAwards, draw.milestones, MAX_PAIR_SYNERGY, MAX_TOTAL_SYNERGY) });
  },

  rerollMilestone: (slug) => {
    const { availableMilestones, draw } = get();
    const idx = draw.milestones.indexOf(slug);
    const remaining = draw.milestones.filter(m => m !== slug);
    const replacement = generateSingleMilestone(availableMilestones, remaining, draw.awards, MAX_PAIR_SYNERGY);
    const next = [...remaining];
    next.splice(idx, 0, replacement);
    set({ draw: { ...draw, milestones: next } });
  },

  rerollAward: (slug) => {
    const { availableAwards, draw } = get();
    const idx = draw.awards.indexOf(slug);
    const remaining = draw.awards.filter(a => a !== slug);
    const replacement = generateSingleAward(availableAwards, draw.milestones, remaining, MAX_PAIR_SYNERGY);
    const next = [...remaining];
    next.splice(idx, 0, replacement);
    set({ draw: { ...draw, awards: next } });
  },

  removeMilestone: (slug) => {
    const { availableMilestones, draw } = get();
    const newAvailM = availableMilestones.filter(m => m !== slug);
    if (newAvailM.length < REQUIRED) {
      set({ availableMilestones: newAvailM, draw: { ...draw, milestones: draw.milestones.filter(m => m !== slug) } });
      return;
    }
    const idx = draw.milestones.indexOf(slug);
    const remaining = draw.milestones.filter(m => m !== slug);
    const replacement = generateSingleMilestone(newAvailM, remaining, draw.awards, MAX_PAIR_SYNERGY);
    const next = [...remaining];
    next.splice(idx, 0, replacement);
    set({ availableMilestones: newAvailM, draw: { ...draw, milestones: next } });
  },

  removeAward: (slug) => {
    const { availableAwards, draw } = get();
    const newAvailA = availableAwards.filter(a => a !== slug);
    if (newAvailA.length < REQUIRED) {
      set({ availableAwards: newAvailA, draw: { ...draw, awards: draw.awards.filter(a => a !== slug) } });
      return;
    }
    const idx = draw.awards.indexOf(slug);
    const remaining = draw.awards.filter(a => a !== slug);
    const replacement = generateSingleAward(newAvailA, draw.milestones, remaining, MAX_PAIR_SYNERGY);
    const next = [...remaining];
    next.splice(idx, 0, replacement);
    set({ availableAwards: newAvailA, draw: { ...draw, awards: next } });
  },

  setAvailable: (newAvailM, newAvailA) => {
    const { availableMilestones, availableAwards, draw } = get();
    const nowEnoughM = newAvailM.length >= REQUIRED;
    const nowEnoughA = newAvailA.length >= REQUIRED;
    const recoveredM = availableMilestones.length < REQUIRED && nowEnoughM;
    const recoveredA = availableAwards.length < REQUIRED && nowEnoughA;
    const availMSet = new Set(newAvailM);
    const availASet = new Set(newAvailA);
    const affectsDraw =
      draw.milestones.some(s => !availMSet.has(s)) ||
      draw.awards.some(s => !availASet.has(s));

    let newDraw = draw;
    if (affectsDraw || recoveredM || recoveredA) {
      if (nowEnoughM && nowEnoughA) {
        newDraw = generateMilestonesAwards(newAvailM, newAvailA, MAX_PAIR_SYNERGY, MAX_TOTAL_SYNERGY);
      } else {
        newDraw = {
          ...draw,
          milestones: draw.milestones.filter(m => availMSet.has(m)),
          awards: draw.awards.filter(a => availASet.has(a)),
        };
      }
    }
    set({ availableMilestones: newAvailM, availableAwards: newAvailA, draw: newDraw });
  },

  setShowDescriptions: (value) => set({ showDescriptions: value }),
}));

export default useStore;
