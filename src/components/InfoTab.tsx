import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  caretForwardOutline,
  informationCircleSharp,
  options,
} from "ionicons/icons";
import { useState, useImperativeHandle } from "react";
import { capitalizeFirstLetter } from "../utils/stringUtils";
import workoutInfo from "../data/wokoutInfo.json";
import { info_img } from "../assets/info_img/info";
import { apiUrlLocal, imageUrl } from "../env";
interface InfoTabProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InfoTab: React.FC<InfoTabProps> = ({ isOpen, setIsOpen }) => {
  const [info, setInfo] = useState<any[]>([]);
  const [selected, setSelected] = useState("");
  const handleOnSelect = (selected: string) => {
    setSelected(selected);
    if (selected === "Levels") {
      setInfo(workoutInfo?.workoutLevels);
    } else if (selected === "Muscles") {
      setInfo(workoutInfo?.muscle_groups);
    } else if (selected === "Equipments") {
      setInfo(workoutInfo?.equipment_types);
    }
  };
  return (
    <>
      <IonModal isOpen={isOpen}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Information {selected && "- " + selected}</IonTitle>

            {info.length === 0 ? (
              <IonButtons slot="end">
                <IonButton
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  Close
                </IonButton>
              </IonButtons>
            ) : (
              <IonButtons slot="end">
                <IonButton
                  onClick={() => {
                    setInfo([]);
                    setSelected("");
                  }}
                >
                  Back
                </IonButton>
              </IonButtons>
            )}
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {info.length === 0 ? (
            <IonList>
              <IonItem
                onClick={() => {
                  handleOnSelect("Levels");
                }}
                button={true}
                detailIcon={caretForwardOutline}
                detail={true}
              >
                <IonLabel>Levels</IonLabel>
              </IonItem>
              <IonItem
                onClick={() => {
                  handleOnSelect("Muscles");
                }}
                button={true}
                detailIcon={caretForwardOutline}
                detail={true}
              >
                <IonLabel>Muscles</IonLabel>
              </IonItem>
              <IonItem
                onClick={() => {
                  handleOnSelect("Equipments");
                }}
                button={true}
                detailIcon={caretForwardOutline}
                detail={true}
              >
                <IonLabel>Equipments</IonLabel>
              </IonItem>
            </IonList>
          ) : (
            <IonCard className="ion-padding">
              {selected === "Levels"
                ? info.map((info) => (
                    <div key={info.name}>
                      <IonCardTitle>{info.name}:</IonCardTitle>
                      <IonCardHeader>
                        <IonCardSubtitle
                          style={{
                            fontWeight: "bolder",
                            fontSize: "1.1rem",
                          }}
                        >
                          Ideal For:
                        </IonCardSubtitle>
                        <div
                          style={{
                            marginTop: "5px",
                          }}
                        >
                          {info.idealFor}
                        </div>
                        <IonCardSubtitle
                          style={{
                            fontWeight: "bolder",
                            fontSize: "1.1rem",
                          }}
                        >
                          Focus:
                        </IonCardSubtitle>
                        <div
                          style={{
                            marginTop: "5px",
                          }}
                        >
                          {info.focus}
                        </div>
                        <div
                          style={{
                            marginTop: "5px",
                          }}
                        >
                          {info.idealFor}
                        </div>
                        <IonCardSubtitle
                          style={{
                            fontWeight: "bolder",
                            fontSize: "1.1rem",
                          }}
                        >
                          Plan:
                        </IonCardSubtitle>
                        <div
                          style={{
                            marginTop: "5px",
                          }}
                        >
                          {info.plan}
                        </div>
                      </IonCardHeader>
                    </div>
                  ))
                : info.map((info) => {
                    return (
                      <div key={info.name}>
                        <IonCardTitle>
                          {capitalizeFirstLetter(info.name)}:
                        </IonCardTitle>

                        <IonCardHeader>
                          <img
                            src={imageUrl + "/info_img/" + info.image}
                            alt={info.image}
                          />
                          <IonCardSubtitle>{info.info}</IonCardSubtitle>
                        </IonCardHeader>
                      </div>
                    );
                  })}
            </IonCard>
          )}
        </IonContent>
      </IonModal>
    </>
  );
};

export default InfoTab;
