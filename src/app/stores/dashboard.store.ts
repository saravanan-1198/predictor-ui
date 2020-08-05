import { createContext } from "react";
import { observable, action } from "mobx";

class DashboardStore {
  constructor() {
    this.reset();
  }

  @action
  reset = () => {
    this.tmrData = undefined;
    this.accData = undefined;
    this.lastTraining = "";
    this.uploaddetails = undefined;
  };

  @observable
  uploaddetails: any;

  @observable
  tmrData: any;

  @observable
  lastTraining: string = "";

  @observable
  accData: any;

  @action
  setUploadDetails = (value: any) => {
    this.uploaddetails = value;
  };

  @action
  setLastTraining = (value: string) => {
    this.lastTraining = value;
  };

  @action
  setTmrData = (value: any) => {
    this.tmrData = value;
  };

  @action
  setAccData = (value: any) => {
    this.accData = value;
  };
}

export default createContext<DashboardStore>(new DashboardStore());
