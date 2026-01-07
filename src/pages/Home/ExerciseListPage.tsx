import {
  IonButton,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonLabel,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { options } from "ionicons/icons";
import { WorkoutType } from "../../types/workout-type";

import WorkoutCard from "../../components/WorkoutCard";
import SkeletonCard from "../../components/SkeletonCard";
import useUserStore from "../../store/userStore";
import {
  fetchRecommendation,
  fetchSearch,
} from "../../apiServices/workoutService";
import FilterOptionsModal from "../../components/FilterOptionsModal";
import { iWorkoutPage } from "../../types/workout-type";
import { loadMoreWorkouts } from "../../utils/arrayUtils";
import WorkoutAddCard from "../../components/WorkoutAddCard";
import useAxios from "../../hooks/useAxios";
interface BrowseProps {}

const ExerciseListPage: React.FC<BrowseProps> = () => {
  const [muscleFilters, setMuscleFilters] = useState<Array<string>>([]);
  const [equipmentFilters, setEquipmentFilters] = useState<Array<string>>([]);
  const [searchResults, setSearchResults] =
    useState<iWorkoutPage>(initWorkoutPage);
  const [searchKey, setSearchKey] = useState<string | null>("");
  const [isOpenFilters, setIsOpenFilters] = useState(false);
  const [recommendation, setRecommendation] =
    useState<iWorkoutPage>(initWorkoutPage);
  const [isLoading, setIsLoading] = useState(true);
  const [currPage, setCurrPage] = useState(1);
  const [windowName, setWindowName] = useState<"search" | "recommended">(
    "recommended"
  );
  const { preferences, access_token } = useUserStore();
  const topRef = useRef<HTMLIonHeaderElement>(null);
  const fetch = useAxios();

  useEffect(() => {
    getRecommendations();
  }, []);

  const handleApplyFilter = () => {
    setIsOpenFilters(false);

    setWindowName("search");
    setIsLoading(true);
    setCurrPage(1);
    getResult(searchKey, muscleFilters, equipmentFilters);
  };

  const getResult = async (
    searchKey?: string | null,
    muscleFilters?: string[] | null,
    equipmentFilters?: string[] | null,
    isChangeWindow = false
  ) => {
    setSearchKey(searchKey || "");

    // const response = await fetchSearch(
    //   isChangeWindow ? 1 : currPage,
    //   access_token,
    //   searchKey,
    //   muscleFilters,
    //   equipmentFilters
    // );

    const filter = {
      search_key: searchKey || "",
      muscles: muscleFilters || [],
      equipments: equipmentFilters || [],
    };
    const response = await fetch.post(
      `/workouts?page_number=${isChangeWindow ? 1 : currPage}`,
      filter
    );
    if (isChangeWindow) {
      setCurrPage(1);

      setSearchResults(initWorkoutPage);
    }

    setIsLoading(false);
    setWindowName("search");
    if (currPage > 1 && !isChangeWindow) {
      const updatedPage = loadMoreWorkouts(searchResults, response);
      setSearchResults(updatedPage);
    } else {
      setSearchResults(response.data);
    }
  };

  const getRecommendations = async (isChangeWindow = false) => {
    const { id, ...pref } = preferences as any;

    // const response = await fetchRecommendation(
    //   isChangeWindow ? 1 : currPage,
    //   pref,
    //   access_token
    // );
    const response = await fetch.post(
      `/workouts/recommendation?is_shuffle=false&page_number=${
        isChangeWindow ? 1 : currPage
      }`,
      pref
    );

    setIsLoading(false);
    if (currPage > 1 && !isChangeWindow) {
      const updatedPage = loadMoreWorkouts(searchResults, response);
      setRecommendation(updatedPage);
    } else {
      setRecommendation(response.data);
    }
  };

  const handleChangeWindwow = (e: any) => {
    setIsLoading(true);
    topRef.current?.scrollIntoView({ behavior: "smooth" });

    setWindowName(e.detail.value as any);

    if (e.detail.value === "recommended") {
      getRecommendations(true);
    } else {
      getResult(searchKey, muscleFilters, equipmentFilters, true);
    }
  };

  return (
    <>
      <IonHeader translucent={true} mode="ios" ref={topRef}>
        <IonToolbar>
          <IonTitle>Browse Workouts</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment onIonChange={handleChangeWindwow} value={windowName}>
            <IonSegmentButton value="recommended">
              <IonLabel>Recommended</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="search">
              <IonLabel>Search</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      {/* <IonCard /> */}

      <IonContent>
        <FilterOptionsModal
          isOpen={isOpenFilters}
          setIsOpen={setIsOpenFilters}
          setEquipmentFilters={setEquipmentFilters}
          equipmentFilters={equipmentFilters}
          muscleFilters={muscleFilters}
          setMuscleFilters={setMuscleFilters}
          handleApplyFilter={handleApplyFilter}
        />
        {/* rendering workouts */}

        {windowName === "search" && (
          <div
            style={{
              display: "flex",
            }}
          >
            <IonSearchbar
              debounce={1000}
              onIonInput={(e) => {
                setIsLoading(true);
                setCurrPage(1);
                getResult(
                  e.target.value as string,
                  muscleFilters,
                  equipmentFilters
                );
              }}
              showClearButton="focus"
            ></IonSearchbar>
            <IonButton
              color={
                equipmentFilters.length > 0 || muscleFilters.length > 0
                  ? "primary"
                  : "light"
              }
              onClick={() => setIsOpenFilters(true)}
            >
              <IonIcon slot="icon-only" icon={options}></IonIcon>
            </IonButton>
          </div>
        )}

        {isLoading ? (
          Array(3)
            .fill(1)
            .map((_, index) => {
              return <SkeletonCard key={index} />;
            })
        ) : windowName === "search" ? (
          searchResults.workouts.length > 0 ? (
            searchResults.workouts.map((result: WorkoutType, index) => (
              <WorkoutAddCard
                style={
                  !searchResults.hasNextPage &&
                  searchResults.workouts.length - 1 === index
                    ? { marginBottom: "150px" }
                    : {}
                }
                key={result?.id}
                workout={result}
              />
            ))
          ) : (
            <div
              style={{
                display: "flex",
                height: "90%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IonLabel
                style={{
                  f: "",
                }}
              >
                Not Found
              </IonLabel>
            </div>
          )
        ) : (
          recommendation.workouts.map((workout: WorkoutType, index) => (
            <WorkoutAddCard
              style={
                !searchResults.hasNextPage &&
                searchResults.workouts.length - 1 === index
                  ? { marginBottom: "150px" }
                  : {}
              }
              key={workout?.id}
              workout={workout}
            />
          ))
        )}

        <IonInfiniteScroll
          disabled={
            (windowName === "search" && !searchResults.hasNextPage) ||
            (windowName === "recommended" && !recommendation.hasNextPage)
          }
          onIonInfinite={(ev) => {
            setCurrPage((prev) => prev + 1);

            if (searchResults.workouts.length > 0 && windowName === "search") {
              getResult(searchKey, muscleFilters, equipmentFilters);
            } else {
              getRecommendations();
            }
            setTimeout(() => ev.target.complete(), 1000);
          }}
        >
          <IonInfiniteScrollContent
            style={{
              marginBottom: "80px",
              marginTop: "10px",
            }}
            loadingSpinner="bubbles"
          ></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
    </>
  );
};

const initWorkoutPage = {
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
  hasNextPage: true,
  hasPrevPage: true,
  workouts: [],
};

export default ExerciseListPage;
