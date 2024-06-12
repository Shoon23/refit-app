import {
  IonGrid,
  IonRow,
  IonLabel,
  IonChip,
  IonIcon,
  IonAvatar,
} from "@ionic/react";
import { checkmark } from "ionicons/icons";
import React from "react";
import { equipmentTypes } from "../../data/filterData";
import { capitalizeFirstLetter } from "../../utils/stringUtils";
import avatar from "../../assets/avatar.svg";
interface UpdatePrefOptionProps {
  handleSelect: (val: string) => void;
  options: string[];
  selected: Array<{ id: string; name: string }>;
  name: string;
}

const UpdatePrefOption: React.FC<UpdatePrefOptionProps> = ({
  handleSelect,
  options,
  selected,
  name,
}) => {
  return (
    <IonGrid>
      <IonRow>
        <IonLabel
          style={{
            fontWeight: "bolder",
            fontSize: "1.3rem",
          }}
        >
          {name}
        </IonLabel>
      </IonRow>

      {options.map((option, index) => (
        <IonChip
          key={index}
          onClick={() => handleSelect(option)}
          color={selected.some((item) => item.name === option) ? "primary" : ""}
        >
          {selected.some((item) => item.name === option) ? (
            <IonIcon icon={checkmark}></IonIcon>
          ) : (
            <IonAvatar>
              <img alt="Silhouette of a person's head" src={avatar} />
            </IonAvatar>
          )}
          <IonLabel>{capitalizeFirstLetter(option)}</IonLabel>
        </IonChip>
      ))}
    </IonGrid>
  );
};

export default UpdatePrefOption;
