import { createContext } from "react";
import { configure, observable, action } from "mobx";

configure({ enforceActions: "always" });

class InputStore {
  constructor() {
    this.reset();
  }

  @action
  reset = () => {
    this.categoriesDisabled = false;
    this.branchesDisabled = false;
    this.categoriesSelectAll = false;
    this.branchesSelectAll = false;
  };

  @observable
  categoriesDisabled: boolean = false;

  @observable
  branchesDisabled: boolean = false;

  @observable
  categoriesSelectAll: boolean = false;

  @observable
  branchesSelectAll: boolean = false;

  @action
  setCategoriesDiabled = (value: boolean) => {
    this.categoriesDisabled = value;
  };

  @action
  setBranchesDiabled = (value: boolean) => {
    this.branchesDisabled = value;
  };

  @action
  setCategoriesSelectAll = (value: boolean) => {
    this.categoriesSelectAll = value;
  };

  @action
  setBranchesSelectAll = (value: boolean) => {
    this.branchesSelectAll = value;
  };
}

export default createContext<InputStore>(new InputStore());
