import React, { ReactNode, useEffect, useState } from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/authUtils";
import { Preferences } from "@capacitor/preferences";
import { IonSpinner } from "@ionic/react";

interface IsAuthProps {
  children: ReactNode;
}
export const IsAuth: React.FC<IsAuthProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const { value } = await Preferences.get({ key: "userData" });

        if (!value) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuthentication();
  }, []);

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
  ) : isAuthenticated ? (
    <Redirect to={location.pathname} />
  ) : (
    children
  );
};
