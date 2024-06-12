import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonCard,
  IonCardContent,
  IonAlert,
  IonChip,
  IonGrid,
  IonIcon,
  IonLabel,
  IonRow,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { levelTypes, muscleGroups, equipmentTypes } from "../data/filterData";
import PreferenceOptions from "./Preferences/PreferenceOptions";
import { Preferences } from "@capacitor/preferences";
import useUserStore from "../store/userStore";
import UpdatePrefOption from "./Preferences/UpdatePrefOption";
import { apiUrlLocal } from "../env";
import { CapacitorHttp } from "@capacitor/core";
import { checkmark } from "ionicons/icons";
import { capitalizeFirstLetter } from "../utils/stringUtils";
import exerciseData from "../data/exercises.json";
import InfoTab from "./InfoTab";
import {
  equipmentTypes as et,
  levelTypes as lt,
  muscleGroups as mg,
} from "../data/filterData";
import useHomeStore from "../store/homeStore";
interface ChangePreferenceModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChangePreferenceModal: React.FC<ChangePreferenceModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const { preferences, setPreference } = useUserStore();
  const [updatedMuscles, setUpdatedMuscles] = useState<string[]>([]);
  const [updateddEquipments, setUpdatedEquipments] = useState<string[]>([]);
  const [updatedLevels, setUpdatedLevels] = useState<string[]>([]);
  const [levelTypes, setLevelTypes] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [isError, setIsError] = useState(false);
  const { setIsLoadedRecommended } = useHomeStore();
  const { access_token } = useUserStore();

  useEffect(() => {
    const getUserPref = async () => {
      setUpdatedLevels(preferences?.levels as any);
      setUpdatedEquipments(preferences?.equipments as any);
      setUpdatedMuscles(preferences?.muscles as any);
      setLevelTypes(lt as any);
      // TODO:load the available equipment and muscle based on the selected
      const { newEqOptions, newMusOptions } = filterMuscleAndEquipmentOptions(
        preferences?.levels[0]
      );
      setEquipmentTypes(newEqOptions as any);
      setMuscleGroups(newMusOptions as any);
    };
    getUserPref();
  }, [isOpen, setIsOpen]);

  const handleSelectLevel = (level: string) => {
    // if deselect return the default options for equipment and muscles
    if (updatedLevels.includes(level)) {
      setEquipmentTypes(et as any);
      setMuscleGroups(mg as any);
      setUpdatedEquipments([]);
      setUpdatedMuscles([]);
      setUpdatedLevels((prev) =>
        prev.filter((selectedLevel) => selectedLevel !== level)
      );
    } else {
      setUpdatedLevels([level]);
      const { newEqOptions, newMusOptions } =
        filterMuscleAndEquipmentOptions(level);
      setEquipmentTypes(newEqOptions as any);
      setMuscleGroups(newMusOptions as any);
      // Filter selected equipments and muscles to only include values present in newEqOptions and newMusOptions
      const filteredSelectedEquipments = updateddEquipments.filter(
        (equipment) => newEqOptions.includes(equipment)
      );
      const filteredSelectedMuscles = updatedMuscles.filter((muscle) =>
        newMusOptions.includes(muscle)
      );
      setUpdatedEquipments(filteredSelectedEquipments);
      setUpdatedMuscles(filteredSelectedMuscles);
    }
  };

  const handleSelectMuscles = (muscle: string) => {
    // deselect
    if (updatedMuscles.includes(muscle)) {
      const updateMuscles = updatedMuscles.filter(
        (selectedMuscle) => selectedMuscle !== muscle
      );
      setUpdatedMuscles(updateMuscles);
      // if no selected muscles reset the equipment selected and options
      if (updateMuscles.length === 0) {
        setEquipmentTypes(et as any);
        setUpdatedEquipments([]);
        return;
      }

      // update the equipment options if something in the muscles option is deselected
      const filtered = exerciseData.workouts.filter((exercise) => {
        return updateMuscles.some(
          (muscle: string) =>
            exercise.primaryMuscles.includes(muscle) &&
            exercise.level === updatedLevels[0]
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
      const filteredSelectedEquipments = updateddEquipments.filter(
        (equipment) => newEqOptions.includes(equipment)
      );
      setUpdatedEquipments(filteredSelectedEquipments);
    } else {
      setUpdatedMuscles((prev) => [...prev, muscle]);
      const filtered = exerciseData.workouts.filter((exercise) => {
        return [...updatedMuscles, muscle].some(
          (muscle: string) =>
            exercise.primaryMuscles.includes(muscle) &&
            exercise.level === updatedLevels[0]
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
      const filteredSelectedEquipments = updateddEquipments.filter(
        (equipment) => newEqOptions.includes(equipment)
      );
      setUpdatedEquipments(filteredSelectedEquipments);
    }
  };

  const handleSelectEquipments = (equipment: string) => {
    if (updateddEquipments.includes(equipment)) {
      setUpdatedEquipments((prev) =>
        prev.filter((selectedEquipment) => selectedEquipment !== equipment)
      );
    } else {
      setUpdatedEquipments((prev) => [...prev, equipment]);
    }
  };
  const handleSave = async () => {
    const formPref = {
      id: preferences.id,
    } as any;

    const isChangeLevel =
      JSON.stringify(updatedLevels) !== JSON.stringify(preferences.levels);

    const isChangeEq =
      JSON.stringify(updateddEquipments) !==
      JSON.stringify(preferences.equipments);
    const isChangeM =
      JSON.stringify(updatedMuscles) !== JSON.stringify(preferences.muscles);

    if (isChangeLevel) {
      formPref.levels = updatedLevels;
    }

    if (isChangeEq) {
      formPref.equipments = updateddEquipments;
    }

    if (isChangeM) {
      formPref.muscles = updatedMuscles;
    }

    try {
      const options = {
        url: apiUrlLocal + "/preferences/update",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        data: formPref,
      };
      const response = await CapacitorHttp.put(options);

      if (response.status >= 400) {
        setIsError(true);
        return;
      }
      setIsOpen(false);
      setPreference({ ...preferences, ...formPref });
      setIsLoadedRecommended(false);
    } catch (error) {
      setIsError(true);
    }
  };
  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Change Preference</IonTitle>
          <IonButtons slot="end">
            <IonButton color={"primary"} onClick={() => setIsOpen(false)}>
              Back
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
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
                  color={updatedLevels.includes(option) ? "primary" : ""}
                  disabled={
                    !updatedLevels.includes(option) &&
                    updatedLevels.length !== 0
                  }
                >
                  {updatedLevels.includes(option) && (
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
                  color={updatedMuscles.includes(option) ? "primary" : ""}
                  disabled={updatedLevels.length === 0}
                >
                  {updatedMuscles.includes(option) && (
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
                  color={updateddEquipments.includes(option) ? "primary" : ""}
                  disabled={
                    updatedLevels.length === 0 || updatedMuscles.length === 0
                  }
                >
                  {updateddEquipments.includes(option) && (
                    <IonIcon icon={checkmark}></IonIcon>
                  )}
                  <IonLabel>{capitalizeFirstLetter(option)}</IonLabel>
                </IonChip>
              ))}
            </IonGrid>
            <IonButton
              disabled={
                updatedLevels.length === 0 ||
                updatedMuscles.length === 0 ||
                updateddEquipments.length === 0 ||
                (JSON.stringify(preferences?.equipments) ===
                  JSON.stringify(updateddEquipments) &&
                  JSON.stringify(preferences?.levels) ===
                    JSON.stringify(updatedLevels) &&
                  JSON.stringify(preferences?.muscles) ===
                    JSON.stringify(updatedMuscles))
              }
              style={{
                marginTop: "10px",
              }}
              expand="block"
              onClick={handleSave}
            >
              Save
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>

      <IonAlert
        isOpen={isError}
        header="Something Went Wrong"
        buttons={["Okay"]}
        onDidDismiss={() => setIsError(false)}
      ></IonAlert>
    </IonModal>
  );
};

function filterMuscleAndEquipmentOptions(level: any) {
  const filtered = exerciseData.workouts.filter(
    (exercise) =>
      exercise.level.toLowerCase() === level.toLowerCase() &&
      exercise.equipment?.toLowerCase() !== "other"
  );

  //   change the options based on the selected level
  const newMusOptions = [...new Set(filtered.map((f) => f.primaryMuscles[0]))];

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

  return { newEqOptions, newMusOptions };
}

export default ChangePreferenceModal;
