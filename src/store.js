import { create } from 'zustand';
import {
  generateMilestonesAwards, generateMilestonesOnly, generateAwardsOnly, selectMilestone, selectAward,
} from './randomizer';
import milestonesData from './ma-data/milestones.json';
import awardsData from './ma-data/awards.json';

export const REQUIRED = 5;
export const allMilestoneSlugs = Object.keys(milestonesData);
export const allAwardSlugs = Object.keys(awardsData);

const MAX_PAIR_SYNERGY = 6;

const useStore = create((set, get) => ({
  availableMilestones: allMilestoneSlugs,
  availableAwards: allAwardSlugs,
  draw: generateMilestonesAwards(allMilestoneSlugs, allAwardSlugs, MAX_PAIR_SYNERGY),
  showDescriptions: true,
  error: null,

  clearError: () => set({ error: null }),

  rerandomize: () => {
    const { availableMilestones, availableAwards } = get();
    if (availableMilestones.length < REQUIRED || availableAwards.length < REQUIRED) return;
    try {
      set({ draw: generateMilestonesAwards(availableMilestones, availableAwards, MAX_PAIR_SYNERGY), error: null });
    } catch (e) {
      set({ error: e.message });
    }
  },

  rerandomizeMilestones: () => {
    const { availableMilestones, draw } = get();
    if (availableMilestones.length < REQUIRED) return;
    try {
      set({ draw: generateMilestonesOnly(availableMilestones, draw.awards, MAX_PAIR_SYNERGY), error: null });
    } catch (e) {
      set({ error: e.message });
    }
  },

  rerandomizeAwards: () => {
    const { availableAwards, draw } = get();
    if (availableAwards.length < REQUIRED) return;
    try {
      set({ draw: generateAwardsOnly(availableAwards, draw.milestones, MAX_PAIR_SYNERGY), error: null });
    } catch (e) {
      set({ error: e.message });
    }
  },

  rerollMilestone: (slug) => {
    const { availableMilestones, draw } = get();
    const idx = draw.milestones.indexOf(slug);
    const remaining = draw.milestones.filter(m => m !== slug);
    const replacement = selectMilestone(availableMilestones, remaining, draw.awards, MAX_PAIR_SYNERGY);
    if (replacement === null) {
      set({ error: 'No valid milestone replacement found. Enable more milestones.' });
      return;
    }
    const next = [...remaining];
    next.splice(idx, 0, replacement);
    set({ draw: { ...draw, milestones: next }, error: null });
  },

  rerollAward: (slug) => {
    const { availableAwards, draw } = get();
    const idx = draw.awards.indexOf(slug);
    const remaining = draw.awards.filter(a => a !== slug);
    const replacement = selectAward(availableAwards, draw.milestones, remaining, MAX_PAIR_SYNERGY);
    if (replacement === null) {
      set({ error: 'No valid award replacement found. Enable more awards.' });
      return;
    }
    const next = [...remaining];
    next.splice(idx, 0, replacement);
    set({ draw: { ...draw, awards: next }, error: null });
  },

  // Remove a milestone from the available pool and replace it in the draw.
  // Unlike rerollMilestone, on failure we drop the slot rather than leaving a ghost slug.
  removeMilestone: (slug) => {
    const { availableMilestones, draw } = get();
    const newAvailM = availableMilestones.filter(m => m !== slug);
    if (!draw.milestones.includes(slug)) {
      set({ availableMilestones: newAvailM });
      return;
    }
    const idx = draw.milestones.indexOf(slug);
    const remaining = draw.milestones.filter(m => m !== slug);
    if (newAvailM.length < REQUIRED) {
      set({ availableMilestones: newAvailM, draw: { ...draw, milestones: remaining } });
      return;
    }
    const replacement = selectMilestone(newAvailM, remaining, draw.awards, MAX_PAIR_SYNERGY);
    if (replacement === null) {
      set({ availableMilestones: newAvailM, draw: { ...draw, milestones: remaining }, error: 'No valid milestone replacement found. Enable more milestones.' });
      return;
    }
    const next = [...remaining];
    next.splice(idx, 0, replacement);
    set({ availableMilestones: newAvailM, draw: { ...draw, milestones: next }, error: null });
  },

  removeAward: (slug) => {
    const { availableAwards, draw } = get();
    const newAvailA = availableAwards.filter(a => a !== slug);
    if (!draw.awards.includes(slug)) {
      set({ availableAwards: newAvailA });
      return;
    }
    const idx = draw.awards.indexOf(slug);
    const remaining = draw.awards.filter(a => a !== slug);
    if (newAvailA.length < REQUIRED) {
      set({ availableAwards: newAvailA, draw: { ...draw, awards: remaining } });
      return;
    }
    const replacement = selectAward(newAvailA, draw.milestones, remaining, MAX_PAIR_SYNERGY);
    if (replacement === null) {
      set({ availableAwards: newAvailA, draw: { ...draw, awards: remaining }, error: 'No valid award replacement found. Enable more awards.' });
      return;
    }
    const next = [...remaining];
    next.splice(idx, 0, replacement);
    set({ availableAwards: newAvailA, draw: { ...draw, awards: next }, error: null });
  },

  setAvailable: (newAvailM, newAvailA) => {
    const nowEnoughM = newAvailM.length >= REQUIRED;
    const nowEnoughA = newAvailA.length >= REQUIRED;
    let newDraw = { milestones: [], awards: [] };
    let error = null;
    if (nowEnoughM && nowEnoughA) {
      try {
        newDraw = generateMilestonesAwards(newAvailM, newAvailA, MAX_PAIR_SYNERGY);
      } catch (e) {
        error = e.message;
      }
    }
    set({ availableMilestones: newAvailM, availableAwards: newAvailA, draw: newDraw, error });
  },

  setShowDescriptions: (value) => set({ showDescriptions: value }),
}));

export default useStore;
