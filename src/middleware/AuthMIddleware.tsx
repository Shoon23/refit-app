import React, { ReactNode, useEffect, useState } from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/authUtils";
import { Preferences } from "@capacitor/preferences";
import {
  IonButton,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonSpinner,
  useIonRouter,
} from "@ionic/react";
import useUserStore from "../store/userStore";
import { CapacitorHttp } from "@capacitor/core";
import { apiUrlLocal } from "../env";
import { Network } from "@capacitor/network";
import logo from "../assets/Logo.png";
interface AuthMiddlewareProps {
  children: ReactNode;
}
export const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [isError, setIsError] = useState(false);
  const { id, setUser, setPreference, setUpdateActiveWP } = useUserStore();
  const router = useIonRouter();
  const checkAuthentication = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setIsConnected(true);

      if (id) {
        setIsAuthenticated(true);
        return;
      }

      const { value } = await Preferences.get({ key: "refreshToken" });
      if (!value) {
        setIsAuthenticated(false);
        return;
      }

      const status = await Network.getStatus();
      if (!status.connected) {
        setIsConnected(false);
        return;
      }

      const refreshToken = JSON.parse(value);

      const response = await CapacitorHttp.get({
        url: `${apiUrlLocal}/auth/refresh/${refreshToken}`,
      });

      if (response.status >= 400) {
        setIsAuthenticated(false);
        router.push("/auth", "root", "replace");
        return;
      }
      setUser(response.data);
      setPreference(response.data.preferences);
      setUpdateActiveWP(response.data.workout_plan);
      setIsAuthenticated(true);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    checkAuthentication();
  }, []);
  function handleRetry() {
    checkAuthentication();
  }

  return isLoading ? (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "30px",
      }}
    >
      <img alt="Logo" height={200} src={logo} />
      <IonSpinner name="bubbles"></IonSpinner>
    </div>
  ) : !isConnected || isError ? (
    <>
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IonCardHeader>
          <IonCardTitle>Connection Error</IonCardTitle>
          <IonButton color={"dark"} onClick={handleRetry}>
            Retry
          </IonButton>
        </IonCardHeader>
      </div>
    </>
  ) : isAuthenticated ? (
    children
  ) : (
    <Redirect to={"/auth"} />
  );
};
