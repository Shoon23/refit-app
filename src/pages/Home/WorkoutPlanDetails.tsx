import {
  IonCard,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonSpinner,
  IonFab,
  IonFabButton,
  IonIcon,
  useIonRouter,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonAlert,
  IonInput,
  IonModal,
} from "@ionic/react";
import { add, scanOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { DayOfWeekType, exerciseDates } from "../../data/exerciseDate";
import WorkoutItem from "../../components/WorkoutItem";

import { apiUrlLocal } from "../../env";
import useWorkoutPlanStore from "../../store/workoutPlanStore";
import useUserStore from "../../store/userStore";
import { createOutline } from "ionicons/icons";
import useHomeStore from "../../store/homeStore";
import useAxios from "../../hooks/useAxios";
import { motion } from "framer-motion";

interface WorkoutPlanDetailsProps {}

const WorkoutPlanDetails: React.FC<WorkoutPlanDetailsProps> = () => {
  const router = useIonRouter();

  const [currView, setCurrView] = useState("");
  const [workoutDayIds, setWorkoutDayIds] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [updatedNamed, setUpdatedName] = useState("");
  const [isError, setIsError] = useState(false);
  const fetch = useAxios();
  const {
    clearSelectedWO,
    setWorkoutDaySelected,
    day,
    selectedExercise,
    setSelectedExercise,
    viewDetailsWP,
    clearViewDetaulsWP,
    setViewDetailsWP,
    activeWP,
    workoutPlans,
    setActiveWP,
    setWorkoutPlans,
  } = useWorkoutPlanStore();
  const { setUpdateActiveWP, workout_plan } = useUserStore((state) => ({
    setUpdateActiveWP: state.setUpdateActiveWP,
    workout_plan: state.workout_plan,
  }));
  const { setIsLoadedCurrWO } = useHomeStore();
  const getWorkoutPlanIds = async () => {
    try {
      if (!viewDetailsWP?.id) {
        router.push("/main/workout-plan", "back");
        return;
      }
      const workoutPlan = viewDetailsWP?.workouts;

      let currId;
      setWorkoutDayIds(workoutPlan);

      if (!day.day) {
        setCurrView("M");
        const selectedDay = workoutPlan.find((id: any) => id.day === "Monday");
        currId = selectedDay?.id;
        setWorkoutDaySelected(selectedDay);
      } else {
        const selectedDay = workoutPlan.find((hah: any) => hah.day === day.day);
        currId = selectedDay?.id;
        const key = Object.keys(exerciseDates).find(
          (key: keyof DayOfWeekType) => exerciseDates[key] === selectedDay?.day
        );

        setCurrView(key as string);
      }

      fetch_workout_day_exercises(currId);
    } catch (error) {
      console.log(error);
    }
  };
  const fetch_workout_day_exercises = async (id: string | undefined) => {
    setIsLoading(true);

    const response = await fetch.get(`/workout_plan/schedule/${id}`);

    setSelectedExercise(response.data.exercises);
    setIsLoading(false);
  };

  useEffect(() => {
    clearSelectedWO();
    getWorkoutPlanIds();
    setUpdatedName(viewDetailsWP?.name);
  }, []);

  const handleDeleteWP = async () => {
    try {
      await fetch.delete(`/workout_plan/${viewDetailsWP.id}`);
      if (viewDetailsWP.id === workout_plan.id) {
        setUpdateActiveWP({
          id: "",
          name: "",
          is_active: false,
          workouts: [],
        });
        setIsLoadedCurrWO(false);
      }

      router.push("/main/workout-plan", "back");
    } catch (error) {
      setIsError(true);
      console.log(error);
    }
  };

  const handleUsePlan = async () => {
    try {
      await fetch.put(`/workout_plan/activate`, {
        new_wp_id: viewDetailsWP?.id,
        old_wp_id: workout_plan?.id,
      });

      setIsLoadedCurrWO(false);
      setUpdateActiveWP({ ...viewDetailsWP, is_active: true });
    } catch (error) {
      setIsError(true);
      console.log(error);
    }
  };

  const handleUpdateName = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch.put(`/workout_plan/update`, {
        workout_plan_id: viewDetailsWP?.id,
        name: updatedNamed,
      });

      setViewDetailsWP({ name: updatedNamed });

      setIsOpenUpdate(false);
    } catch (error) {
      console.log(error);
      setIsError(true);
    }
  };

  const handleOnChange = (e: any) => {
    const value = (e.target as HTMLInputElement).value;
    setUpdatedName(value);
  };
  return (
    <>
      <IonHeader translucent={true} mode="ios">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              color={"primary"}
              onClick={() => {
                router.push("/main/workout-plan", "back");
                clearViewDetaulsWP();
                clearSelectedWO();
              }}
            >
              Back
            </IonButton>
          </IonButtons>
          <IonTitle>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              {viewDetailsWP?.name}
              <IonIcon
                onClick={() => {
                  setIsOpenUpdate(true);
                }}
                icon={createOutline}
                size="small"
              ></IonIcon>
            </div>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton
              color={"danger"}
              onClick={() => {
                setIsOpenDelete(true);
              }}
            >
              Delete
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <IonCard>
              <IonSegment
                scrollable={true}
                value={currView}
                onIonChange={(e) => {
                  const convert_day = exerciseDates[e.target.value as string];
                  const selectedDay = workoutDayIds.filter(
                    (id: any) => id.day === convert_day
                  )[0];

                  setWorkoutDaySelected(selectedDay);
                  fetch_workout_day_exercises(selectedDay.id);
                  setCurrView(e.target.value as string);
                }}
              >
                {Object.keys(exerciseDates).map((date) => (
                  <IonSegmentButton key={date} value={date}>
                    <IonLabel>{date}</IonLabel>
                  </IonSegmentButton>
                ))}
              </IonSegment>
            </IonCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              flex: 1,
            }}
          >
            <IonCard
              style={{
                height: "90%",

                marginBottom: "100px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <IonList style={{ height: "100%", overflowY: "auto" }}>
                {isLoading ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    <IonItem>
                      <IonSpinner name="bubbles"></IonSpinner>
                    </IonItem>
                  </div>
                ) : selectedExercise.length === 0 ? (
                  <div
                    className=""
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    <IonLabel>Rest Day</IonLabel>
                  </div>
                ) : (
                  selectedExercise.map((e: any) => (
                    <WorkoutItem key={e.id} data={e} />
                  ))
                )}
              </IonList>
              <IonButton
                disabled={viewDetailsWP?.id === workout_plan?.id}
                color={"secondary"}
                onClick={handleUsePlan}
              >
                {viewDetailsWP?.id === workout_plan?.id
                  ? "Already In Use"
                  : "Use this Plan"}
              </IonButton>
            </IonCard>
          </motion.div>

          <IonFab
            onClick={() => router.push("/main/workout-plan/add")}
            slot="fixed"
            vertical="bottom"
            horizontal="end"
            style={{
              marginBottom: "135px",
            }}
          >
            <IonFabButton>
              <IonIcon icon={add}></IonIcon>
            </IonFabButton>
          </IonFab>
        </div>
        <IonAlert
          isOpen={isOpenDelete}
          header="Are you sure you want to delete this?"
          buttons={[
            {
              text: "No",
              cssClass: "alert-button-cancel",
            },
            {
              text: "Yes",
              cssClass: "alert-button-confirm",
              handler: handleDeleteWP,
            },
          ]}
          onDidDismiss={() => setIsOpenDelete(false)}
          backdropDismiss={false}
        ></IonAlert>
        {/* update namae modal */}

        <IonModal isOpen={isOpenUpdate}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Update Workout Plan Name</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setIsOpenUpdate(false)}>
                  Close
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonCard>
              <form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "15px",
                  gap: "20px",
                }}
                onSubmit={handleUpdateName}
              >
                <IonInput
                  type="text"
                  fill="solid"
                  label="Name"
                  labelPlacement="floating"
                  helperText="Enter a valid Name"
                  errorText="Invalid name"
                  name="name"
                  onIonInput={handleOnChange}
                  value={updatedNamed}
                ></IonInput>
                <IonButton
                  type="submit"
                  disabled={
                    updatedNamed === viewDetailsWP?.name ||
                    !updatedNamed ||
                    updatedNamed.length <= 3
                  }
                  expand="block"
                >
                  Update Name
                </IonButton>
              </form>
            </IonCard>
          </IonContent>
        </IonModal>
      </IonContent>
      <IonAlert
        isOpen={isError}
        header="Something Went Wrong"
        buttons={["Okay"]}
        onDidDismiss={() => setIsError(false)}
      ></IonAlert>
    </>
  );
};

export default WorkoutPlanDetails;
