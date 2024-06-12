import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonChip,
  IonGrid,
  IonImg,
  useIonRouter,
} from "@ionic/react";
import React, { useState } from "react";
import { WorkoutType } from "../types/workout-type";
import ModalDetails from "./ModalDetails";
import { apiUrlLocal } from "../env";
interface WorkoutCardProps {
  workout: WorkoutType;
  style: {
    [key: string]: any;
  };
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, style = {} }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <IonCard style={style}>
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "67%",
        }}
      >
        <img
          alt={workout.name}
          src={
            workout.images && workout.images.length > 0
              ? apiUrlLocal + "/" + workout?.images[0]
              : ""
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

      <IonCardContent>
        <IonCardTitle style={{ marginBottom: "5px" }}>
          {workout.name}
        </IonCardTitle>
        <IonGrid>
          {workout.mechanic && (
            <IonChip disabled={true}>{workout.mechanic}</IonChip>
          )}
          {workout?.primaryMuscles[0] && (
            <IonChip disabled={true}>{workout?.primaryMuscles[0]}</IonChip>
          )}
          {workout?.force && (
            <IonChip disabled={true}>{workout?.force}</IonChip>
          )}
        </IonGrid>
        <IonButton
          expand="block"
          color={"secondary"}
          onClick={() => setIsOpen(true)}
        >
          View More
        </IonButton>

        <ModalDetails isOpen={isOpen} setIsOpen={setIsOpen} workout={workout} />
      </IonCardContent>
    </IonCard>
  );
};

export default WorkoutCard;
