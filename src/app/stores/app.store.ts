import { createContext } from "react";
import { observable, action, runInAction, configure, computed } from "mobx";
import { Services } from "../api/agent";
import * as jwt from "jsonwebtoken";
import { message } from "antd";

configure({ enforceActions: "always" });

const authTokenKey = "x-auth-token";

class AppStore {
  @observable token: string | null = localStorage.getItem(authTokenKey);

  @observable loggingIn: boolean = false;

  @computed get isAuthenticated() {
    return this.token ? true : false;
  }

  @computed get isAdminUser() {
    const payload = jwt.decode(this.token!);
    let obj = payload as {
      [key: string]: any;
    };
    return obj["isAdmin"];
  }

  @action setLoggingIn = (value: boolean) => {};

  @action login = async (email: string, password: string): Promise<boolean> => {
    try {
      this.loggingIn = true;
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

  @action logout = () => {
    this.token = null;
    localStorage.removeItem(authTokenKey);
  };
}

export default createContext<AppStore>(new AppStore());
