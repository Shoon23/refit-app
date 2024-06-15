import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import bgImg from "../assets/sleeping_sulek.jpeg";
import { WorkoutType } from "../types/workout-type";
import ken2 from "../assets/ken_2.jpeg";
interface iCurrWorkout {
  details: WorkoutType;
  id: string;
  reps: number;
  sets: number;
  workout_day_id: string;
}

interface RestTimeCardProps {
  workout: iCurrWorkout;
  nextWorkout: iCurrWorkout | null;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  handleSkipRestTime: () => void;
  setProgressSet: React.Dispatch<React.SetStateAction<number>>;
  progressSet: number;
  setIsNext: React.Dispatch<React.SetStateAction<boolean>>;
  restTimes: {
    rpe: number;
    rps: number;
  };
  currExercise: number;
  totalNumberOfExercise: number;
  setExercise: React.Dispatch<React.SetStateAction<number>>;
  setIsFinished: React.Dispatch<React.SetStateAction<boolean>>;
}
const RestTimeCard: React.FC<RestTimeCardProps> = ({
  workout,
  nextWorkout,
  time,
  setTime,
  setProgressSet,
  progressSet,
  handleSkipRestTime,
  setIsNext,
  restTimes,
  currExercise,
  totalNumberOfExercise,
  setExercise,
  setIsFinished,
}) => {
  useEffect(() => {
    if (time === 0) {
      setIsNext(false);
      // for the rest time for each sets
      if (progressSet < workout.sets) {
        setProgressSet((prev) => prev + 1);
        setTime(restTimes.rps);
      }
      // for the rest time for each exercise
      else if (progressSet === workout.sets) {
        if (currExercise < totalNumberOfExercise - 1) {
          setExercise((prev) => prev + 1);
          setProgressSet(1);
          setTime(restTimes.rpe);
          setIsNext(false);
        } else {
          setIsFinished(true);
        }
      }
    }
  }, [time]);
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          // height: "85%",
          width: "100%",
        }}
      >
        <IonCard style={{ marginBottom: 0, alignSelf: "start", width: "95%" }}>
          <IonCardHeader>
            <IonCardTitle
              style={{
                fontSize: "1.6rem",
                fontWeight: "bolder",
              }}
            >
              Current Exercise:
            </IonCardTitle>
            <IonCardTitle
              style={{
                fontSize: "1.4rem",
              }}
            >
              {workout.details.name}
            </IonCardTitle>
            <IonCardTitle
              style={{
                fontSize: "1.4rem",
              }}
            >
              Progress {progressSet}/{workout.sets}
            </IonCardTitle>
          </IonCardHeader>
        </IonCard>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "2rem",
            fontWeight: "bold",
            textAlign: "center",
            width: "100%",
          }}
        >
          <IonCard
            style={{
              width: "100%",
              padding: 20,
            }}
          >
            <IonCardHeader>
              <IonCardTitle
                style={{
                  fontSize: "1.5rem",
                  margin: 10,
                  display: "flex",
                  justifyContent: "space-between",
                }}
                color={"success"}
              >
                Rest Time
              </IonCardTitle>
              <IonCardTitle
                style={{
                  fontWeight: "bolder",
                  fontSize: "5rem",
                }}
              >
                {time}
              </IonCardTitle>
            </IonCardHeader>
            <div
              style={{
                display: "flex",
                width: "100%",
                gap: 5,
              }}
            >
              <IonButton
                color={"light"}
                style={{
                  width: "50%",
                }}
                onClick={handleSkipRestTime}
              >
                Skip
              </IonButton>
              <IonButton
                style={{
                  width: "50%",
                }}
                onClick={() => {
                  if (time > 600) return;
                  setTime((prevTime) => prevTime + 20);
                }}
              >
                Add 20 secs
              </IonButton>
            </div>
          </IonCard>
        </div>
      </div>
      <IonCard style={{ margin: "0px 10px", alignSelf: "start", width: "95%" }}>
        {nextWorkout?.id && (
          <IonCardHeader>
            <IonCardTitle
              style={{
                fontSize: "1.6rem",
                fontWeight: "bolder",
              }}
              color={"medium"}
            >
              Next Exercise:
            </IonCardTitle>
            <IonCardTitle
              style={{
                fontSize: "1.4rem",
              }}
              color={"medium"}
            >
              {nextWorkout?.details?.name}
            </IonCardTitle>
          </IonCardHeader>
        )}
      </IonCard>
    </>
  );
};

export default RestTimeCard;
