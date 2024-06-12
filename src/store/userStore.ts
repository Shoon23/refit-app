import { create } from "zustand";

interface Workout {
  id: string;
  day: string;
}

export interface iWorkoutPlan {
  id: string;
  name: string;
  is_active: boolean;
  workouts: Workout[];
}

interface Preferences {
  id: string;
  levels: string[];
  equipments: string[];
  muscles: string[];
}

interface UserState {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  access_token: string;
  workout_plan: iWorkoutPlan;
  preferences: Preferences;
  isNewUser: boolean;
  setUser: (newUserData: UserState) => void;
  setPreference: (preferences: Preferences) => void;
  setIsNewUSer: (status: boolean) => void;
  setUpdateActiveWP: (wp: iWorkoutPlan) => void;
  clearUser: () => void;
}

const useUserStore = create<UserState>()((set) => ({
  isNewUser: true,
  id: "",
  email: "",
  first_name: "",
  last_name: "",
  access_token: "",
  workout_plan: {
    id: "",
    name: "",
    is_active: false,
    workouts: [],
  },
  preferences: {
    id: "",
    levels: [],
    equipments: [],
    muscles: [],
  },
  clearUser: () => set({}),
  setIsNewUSer: (status: boolean) => set({ isNewUser: status }),
  setUser: (newUserData: UserState) => set({ ...newUserData }),
  setUpdateActiveWP: (wp: iWorkoutPlan) => set({ workout_plan: wp }),
  setPreference: (preferences: Preferences) =>
    set((state) => ({ ...state, preferences })),
}));

export default useUserStore;
