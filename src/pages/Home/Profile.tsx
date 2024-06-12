import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { informationCircleOutline, options } from "ionicons/icons";
import { useState } from "react";
import "./profile.css";
import avatar from "../../assets/avatar.svg";
import { Preferences } from "@capacitor/preferences";
import { capitalizeFirstLetter } from "../../utils/stringUtils";
import ChangePreferenceModal from "../../components/ChangePreferenceModal";
import useUserStore from "../../store/userStore";
import InfoTab from "../../components/InfoTab";
import bgImg from "../../assets/backgrounds/3.jpeg";
import useHomeStore from "../../store/homeStore";
import useWorkoutPlanStore from "../../store/workoutPlanStore";
const Profile: React.FC = () => {
  const [isOpenLogout, setIsOpenLogout] = useState(false);
  const router = useIonRouter();
  const [isOpenInfo, setIsOpenInfo] = useState(false);
  const [isOpenChange, setIsOpenChange] = useState(false);
  const { first_name, last_name, clearUser } = useUserStore();
  const { clearHome } = useHomeStore();
  const { clearWorkoutPlan } = useWorkoutPlanStore();

  const handleLogOut = async () => {
    await Preferences.remove({ key: "refreshToken" });
    clearHome();
    clearUser();
    clearWorkoutPlan();
    router.push("/auth", "root", "replace");
  };

  return (
    <>
      <IonHeader translucent={true} mode="ios">
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonAvatar aria-hidden="true" slot="start">
              <img alt="" src={avatar} />
            </IonAvatar>
            <IonLabel>
              {capitalizeFirstLetter(first_name) +
                " " +
                capitalizeFirstLetter(last_name)}
            </IonLabel>
          </IonItem>
          <IonItem button={true} onClick={() => setIsOpenChange(true)}>
            <IonIcon slot="start" icon={options} size="large"></IonIcon>
            <IonLabel>Preference</IonLabel>
          </IonItem>
          <IonItem button={true} onClick={() => setIsOpenInfo(true)}>
            <div slot="start">
              <IonIcon icon={informationCircleOutline} size="large"></IonIcon>
            </div>
            <IonLabel>More Information</IonLabel>
          </IonItem>
          <InfoTab isOpen={isOpenInfo} setIsOpen={setIsOpenInfo} />

          <IonButton
            style={{
              marginInline: "20px",
            }}
            color="danger"
            expand="block"
            onClick={() => setIsOpenLogout(true)}
          >
            Logout
          </IonButton>

          <IonAlert
            isOpen={isOpenLogout}
            header="Are you sure?"
            buttons={[
              {
                text: "No",
                cssClass: "alert-button-cancel",
              },
              {
                text: "Yes",
                cssClass: "alert-button-confirm",
                handler: handleLogOut,
              },
            ]}
            onDidDismiss={() => setIsOpenLogout(false)}
            backdropDismiss={false}
          ></IonAlert>
        </IonList>
      </IonContent>
      <ChangePreferenceModal
        isOpen={isOpenChange}
        setIsOpen={setIsOpenChange}
      />
    </>
  );
};

export default Profile;
