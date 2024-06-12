import { iWorkoutPage } from "../types/workout-type";

export function loadMoreWorkouts(
  searchResults: iWorkoutPage,
  response: { data: iWorkoutPage }
): iWorkoutPage {
  const { workouts, ...rest } = response.data;

  const updatedPage: iWorkoutPage = {
    ...rest,
    workouts: [...searchResults.workouts, ...workouts],
  };

  return updatedPage;
}

export function swapArrayValue(arr: any[], idx1: number, idx2: number) {
  if (idx1 >= 0 && idx1 < arr.length && idx2 >= 0 && idx2 < arr.length) {
    const newArr = [...arr];
    const temp = newArr[idx1];
    newArr[idx1] = newArr[idx2];
    newArr[idx2] = temp;
    return newArr;
  } else {
    console.error("Invalid indices");
    return arr;
  }
}

export function findWorkout(
  workoutsPage: iWorkoutPage,
  search_key?: string | null,
  muscles?: string[] | null,
  equipments?: string[] | null
) {
  if (
    (!equipments || equipments.length === 0) &&
    (!muscles || muscles.length === 0) &&
    !search_key
  ) {
    return workoutsPage;
  }

  // filter based on the equipments if its
  let equipment_search: any = [];
  if (equipments && equipments.length > 0) {
    equipment_search = filter_by_equipments(workoutsPage.workouts, equipments);
  }

  // filter based on the muscles if its

  let muscle_search: any = [];
  if (muscles && muscles.length > 0) {
    muscle_search = filter_by_muscle(workoutsPage.workouts, muscles);
  }

  let search_key_equipment: any = [];
  let search_key_muscle: any = [];
  let search_key_result: any = [];
  if (search_key) {
    // filter based on equipment and search key
    if (equipment_search.length > 0) {
      search_key_equipment = filter_by_search_key(equipment_search, search_key);
    }
    // filter based on muscles and search key

    if (muscle_search.length > 0) {
      search_key_muscle = filter_by_search_key(muscle_search, search_key);
    }
    // search key only

    if (equipment_search.length <= 0 && muscle_search.length <= 0) {
      search_key_result = filter_by_search_key(
        workoutsPage.workouts,
        search_key
      );
    }
  }
  let clean_results: any = [];

  // both muscle and equipment or  search key and muscle ,and equipment and search key
  if (
    (search_key_equipment.length > 0 && search_key_muscle.length > 0) ||
    (equipment_search.length > 0 && muscle_search.length > 0)
  ) {
    const to_clean_equipment =
      search_key_equipment.length > 0 ? search_key_equipment : equipment_search;
    const to_clean_muscle =
      search_key_muscle > 0 ? search_key_muscle : muscle_search;

    clean_results = remove_duplicates(
      to_clean_equipment,
      to_clean_muscle,
      "id"
    );
  }

  let final_filter: any = [];

  // all filter options applied or only both equipmet and muscle
  if (clean_results.length > 0) {
    final_filter = clean_results;
  }
  // equipment filter only
  else if (
    equipment_search.length > 0 &&
    muscle_search.length <= 0 &&
    !search_key
  ) {
    final_filter = equipment_search;
  }
  // muscle filter only
  else if (
    muscle_search.length > 0 &&
    equipment_search.length <= 0 &&
    !search_key
  ) {
    final_filter = muscle_search;
  }
  // search key only
  else if (
    search_key &&
    equipment_search.length <= 0 &&
    muscle_search.length <= 0
  ) {
    final_filter = search_key_result;
  }
  // muscle and search key
  else if (
    muscle_search.length > 0 &&
    search_key &&
    equipment_search.length <= 0
  ) {
    final_filter = search_key_muscle;
  }
  // equipment and search key
  else if (
    equipment_search.length > 0 &&
    search_key &&
    muscle_search.length <= 0
  ) {
    final_filter = search_key_equipment;
  }

  return final_filter;

  function remove_duplicates(
    array1: any[],
    array2: any[],
    propertyName: string
  ) {
    // Concatenate both arrays
    const combinedArray = [...array1, ...array2];

    // Create a Set to store unique property values
    const set = new Set();

    // Filter the combined array to keep only unique objects based on the specified property
    const uniqueObjects = combinedArray.filter((item) => {
      if (set.has(item[propertyName])) {
        return false; // Filter out duplicates
      } else {
        set.add(item[propertyName]);
        return true; // Keep unique items
      }
    });

    return uniqueObjects;
  }

  function filter_by_equipments(workouts: any[], equipments: string[]) {
    if (!equipments || equipments.length <= 0) {
      return workouts;
    }
    return workouts.filter((workouts) => {
      if (!workouts.equipment) return false;
      return equipments.some((equipment: string) =>
        workouts.equipment.includes(equipment)
      );
    });
  }

  function filter_by_muscle(workouts: any[], muscles: string[]) {
    if (!muscles || muscles.length <= 0) {
      return workouts;
    }

    return workouts.filter((workouts) => {
      return muscles.some((muscle: string) =>
        workouts.primaryMuscles.includes(muscle)
      );
    });
  }

  function filter_by_search_key(workouts: any[], search_key: string) {
    const lowercase_searchKey = search_key.toLowerCase().replace(/\s+/g, ""); // Remove whitespace
    return workouts.filter(({ instructions, name }) => {
      const lowercaseName = name.toLowerCase().replace(/\s+/g, ""); // Remove whitespace
      const firstInstruction = instructions.length > 0 ? instructions[0] : ""; // Check if instructions array is not empty
      const lowercaseInstruction = firstInstruction
        .toLowerCase()
        .replace(/\s+/g, ""); // Remove whitespace

      // Remove hyphens and whitespace from search_key
      const searchKeyWithoutHyphens = lowercase_searchKey.replace(/-/g, "");

      return (
        lowercaseName.includes(searchKeyWithoutHyphens) ||
        lowercaseInstruction.includes(searchKeyWithoutHyphens)
      );
    });
  }
}
