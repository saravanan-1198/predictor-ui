import React, { useContext, useEffect, useState } from "react";
import "./NavBar.css";
import { Layout, Menu, Button, message, Tooltip } from "antd";
import { NavLink } from "react-router-dom";
import { Routes } from "../../app/layout/Routes";
import { observer } from "mobx-react-lite";
import AppStore from "../../app/stores/app.store";
import { Services } from "../../app/api/agent";
import { Days } from "../../app/models/days.enum";
const { Header } = Layout;

interface IProps {
  handleLogout: () => void;
  currentPath: string;
}

const NavBar: React.FC<IProps> = ({ handleLogout, currentPath }) => {
  const { isAdminUser } = useContext(AppStore);
  const [lastTraining, setLastTraining] = useState("");

  useEffect(() => {
    loadModelTrainingDateTime();
  }, []);

  const loadModelTrainingDateTime = async () => {
    try {
      const result = await Services.AssetService.getLastTraining();
      setLastTraining(result);
    } catch (error) {
      message.error("Server Error. Please try again later.");
    }
  };

  return (
    <Header style={{ background: "#fff", padding: 0 }}>
      <div className="logo">Predictor UI</div>
      <Menu
        mode="horizontal"
        selectedKeys={
          Object.keys(Routes).includes(currentPath)
            ? [Routes[currentPath].navKey]
            : []
        }
      >
        <Menu.Item key="1">
          <NavLink to="/">Dashboard</NavLink>
        </Menu.Item>
        <Menu.Item key="2">
          <NavLink to="/predict">Predict</NavLink>
        </Menu.Item>
        <Menu.Item key="7">
          <NavLink to="/compare">Compare</NavLink>
        </Menu.Item>
        <Menu.Item key="3">
          <NavLink to="/upload">Upload</NavLink>
        </Menu.Item>
        <Menu.Item key="6">
          <NavLink to="/accuracy">Accuracy</NavLink>
        </Menu.Item>
        <Menu.Item key="5" className="right" disabled>
          <Button type="primary" onClick={handleLogout} htmlType="submit">
            Logout
          </Button>
        </Menu.Item>
        {/* {isAdminUser ? (
          <Menu.Item key="4" className="right">
            <NavLink to="/user/create">Create an Account</NavLink>
          </Menu.Item>
        ) : null} */}
        <Menu.Item
          key="4"
          disabled
          style={{ cursor: "text" }}
          className="right"
        >
          <Tooltip title="Last Model Training">
            <span>Last Training - {new Date(lastTraining).toUTCString()}</span>
          </Tooltip>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default observer(NavBar);
