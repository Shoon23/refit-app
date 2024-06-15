import { Redirect, Route } from "react-router-dom";
import {
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";

import { barbell, calendar, home, personCircle } from "ionicons/icons";
import Browse from "./Home/Browse";
import Home from "./Home/Home";
import WorkoutPlan from "./Home/WorkoutPlan";
import Profile from "./Home/Profile";
import AddExercisePage from "./Home/AddExercisePage";
import ExerciseListPage from "./Home/ExerciseListPage";
import WorkoutPlanDetails from "./Home/WorkoutPlanDetails";

const MainPages: React.FC = () => {
  return (
    <IonPage>
      <IonTabs>
        <IonRouterOutlet>
          <Redirect exact path="/main" to="/main/home" />
          <Route exact path="/main/home" render={() => <Home />} />

          <Route exact path="/main/browse" render={() => <Browse />} />
          <Route
            exact
            path="/main/workout-plan"
            render={() => <WorkoutPlan />}
          />
          <Route
            exact
            path="/main/workout-plan/details"
            render={(props) => <WorkoutPlanDetails {...props} />}
          />
          <Route
            path="/main/workout-plan/list"
            render={(props) => <ExerciseListPage {...props} />}
          />
          <Route
            path="/main/workout-plan/add"
            render={(props) => <AddExercisePage {...props} />}
          />

          <Route exact path="/main/profile" render={() => <Profile />} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/main/home">
            <IonIcon icon={home} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="browse" href="/main/browse">
            <IonIcon icon={barbell} />
            <IonLabel>Browse</IonLabel>
          </IonTabButton>
          <IonTabButton tab="workoutplan" href="/main/workout-plan">
            <IonIcon icon={calendar} />
            <IonLabel>Workout Plan</IonLabel>
          </IonTabButton>
          <IonTabButton tab="profile" href={"/main/profile"}>
            <IonIcon icon={personCircle} />
            <IonLabel>Profile</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonPage>
  );
};

export default MainPages;
