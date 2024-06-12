import { create } from "zustand";
import { WorkoutType } from "../types/workout-type";

interface CurrentWorkout {
  id: string;
  day: string;
  workout_plan_id: string;
  exercises: any[];
}

interface RestTimes {
  rpe: number;
  rps: number;
}

interface HomeState {
  recommendedWO: WorkoutType[];
  isLoadedRecommended: boolean;
  isLoadedCurrWO: boolean;
  restTimes: RestTimes;
  setRecommendedWO: (workouts: WorkoutType[]) => void;
  currentWO: CurrentWorkout | null;
  setCurrentWO: (workout: CurrentWorkout | null) => void;
  setIsLoadedRecommended: (status: boolean) => void;
  setIsLoadedCurrWO: (status: boolean) => void;
  setCurrWoExercise: (exercises: any[]) => void;
  setRestTimes: (times: RestTimes) => void;
  clearHome: () => void;
}
const useHomeStore = create<HomeState>()((set) => ({
  restTimes: {
    rpe: 60,
    rps: 30,
  },
  isLoadedCurrWO: false,
  isLoadedRecommended: false,
  currentWO: {
    id: "",
    exercises: [],
    day: "",
    workout_plan_id: "",
  },
  recommendedWO: [],
  setRestTimes: (times: RestTimes) => set({ restTimes: times }),
  setCurrWoExercise: (exercises: any[]) =>
    set((state) => ({
      currentWO: state.currentWO
        ? {
            ...state?.currentWO,
            exercises: exercises,
          }
        : null,
    })),
  clearHome: () => set({}),
  setIsLoadedCurrWO: (status: boolean) => set({ isLoadedCurrWO: status }),
  setIsLoadedRecommended: (status: boolean) =>
    set({ isLoadedRecommended: status }),
  setCurrentWO: (workout: CurrentWorkout | null) => set({ currentWO: workout }),
  setRecommendedWO: (workouts: WorkoutType[]) =>
    set({ recommendedWO: workouts }),
}));

export default useHomeStore;
