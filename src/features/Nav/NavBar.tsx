import React, { useContext, useEffect, useState } from "react";
import "./NavBar.css";
import { Layout, Menu, Button, message, Tooltip, Tag } from "antd";
import { NavLink } from "react-router-dom";
import { Routes } from "../../app/layout/Routes";
import { observer } from "mobx-react-lite";
import AppStore from "../../app/stores/app.store";
import { Services } from "../../app/api/agent";
import { Days } from "../../app/models/days.enum";
import dashboardStore from "../../app/stores/dashboard.store";
import PredictionStore from "../../app/stores/prediction.store";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  LineChartOutlined,
  MonitorOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
import Home from "../Home/Home";

const { Header } = Layout;

const { Sider, Content } = Layout;

interface IProps {
  handleLogout: () => void;
  currentPath: string;
}

const NavBar: React.FC<IProps> = ({ handleLogout, currentPath }) => {
  const { isAdminUser } = useContext(AppStore);
  const { lastTraining, setLastTraining } = useContext(dashboardStore);
  const { Lasttimestamp } = useContext(PredictionStore);
  const [collapsed, setState] = useState(true);

  useEffect(() => {
    loadModelTrainingDateTime();
  }, []);

  const toggle = () => {
    setState(!collapsed);
  };

  const loadModelTrainingDateTime = async () => {
    try {
      const result = await Services.AssetService.getLastTraining();
      setLastTraining(result);
    } catch (error) {
      message.error("Server Error. Please try again later.");
    }
  };

  return (
    <Layout>
      <Header className="header" style={{ padding: 0, background: "#fff" }}>
        <div className="logo">
          <Button onClick={toggle}>
            {collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          </Button>{" "}
          <span> </span>
          Predictor UI
        </div>

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
              <Tag key={0} color="blue">
                <span>
                  Last Training - {Lasttimestamp.slice(0, 19).replace("T", " ")}
                </span>
              </Tag>
            </Tooltip>
          </Menu.Item>
        </Menu>
      </Header>

      <Layout className="site-layout">
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            display: collapsed ? "none" : "block",
            width: "30",
            position: "absolute",
            color: "#f0f5ff",
          }}
          className="MenuButton"
        >
          <Menu
            theme="light"
            mode="inline"
            className="menuitem"
            onSelect={toggle}
          >
            <Menu.Item key="1">
              <NavLink to="/" activeClassName="your-active-class">
                Dashboard
              </NavLink>
            </Menu.Item>
            <Menu.Item key="3">
              <NavLink to="/upload" activeClassName="your-active-class">
                Upload
              </NavLink>
            </Menu.Item>
            <Menu.Item key="8">
              <NavLink to="/inventory" activeClassName="your-active-class">
                Inventory
              </NavLink>
            </Menu.Item>
          </Menu>
        </Sider>
      </Layout>
    </Layout>
  );
};

export default observer(NavBar);
