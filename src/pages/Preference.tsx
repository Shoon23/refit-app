import {
  IonAlert,
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
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonPopover,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { useEffect, useState } from "react";
import {
  equipmentTypes as et,
  levelTypes as lt,
  muscleGroups as mg,
} from "../data/filterData";
import useUserStore from "../store/userStore";
import exerciseData from "../data/exercises.json";
import { checkmark } from "ionicons/icons";
import { capitalizeFirstLetter } from "../utils/stringUtils";
import { CapacitorHttp } from "@capacitor/core";
import { apiUrlLocal } from "../env";
import {
  informationCircle,
  informationCircleSharp,
  infiniteOutline,
} from "ionicons/icons";
import workoutInfo from "../data/wokoutInfo.json";
import InfoTab from "../components/InfoTab";
const Preference = () => {
  const [selectedMuscles, setSelectedMuscles] = useState<Array<string>>([]);
  const [selectedEquipments, setSelectedEquipments] = useState<Array<string>>(
    []
  );
  const [selectedLevels, setSelectecLevels] = useState<string[]>([]);
  const [isError, setIsError] = useState(false);
  const router = useIonRouter();

  const [message, setMessage] = useState("");
  const { setPreference, id, setIsNewUSer } = useUserStore();

  const [levelTypes, setLevelTypes] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [muscleGroups, setMuscleGroups] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const eme = () => {
      setLevelTypes(lt as any);
      setEquipmentTypes(et as any);
      setMuscleGroups(mg as any);
    };

    eme();
  }, []);
  const handleSubmit = async () => {
    const pref = {
      muscles: selectedMuscles,
      equipments: selectedEquipments,
      levels: selectedLevels,
    };

    try {
      const options = {
        url: apiUrlLocal + "/preferences",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: { ...pref, user_id: id },
      };
      const response = await CapacitorHttp.post(options);

      if (response.status >= 400) {
        setMessage("Something Went Wrong Please Try Again");
        setIsError(true);
        return;
      }

      setPreference(response.data);

      router.push("/main", "root", "replace");
    } catch (error) {
      setMessage("Something Went Wrong Please Try Again Later");
      setIsError(true);
    }
  };

  const handleSelectLevel = (level: string) => {
    // if deselect return the default options for equipment and muscles
    if (selectedLevels.includes(level)) {
      setEquipmentTypes(et as any);
      setMuscleGroups(mg as any);
      setSelectedEquipments([]);
      setSelectecLevels([]);
      setSelectedMuscles([]);
      // selecting
    } else {
      setSelectecLevels([level]);

      // filter the available muscles and equipment based on the selected level
      const filtered = exerciseData.workouts.filter(
        (exercise) => exercise.level.toLowerCase() === level
      );

      //   change the options based on the selected level
      const newMusOptions = [
        ...new Set(filtered.map((f) => f.primaryMuscles[0])),
      ];
      const newEqOptions = [
        ...new Set(
          filtered
            .map((e) => {
              return e.equipment;
            })
            .filter(
              (equipment) =>
                equipment !== null &&
                equipment !== undefined &&
                equipment !== "other"
            )
        ),
      ];

      setEquipmentTypes(newEqOptions as any);
      setMuscleGroups(newMusOptions as any);

      // Filter selected equipments and muscles to only include values present in newEqOptions and newMusOptions
      const filteredSelectedEquipments = selectedEquipments.filter(
        (equipment) => newEqOptions.includes(equipment)
      );
      const filteredSelectedMuscles = selectedMuscles.filter((muscle) =>
        newMusOptions.includes(muscle)
      );
      setSelectedEquipments(filteredSelectedEquipments);
      setSelectedMuscles(filteredSelectedMuscles);
    }
  };

  const handleSelectMuscles = (muscle: string) => {
    // deselect
    if (selectedMuscles.includes(muscle)) {
      const updateSelectedMuscles = selectedMuscles.filter(
        (selectedMuscle) => selectedMuscle !== muscle
      );
      setSelectedMuscles(updateSelectedMuscles);
      // if no selected muscles reset the equipment selected and options
      if (updateSelectedMuscles.length === 0) {
        setEquipmentTypes(et as any);
        setSelectedEquipments([]);
        return;
      }
      // update the equipment options if something in the muscles option is deselected
      const filtered = exerciseData.workouts.filter((exercise) => {
        return updateSelectedMuscles.some(
          (muscle: string) =>
            exercise.primaryMuscles.includes(muscle) &&
            exercise.level === selectedLevels[0]
        );
      });
      //   change the options in equipemnts based on the selected muscle
      const newEqOptions = [
        ...new Set(
          filtered
            .map((e) => {
              return e.equipment;
            })
            .filter(
              (equipment) =>
                equipment !== null &&
                equipment !== undefined &&
                equipment !== "other"
            )
        ),
      ];

      // Filter selected equipments to only include values present in newEqOptions
      setEquipmentTypes(newEqOptions as any);
      const filteredSelectedEquipments = selectedEquipments.filter(
        (equipment) => newEqOptions.includes(equipment)
      );
      setSelectedEquipments(filteredSelectedEquipments);
    } else {
      // filter the available equipment based on the selected level and equipment
      setSelectedMuscles((prev) => [...prev, muscle]);
      const filtered = exerciseData.workouts.filter((exercise) => {
        return [...selectedMuscles, muscle].some(
          (muscle: string) =>
            exercise.primaryMuscles.includes(muscle) &&
            exercise.level === selectedLevels[0]
        );
      });

      //   change the options in equipemnts based on the selected muscle
      const newEqOptions = [
        ...new Set(
          filtered
            .map((e) => {
              return e.equipment;
            })
            .filter(
              (equipment) =>
                equipment !== null &&
                equipment !== undefined &&
                equipment !== "other"
            )
        ),
      ];

      // Filter selected equipments to only include values present in newEqOptions
      setEquipmentTypes(newEqOptions as any);
      const filteredSelectedEquipments = selectedEquipments.filter(
        (equipment) => newEqOptions.includes(equipment)
      );
      setSelectedEquipments(filteredSelectedEquipments);
    }
  };

  const handleSelectEquipments = (equipment: string) => {
    if (selectedEquipments.includes(equipment)) {
      setSelectedEquipments((prev) =>
        prev.filter((selectedEquipment) => selectedEquipment !== equipment)
      );
    } else {
      setSelectedEquipments((prev) => [...prev, equipment]);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle slot="start">Preference</IonTitle>
          <div
            slot="end"
            style={{
              marginRight: "10px",
            }}
          >
            <IonIcon
              onClick={() => setIsOpen(true)}
              slot="end"
              icon={informationCircleSharp}
              size="large"
              color="primary"
            ></IonIcon>
            <InfoTab isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle
              style={{
                fontWeight: "bolder",
                fontFamily: "Quicksand, sans-serif",
                fontSize: "1.5rem",
                padding: "12  px",
              }}
            >
              We want to know about you?
            </IonCardTitle>
            <div
              style={{
                marginTop: "10px",
                fontSize: "1.1rem",
              }}
            >
              Select at least one of each categories
            </div>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonLabel
                  style={{
                    fontWeight: "bolder",
                    fontSize: "1.3rem",
                  }}
                >
                  Levels
                </IonLabel>
              </IonRow>

              {levelTypes.map((option, index) => (
                <IonChip
                  key={index}
                  onClick={() => handleSelectLevel(option)}
                  color={selectedLevels.includes(option) ? "primary" : ""}
                  disabled={
                    !selectedLevels.includes(option) &&
                    selectedLevels.length !== 0
                  }
                >
                  {selectedLevels.includes(option) && (
                    <IonIcon icon={checkmark}></IonIcon>
                  )}
                  <IonLabel>{capitalizeFirstLetter(option)}</IonLabel>
                </IonChip>
              ))}
            </IonGrid>

            <IonGrid>
              <IonRow>
                <IonLabel
                  style={{
                    fontWeight: "bolder",
                    fontSize: "1.3rem",
                  }}
                >
                  Muscles
                </IonLabel>
              </IonRow>

              {muscleGroups.map((option, index) => (
                <IonChip
                  key={index}
                  onClick={() => handleSelectMuscles(option)}
                  color={selectedMuscles.includes(option) ? "primary" : ""}
                  disabled={selectedLevels.length === 0}
                >
                  {selectedMuscles.includes(option) && (
                    <IonIcon icon={checkmark}></IonIcon>
                  )}
                  <IonLabel>{capitalizeFirstLetter(option)}</IonLabel>
                </IonChip>
              ))}
            </IonGrid>
            <IonGrid>
              <IonRow>
                <IonLabel
                  style={{
                    fontWeight: "bolder",
                    fontSize: "1.3rem",
                  }}
                >
                  Equipment
                </IonLabel>
              </IonRow>

              {equipmentTypes.map((option, index) => (
                <IonChip
                  key={index}
                  onClick={() => handleSelectEquipments(option)}
                  color={selectedEquipments.includes(option) ? "primary" : ""}
                  disabled={
                    selectedLevels.length === 0 || selectedMuscles.length === 0
                  }
                >
                  {selectedEquipments.includes(option) && (
                    <IonIcon icon={checkmark}></IonIcon>
                  )}
                  <IonLabel>{capitalizeFirstLetter(option)}</IonLabel>
                </IonChip>
              ))}
            </IonGrid>

            <IonButton
              disabled={
                selectedEquipments.length === 0 ||
                selectedMuscles.length === 0 ||
                selectedLevels.length === 0
              }
              style={{
                marginTop: "10px",
              }}
              expand="block"
              onClick={handleSubmit}
            >
              Submit
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
      <IonAlert
        isOpen={isError}
        header={message}
        buttons={["Okay"]}
        onDidDismiss={() => setIsError(false)}
      ></IonAlert>
    </IonPage>
  );
};

export default Preference;
