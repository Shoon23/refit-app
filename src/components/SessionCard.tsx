import {
  IonBackdrop,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonChip,
  IonContent,
  IonGrid,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { apiUrlLocal, imageUrl } from "../env";
import { CapacitorHttp, HttpResponse, ISODateString } from "@capacitor/core";
import { WorkoutType } from "../types/workout-type";
import "../components/sessionCard.css";
import { motion } from "framer-motion";

interface iCurrWorkout {
  details: WorkoutType;
  id: string;
  reps: number;
  sets: number;
  workout_day_id: string;
}

interface ModalDetailsProps {
  workout: iCurrWorkout;
  handleNextSet: () => void;
  handleSkip: () => void;
  progressSet: number;
}

const SessionCard: React.FC<ModalDetailsProps> = ({
  workout,
  handleNextSet,
  progressSet,
  handleSkip,
}) => {
  const [workoutDetail, setWorkoutDetail] =
    useState<WorkoutType>(initWorkoutDetails);
  const [isViewMore, setIsViewMore] = useState(false);
  const [currImg, setCurrImg] = useState(0);
  const router = useIonRouter();
  useEffect(() => {
    if (!workout.id) {
      router.goBack();
      return;
    }

    setWorkoutDetail(workout.details);
  }, [handleSkip]);
  const intervalTime: number = 1000;
  let intervalId: any;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  useEffect(() => {
    const toggleImage = () => {
      setCurrImg((prevIndex) => (prevIndex === 0 ? 1 : 0));
    };

    if (isPlaying) {
      intervalId = setInterval(toggleImage, intervalTime);
    } else {
      clearInterval(intervalId);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isPlaying]);

  const handlePlayPpause = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  return (
    <>
      {isViewMore && <IonBackdrop visible={true}></IonBackdrop>}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <IonCard>
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingBottom: "67%",
            }}
          >
            <img
              alt={workout.details.name}
              src={
                imageUrl + "/exercises_img/" + workoutDetail?.images[currImg]
              }
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            />
          </div>

          <IonCardHeader>
            <IonCardTitle
              style={{
                fontSize: "1.5rem",
                marginBottom: 4,
              }}
              //   color={"light"}
            >
              {workoutDetail.name}
            </IonCardTitle>
            <IonButton onClick={handlePlayPpause}>
              {isPlaying ? "Pause" : "Play"}
            </IonButton>
            <IonButton
              onClick={() => {
                setIsViewMore((prev) => !prev);
                setIsPlaying(false);
              }}
            >
              Show Intruction
            </IonButton>
          </IonCardHeader>

          <IonCardContent>
            <IonCardTitle
              style={{
                fontSize: "1.5rem",
                margin: "0px 10px",
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 3,
              }}
            >
              <span> Set Progress</span>{" "}
              <span>
                {progressSet} / {workout.sets}
              </span>
            </IonCardTitle>
            <div
              style={{
                margin: "10px 0px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <IonCardTitle
                style={{
                  fontSize: "1.5rem",
                  margin: "0px 10px",
                }}
              >
                Repetitions
              </IonCardTitle>
              <IonCardTitle
                style={{
                  fontSize: "5rem",
                  alignSelf: "center",
                  fontWeight: "bolder",
                }}
              >
                {workout.reps}
              </IonCardTitle>
            </div>
            <div
              style={{
                display: "flex",
                width: "100%",
                gap: 8,
              }}
            >
              <IonButton
                color={"light"}
                style={{
                  width: "50%",
                }}
                onClick={handleSkip}
              >
                Skip Exercise
              </IonButton>
              <IonButton
                style={{
                  width: "50%",
                  color: "white",
                }}
                color={"success"}
                onClick={handleNextSet}
              >
                Next Set
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>
      </motion.div>

      {isViewMore && (
        <div id="box">
          <IonList
            style={{
              width: "100%",
              padding: "5px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <IonCardTitle
                style={{
                  margin: "5px",
                  fontWeight: "bolder",
                  fontSize: "1.9rem",
                }}
              >
                Instruction
              </IonCardTitle>
              <IonButton onClick={() => setIsViewMore(false)}>Close</IonButton>
            </div>
            {workout.details.instructions.map((instruction, index) => (
              <IonItem key={index}>
                <IonLabel>
                  {" "}
                  <span
                    style={{
                      fontWeight: "bolder",
                      fontSize: "1.1rem",
                    }}
                  >
                    {index + 1}
                  </span>
                  {". " + instruction}
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        </div>
      )}
    </>
  );
};

const initWorkoutDetails = {
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
export default SessionCard;
