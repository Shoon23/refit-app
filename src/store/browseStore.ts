import { create } from "zustand";
import { WorkoutType } from "../types/workout-type";
import { iWorkoutPage } from "../types/workout-type";

export interface iCache extends iWorkoutPage {
  hasData: boolean;
}

interface BrowseState {
  searchResults: iCache;
  recommendations: iCache;
  setSearchResults: (res: iWorkoutPage) => void;
  setRecommendations: (res: iWorkoutPage) => void;
  clearRecommendation: () => void;
}

const useBrowseStore = create<BrowseState>()((set) => ({
  searchResults: {
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    hasNextPage: true,
    hasPrevPage: true,
    workouts: [],
    hasData: false,
  },
  recommendations: {
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    hasNextPage: true,
    hasPrevPage: true,
    workouts: [],
    hasData: false,
  },
  setSearchResults: (res: iWorkoutPage) =>
    set({
      searchResults: { ...res, hasData: true },
    }),
  setRecommendations: (res: iWorkoutPage) =>
    set({
      recommendations: { ...res, hasData: true },
    }),
  clearRecommendation: () =>
    set({
      recommendations: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 0,
        hasNextPage: true,
        hasPrevPage: true,
        workouts: [],
        hasData: false,
      },
    }),
}));

export default useBrowseStore;
