import {
  IonCard,
  IonCardContent,
  IonLabel,
  IonButton,
  IonSkeletonText,
} from "@ionic/react";
import React from "react";
import { apiUrlLocal } from "../env";

const WorkoutAddCardSekeleton = () => {
  return (
    <IonCard>
      <IonCardContent
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
        }}
      >
        <div
          className=""
          style={{
            borderRadius: "5px",
            height: "120px",
            width: "140px",
          }}
        >
          <IonSkeletonText animated={true}></IonSkeletonText>
        </div>

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
            <IonSkeletonText animated={true}></IonSkeletonText>
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
              <IonSkeletonText animated={true}></IonSkeletonText>
              <IonSkeletonText animated={true}></IonSkeletonText>
              <IonSkeletonText animated={true}></IonSkeletonText>
            </div>
            <IonButton disabled={true} style={{}} color={"light"}>
              add
            </IonButton>
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default WorkoutAddCardSekeleton;
