import { IonCard, IonLabel, IonSkeletonText } from "@ionic/react";
import React from "react";
import { apiUrlLocal } from "../env";

const WorkoutItemSkeleton = () => {
  return (
    <>
      <IonCard>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
          }}
        >
          <IonSkeletonText
            style={{
              width: "130px",
              height: "87px",
            }}
            animated={true}
          ></IonSkeletonText>

          <IonLabel
            color={"dark"}
            style={{
              whiteSpace: "wrap",
              // width: "140px",
              flex: 2,
            }}
          >
            <IonSkeletonText animated={true}></IonSkeletonText>
          </IonLabel>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <IonSkeletonText animated={true}></IonSkeletonText>

            <IonSkeletonText animated={true}></IonSkeletonText>
          </div>
        </div>
      </IonCard>
    </>
  );
};

export default WorkoutItemSkeleton;
