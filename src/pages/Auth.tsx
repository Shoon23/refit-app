import {
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRow,
  IonCol,
  IonButton,
  IonCard,
  IonCardContent,
} from "@ionic/react";
import main_logo from "../assets/main-logo.png";
import { useIonRouter } from "@ionic/react";
import bgImg from "../assets/backgrounds/1.jpeg";
const Auth: React.FC = () => {
  const router = useIonRouter();

  return (
    <IonPage>
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <IonCard>
          <IonCardContent>
            <IonGrid>
              <IonRow class="ion-justify-content-center ion-text-center">
                <IonCol>
                  <img alt="Main Logo" src={main_logo} width={"45%"} />
                </IonCol>
              </IonRow>
              <IonRow class="ion-justify-content-center ion-text-center">
                <IonCol>
                  <IonLabel color={"primary"}>
                    <h1
                      style={{
                        fontSize: "2rem",
                      }}
                    >
                      Welcome to ReFit
                    </h1>
                  </IonLabel>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonButton
                    onClick={() => router.push("/login", "forward", "replace")}
                    color={"secondary"}
                    expand="block"
                  >
                    Login
                  </IonButton>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonButton
                    onClick={() =>
                      router.push("/register", "forward", "replace")
                    }
                    color="light"
                    expand="block"
                  >
                    Register
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      </div>
    </IonPage>
  );
};

export default Auth;
