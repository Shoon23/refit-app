import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
  IonReorder,
  IonReorderGroup,
  ItemReorderEventDetail,
  IonButton,
  IonChip,
  IonInput,
  IonIcon,
  useIonRouter,
  IonSpinner,
} from "@ionic/react";
import { checkmark, close } from "ionicons/icons";
import { useEffect, useState } from "react";
import bgImg from "../assets/backgrounds/4.jpeg";
import useHomeStore from "../store/homeStore";
import { swapArrayValue } from "../utils/arrayUtils";
import useUserStore from "../store/userStore";
import { motion } from "framer-motion";
const WorkoutSession = () => {
  const [isEdit, setIsEdit] = useState({
    rpe: false,
    rps: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { currentWO, setCurrWoExercise, setRestTimes } = useHomeStore();
  const { workout_plan } = useUserStore();
  const [rpe, setRpe] = useState(60);
  const [rps, setRps] = useState(30);
  const [prevRpe, setPrevRpe] = useState(60);
  const [prevRps, setPrevRps] = useState(30);

  const router = useIonRouter();
  useEffect(() => {
    if (!currentWO?.id) {
      router.push("/main/home");
    } else {
      setIsLoading(false);
    }
  }, []);

  function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    setCurrWoExercise(
      swapArrayValue(
        currentWO?.exercises as any,
        event.detail.from,
        event.detail.to
      )
    );
    event.detail.complete();
  }

  const handleShowEdit = (key: string) => {
    setIsEdit((prev) => ({ ...prev, [key]: true }));
  };
  const handleCloseEdit = (key: string) => {
    setIsEdit((prev) => ({ ...prev, [key]: false }));
    setRpe(prevRpe);
    setRps(prevRps);
  };

  const handleUpdate = (key: string) => {
    setIsEdit((prev) => ({ ...prev, [key]: false }));
    setPrevRpe(rpe);
    setPrevRps(rps);
  };

  const handleInputChange = (e: any) => {
    const name = e.target.name;
    const value = parseInt(e.detail.value, 10);

    if (!isNaN(value)) {
      if (name === "rpe") {
        setRpe(value > 600 ? 600 : value);
      } else if (name === "rps") {
        setRps(value > 600 ? 600 : value);
      }
    }
  };

  const handleStartSession = () => {
    setRestTimes({ rps, rpe });
    router.push("/workout-session/start");
  };
  return (
    <IonPage>
      <IonHeader mode="ios" translucent={true}>
        <IonToolbar>
          <IonButton
            onClick={() => {
              location.href = "/main/home";
            }}
            slot="start"
            color={"light"}
          >
            Back
          </IonButton>
          <IonTitle>Workout Session</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${bgImg})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            filter: "blur(5px)",
            zIndex: -1,
          }}
        ></div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <IonCard>
            {!isLoading ? (
              <>
                <div
                  style={{
                    margin: "10px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <IonCardTitle
                    style={{
                      fontWeight: "bolder",
                      fontSize: "1.8rem",
                    }}
                  >
                    {workout_plan.name} - {currentWO?.day}
                  </IonCardTitle>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "10px",
                    gap: 5,
                    fontSize: "1.1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {!isEdit.rpe ? (
                      <>
                        <IonLabel>Rest Per Exercises:</IonLabel>
                        <IonChip
                          onClick={() => handleShowEdit("rpe")}
                          outline={true}
                        >
                          {rpe} secs
                        </IonChip>
                      </>
                    ) : (
                      <>
                        <IonInput
                          label="Rest Per Exercises"
                          type="number"
                          placeholder="000"
                          name="rpe"
                          onIonInput={handleInputChange}
                          value={rpe}
                        ></IonInput>
                        <div
                          style={{
                            display: "flex",
                          }}
                        >
                          <IonButton
                            color={"light"}
                            onClick={() => handleUpdate("rpe")}
                            disabled={rpe > 600}
                          >
                            <IonIcon icon={checkmark}></IonIcon>
                          </IonButton>
                          <IonButton
                            color={"light"}
                            onClick={() => handleCloseEdit("rpe")}
                          >
                            <IonIcon icon={close}></IonIcon>
                          </IonButton>
                        </div>
                      </>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {!isEdit.rps ? (
                      <>
                        <IonLabel>Rest Per Sets:</IonLabel>
                        <IonChip
                          onClick={() => handleShowEdit("rps")}
                          outline={true}
                        >
                          {rps} secs
                        </IonChip>
                      </>
                    ) : (
                      <>
                        <IonInput
                          label="Rest Per Sets"
                          type="number"
                          placeholder="000"
                          name="rps"
                          onIonInput={handleInputChange}
                          value={rps}
                        ></IonInput>

                        <div
                          style={{
                            display: "flex",
                          }}
                        >
                          <IonButton
                            color={"light"}
                            onClick={() => handleUpdate("rps")}
                            disabled={rps > 600}
                          >
                            <IonIcon icon={checkmark}></IonIcon>
                          </IonButton>
                          <IonButton
                            color={"light"}
                            onClick={() => handleCloseEdit("rps")}
                          >
                            <IonIcon icon={close}></IonIcon>
                          </IonButton>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <IonCardContent>
                  <IonList
                    style={{
                      height: "500px",
                      overflowY: "auto",
                    }}
                  >
                    {/* The reorder gesture is disabled by default, enable it to drag and drop items */}
                    <IonReorderGroup
                      disabled={false}
                      onIonItemReorder={handleReorder}
                      style={{ height: "100%", overflowY: "auto" }}
                    >
                      {currentWO?.exercises.map((exercise) => (
                        <IonItem key={exercise.id}>
                          <IonLabel>{exercise?.details.name}</IonLabel>
                          <IonReorder slot="end"></IonReorder>
                        </IonItem>
                      ))}
                    </IonReorderGroup>
                  </IonList>

                  <IonButton
                    onClick={handleStartSession}
                    expand="block"
                    color={"secondary"}
                    disabled={isEdit.rpe || isEdit.rps}
                  >
                    Start
                  </IonButton>
                </IonCardContent>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  height: "80vh",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IonSpinner name="bubbles"></IonSpinner>
              </div>
            )}
          </IonCard>
        </motion.div>
      </IonContent>
    </IonPage>
  );
};

export default WorkoutSession;
