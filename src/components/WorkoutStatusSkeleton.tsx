import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonSkeletonText,
} from "@ionic/react";

const WorkoutStatusSkeleton = () => {
  return (
    <IonCard
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "20px",
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
          backgroundSize: "cover",
          filter: "blur(3px)",
          zIndex: -1,
        }}
      >
        <IonSkeletonText animated={true}></IonSkeletonText>
      </div>

      <IonCardHeader
        style={{
          margin: "20px",
        }}
      >
        <IonCardTitle>
          <div
            className=""
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <IonSkeletonText
              style={{
                padding: "5px",
              }}
              animated={true}
            ></IonSkeletonText>
          </div>
        </IonCardTitle>
      </IonCardHeader>
    </IonCard>
  );
};

export default WorkoutStatusSkeleton;
