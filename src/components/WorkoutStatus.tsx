import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  useIonRouter,
} from "@ionic/react";
import React from "react";

import workoutDayImg from "../assets/sam_sulek.webp";
import restDayImg from "../assets/black_sleep.avif";
import sadImg from "../assets/sad-boi.jpeg";
interface WorkoutStatusProps {
  currWorkout: any;
}

const WorkoutStatus: React.FC<WorkoutStatusProps> = ({ currWorkout }) => {
  const router = useIonRouter();
  return (
    <IonCard
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "10px",
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
      }}
    >
      {/* Background image with blur effect */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${
            !currWorkout
              ? sadImg
              : currWorkout?.exercises?.length > 0
              ? workoutDayImg
              : restDayImg
          })`,
          backgroundSize: "cover",
          filter: "blur(5px)",
          zIndex: -1,
        }}
      ></div>

      <IonCardHeader
        style={{
          padding: "20px",
          color: "#fff",
          textAlign: "center",
          background: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <IonCardTitle
          style={{
            fontWeight: "bold",
            fontSize: "1.8rem",
            textShadow: "0px 3px 6px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div
            className=""
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i
                className={`icon ${
                  currWorkout?.exercises?.length > 0 ? "icon-run" : "icon-rest"
                }`}
                style={{ marginRight: "10px" }}
              ></i>
              <p>
                {!currWorkout
                  ? "No Active Workout Plan"
                  : currWorkout?.exercises?.length > 0
                  ? "Training Day"
                  : "Rest Day"}
              </p>
            </div>
            {currWorkout?.exercises?.length > 0 && (
              <IonButton
                onClick={() => router.push("/workout-session")}
                style={{ marginTop: "10px" }}
                color={"success"}
                expand="block"
              >
                Start Workout
              </IonButton>
            )}
          </div>
        </IonCardTitle>
      </IonCardHeader>
    </IonCard>
  );
};

export default WorkoutStatus;
