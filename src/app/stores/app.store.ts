import { createContext } from "react";
import { observable, action, runInAction, configure, computed } from "mobx";
import { Services } from "../api/agent";
import * as jwt from "jsonwebtoken";
import { message } from "antd";
import firebase from "firebase";

configure({ enforceActions: "always" });

var config = JSON.parse(process.env.REACT_APP_FIREBASE_AUTH_JSON ?? "");

const authTokenKey = "x-auth-token";

class AppStore {
  constructor() {
    firebase.initializeApp(config);
    this.reset();
  }

  @action
  setToken = (token: string | undefined) => {
    this.loggingIn = false;
    if (token) {
      localStorage.setItem(authTokenKey, token);
      this.token = token;
    } else {
      localStorage.removeItem(authTokenKey);
      this.token = null;
    }
  };

  @action
  reset = () => {
    this.token = localStorage.getItem(authTokenKey);
    this.loggingIn = false;
  };

  @observable
  token: string | null = localStorage.getItem(authTokenKey);

  @observable
  loggingIn: boolean = false;

  @computed
  get isAuthenticated() {
    return this.token ? true : false;
  }

  getVerfiedFromStorage = () => {
    if (localStorage.getItem("Verified")) {
      return localStorage.getItem("Verified") === "true" ? true : false;
    }

    return false;
  };

  @observable
  isVerified = this.getVerfiedFromStorage();

  @action
  setIsVerified = (val: boolean | undefined) => {
    if (val === undefined) {
      val = false;
    }
    this.isVerified = val;
    const strVal = val ? "true" : "false";
    localStorage.setItem("Verified", strVal);
  };

  // get isVerifiedUser() {
  //   return firebase.auth().currentUser?.emailVerified;
  // }

  @computed
  get isAdminUser() {
    const payload = jwt.decode(this.token!);
    let obj = payload as {
      [key: string]: any;
    };
    return obj["isAdmin"];
  }

  @action
  setLoggingIn = (value: boolean) => {};

  @action
  gcpLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      this.loggingIn = true;
      await firebase.auth().signInWithEmailAndPassword(email, password);
      return runInAction("Login", async () => {
        const verfi = firebase.auth().currentUser?.emailVerified;
        this.setIsVerified(verfi);
        this.loggingIn = false;
        return true;
      });
    } catch (error) {
      runInAction("Login Failed", () => {
        this.loggingIn = false;
        if (
          error.code === "auth/wrong-password" ||
          error.code === "auth/user-not-found"
        ) {
          message.error("Invalid user crendentails");
        } else {
          message.error("Server Error. Please try again later");
        }
      });
      return false;
    }
  };

  sendPasswordUpdate = () => {
    const mail = firebase.auth().currentUser?.email;
    console.log(mail);
    if (mail) firebase.auth().sendPasswordResetEmail(mail);
  };

  @action
  login = async (email: string, password: string): Promise<boolean> => {
    try {
      const token = await Services.AuthService.login({ email, password });
      return runInAction("Login", () => {
        this.loggingIn = false;
        if (token) {
          localStorage.setItem(authTokenKey, token);
          this.token = token;
          return true;
        } else {
          localStorage.removeItem(authTokenKey);
          this.token = null;
          return false;
        }
      });
    } catch (error) {
      runInAction("Login Failed", () => {
        this.loggingIn = false;
        if (error.response === undefined) {
          message.error("Server not running. Please try again later");
        } else if (error.response.status === 400) {
          message.error("Invalid user crendentails");
        } else {
          message.error("Server Error. Please try again later");
        }
      });
      return false;
    }
  };

  @action
  logout = async () => {
    await firebase.auth().signOut();
    runInAction("Signout", () => {
      this.token = null;
      localStorage.removeItem(authTokenKey);
      localStorage.removeItem("Verified");
    });
  };
}

export default createContext<AppStore>(new AppStore());
