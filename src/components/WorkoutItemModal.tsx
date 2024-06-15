import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { apiUrlLocal } from "../env";

import { WorkoutType } from "../types/workout-type";
import { pencil, checkmark, create, close } from "ionicons/icons";
import InstructionModal from "./InstructionModal";
import useWorkoutPlanStore from "../store/workoutPlanStore";
import useHomeStore from "../store/homeStore";
import useUserStore from "../store/userStore";
import useAxios from "../hooks/useAxios";

interface ModalDetailsProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: {
    id: string;
    sets: number;
    reps: number;
    details: WorkoutType;
  };
}

const WorkoutItemModal: React.FC<ModalDetailsProps> = ({
  isOpen,
  setIsOpen,
  data,
}) => {
  const [workoutDetail, setWorkoutDetail] =
    useState<WorkoutType>(initWorkoutDetails);
  const {
    selectedExercise,
    setUpdateSelectedWorkout,
    setRemoveSelectedWorkout,
  } = useWorkoutPlanStore();

  const { access_token } = useUserStore();
  const [currImg, setCurrImg] = useState(0);
  const [isOpenInstruc, setIsOpenInstruc] = useState(false);
  const [isEdit, setIsEdit] = useState({
    sets: false,
    reps: false,
  });
  const [details, setDetails] = useState<{
    sets: number;
    reps: number;
  }>({ sets: 0, reps: 0 });
  const fetch = useAxios();
  useEffect(() => {
    setWorkoutDetail(data.details);
    setDetails({ sets: data.sets, reps: data.reps });
  }, []);
  const intervalTime: number = 1000;
  let intervalId: NodeJS.Timeout;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  useEffect(() => {
    const toggleImage = () => {
      setCurrImg((prevIndex) => (prevIndex === 0 ? 1 : 0));
    };

    if (isPlaying) {
      intervalId = setInterval(toggleImage, intervalTime);
    } else {
      clearInterval(intervalId);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isPlaying]);

  const handlePlayPpause = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  const handlRemove = async () => {
    const response = await fetch.delete(
      `/workout_plan/schedule/remove/${data.id}`
    );
    setRemoveSelectedWorkout(data);
    setIsOpen(false);
  };

  const handleShowEdit = (key: string) => {
    setIsEdit((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  const handleUpdate = async (key: string) => {
    setIsEdit((prev) => ({
      ...prev,
      [key]: false,
    }));

    const value = (details as any)[key];

    const response = await fetch.put(`/workout_plan/schedule/update`, {
      exercise_id: data.id,
      [key]: value,
    });

    if (response.status === 200) {
      setDetails((prev) => ({
        ...prev,
        [key]: value,
      }));

      const { index, item } = selectedExercise.reduce(
        (acc, exer: any, currentIndex) => {
          if (exer.id === data.id) {
            return {
              index: currentIndex,
              item: {
                ...exer,
                [key]: value,
              },
            };
          }
          return acc;
        },
        { index: -1, item: null }
      );
      setUpdateSelectedWorkout(item, index);
    }
  };

  const handleOnChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    setDetails((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // close the edit
  function handleClose(key: string) {
    setIsEdit((prev) => ({
      ...prev,
      [key]: false,
    }));
    setDetails((prev) => ({
      ...prev,
      [key]: (data as any)[key],
    }));
  }

  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonButtons onClick={handlRemove} slot="start">
            <IonButton expand="block" color={"danger"}>
              Remove
            </IonButton>
          </IonButtons>

          <IonButtons
            slot="end"
            onClick={() => {
              setIsPlaying(false);
              clearInterval(intervalId);
              setIsOpen(false);
              setIsEdit({ reps: false, sets: false });
            }}
          >
            <IonButton>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <img
            alt={data.details.name}
            src={apiUrlLocal + "/" + workoutDetail.images[currImg]}
            height={"50%"}
          />

          <IonCardHeader>
            <IonCardTitle
              style={{
                marginBottom: "5px",
              }}
              color={"primary"}
            >
              {workoutDetail.name}
            </IonCardTitle>
            <IonButton onClick={handlePlayPpause}>
              {isPlaying ? "Pause" : "Play"}
            </IonButton>

            <IonButton color={"light"} onClick={() => setIsOpenInstruc(true)}>
              Instruction
            </IonButton>
          </IonCardHeader>

          <IonCardContent>
            <IonGrid>
              <IonRow>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  {/* Label And Edit input for sets  start*/}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {!isEdit.sets ? (
                      <IonCardTitle>
                        Sets:{" "}
                        <IonLabel
                          style={{
                            fontSize: "1.6rem",
                          }}
                          color={"success"}
                        >
                          {details.sets}
                        </IonLabel>
                      </IonCardTitle>
                    ) : (
                      <IonInput
                        label="Sets"
                        type="number"
                        placeholder="000"
                        onIonInput={handleOnChange}
                        value={details.sets}
                        name="sets"
                      ></IonInput>
                    )}
                  </div>
                  {!isEdit.sets ? (
                    <IonButton
                      onClick={() => handleShowEdit("sets")}
                      color={"light"}
                    >
                      <IonIcon icon={pencil}></IonIcon>
                    </IonButton>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <IonButton
                        onClick={() => handleUpdate("sets")}
                        color={"light"}
                      >
                        <IonIcon icon={checkmark}></IonIcon>
                      </IonButton>
                      <IonButton
                        onClick={() => handleClose("sets")}
                        color={"light"}
                      >
                        <IonIcon icon={close}></IonIcon>
                      </IonButton>
                    </div>
                  )}
                </div>
                {/* Label And Edit input for sets  end */}
              </IonRow>
              <IonRow>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  {/* Label And Edit input for reps  start*/}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {!isEdit.reps ? (
                      <IonCardTitle>
                        Reps:{" "}
                        <IonLabel
                          style={{
                            fontSize: "1.6rem",
                          }}
                          color={"success"}
                        >
                          {details.reps}
                        </IonLabel>
                      </IonCardTitle>
                    ) : (
                      <IonInput
                        label="Reps"
                        type="number"
                        placeholder="000"
                        value={details.reps}
                        onIonInput={handleOnChange}
                        name="reps"
                      ></IonInput>
                    )}
                  </div>
                  {!isEdit.reps ? (
                    <IonButton
                      color={"light"}
                      onClick={() => handleShowEdit("reps")}
                    >
                      <IonIcon icon={pencil}></IonIcon>
                    </IonButton>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <IonButton
                        color={"light"}
                        onClick={() => handleUpdate("reps")}
                      >
                        <IonIcon icon={checkmark}></IonIcon>
                      </IonButton>
                      <IonButton
                        color={"light"}
                        onClick={() => handleClose("reps")}
                      >
                        <IonIcon icon={close}></IonIcon>
                      </IonButton>
                    </div>
                  )}
                </div>
                {/* Label And Edit input for reps  end*/}
              </IonRow>
            </IonGrid>

            <InstructionModal
              instructions={data.details.instructions}
              isOpen={isOpenInstruc}
              setIsOpen={setIsOpenInstruc}
            />
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonModal>
  );
};

const initWorkoutDetails = {
  name: "",
  force: "",
  level: "",
  mechanic: "",
  equipment: "",
  primaryMuscles: [],
  secondaryMuscles: [],
  instructions: [],
  category: "",
  images: [],
  id: "",
};
export default WorkoutItemModal;
