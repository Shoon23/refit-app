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
} from "@ionic/react";
import useUserStore from "../store/userStore";
import { CapacitorHttp } from "@capacitor/core";
import { apiUrlLocal } from "../env";
import { Network } from "@capacitor/network";

interface AuthMiddlewareProps {
  children: ReactNode;
}
export const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [isError, setIsError] = useState(false);
  const { id, setUser } = useUserStore();

  useEffect(() => {
    const checkAuthentication = async () => {
      if (id) {
        setIsAuthenticated(true);
        setIsLoading(false);

        return;
      }

      // if no user id get new token
      const { value } = await Preferences.get({ key: "refreshToken" });
      if (!value) {
        setIsAuthenticated(false);
        setIsLoading(false);

        return;
      }

      const status = await Network.getStatus();

      if (!status.connected) {
        setIsLoading(false);
        setIsConnected(false);
        return;
      }
      const options = {
        url: apiUrlLocal + `/refresh/${JSON.parse(value)}`,
      };
      const response = await CapacitorHttp.get(options);

      if (response.status >= 400) {
        setIsAuthenticated(false);
        setIsLoading(false);

        return;
      }

      setIsAuthenticated(true);
      setUser(response.data);
      setIsLoading(false);
    };

    checkAuthentication();
  }, [handleRetry]);

  function handleRetry() {
    setIsConnected(true);
    setIsLoading(true);
  }

  return isLoading ? (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
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
