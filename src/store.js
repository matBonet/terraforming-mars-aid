import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  generateMilestonesAwards, generateMilestonesOnly, generateAwardsOnly, selectMilestone, selectAward,
} from './randomizer';
import milestonesData from './ma-data/milestones.json';
import awardsData from './ma-data/awards.json';

export const REQUIRED = 5;
export const allMilestoneSlugs = Object.keys(milestonesData);
export const allAwardSlugs = Object.keys(awardsData);

const MAX_PAIR_SYNERGY = 6;

function withoutMarker(markers, slug) {
  const next = { ...markers };
  delete next[slug];
  return next;
}

const useStore = create(persist((set, get) => ({
  availableMilestones: allMilestoneSlugs,
  availableAwards: allAwardSlugs,
  draw: generateMilestonesAwards(allMilestoneSlugs, allAwardSlugs, MAX_PAIR_SYNERGY),
  showDescriptions: true,
  error: null,
  markers: {},       // { [slug]: 'red' | 'yellow' | 'green' | 'black' | 'blue' }
  pendingAction: null, // fn | null — queued reroll waiting for confirmation

  clearError: () => set({ error: null }),

  // ── Marker actions ────────────────────────────────────────────────────────
  setMarker: (slug, color, type) => {
    const { markers, draw } = get();
    if (markers[slug]) return; // already claimed
    const group = type === 'milestones' ? draw.milestones : draw.awards;
    const claimed = group.filter(s => markers[s]).length;
    if (claimed >= 3) return; // limit reached
    set({ markers: { ...markers, [slug]: color } });
  },

  clearMarker: (slug) => {
    set({ markers: withoutMarker(get().markers, slug) });
  },

  // ── Confirmation gate ─────────────────────────────────────────────────────
  // Components call requestAction(fn) instead of the action directly.
  // If any markers exist, queues fn for user confirmation; otherwise runs immediately.
  requestAction: (fn) => {
    const { markers } = get();
    if (Object.keys(markers).length > 0) {
      set({ pendingAction: fn });
    } else {
      fn();
    }
  },

  confirmAction: () => {
    const { pendingAction } = get();
    if (pendingAction) pendingAction();
    set({ pendingAction: null });
  },

  cancelAction: () => set({ pendingAction: null }),

  // ── Rerandomize ───────────────────────────────────────────────────────────
  rerandomize: () => {
    const { availableMilestones, availableAwards } = get();
    if (availableMilestones.length < REQUIRED || availableAwards.length < REQUIRED) return;
    try {
      set({ draw: generateMilestonesAwards(availableMilestones, availableAwards, MAX_PAIR_SYNERGY), markers: {}, error: null });
    } catch (e) {
      set({ error: e.message });
    }
  },

  rerandomizeMilestones: () => {
    const { availableMilestones, draw, markers } = get();
    if (availableMilestones.length < REQUIRED) return;
    try {
      const clearedMarkers = Object.fromEntries(
        Object.entries(markers).filter(([slug]) => !draw.milestones.includes(slug))
      );
      set({ draw: generateMilestonesOnly(availableMilestones, draw.awards, MAX_PAIR_SYNERGY), markers: clearedMarkers, error: null });
    } catch (e) {
      set({ error: e.message });
    }
  },

  rerandomizeAwards: () => {
    const { availableAwards, draw, markers } = get();
    if (availableAwards.length < REQUIRED) return;
    try {
      const clearedMarkers = Object.fromEntries(
        Object.entries(markers).filter(([slug]) => !draw.awards.includes(slug))
      );
      set({ draw: generateAwardsOnly(availableAwards, draw.milestones, MAX_PAIR_SYNERGY), markers: clearedMarkers, error: null });
    } catch (e) {
      set({ error: e.message });
    }
  },

  // ── Individual reroll / remove ────────────────────────────────────────────
  rerollMilestone: (slug) => {
    const { availableMilestones, draw, markers } = get();
    const idx = draw.milestones.indexOf(slug);
    const remaining = draw.milestones.filter(m => m !== slug);
    const replacement = selectMilestone(availableMilestones, remaining, draw.awards, MAX_PAIR_SYNERGY);
    if (replacement === null) {
      set({ error: 'No valid milestone replacement found. Enable more milestones.' });
      return;
    }
    const next = [...remaining];
    next.splice(idx, 0, replacement);
    set({ draw: { ...draw, milestones: next }, markers: withoutMarker(markers, slug), error: null });
  },

  rerollAward: (slug) => {
    const { availableAwards, draw, markers } = get();
    const idx = draw.awards.indexOf(slug);
    const remaining = draw.awards.filter(a => a !== slug);
    const replacement = selectAward(availableAwards, draw.milestones, remaining, MAX_PAIR_SYNERGY);
    if (replacement === null) {
      set({ error: 'No valid award replacement found. Enable more awards.' });
      return;
    }
    const next = [...remaining];
    next.splice(idx, 0, replacement);
    set({ draw: { ...draw, awards: next }, markers: withoutMarker(markers, slug), error: null });
  },

  removeMilestone: (slug) => {
    const { availableMilestones, draw, markers } = get();
    const newAvailM = availableMilestones.filter(m => m !== slug);
    const clearedMarkers = withoutMarker(markers, slug);
    if (!draw.milestones.includes(slug)) {
      set({ availableMilestones: newAvailM });
      return;
    }
    const idx = draw.milestones.indexOf(slug);
    const remaining = draw.milestones.filter(m => m !== slug);
    if (newAvailM.length < REQUIRED) {
      set({ availableMilestones: newAvailM, draw: { ...draw, milestones: remaining }, markers: clearedMarkers });
      return;
    }
    const replacement = selectMilestone(newAvailM, remaining, draw.awards, MAX_PAIR_SYNERGY);
    if (replacement === null) {
      set({ availableMilestones: newAvailM, draw: { ...draw, milestones: remaining }, markers: clearedMarkers, error: 'No valid milestone replacement found. Enable more milestones.' });
      return;
    }
    const next = [...remaining];
    next.splice(idx, 0, replacement);
    set({ availableMilestones: newAvailM, draw: { ...draw, milestones: next }, markers: clearedMarkers, error: null });
  },

  removeAward: (slug) => {
    const { availableAwards, draw, markers } = get();
    const newAvailA = availableAwards.filter(a => a !== slug);
    const clearedMarkers = withoutMarker(markers, slug);
    if (!draw.awards.includes(slug)) {
      set({ availableAwards: newAvailA });
      return;
    }
    const idx = draw.awards.indexOf(slug);
    const remaining = draw.awards.filter(a => a !== slug);
    if (newAvailA.length < REQUIRED) {
      set({ availableAwards: newAvailA, draw: { ...draw, awards: remaining }, markers: clearedMarkers });
      return;
    }
    const replacement = selectAward(newAvailA, draw.milestones, remaining, MAX_PAIR_SYNERGY);
    if (replacement === null) {
      set({ availableAwards: newAvailA, draw: { ...draw, awards: remaining }, markers: clearedMarkers, error: 'No valid award replacement found. Enable more awards.' });
      return;
    }
    const next = [...remaining];
    next.splice(idx, 0, replacement);
    set({ availableAwards: newAvailA, draw: { ...draw, awards: next }, markers: clearedMarkers, error: null });
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
    set({ availableMilestones: newAvailM, availableAwards: newAvailA, draw: newDraw, markers: {}, error });
  },

  setShowDescriptions: (value) => set({ showDescriptions: value }),
}), {
  name: 'tma-store',
  version: 2,
  partialize: (state) => ({
    availableMilestones: state.availableMilestones,
    availableAwards: state.availableAwards,
    draw: state.draw,
    showDescriptions: state.showDescriptions,
    markers: state.markers,
  }),
  migrate: (persisted, _version) => {
    const mSet = new Set(allMilestoneSlugs);
    const aSet = new Set(allAwardSlugs);
    const draw = {
      milestones: (persisted.draw?.milestones || []).filter(s => mSet.has(s)),
      awards: (persisted.draw?.awards || []).filter(s => aSet.has(s)),
    };
    const validSlugs = new Set([...draw.milestones, ...draw.awards]);
    const markers = Object.fromEntries(
      Object.entries(persisted.markers || {}).filter(([slug]) => validSlugs.has(slug))
    );
    return {
      ...persisted,
      availableMilestones: (persisted.availableMilestones || []).filter(s => mSet.has(s)),
      availableAwards: (persisted.availableAwards || []).filter(s => aSet.has(s)),
      draw,
      markers,
    };
  },
}));

export default useStore;
