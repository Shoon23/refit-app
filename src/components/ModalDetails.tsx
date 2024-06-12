import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
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
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { apiUrlExternal, apiUrlLocal } from "../env";
import { CapacitorHttp, HttpResponse, ISODateString } from "@capacitor/core";
import { WorkoutType } from "../types/workout-type";

interface ModalDetailsProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  workout: WorkoutType;
}

const ModalDetails: React.FC<ModalDetailsProps> = ({
  isOpen,
  setIsOpen,
  workout,
}) => {
  const [workoutDetail, setWorkoutDetail] =
    useState<WorkoutType>(initWorkoutDetails);

  const [currImg, setCurrImg] = useState(0);

  useEffect(() => {
    setWorkoutDetail(workout);
  }, []);
  const intervalTime: number = 1000;
  let intervalId: NodeJS.Timeout;
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
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Details</IonTitle>
          <IonButtons slot="end">
            <IonButton
              color={"primary"}
              onClick={() => {
                setIsPlaying(false);
                clearInterval(intervalId);
                setIsOpen(false);
              }}
            >
              Close
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <img
            alt={workout.name}
            src={apiUrlLocal + "/" + workoutDetail.images[currImg]}
            height={"50%"}
          />

          <IonCardHeader>
            <IonButton onClick={handlePlayPpause}>
              {isPlaying ? "Pause" : "Play"}
            </IonButton>

            <IonCardTitle color={"primary"}>{workoutDetail.name}</IonCardTitle>
          </IonCardHeader>
          <IonGrid>
            {workoutDetail.mechanic && (
              <IonChip disabled={true}>{workoutDetail.mechanic}</IonChip>
            )}
            {workoutDetail.category && (
              <IonChip disabled={true}>{workoutDetail.category}</IonChip>
            )}
            {workoutDetail?.primaryMuscles[0] && (
              <IonChip disabled={true}>
                {workoutDetail?.primaryMuscles[0]}
              </IonChip>
            )}

            {workoutDetail?.secondaryMuscles[0] &&
              workoutDetail.secondaryMuscles.map((muscle, idx) => (
                <IonChip key={idx} disabled={true}>
                  {muscle}
                </IonChip>
              ))}
            {workoutDetail?.force && (
              <IonChip disabled={true}>{workoutDetail?.force}</IonChip>
            )}
            {workoutDetail?.equipment && (
              <IonChip disabled={true}>{workoutDetail?.equipment}</IonChip>
            )}
          </IonGrid>
          <IonCardContent>
            <IonCardTitle style={{ marginBottom: "5px" }}>
              Instruction:
            </IonCardTitle>
            <IonList>
              {workout.instructions.map((instruction, index) => (
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
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonModal>
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
export default ModalDetails;
