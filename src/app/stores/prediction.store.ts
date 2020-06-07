import { configure, observable, action, computed } from "mobx";
import { createContext } from "react";
import moment, { Moment } from "moment";
import { Line, Pie } from "@antv/g2plot";
import { TrainingStatus } from "../models/training-status.enum";
import { IPredictionOutput } from "../models/prediction-output.model";

configure({ enforceActions: "always" });

class PredictionStore {
  @observable
  criteria: number = 0;

  @observable
  selectAll: boolean = false;

  @observable
  selectAllBranch: boolean = false;

  @observable
  dateInput: Moment[] = [
    moment(new Date(2020, 1, 3)),
    moment(new Date(2020, 1, 5)),
  ];

  @observable
  categories: string[] = [];

  @observable
  predictionOutput: any;

  @observable
  tableLoading: boolean = false;

  @observable
  showResult: boolean = false;

  @observable
  showForm: boolean = true;

  @observable
  branchList: { key: number; name: string }[] = [];

  @observable
  treeData: any[] = [];

  @observable
  linePlot: Line | null = null;

  @observable
  piePlotQuantity: Pie | null = null;

  @observable
  piePlotRevenue: Pie | null = null;

  @observable
  FileUploadStatus: TrainingStatus = TrainingStatus.Pending;

  @observable
  tableData: any[] = [];

  @observable
  PipelineInitiatedStatus: TrainingStatus = TrainingStatus.Pending;

  @observable
  TrainingCompletedStatus: TrainingStatus = TrainingStatus.Pending;

  @observable
  ModelReadyStatus: TrainingStatus = TrainingStatus.Pending;

  @computed get lineData() {
    const lineData: { year: string; sales: number }[] = [];

    const result = this.predictionOutput as IPredictionOutput;

    result.branches.forEach((branch) => {
      branch.data.forEach((item: any) => {
        Object.keys(item.predicion).forEach((key) => {
          if (key !== "total") {
            const data = lineData.find((pd) => pd.year === key);
            if (!data) {
              lineData.push({
                year: key,
                sales: Math.round(item.predicion[key].revenue),
              });
            } else {
              data.sales += Math.round(item.predicion[key].revenue);
            }
          }
        });
      });
    });

    return lineData;
  }

  @computed get pieDataQuantity() {
    const pieData: { type: string; value: number }[] = [];

    const result = this.predictionOutput as IPredictionOutput;

    result.branches.forEach((branch) => {
      branch.data.forEach((item: any) => {
        const data = pieData.find((pd) => pd.type === item.super_category);
        if (!data) {
          pieData.push({
            type: item.super_category,
            value: item.predicion["total"].quantity,
          });
        } else {
          data.value += item.predicion["total"].quantity;
        }
      });
    });

    return pieData;
  }

  @computed get totalQuantity() {
    let totalQ = 0;

    const result = this.predictionOutput as IPredictionOutput;

    result.branches.forEach((branch) => {
      branch.data.forEach((data) => {
        totalQ += data.predicion["total"].quantity;
      });
    });

    return totalQ;
  }

  @computed get totalRevenue() {
    let totalR = 0;

    const result = this.predictionOutput as IPredictionOutput;

    result.branches.forEach((branch) => {
      branch.data.forEach((data) => {
        totalR += data.predicion["total"].revenue;
      });
    });

    return totalR.toFixed(2);
  }

  @computed get pieDataRevenue() {
    const pieData: { type: string; value: number }[] = [];

    const result = this.predictionOutput as IPredictionOutput;

    result.branches.forEach((branch) => {
      branch.data.forEach((item: any) => {
        const data = pieData.find((pd) => pd.type === item.super_category);
        if (!data) {
          pieData.push({
            type: item.super_category,
            // value: Number.parseFloat(
            //   item.predicion["total"].revenue.toFixed(2)
            // ),
            value: Math.round(item.predicion["total"].revenue),
          });
        } else {
          data.value += Math.round(item.predicion["total"].revenue);
        }
      });
    });

    return pieData;
  }

  @action
  setSelectAll = (value: boolean) => {
    this.selectAll = value;
  };

  @action
  setSelectAllBranch = (value: boolean) => {
    this.selectAllBranch = value;
  };

  @action
  setTableData = (data: any[]) => {
    this.tableData = data;
  };

  @action
  setFileUploaded = (status: TrainingStatus) => {
    this.FileUploadStatus = status;
  };

  @action
  setPipelineInit = (status: TrainingStatus) => {
    this.PipelineInitiatedStatus = status;
  };

  @action
  setTrainingCompleted = (status: TrainingStatus) => {
    this.TrainingCompletedStatus = status;
  };

  @action
  setModelReady = (status: TrainingStatus) => {
    this.ModelReadyStatus = status;
  };

  @action
  setLinePlot = (linePlot: Line) => {
    this.linePlot = linePlot;
  };

  @action
  setPiePlotQuantity = (piePlot: Pie) => {
    this.piePlotQuantity = piePlot;
  };

  @action
  setPiePlotRevenue = (piePlot: Pie) => {
    this.piePlotRevenue = piePlot;
  };

  @action
  setCategories = (value: string[]) => {
    this.categories = value;
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
  toggleShowForm = (value: boolean) => {
    this.showForm = value;
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
