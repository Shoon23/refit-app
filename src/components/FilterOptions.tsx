import {
  IonGrid,
  IonRow,
  IonLabel,
  IonChip,
  IonIcon,
  IonAvatar,
  IonButton,
} from "@ionic/react";

import { capitalizeFirstLetter } from "../utils/stringUtils";

interface FilterOptionsProps {
  handleSelect: (val: string) => void;
  options: string[];
  selected: string[];
  name: string;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({
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
        <IonButton
          key={index}
          onClick={() => handleSelect(option)}
          color={selected.includes(option) ? "secondary" : "medium"}
        >
          <IonLabel>{capitalizeFirstLetter(option)}</IonLabel>
        </IonButton>
      ))}
    </IonGrid>
  );
};

export default FilterOptions;
