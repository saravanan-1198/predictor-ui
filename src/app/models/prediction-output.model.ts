export interface IPredictionOutput {
  branches: IBranch[];
  insights: IInsight[];
  predictions: number;
  reads: number;
  writes: number;
}

interface IInsight {
  key: number;
  year: number;
  month: number;
  date: number;
  branch: number;
  weekday: number;
  isPublicHoliday: number;
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
