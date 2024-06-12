import { create } from "zustand";
import { WorkoutType } from "../types/workout-type";
import { iWorkoutPlan } from "./userStore";
interface WorkoutPlanState {
  selected_workout: WorkoutType;
  day: {
    id: string;
    day: string;
  };
  setWorkout: (workout: WorkoutType) => void;
  setWorkoutDaySelected: (day: { id: string; day: string } | undefined) => void;
  clearSelect: () => void;
  clearSelectedWO: () => void;
  selectedExercise: string[];
  setSelectedExercise: (exercises: string[]) => void;
  setUpdateSelectedWorkout: (exercise: any, index: number) => void;
  setRemoveSelectedWorkout: (exerciseToRemove: any) => void;

  setViewDetailsWP: (wp: any) => void;
  viewDetailsWP: iWorkoutPlan;
  clearViewDetaulsWP: () => void;
  clearWorkoutPlan: () => void;
}
const initWorkout = {
  name: "",
  force: "",
  level: "",
  mechanic: "",
  equipment: "",
  primaryMuscles: [],
  secondaryMuscles: [],
  instructions: [],
  category: "",
  images: [],
  id: "",
};
const useWorkoutPlanStore = create<WorkoutPlanState>()((set) => ({
  viewDetailsWP: {
    id: "",
    name: "",
    is_active: false,
    workouts: [],
  },
  selected_workout: initWorkout,
  selectedExercise: [],
  day: {
    id: "",
    day: "",
  },
  clearWorkoutPlan: () => set({}),
  setViewDetailsWP: (wp: any) =>
    set((state) => ({
      ...state,
      viewDetailsWP: { ...state.viewDetailsWP, ...wp },
    })),
  clearViewDetaulsWP: () =>
    set({
      viewDetailsWP: {
        id: "",
        name: "",
        is_active: false,
        workouts: [],
      },
    }),
  setRemoveSelectedWorkout: (exerciseToRemove: any) =>
    set((state) => {
      const updatedExercises = state.selectedExercise.filter(
        (exercise: any) => {
          return exercise.id !== exerciseToRemove.id;
        }
      );
      return { selectedExercise: updatedExercises };
    }),
  setUpdateSelectedWorkout: (exercise: any, index: number) =>
    set((state) => {
      const updatedExercises = [...state.selectedExercise];
      updatedExercises[index] = exercise;
      return { selectedExercise: updatedExercises };
    }),
  setWorkout: (workout: WorkoutType) => set({ selected_workout: workout }),
  setWorkoutDaySelected: (day: { id: string; day: string } | undefined) =>
    set({ day: day }),
  clearSelect: () =>
    set({ selected_workout: initWorkout, day: { id: "", day: "" } }),
  clearSelectedWO: () =>
    set((state) => ({ ...state, selected_workout: initWorkout })),
  setSelectedExercise: (exercises: string[]) =>
    set({ selectedExercise: exercises }),
}));

export default useWorkoutPlanStore;
