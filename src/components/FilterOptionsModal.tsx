import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardContent,
} from "@ionic/react";
import React from "react";
import { muscleGroups, equipmentTypes } from "../data/filterData";
import PreferenceOptions from "./Preferences/PreferenceOptions";
import FilterOptions from "./FilterOptions";

interface FilterOptionsModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEquipmentFilters: React.Dispatch<React.SetStateAction<string[]>>;
  equipmentFilters: string[];
  muscleFilters: string[];
  setMuscleFilters: React.Dispatch<React.SetStateAction<string[]>>;
  handleApplyFilter: () => void;
}

const FilterOptionsModal: React.FC<FilterOptionsModalProps> = ({
  isOpen,
  setIsOpen,
  setEquipmentFilters,
  equipmentFilters,
  muscleFilters,
  handleApplyFilter,
  setMuscleFilters,
}) => {
  const handleSelectMuscles = (muscles: string) => {
    if (muscleFilters.includes(muscles)) {
      setMuscleFilters((prev) => prev.filter((muscle) => muscle !== muscles));
    } else {
      setMuscleFilters((prev) => [...prev, muscles]);
    }
  };

  const handleSelectEquipments = (equipment: string) => {
    if (equipmentFilters.includes(equipment)) {
      setEquipmentFilters((prev) => prev.filter((eq) => eq !== equipment));
    } else {
      setEquipmentFilters((prev) => [...prev, equipment]);
    }
  };

  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Filters</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardContent>
            <FilterOptions
              handleSelect={handleSelectMuscles}
              options={muscleGroups}
              selected={muscleFilters}
              name={"Muscles"}
            />
            <FilterOptions
              handleSelect={handleSelectEquipments}
              options={equipmentTypes}
              selected={equipmentFilters}
              name={"Equipments"}
            />
            <IonButton onClick={handleApplyFilter} expand="block">
              Apply
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonModal>
  );
};

export default FilterOptionsModal;
