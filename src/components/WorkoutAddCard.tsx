import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonChip,
  IonLabel,
  useIonRouter,
} from "@ionic/react";
import React, { useState } from "react";
import { WorkoutType } from "../types/workout-type";
import ModalDetails from "./ModalDetails";
import { apiUrlLocal, imageUrl } from "../env";
import useSelectWOStore from "../store/workoutPlanStore";
import { motion } from "framer-motion";
interface WorkoutCardProps {
  workout: WorkoutType;
  style: {
    [key: string]: any;
  };
}

const WorkoutAddCard: React.FC<WorkoutCardProps> = ({
  workout,
  style = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setWorkout } = useSelectWOStore();

  const router = useIonRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: "easeOut", duration: 0.5 }}
    >
      <IonCard onClick={() => setIsOpen(true)} style={style} button={true}>
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
                  setWorkout(workout);
                  setIsOpen(false);
                  router.push("/main/workout-plan/add", "back", "replace");
                }}
                style={{}}
                color={"success"}
              >
                add
              </IonButton>
            </div>
          </div>
        </IonCardContent>
      </IonCard>
      <ModalDetails isOpen={isOpen} setIsOpen={setIsOpen} workout={workout} />
    </motion.div>
  );
};

export default WorkoutAddCard;
