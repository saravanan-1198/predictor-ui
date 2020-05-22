import React, { useContext } from "react";
import { Home } from "../../features/Home/Home";
import { Switch, Route } from "react-router-dom";
import Login from "../../features/Login/Login";
import { LoadingComponent } from "./LoadingComponent";
import ProtectedRoute from "../auth/ProtectedRoute";
import AppStore from "../stores/app.store";
import { observer } from "mobx-react-lite";

const App = () => {
  const { isAuthenticated } = useContext(AppStore);

  return (
    <Switch>
      <ProtectedRoute
        exact
        path="/login"
        component={Login}
        isAuthenticated={() => !isAuthenticated}
        redirectPath="/"
      />
      <Route exact path="/loader" component={LoadingComponent} />
      <ProtectedRoute
        path="/"
        component={Home}
        isAuthenticated={() => isAuthenticated}
        redirectPath="/login"
      />
    </Switch>
  );
};

export default observer(App);
