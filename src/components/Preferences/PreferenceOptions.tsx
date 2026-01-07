import {
  IonGrid,
  IonRow,
  IonLabel,
  IonChip,
  IonIcon,
  IonAvatar,
} from "@ionic/react";
import { checkmark } from "ionicons/icons";
import { equipmentTypes } from "../../data/filterData";
import { capitalizeFirstLetter } from "../../utils/stringUtils";
import avatar from "../../assets/avatar.svg";
interface PreferenceOptionsProps {
  handleSelect: (val: string) => void;
  options: string[];
  selected: string[];
  name: string;
}

const PreferenceOptions: React.FC<PreferenceOptionsProps> = ({
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
          color={selected.includes(option) ? "primary" : ""}
        >
          {selected.includes(option) && <IonIcon icon={checkmark}></IonIcon>}
          <IonLabel>{capitalizeFirstLetter(option)}</IonLabel>
        </IonChip>
      ))}
    </IonGrid>
  );
};

export default PreferenceOptions;
