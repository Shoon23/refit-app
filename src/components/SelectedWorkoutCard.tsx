import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonLabel,
  useIonRouter,
} from "@ionic/react";
import { useState } from "react";
import { WorkoutType } from "../types/workout-type";
import ModalDetails from "./ModalDetails";
import { apiUrlLocal, imageUrl } from "../env";
import useSelectWOStore from "../store/workoutPlanStore";
interface WorkoutCardProps {
  workout: WorkoutType;
}

const SelectedWorkoutCard: React.FC<WorkoutCardProps> = ({ workout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { clearSelectedWO } = useSelectWOStore();

  return (
    <>
      <IonCard
        button={true}
        onClick={() => setIsOpen(true)}
        style={{
          margin: "0px",
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
                ? imageUrl + "/exercises_img/" + workout?.images[0]
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
            }}
          >
            <IonLabel
              style={{
                fontSize: "1.2rem",
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
                  gap: "10px",
                }}
              >
                {workout.mechanic && <IonLabel>{workout.mechanic}</IonLabel>}
                {workout?.primaryMuscles[0] && (
                  <IonLabel>{workout?.primaryMuscles[0]}</IonLabel>
                )}
                {workout?.force && <IonLabel>{workout?.force}</IonLabel>}
              </div>

              <IonButton
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelectedWO();
                }}
                style={{}}
                color={"danger"}
              >
                Remove
              </IonButton>
            </div>
          </div>
        </IonCardContent>
      </IonCard>
      <ModalDetails isOpen={isOpen} setIsOpen={setIsOpen} workout={workout} />
    </>
  );
};

export default SelectedWorkoutCard;
