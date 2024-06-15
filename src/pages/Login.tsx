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
  IonButton,
  IonCard,
  IonCardContent,
  IonButtons,
  IonBackButton,
  IonAlert,
} from "@ionic/react";

import { useIonRouter } from "@ionic/react";
import { useState } from "react";
import { apiUrlLocal } from "../env";
import useAxios from "../hooks/useAxios";
import { Preferences } from "@capacitor/preferences";
import useUserStore from "../store/userStore";
import bgImg from "../assets/backgrounds/2.jpeg";
import { CapacitorHttp } from "@capacitor/core";
interface iFormData {
  email: string;
  password: string;
}
const Login: React.FC = () => {
  const [formData, setFormData] = useState<iFormData>(initFormData);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const router = useIonRouter();
  const [isSubmit, setIsSubmit] = useState(false);
  const { setUser } = useUserStore();
  const fetch = useAxios();
  const [isValid, setIsValid] = useState({
    email: false,
    password: false,
  });

  const [isTouched, setisTouched] = useState({
    email: false,
    password: false,
  });
  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleOnChange = (e: any) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (!value) {
      setIsValid((prev) => ({
        ...prev,
        [name]: false,
      }));

      return;
    }
    if (name === "email") {
      validateEmail(value) !== null
        ? setIsValid((prev) => ({
            ...prev,
            email: true,
          }))
        : setIsValid((prev) => ({
            ...prev,
            email: false,
          }));
    } else if (name === "password") {
      setIsValid((prev) => ({
        ...prev,
        password: true,
      }));
    }
  };
  const handleOnTouched = (key: string) => {
    setisTouched((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmit(true);
    try {
      const options = {
        url: apiUrlLocal + "/login",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: formData,
      };
      const response = await CapacitorHttp.post(options);

      if (response.status === 400) {
        setMessage("Invalid Input");
        setIsError(true);
        setIsSubmit(false);

        return;
      }

      if (response.status > 400) {
        setMessage(response.data.message);
        setIsError(true);
        setIsSubmit(false);

        return;
      }

      const { refresh_token, ...user_info } = response.data;
      await Preferences.set({
        key: "refreshToken",
        value: JSON.stringify(refresh_token),
      });
      setUser(user_info);
      setIsSubmit(false);

      router.push("/main", "forward", "replace");
    } catch (error) {
      setMessage("Something Went Wrong Please Try Again Later");
      setIsError(true);
      setIsSubmit(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/auth"></IonBackButton>
          </IonButtons>
          <IonTitle>ReFit Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
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
            zIndex: -1,
            filter:
              isTouched.email || isTouched.password ? "blur(5px)" : "none",
          }}
        ></div>
        <IonAlert
          isOpen={isError}
          header={message}
          buttons={["Okay"]}
          onDidDismiss={() => setIsError(false)}
        ></IonAlert>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <IonCard
            style={{
              width: "400px",
              padding: "10px",
              background: "rgba(0, 0, 0, 0)",
            }}
          >
            <IonCardContent>
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <IonLabel color={"primary"}>
                  <h1
                    style={{
                      fontSize: "2rem",
                    }}
                  >
                    Welcome Back
                  </h1>
                </IonLabel>

                <IonLabel>Login into your account</IonLabel>

                <IonInput
                  className={`${isValid.email && "ion-valid"} ${
                    !isValid.email && "ion-invalid"
                  } ${isTouched.email && "ion-touched"}`}
                  type="email"
                  fill="solid"
                  label="Email"
                  labelPlacement="floating"
                  helperText="Enter a valid email"
                  errorText="Invalid email"
                  name="email"
                  onIonInput={handleOnChange}
                  onIonBlur={() => handleOnTouched("email")}
                  onIonFocus={() => handleOnTouched("email")}
                ></IonInput>

                <IonInput
                  className={`${isValid.password && "ion-valid"} ${
                    !isValid.password && "ion-invalid"
                  } ${isTouched.password && "ion-touched"}`}
                  type="password"
                  fill="solid"
                  label="Password"
                  labelPlacement="floating"
                  helperText="Enter a valid Password"
                  errorText="Invalid Password"
                  name="password"
                  onIonInput={handleOnChange}
                  onIonBlur={() => handleOnTouched("password")}
                  onIonFocus={() => handleOnTouched("password")}
                ></IonInput>

                <IonButton
                  type="submit"
                  disabled={!isValid.email || !isValid.password || isSubmit}
                  color={"secondary"}
                  expand="block"
                  style={{
                    width: "100%",
                  }}
                >
                  Login
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

const initFormData = {
  email: "",
  password: "",
};

export default Login;
