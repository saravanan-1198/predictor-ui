import React, { useContext } from "react";
import "./Home.css";
import { Layout, Modal } from "antd";
import Prediction from "../../features/Prediction/Prediction";
import { FileUpload } from "../../features/Upload/FileUpload";
import { Switch, Route, RouteComponentProps } from "react-router-dom";
import { Dashboard } from "../../features/Dashboard/Dashboard";
import { SignUpForm } from "../SignUp/SignUpForm";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import NavBar from "../Nav/NavBar";
import Accuracy from "../Accuracy/Accuracy";
import AppStore from "../../app/stores/app.store";
import ProtectedRoute from "../../app/auth/ProtectedRoute";
import { NotFound } from "../../app/layout/NotFound";
const { confirm } = Modal;
const { Content } = Layout;

export const Home: React.FC<RouteComponentProps> = ({ history, location }) => {
  const { logout, isAdminUser } = useContext(AppStore);

  const handleLogout = () => {
    confirm({
      title: "Do you want to Logout?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        logout();
        history.push("/loader");
        setTimeout(() => {
          history.push("/login");
        }, 3000);
      },

      onCancel() {},
    });
  };

  return (
    <Layout className="site-layout">
      <NavBar handleLogout={handleLogout} currentPath={location.pathname} />
      <Content style={{ margin: "0 16px" }}>
        <div className="site-layout-background" style={{ padding: 24 }}>
          <Switch>
            <Route exact path="/upload" component={FileUpload} />
            <Route exact path="/predict" component={Prediction} />
            <Route exact path="/accuracy" component={Accuracy} />
            <ProtectedRoute
              exact
              path="/user/create"
              component={SignUpForm}
              isAuthenticated={() => isAdminUser}
              redirectPath="/"
            />
            <Route exact path="/" component={Dashboard} />
            <Route path="/*" component={NotFound} />
          </Switch>
        </div>
      </Content>
    </Layout>
  );
};
