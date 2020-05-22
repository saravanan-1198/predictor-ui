export interface IPredictionOutput {
  branches: IBranch[];
}

interface IBranch {
  branch: number;
  items: IItem[];
}

export interface IItem {
  key: number;
  name: string;
  prediction: IPrediction;
  sub_category: string;
  super_category: string;
}

interface IPrediction {
  [key: string]: {
    quantity: number;
    revenue: number;
  };
}
