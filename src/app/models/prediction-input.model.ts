export interface IPredictionInput {
  criteria: number;
  branch: number[];
  category: ICategory[];
  years: IYear[];
}

interface ICategory {
  super: string;
  sub: string[];
}

export interface IYear {
  year: number;
  months: IMonth[];
}

export interface IMonth {
  month: number;
  dates: number[];
}
