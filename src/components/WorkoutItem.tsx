import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonImg,
  IonItem,
  IonLabel,
  IonRow,
  IonThumbnail,
} from "@ionic/react";
import React, { useState } from "react";
import { apiUrlLocal } from "../env";
import ModalDetails from "./ModalDetails";
import { WorkoutType } from "../types/workout-type";
import WorkoutItemModal from "./WorkoutItemModal";

interface WorkoutItemProps {
  data: {
    id: string;
    sets: number;
    reps: number;
    details: WorkoutType;
  };
}

const WorkoutItem: React.FC<WorkoutItemProps> = ({
  data: { details: workout, reps, sets, id },
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IonCard
        onClick={() => setIsOpen(true)}
        button={true}
        style={{
          margin: 2,
        }}
      >
        <IonCardContent
          style={{
            display: "flex",
            gap: "15px",
            alignItems: "center",
          }}
        >
          <img
            alt={workout.name}
            src={
              workout.images && workout.images.length > 0
                ? apiUrlLocal + "/" + workout?.images[0]
                : ""
            }
            height={"120px"}
            width={"140px"}
            style={{
              borderRadius: "5px",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              height: "100%",
              alignItems: "center",
            }}
          >
            <IonLabel
              style={{
                fontSize: "1.2rem",
                textAlign: "center",
              }}
              color={"dark"}
            >
              {workout.name}
            </IonLabel>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div>
                  <IonLabel>Sets: </IonLabel>
                  <IonLabel>{sets}</IonLabel>
                </div>
                <div>
                  <IonLabel>Reps: </IonLabel>
                  <IonLabel>{reps}</IonLabel>
                </div>
              </div>
            </div>
          </div>
        </IonCardContent>
      </IonCard>

      <WorkoutItemModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        data={{ details: workout, reps, sets, id }}
      />
    </>
  );
};

export default WorkoutItem;
