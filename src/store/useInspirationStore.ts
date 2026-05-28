import { create } from "zustand";
import { Inspiration } from "@/types";

interface InspirationStore {
  inspirations: Inspiration[];
  setInspirations: (inspirations: Inspiration[]) => void;
  addInspiration: (inspiration: Inspiration) => void;
  updateInspiration: (id: string, updates: Partial<Inspiration>) => void;
  deleteInspiration: (id: string) => void;
  getInspirationById: (id: string) => Inspiration | undefined;
  searchInspirations: (query: string) => Inspiration[];
  filterByTags: (tags: string[]) => Inspiration[];
  getAllTags: () => string[];
}

export const useInspirationStore = create<InspirationStore>()((set, get) => ({
  inspirations: [],
  
  setInspirations: (inspirations) => {
    set({ inspirations });
  },

  addInspiration: (inspiration) => {
    set((state) => ({
      inspirations: [inspiration, ...state.inspirations],
    }));
  },

  updateInspiration: (id, updates) => {
    set((state) => ({
      inspirations: state.inspirations.map((insp) =>
        insp.id === id
          ? { ...insp, ...updates, updatedAt: new Date().toISOString() }
          : insp
      ),
    }));
  },

  deleteInspiration: (id) => {
    set((state) => ({
      inspirations: state.inspirations.filter((insp) => insp.id !== id),
    }));
  },

  getInspirationById: (id) => {
    return get().inspirations.find((insp) => insp.id === id);
  },

  searchInspirations: (query) => {
    const lowerQuery = query.toLowerCase();
    return get().inspirations.filter(
      (insp) =>
        insp.title.toLowerCase().includes(lowerQuery) ||
        insp.content.toLowerCase().includes(lowerQuery) ||
        insp.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  },

  filterByTags: (tags) => {
    if (tags.length === 0) return get().inspirations;
    return get().inspirations.filter((insp) =>
      tags.some((tag) => insp.tags.includes(tag))
    );
  },

  getAllTags: () => {
    const tags = new Set<string>();
    get().inspirations.forEach((insp) => {
      insp.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  },
}));
