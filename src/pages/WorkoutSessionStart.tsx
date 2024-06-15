import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  useIonRouter,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardSubtitle,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import WorkoutCard from "../components/WorkoutCard";
import useHomeStore from "../store/homeStore";
import SessionCard from "../components/SessionCard";
import RestTimeCard from "../components/RestTimeCard";
import bgImg from "../assets/sleeping_sulek.jpeg";
import waveBg from "../assets/wave_2.svg";
import { motion } from "framer-motion";
const WorkoutSessionStart = () => {
  const { currentWO, restTimes } = useHomeStore();
  const router = useIonRouter();
  const [isNext, setIsNext] = useState(false);
  const [currExercise, setExercise] = useState(0);
  const [time, setTime] = useState(1000);
  const [progressSet, setProgressSet] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  useEffect(() => {
    if (!currentWO?.id) {
      router.push("/main/home");
      return;
    }
    setTime(restTimes.rps);
  }, []);

  const handleNextSet = () => {
    setIsNext(true);
  };
  const handleSkip = () => {
    if (currExercise < (currentWO?.exercises.length as number) - 1) {
      setExercise((prev) => prev + 1);
      setProgressSet(0);
      setTime(restTimes.rpe);
      setIsNext(true);
    } else {
      setIsFinished(true);
    }
  };

  const handleSkipRestTime = () => {
    const currExer = currentWO?.exercises[currExercise];
    if (progressSet < currExer.sets) {
      setProgressSet((prev) => prev + 1);
      setIsNext(false);
      setTime(restTimes.rps);
    } else if (progressSet === currExer.sets) {
      if (currExercise < (currentWO?.exercises.length as number) - 1) {
        setExercise((prev) => prev + 1);
        setProgressSet(1);
        setTime(restTimes.rpe);
        setIsNext(false);
      }
    }
  };

  return (
    <IonPage>
      {!isFinished && (
        <IonHeader mode="ios" translucent={true}>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton
                defaultHref="/main/home"
                text={"Cancel"}
                color={"danger"}
              ></IonBackButton>
            </IonButtons>
            <IonTitle>Workout Session Start</IonTitle>
          </IonToolbar>
        </IonHeader>
      )}

      <IonContent scrollY={true}>
        {!isFinished && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <IonCard style={{ marginBottom: 0 }}>
              <IonCardTitle
                style={{
                  fontSize: "1.5rem",
                  margin: 10,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span> Exercise Progress</span>
                <span>
                  {currExercise + 1} / {currentWO?.exercises.length}
                </span>
              </IonCardTitle>
            </IonCard>
          </motion.div>
        )}

        {!isFinished ? (
          <>
            {!isNext ? (
              <SessionCard
                workout={currentWO?.exercises[currExercise]}
                handleNextSet={handleNextSet}
                handleSkip={handleSkip}
                progressSet={progressSet}
              />
            ) : (
              <RestTimeCard
                restTimes={restTimes}
                time={time}
                setTime={setTime}
                workout={currentWO?.exercises[currExercise]}
                nextWorkout={
                  currExercise + 1 <=
                  (currentWO?.exercises.length as number) - 1
                    ? currentWO?.exercises[currExercise + 1]
                    : null
                }
                handleSkipRestTime={handleSkipRestTime}
                setProgressSet={setProgressSet}
                progressSet={progressSet}
                setIsNext={setIsNext}
                currExercise={currExercise}
                totalNumberOfExercise={currentWO?.exercises?.length as number}
                setExercise={setExercise}
                setIsFinished={setIsFinished}
              />
            )}
          </>
        ) : (
          <div
            style={{
              backgroundImage: `url(${waveBg})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "left",
              backgroundSize: "cover",
              width: "100vw",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <IonCardHeader>
                <IonCardTitle
                  style={{
                    fontSize: "3rem",
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#ff9900",
                    margin: "10px",
                  }}
                >
                  Great session!
                </IonCardTitle>
                <IonCardSubtitle
                  onClick={() => {
                    location.href = "/main/home";
                  }}
                  color={"primary"}
                  style={{
                    fontSize: "1.5rem",
                    textAlign: "center",
                  }}
                >
                  Go Back
                </IonCardSubtitle>
              </IonCardHeader>
            </motion.div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default WorkoutSessionStart;
