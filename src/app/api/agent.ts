import axios, { AxiosResponse } from "axios";
import { history } from "../../index";
import { IPredictionInput } from "../models/prediction-input.model";

axios.defaults.baseURL = "https://192.168.191.186:5000/api";

axios.interceptors.response.use(undefined, (error) => {
  if (error.response.status === 404) {
    history.push("/notfound");
  } else {
    throw error;
  }
});

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) =>
    setTimeout(() => resolve(response), ms)
  );

const requests = {
  get: (url: string) =>
    axios
      .get(url, {
        headers: { "x-auth-token": localStorage.getItem("x-auth-token") },
      })
      .then(sleep(1000))
      .then(responseBody),
  post: (url: string, body: {}) =>
    axios
      .post(url, body, {
        headers: { "x-auth-token": localStorage.getItem("x-auth-token") },
      })
      .then(sleep(1000))
      .then(responseBody),
  put: (url: string, body: {}) =>
    axios.put(url, body).then(sleep(1000)).then(responseBody),
  delete: (url: string) =>
    axios.delete(url).then(sleep(1000)).then(responseBody),
};

const AuthService = {
  login: (credentials: { email: string; password: string }): Promise<string> =>
    requests.post("/auth", credentials),
};

const UserService = {
  createUser: (credentials: {
    email: string;
    password: string;
    isAdmin: boolean;
  }) => requests.post("/users", credentials),
};

const AssetService = {
  getBranches: () => requests.get("/branches"),
  getCategories: () => requests.get("/categories"),
};

const PredictionService = {
  getAccuracy: () => requests.get("/accuracy"),
  getPrediction: (predictionInput: IPredictionInput) =>
    requests.post("/predict", predictionInput),
};

export const Services = {
  AuthService,
  UserService,
  PredictionService,
  AssetService,
};
