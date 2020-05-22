import { configure, observable, action, computed } from "mobx";
import { createContext } from "react";
import moment, { Moment } from "moment";
import { Line, Pie } from "@antv/g2plot";

configure({ enforceActions: "always" });

class PredictionStore {
  @observable
  criteria: number = 0;

  @observable
  dateInput: Moment[] = [
    moment(new Date(2020, 1, 3)),
    moment(new Date(2020, 1, 5)),
  ];

  @observable
  predictionOutput: any;

  @observable
  tableLoading: boolean = false;

  @observable
  showResult: boolean = false;

  @observable
  branchList: { key: number; name: string }[] = [];

  @observable
  treeData: any[] = [];

  @observable
  linePlot: Line | null = null;

  @observable
  piePlot: Pie | null = null;

  @computed get lineData() {
    const lineData: { year: string; sales: number }[] = [];

    this.predictionOutput[Object.keys(this.predictionOutput)[0]].forEach(
      (item: any) => {
        Object.keys(item.predicion).forEach((key) => {
          if (key !== "total") {
            const data = lineData.find((pd) => pd.year === key);
            if (!data) {
              lineData.push({
                year: key,
                sales: item.predicion[key].revenue,
              });
            } else {
              data.sales += item.predicion[key].revenue;
            }
          }
        });
      }
    );

    return lineData;
  }

  @computed get pieData() {
    const pieData: { type: string; value: number }[] = [];

    this.predictionOutput[Object.keys(this.predictionOutput)[0]].forEach(
      (item: any) => {
        const data = pieData.find((pd) => pd.type === item.super_category);
        if (!data) {
          pieData.push({
            type: item.super_category,
            value: item.predicion["total"].quantity,
          });
        } else {
          data.value += item.predicion["total"].quantity;
        }
      }
    );

    return pieData;
  }

  @action
  setLinePlot = (linePlot: Line) => {
    this.linePlot = linePlot;
  };

  @action
  setPiePlot = (piePlot: Pie) => {
    this.piePlot = piePlot;
  };

  @action
  setStoreCriteria = (value: number) => {
    this.criteria = value;
  };

  @action
  setDateInput = (value: Moment[]) => {
    this.dateInput = value;
  };

  @action
  setPredictionOutput = (value: any) => {
    this.predictionOutput = value;
  };

  @action
  setTableLoading = (value: boolean) => {
    this.tableLoading = value;
  };

  @action
  setShowResult = (value: boolean) => {
    this.showResult = value;
  };

  @action
  setTreeData = (value: any[]) => {
    this.treeData = value;
  };

  @action
  setBranchList = (value: { key: number; name: string }[]) => {
    this.branchList = value;
  };
}

export default createContext<PredictionStore>(new PredictionStore());
