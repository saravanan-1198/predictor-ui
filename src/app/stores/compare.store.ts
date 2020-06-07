import { createContext } from "react";
import { configure, observable, action, computed } from "mobx";

configure({ enforceActions: "always" });

class CompareStore {
  constructor() {
    this.reset();
  }

  @action
  reset = () => {
    this.compareMethod = 0;
    this.compareOutput = undefined;
    this.compareTableLoading = false;
    this.showCompareResult = false;
    this.showCompareForm = true;
    this.tableDataCompare = [];
  };

  @observable
  compareMethod: number = 0;

  @observable compareOutput: any;

  @observable
  compareTableLoading: boolean = false;

  @observable
  showCompareResult: boolean = false;

  @observable
  showCompareForm: boolean = true;

  @observable
  tableDataCompare: any[] = [];

  @computed get totalAccuracy() {
    const totalAccuracy =
      100 * (this.totalPredictedRevenue / this.totalActualRevenue);

    return totalAccuracy;
  }

  @computed get totalErrorRevenue() {
    let totalErrorR = 0;

    this.compareOutput.branches.forEach((branch: any) => {
      branch.data.forEach((data: any) => {
        totalErrorR += data.revenue_error;
      });
    });

    return totalErrorR;
  }

  @computed get totalActualRevenue() {
    let totalActualR = 0;

    this.compareOutput.branches.forEach((branch: any) => {
      branch.data.forEach((data: any) => {
        totalActualR += data.actual_revenue;
      });
    });

    return totalActualR;
  }

  @computed get totalPredictedRevenue() {
    let totalR = 0;

    this.compareOutput.branches.forEach((branch: any) => {
      branch.data.forEach((data: any) => {
        totalR += data.revenue;
      });
    });

    return totalR;
  }

  @action
  setCompareMethod = (value: number) => {
    this.compareMethod = value;
  };

  @action
  setCompareTableLoading = (value: boolean) => {
    this.compareTableLoading = value;
  };

  @action
  setCompareOuput = (value: any) => {
    this.compareOutput = value;
  };

  @action
  setShowCompareResult = (value: boolean) => {
    this.showCompareResult = value;
  };

  @action
  setShowCompareForm = (value: boolean) => {
    this.showCompareForm = value;
  };

  @action
  toggleShowCompareForm = (value: boolean) => {
    this.showCompareForm = value;
  };

  @action
  setTableDataCompare = (value: any[]) => {
    this.tableDataCompare = value;
  };
}

export default createContext<CompareStore>(new CompareStore());
