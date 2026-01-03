import {
  IonAlert,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { add, cloudOffline } from "ionicons/icons";

import { useEffect, useState } from "react";

import useUserStore from "../../store/userStore";
import useWorkoutPlanStore from "../../store/workoutPlanStore";
import bgImg from "../../assets/backgrounds/3.jpeg";
import { Network } from "@capacitor/network";
import useAxios from "../../hooks/useAxios";
import { motion } from "framer-motion";
const WorkoutPlan = () => {
  const router = useIonRouter();
  const fetch = useAxios();
  const [isLoading, setIsLoading] = useState(true);
  // const [activeWP, seActiveWP] = useState<iWorkoutPlan>({
  //   id: "",
  //   name: "",
  //   is_active: false,
  //   workouts: [],
  // });
  // const [workoutPlans, setWorkoutPlans] = useState<iWorkoutPlan[]>([]);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const { workout_plan, access_token, id } = useUserStore();
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState<boolean>();
  const [name, setName] = useState("");
  const [isConnected, setIsConnected] = useState(true);
  const {
    clearSelectedWO,
    setViewDetailsWP,
    setActiveWP,
    setWorkoutPlans,
    workoutPlans,
    activeWP,
  } = useWorkoutPlanStore();
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    clearSelectedWO();
    fetchWorkoutPlans();
  }, []);

  const fetchWorkoutPlans = async () => {
    try {
      const status = await Network.getStatus();
      if (!status.connected) {
        setIsConnected(false);
        setIsLoading(false);
        return;
      }

      const response = await fetch.get(`/workout_plan/${id}`);
      const acttiveWP = response.data.filter((wp: any) => wp.is_active);
      const wp = response.data.filter((wp: any) => !wp.is_active);
      setActiveWP(acttiveWP[0]);
      setWorkoutPlans(wp);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      console.log(error);
    }
  };

  const handleOnChange = (e: any) => {
    const value = (e.target as HTMLInputElement).value;
    if (value.length <= 3) {
      setIsValid(false);
      return;
    }

    setName(value);
    setIsValid(true);
  };

  const handleCreateWP = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch.post(`/workout_plan/add`, {
        user_id: id,
        name,
      });
      console.log(response);
      setIsOpenAddModal(false);
      setWorkoutPlans([response.data.workout_plan, ...workoutPlans]);
      // setWorkoutPlans((prev) => [response.data.workout_plan, ...prev]);
    } catch (error) {
      setIsError(true);
      console.log(error);
    }
  };
  const handleOnTouched = async () => {
    setIsTouched(true);
  };

  const handleRetry = async () => {
    const status = await Network.getStatus();

    if (status.connected) {
      setIsLoading(true);
      setIsConnected(true);
      fetchWorkoutPlans();
    }
  };
  return (
    <>
      <IonHeader translucent={true} mode="ios">
        <IonToolbar>
          <IonButtons slot="primary"></IonButtons>
          <IonTitle>Workout Plans</IonTitle>
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
        {isLoading ? (
          <div
            style={{
              display: "flex",
              height: "100vh",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IonSpinner name="bubbles"></IonSpinner>
          </div>
        ) : !isConnected ? (
          <motion.div
            style={{
              display: "flex",
              height: "90%",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
            initial={{ opacity: 0, x: -100, rotate: -10 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <IonLabel
              style={{
                fontSize: "1.5rem",
                fontWeight: "bolder",
              }}
            >
              Connection Error
            </IonLabel>
            <IonButton color={"dark"} onClick={handleRetry}>
              Retry
            </IonButton>
          </motion.div>
        ) : (
          <>
            {workoutPlans.length !== 0 || activeWP?.name ? (
              <>
                {activeWP?.name && (
                  <>
                    <IonCardSubtitle
                      color={"success"}
                      style={{
                        margin: "15px",
                      }}
                    >
                      Active Workout Plan
                    </IonCardSubtitle>

                    <motion.div
                      initial={{ opacity: 0, x: -100, rotate: -10 }}
                      animate={{ opacity: 1, x: 0, rotate: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <IonCard
                        button={true}
                        onClick={() => {
                          setViewDetailsWP(activeWP as any);
                          router.push("/main/workout-plan/details");
                        }}
                      >
                        <IonCardHeader>
                          <IonCardTitle>{activeWP?.name}</IonCardTitle>
                        </IonCardHeader>
                      </IonCard>
                    </motion.div>
                  </>
                )}

                {workoutPlans.length !== 0 && (
                  <>
                    <IonCardSubtitle
                      color={"secondary"}
                      style={{
                        margin: "15px",
                      }}
                    >
                      Workout Plans
                    </IonCardSubtitle>
                    {workoutPlans?.map((wp) => (
                      <motion.div
                        key={wp.id}
                        initial={{ opacity: 0, x: -100, rotate: -10 }}
                        animate={{ opacity: 1, x: 0, rotate: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        <IonCard
                          button={true}
                          onClick={() => {
                            setViewDetailsWP(wp);
                            router.push("/main/workout-plan/details");
                          }}
                        >
                          <IonCardHeader>
                            <IonCardTitle>{wp.name}</IonCardTitle>
                          </IonCardHeader>
                        </IonCard>
                      </motion.div>
                    ))}
                  </>
                )}
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  height: "90%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IonLabel
                  style={{
                    fontSize: "1.4rem",
                  }}
                >
                  No Workout Plan
                </IonLabel>
              </div>
            )}
          </>
        )}

        <IonFab
          slot="fixed"
          vertical="bottom"
          horizontal="end"
          style={{
            marginBottom: "50px",
          }}
        >
          <IonFabButton
            onClick={() => setIsOpenAddModal(true)}
            disabled={!isConnected}
          >
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
        {/* add workout plan modal */}
        <IonModal isOpen={isOpenAddModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>New Workout Plan</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setIsOpenAddModal(false)}>
                  Close
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonCard>
              <form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "15px",
                  gap: "20px",
                }}
                onSubmit={handleCreateWP}
              >
                <IonInput
                  className={`${isValid && "ion-valid"} ${
                    !isValid && "ion-invalid"
                  } ${isTouched && "ion-touched"}`}
                  type="text"
                  fill="solid"
                  label="Name"
                  labelPlacement="floating"
                  helperText="Enter a valid Name"
                  errorText="Invalid name"
                  name="name"
                  onIonInput={handleOnChange}
                  onIonBlur={() => handleOnTouched()}
                ></IonInput>
                <IonButton
                  type="submit"
                  disabled={!isValid || !name}
                  expand="block"
                >
                  Create
                </IonButton>
              </form>
            </IonCard>
          </IonContent>
        </IonModal>
      </IonContent>
      <IonAlert
        isOpen={isError}
        header="Something Went Wrong"
        buttons={["Okay"]}
        onDidDismiss={() => setIsError(false)}
      ></IonAlert>
    </>
  );
};

export default WorkoutPlan;
