import React, { useContext, useEffect } from "react";
import { Home } from "../../features/Home/Home";
import { Switch, Route } from "react-router-dom";
import Login from "../../features/Login/Login";
import { LoadingComponent } from "./LoadingComponent";
import ProtectedRoute from "../auth/ProtectedRoute";
import AppStore from "../stores/app.store";
import { observer } from "mobx-react-lite";
import firebase from "firebase";
import VerifiedUser from "../../features/VerfiedUser/VerifiedUser";
import { message, notification } from "antd";

const App = () => {
  const { isAuthenticated, setToken, sendPasswordUpdate } = useContext(
    AppStore
  );

  useEffect(() => {
    const authListener = firebase
      .auth()
      .onAuthStateChanged(async (user: any) => {
        if (user) {
          const token = await firebase.auth().currentUser?.getIdToken();
          setToken(token);
          if (!firebase.auth().currentUser?.emailVerified) {
            try {
              sendPasswordUpdate();
              message.success("Password Reset Email Sent!");
            } catch (error) {
              message.error(
                "Unable to send password reset email. Please contact admin"
              );
            }
          }
        } else {
          setToken(undefined);
        }
      });

    return authListener;
  }, []);

  return (
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/loader" component={LoadingComponent} />
      <Route exact path="/verify" component={VerifiedUser} />
      <ProtectedRoute
        path="/"
        component={Home}
        isAuthenticated={() => isAuthenticated}
        // isAuthenticated={() => isAuthenticated}
        redirectPath={"/login"}
        // redirectPath="/login"
      />
    </Switch>
  );
};

export default observer(App);
