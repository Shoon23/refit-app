import React from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonSkeletonText,
  IonThumbnail,
  useIonRouter,
} from "@ionic/react";

const SkeletonCard = () => {
  return (
    <IonCard>
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "67%",
        }}
      >
        <IonSkeletonText
          animated={true}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        ></IonSkeletonText>
      </div>

      <IonCardContent>
        <IonCardTitle style={{ marginBottom: "10px" }}>
          <IonSkeletonText animated={true}></IonSkeletonText>
        </IonCardTitle>

        <IonButton color={"dark"} disabled={true} expand="block">
          <IonSkeletonText animated={true}></IonSkeletonText>
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default SkeletonCard;
