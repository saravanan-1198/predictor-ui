import React from "react";
import "./SideNav.css";
import { Layout, Menu, Button } from "antd";
import { NavLink } from "react-router-dom";

const { Sider } = Layout;

interface IProps {
  handleLogout: () => void;
}

export const SideNav: React.FC<IProps> = ({ handleLogout }) => {
  return (
    <Sider theme="light">
      <div className="logo">Tosai Predict</div>
      <Menu theme="light" defaultSelectedKeys={["1"]} mode="vertical">
        <Menu.Item key="1">
          <NavLink to="/">Dashboard</NavLink>
        </Menu.Item>
        <Menu.Item key="2">
          <NavLink to="/predict">Predict</NavLink>
        </Menu.Item>
        <Menu.Item key="3">
          <NavLink to="/upload">Upload</NavLink>
        </Menu.Item>
        <Menu.Item key="4">
          <NavLink to="/user/create">Create an Account</NavLink>
        </Menu.Item>
        <Menu.Item key="5" onClick={handleLogout} unselectable="off">
          <Button type="primary" htmlType="submit">
            Create User
          </Button>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};
