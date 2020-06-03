export interface IPredictionOutput {
  branches: IBranch[];
  holidays: string[];
  weekdays: IWeekend;
  predictions: number;
  reads: number;
  writes: number;
}

interface IWeekend {
  [key: string]: number;
}

interface IBranch {
  branch: number;
  data: IItem[];
}

export interface IItem {
  key: number;
  name: string;
  predicion: IPrediction;
  sub_category: string;
  super_category: string;
}

interface IPrediction {
  [key: string]: {
    quantity: number;
    revenue: number;
  };
}
