import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import { useEffect, useState } from "react";

import WorkoutCard from "../../components/WorkoutCard";
import { WorkoutType } from "../../types/workout-type";
import SkeletonCard from "../../components/SkeletonCard";
import { getCurrentDay } from "../../utils/dateUtils";
import { apiUrlLocal } from "../../env";
import WorkoutStatus from "../../components/WorkoutStatus";
import WorkoutStatusSkeleton from "../../components/WorkoutStatusSkeleton";
import useUserStore from "../../store/userStore";
import useHomeStore from "../../store/homeStore";
import { capitalizeFirstLetter } from "../../utils/stringUtils";
import bgImg from "../../assets/backgrounds/4.jpeg";
import useAxios from "../../hooks/useAxios";
interface HomeProps {}

const Home: React.FC<HomeProps> = ({}) => {
  const {
    currentWO,
    recommendedWO,
    setCurrentWO,
    setRecommendedWO,
    isLoadedCurrWO,
    setIsLoadedCurrWO,
    isLoadedRecommended,
    setIsLoadedRecommended,
  } = useHomeStore();
  const [isLoadingReccom, setIsLoadingReccom] = useState(true);
  const [isLoadingCurrWO, setIsLoadingCurrWO] = useState(true);
  const { workout_plan, preferences, first_name, access_token } =
    useUserStore();

  const fetch = useAxios();
  useEffect(() => {
    const fetchWorkoutReccommendation = async () => {
      try {
        const { id, ...pref } = preferences as any;
        const response = await fetch.post("/workouts/recommendation", pref);
        setRecommendedWO(response.data.workouts);
        setIsLoadingReccom(false);
        setIsLoadedRecommended(true);
      } catch (error) {}
    };
    const fetchCurrentWorkout = async () => {
      try {
        if (!workout_plan?.id) {
          setCurrentWO(null);
          setIsLoadingCurrWO(false);
          return;
        }

        const currentDay = workout_plan.workouts.find(
          (workout) =>
            workout.day.toLowerCase() === getCurrentDay().toLowerCase()
        );

        const response = await fetch.get(
          `/workout_plan/schedule/${currentDay?.id}`
        );
        setCurrentWO(response.data);
        setIsLoadingCurrWO(false);
        setIsLoadedCurrWO(true);
      } catch (error) {}
    };
    // main
    if (!isLoadedRecommended) {
      fetchWorkoutReccommendation();
    }

    if (!isLoadedCurrWO) {
      fetchCurrentWorkout();
    }
  }, []);

  return (
    <>
      <IonHeader mode="ios">
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>

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
        <IonCard>
          <IonCardHeader>
            <IonCardTitle
              style={{
                fontWeight: "bolder",
              }}
            >
              Hello {capitalizeFirstLetter(first_name)}!
            </IonCardTitle>
          </IonCardHeader>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Workout Session Today</IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
        {isLoadingCurrWO && !isLoadedCurrWO ? (
          <WorkoutStatusSkeleton />
        ) : (
          <>
            <WorkoutStatus currWorkout={currentWO} />
          </>
        )}
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Reccomendation</IonCardSubtitle>
          </IonCardHeader>
        </IonCard>

        {isLoadingReccom && !isLoadedRecommended
          ? Array(3)
              .fill(1)
              .map((_, index) => {
                return <SkeletonCard key={index} />;
              })
          : recommendedWO.map((workout: WorkoutType) => {
              return (
                <WorkoutCard style={{}} key={workout.id} workout={workout} />
              );
            })}

        <br />
        <br />
        <br />
      </IonContent>
    </>
  );
};

export default Home;
