import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonButton,
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import Auth from "./pages/Auth";
import Preference from "./pages/Preference";
// pages

import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthMiddleware } from "./middleware/AuthMIddleware";
import MainPages from "./pages/MainPages";
import WorkoutSession from "./pages/WorkoutSession";
import WorkoutSessionStart from "./pages/WorkoutSessionStart";
import { useEffect } from "react";
import { CapacitorHttp } from "@capacitor/core";
import { apiUrlLocal } from "./env";
setupIonicReact();

const App: React.FC = () => {
  useEffect(() => {
    const checkDBStatus = async () => {
      const options = {
        url: apiUrlLocal + "/login",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      const response = await CapacitorHttp.post(options);
    };
  }, []);
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <AuthMiddleware>
            <Route path="/main" render={() => <MainPages />} />
            <Route path="/workout-session" render={() => <WorkoutSession />} />
            <Route
              path="/workout-session/start"
              render={() => <WorkoutSessionStart />}
            />
          </AuthMiddleware>
          <Route exact path="/">
            <Redirect to="/main" />
          </Route>

          <Route exact path="/auth" render={() => <Auth />} />
          <Route exact path="/login" render={() => <Login />} />
          <Route exact path="/register" render={() => <Register />} />
          <Route exact path="/preference" render={() => <Preference />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
