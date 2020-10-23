import { createContext } from "react";
import { observable, action } from "mobx";

class InventoryStore { 
    constructor() {
        this.reset();
      }

    
  @action
  reset = () => {  
    this.treeData = [];
    this.accData = undefined;
    this.treeData1 =[];
    this.accData1 = undefined;
  }
  
  @observable
  treeData: any[] = [];

  
  @observable
  accData: any;

  @action
  setAccData = (value: any) => {
    this.accData = value;
  };

  // data 1-add 2-remove 3-Set 4-Transfer
  @observable
  treeData1: any[] = [];

  
  @observable
  accData1: any;

  @action
  setAccData1 = (value: any) => {
    this.accData1 = value;
  };

}


export default createContext<InventoryStore>(new InventoryStore());
