import { Dashboard } from "../../features/Dashboard/Dashboard";
import Prediction from "../../features/Prediction/Prediction";
import FileUpload from "../../features/Upload/FileUpload";
import { SignUpForm } from "../../features/SignUp/SignUpForm";
import { LoadingComponent } from "./LoadingComponent";
import Accuracy from "../../features/Accuracy/Accuracy";

export const Routes: {
  [id: string]: { component: React.FC; navKey: string };
} = {
  "/": { component: Dashboard, navKey: "1" },
  "/predict": { component: Prediction, navKey: "2" },
  "/upload": { component: FileUpload, navKey: "3" },
  "/user/create": { component: SignUpForm, navKey: "5" },
  "/accuracy": { component: Accuracy, navKey: "6" },
  "/loader": {
    component: LoadingComponent,
    navKey: "",
  },
};
