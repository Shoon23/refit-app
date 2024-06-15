import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonCard,
  IonCol,
  IonGrid,
  IonInput,
  IonLabel,
  IonRow,
  useIonRouter,
  IonCardContent,
  IonAlert,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { exerciseDates } from "../../data/exerciseDate";
import useSelectWOStore from "../../store/workoutPlanStore";
import WorkoutCard from "../../components/WorkoutCard";
import SelectedWorkoutCard from "../../components/SelectedWorkoutCard";

import { apiUrlLocal } from "../../env";
import useUserStore from "../../store/userStore";
import useHomeStore from "../../store/homeStore";
import useAxios from "../../hooks/useAxios";

const AddExercisePage: React.FC<RouteComponentProps> = ({ history }) => {
  const { day, selected_workout, clearSelectedWO } = useSelectWOStore();
  const { access_token } = useUserStore();
  const { setIsLoadedCurrWO } = useHomeStore();
  const router = useIonRouter();
  const [formData, setFormData] = useState<{ sets: number; reps: number }>({
    sets: 0,
    reps: 0,
  });
  const [isError, setIsError] = useState(false);
  const fetch = useAxios();
  const handleOnChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch.post("/workout_plan/schedule/assign", {
        day: day.day,
        workout_day_id: day.id,
        reps: formData.reps,
        sets: formData.sets,
        detail_id: selected_workout.id,
      });
      clearSelectedWO();
      setIsLoadedCurrWO(false);
      router.push("/main/workout-plan/details", "back", "replace");
    } catch (error) {
      setIsError(true);
      console.log(error);
    }
  };
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Exercise - {day.day}</IonTitle>
          <IonButtons slot="end">
            <IonButton
              color={"danger"}
              onClick={() => history.replace("/main/workout-plan/details")}
            >
              Cancel
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <form
            onSubmit={handleOnSubmit}
            style={{
              padding: "10px",
            }}
          >
            <IonLabel
              style={{
                fontSize: "1.4rem",
              }}
            >
              Exercise
            </IonLabel>

            {!selected_workout.id ? (
              <IonButton
                routerLink="/main/workout-plan/list"
                expand="block"
                color={"secondary"}
              >
                Choose
              </IonButton>
            ) : (
              <SelectedWorkoutCard workout={selected_workout} />
            )}

            <IonInput
              label="Sets"
              type="number"
              placeholder="1"
              name="sets"
              onIonInput={handleOnChange}
            ></IonInput>

            <IonInput
              label="Reps"
              type="number"
              placeholder="1"
              name="reps"
              onIonInput={handleOnChange}
            ></IonInput>

            <IonButton
              type="submit"
              disabled={
                !selected_workout.name ||
                formData.reps === 0 ||
                formData.sets === 0
              }
              color={"success"}
              expand="block"
            >
              Save
            </IonButton>
          </form>
        </IonCard>
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

export default AddExercisePage;
