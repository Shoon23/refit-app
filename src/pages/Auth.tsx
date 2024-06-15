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
import logo from "../assets/Logo.png";
import { motion } from "framer-motion";
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
      <motion.div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: "easeOut", duration: 0.5 }}
      >
        <IonCard>
          <IonCardContent>
            <IonGrid>
              <IonRow class="ion-justify-content-center ion-text-center">
                <IonCol>
                  <img alt="Logo" src={logo} width={"45%"} />
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
      </motion.div>
    </IonPage>
  );
};

export default Auth;
