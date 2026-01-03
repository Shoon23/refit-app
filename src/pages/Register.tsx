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
  IonButtons,
  IonBackButton,
  IonAlert,
  useIonRouter,
} from "@ionic/react";

import { useState } from "react";
import { apiUrlLocal } from "../env";

import { Preferences } from "@capacitor/preferences";
import bgImg from "../assets/backgrounds/3.jpeg";
import useUserStore from "../store/userStore";
import useAxios from "../hooks/useAxios";
import { CapacitorHttp } from "@capacitor/core";
import { motion } from "framer-motion";

interface iFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<iFormData>(initFormData);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const router = useIonRouter();
  const [errorPassword, setErrorPassword] = useState("Invalid Password");
  const [isSubmit, setIsSubmit] = useState(false);
  const { setUser } = useUserStore();
  const [isValid, setIsValid] = useState({
    first_name: false,
    last_name: false,
    email: false,
    password: false,
    confirm_password: false,
  });

  const [isTouched, setisTouched] = useState({
    first_name: false,
    last_name: false,
    email: false,
    password: false,
    confirm_password: false,
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

    if (name === "first_name" || name === "last_name") {
      setIsValid((prev) => ({
        ...prev,
        [name]: true,
      }));
    } else if (name === "email") {
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
      if (value.length < 8) {
        setErrorPassword("Password At Least 8  Characters Long");
      } else {
        setIsValid((prev) => ({
          ...prev,
          password: true,
        }));
      }
    } else if (name === "confirm_password") {
      if (value !== formData.password || !isValid.password) {
        setIsValid((prev) => ({
          ...prev,
          confirm_password: false,
        }));
      } else {
        setIsValid((prev) => ({
          ...prev,
          confirm_password: true,
        }));
      }
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
      const { confirm_password, ...rest } = formData;

      const options = {
        url: apiUrlLocal + "/auth/register",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: rest,
      };
      const response = await CapacitorHttp.post(options);

      if (response.status === 409) {
        setMessage("Account Already Exists Please Go To Login Page");
        setIsError(true);
        setIsSubmit(false);

        return;
      }

      if (response.status === 400) {
        setMessage("Invalid User Input");
        setIsError(true);
        setIsSubmit(false);

        return;
      }

      if (response.status > 400) {
        setMessage("Something Went Wrong");
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

      router.push("/preference", "forward", "replace");
    } catch (error) {
      setMessage("Something Went Wrong Please Try Again Later");
      setIsError(true);
      setIsSubmit(false);
    }
  };

  return (
    <IonPage>
      <IonHeader
        style={{
          background: "rgba(0, 0, 0, 0)",
        }}
      >
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/auth"></IonBackButton>
          </IonButtons>
          <IonTitle>ReFit Register</IonTitle>
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
            filter:
              isTouched.email ||
              isTouched.password ||
              isTouched.first_name ||
              isTouched.last_name ||
              isTouched.confirm_password
                ? "blur(5px)"
                : "none",
            zIndex: -1,
          }}
        ></div>
        <IonAlert
          isOpen={isError}
          header={message}
          buttons={["Okay"]}
          onDidDismiss={() => setIsError(false)}
        ></IonAlert>
        <motion.div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeOut", duration: 0.5 }}
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
                    Welcome
                  </h1>
                </IonLabel>

                <IonLabel color={"medium"}>Create your account</IonLabel>

                <IonInput
                  className={`${isValid.first_name && "ion-valid"} ${
                    !isValid.first_name && "ion-invalid"
                  } ${isTouched.first_name && "ion-touched"}`}
                  type="text"
                  fill="solid"
                  label="First Name"
                  labelPlacement="floating"
                  helperText="Enter a First Name"
                  errorText="Missing First Name"
                  name="first_name"
                  onIonInput={handleOnChange}
                  onIonBlur={() => handleOnTouched("first_name")}
                  onIonFocus={() => handleOnTouched("first_name")}
                ></IonInput>

                <IonInput
                  className={`${isValid.last_name && "ion-valid"} ${
                    !isValid.last_name && "ion-invalid"
                  } ${isTouched.last_name && "ion-touched"}`}
                  type="text"
                  fill="solid"
                  label="Last Name"
                  labelPlacement="floating"
                  helperText="Enter a First Last Name"
                  errorText="Missing Last Name"
                  name="last_name"
                  onIonInput={handleOnChange}
                  onIonBlur={() => handleOnTouched("last_name")}
                  onIonFocus={() => handleOnTouched("last_name")}
                ></IonInput>

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
                  errorText={errorPassword}
                  name="password"
                  onIonInput={handleOnChange}
                  onIonBlur={() => handleOnTouched("password")}
                  onIonFocus={() => handleOnTouched("password")}
                ></IonInput>

                <IonInput
                  className={`${isValid.confirm_password && "ion-valid"} ${
                    !isValid.confirm_password && "ion-invalid"
                  } ${isTouched.confirm_password && "ion-touched"}`}
                  type="password"
                  fill="solid"
                  label="Confirm Password"
                  labelPlacement="floating"
                  helperText="Enter a valid Confirm Password"
                  errorText="Invalid Confirm Password"
                  name="confirm_password"
                  onIonInput={handleOnChange}
                  onIonBlur={() => handleOnTouched("confirm_password")}
                  onIonFocus={() => handleOnTouched("confirm_password")}
                ></IonInput>

                <IonButton
                  type="submit"
                  disabled={
                    !isValid.email ||
                    !isValid.confirm_password ||
                    !isValid.first_name ||
                    !isValid.last_name ||
                    !isValid.password ||
                    isSubmit
                  }
                  color={"secondary"}
                  expand="block"
                  style={{
                    width: "100%",
                  }}
                >
                  Register
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>
        </motion.div>
      </IonContent>
    </IonPage>
  );
};

const initFormData = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  confirm_password: "",
};
export default Register;
