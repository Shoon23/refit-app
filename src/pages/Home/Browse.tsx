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
import React, { useRef } from "react";
import { options } from "ionicons/icons";
import { Network } from "@capacitor/network";
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
import { findWorkout, loadMoreWorkouts } from "../../utils/arrayUtils";
import bgImg from "../../assets/backgrounds/4.jpeg";
import useBrowseStore from "../../store/browseStore";
interface BrowseProps {}

const Browse: React.FC<BrowseProps> = () => {
  const [muscleFilters, setMuscleFilters] = useState<Array<string>>([]);
  const [equipmentFilters, setEquipmentFilters] = useState<Array<string>>([]);
  const [searchKey, setSearchKey] = useState<string | null>("");
  const [isOpenFilters, setIsOpenFilters] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [results, setResults] = useState<iWorkoutPage>(initWorkoutPage);
  const {
    searchResults,
    setSearchResults,
    setRecommendations,
    recommendations,
  } = useBrowseStore();
  const [isLoading, setIsLoading] = useState(true);
  const [currPage, setCurrPage] = useState(1);
  const [windowName, setWindowName] = useState<"search" | "recommended">(
    "recommended"
  );
  const { preferences, access_token } = useUserStore();

  const topRef = useRef<HTMLIonHeaderElement>(null);

  useEffect(() => {
    const initLoad = async () => {
      const status = await Network.getStatus();

      if (!recommendations.hasData && status.connected) {
        getRecommendations();
      } else if (recommendations.hasData && !status.connected) {
        setIsLoading(false);
      } else if (!recommendations.hasData && !status.connected) {
        setIsLoading(false);
        setIsConnected(false);
      }
    };
    initLoad();
    setIsLoading(false);
  }, []);

  const handleApplyFilter = async () => {
    const status = await Network.getStatus();

    setIsOpenFilters(false);

    setWindowName("search");
    setIsLoading(true);
    if (!searchResults.hasData && status.connected) {
      setCurrPage(1);
      getResult(searchKey, muscleFilters, equipmentFilters);
      setIsConnected(true);
    } else if (searchResults.hasData && !status.connected) {
      if (
        (!equipmentFilters || equipmentFilters.length === 0) &&
        (!muscleFilters || muscleFilters.length === 0) &&
        !searchKey
      ) {
        setResults(searchResults);
      } else {
        const res = findWorkout(
          searchResults,
          searchKey,
          muscleFilters,
          equipmentFilters
        );

        const update = { ...searchResults, workouts: res };
        setResults(update);
      }
    } else if (!searchResults.hasData && !status.connected) {
      setIsLoading(false);
      setIsConnected(false);
    }
    setIsLoading(false);
  };

  const getResult = async (
    searchKey?: string | null,
    muscleFilters?: string[] | null,
    equipmentFilters?: string[] | null,
    isChangeWindow = false
  ) => {
    setSearchKey(searchKey || "");

    const response = await fetchSearch(
      isChangeWindow ? 1 : currPage,
      access_token,
      searchKey,
      muscleFilters,
      equipmentFilters
    );
    if (isChangeWindow) {
      setCurrPage(1);

      setSearchResults(initWorkoutPage);
    }

    if (currPage > 1 && !isChangeWindow) {
      const updatedPage = loadMoreWorkouts(searchResults, response);
      setResults(updatedPage);
      setSearchResults(updatedPage);
    } else {
      setResults(response.data);
      setSearchResults(response.data);
    }
    setIsLoading(false);
    setWindowName("search");
  };

  const getRecommendations = async (isChangeWindow = false) => {
    const { id, ...pref } = preferences as any;

    const response = await fetchRecommendation(
      isChangeWindow ? 1 : currPage,
      pref,
      access_token
    );

    if (currPage > 1 && !isChangeWindow) {
      const updatedPage = loadMoreWorkouts(searchResults, response);
      setRecommendations(updatedPage);
    } else {
      setRecommendations(response.data);
    }
    setIsLoading(false);
  };

  const handleChangeWindwow = async (e: any) => {
    const status = await Network.getStatus();

    topRef.current?.scrollIntoView({ behavior: "smooth" });
    setWindowName(e.detail.value as any);

    if (e.detail.value === "recommended") {
      if (!recommendations.hasData && status.connected) {
        setIsLoading(true);
        setIsConnected(true);
        getRecommendations();
      } else if (recommendations.hasData && !status.connected) {
        setIsConnected(true);
      } else if (!recommendations.hasData && !status.connected) {
        setIsConnected(false);
      }
    } else {
      if (!searchResults.hasData && status.connected) {
        setIsConnected(true);
        getResult(searchKey, muscleFilters, equipmentFilters, true);
      } else if (searchResults.hasData) {
        setResults(searchResults);
        setIsConnected(true);
      } else if (!searchResults.hasData && !status.connected) {
        setIsConnected(false);
      }
    }
  };
  const handleRetry = async () => {
    const status = await Network.getStatus();

    if (status.connected) {
      if (windowName === "search") {
        getResult(searchKey, muscleFilters, equipmentFilters, true);
      } else {
        getRecommendations(true);
      }
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
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${bgImg})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            filter: "blur(5px)",
            zIndex: -1,
          }}
        ></div>
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
              onIonInput={async (e) => {
                const status = await Network.getStatus();
                if (status.connected) {
                  setIsConnected(true);
                  setIsLoading(true);
                  setCurrPage(1);
                  getResult(
                    e.target.value as string,
                    muscleFilters,
                    equipmentFilters
                  );
                } else if (!status.connected) {
                  if (
                    (!equipmentFilters || equipmentFilters.length === 0) &&
                    (!muscleFilters || muscleFilters.length === 0) &&
                    !e.target.value
                  ) {
                    setResults(searchResults);
                    return;
                  }
                  const res = findWorkout(
                    searchResults,
                    e.target.value as string,
                    muscleFilters,
                    equipmentFilters
                  );

                  const update = { ...searchResults, workouts: res };
                  setResults(update);
                } else {
                }
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
        ) : isConnected ? (
          windowName === "search" ? (
            results.workouts.length > 0 ? (
              results.workouts.map((result: WorkoutType, index) => (
                <WorkoutCard
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
                    fontSize: "1.5rem",
                    fontWeight: "bolder",
                  }}
                >
                  Not Found
                </IonLabel>
              </div>
            )
          ) : (
            recommendations.workouts.map((workout: WorkoutType, index) => (
              <WorkoutCard
                style={
                  !recommendations.hasNextPage &&
                  recommendations.workouts.length - 1 === index
                    ? { marginBottom: "150px" }
                    : {}
                }
                key={workout?.id}
                workout={workout}
              />
            ))
          )
        ) : (
          <div
            style={{
              display: "flex",
              height: "90%",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <IonLabel
              style={{
                fontSize: "1.5rem",
                fontWeight: "bolder",
              }}
            >
              Connection Error
            </IonLabel>
            <IonButton color={"dark"} onClick={handleRetry}>
              Retry
            </IonButton>
          </div>
        )}

        <IonInfiniteScroll
          disabled={
            (windowName === "search" && !searchResults.hasNextPage) ||
            (windowName === "recommended" && !recommendations.hasNextPage)
          }
          onIonInfinite={async (ev) => {
            const status = await Network.getStatus();

            setCurrPage((prev) => prev + 1);

            if (searchResults.workouts.length > 0 && windowName === "search") {
              if (searchResults.currentPage <= currPage && status.connected) {
                getResult(searchKey, muscleFilters, equipmentFilters);
              }
            } else {
              if (recommendations.currentPage <= currPage && status.connected) {
                getRecommendations();
              }
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

export default Browse;
