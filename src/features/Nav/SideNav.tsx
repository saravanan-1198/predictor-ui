import React ,{useState} from "react";
import "./SideNav.css";
import { Layout, Menu, Button } from "antd";
import { NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

interface IProps {
  handleLogout: () => void;
}

export const SideNav: React.FC<IProps> = ({ handleLogout }) => {
  const [collapsed, setState] = useState(false);

const toggleCollapsed = () => {
  setState(!collapsed);
};

  return (
    // <Sider theme="light">
      <div  style={{ width: 256 }}>
        <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
        </Button>
      <Menu theme="dark" defaultSelectedKeys={["1"]} 
      mode="inline"
      inlineCollapsed={collapsed}
      >
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
      </div>
    // </Sider>
  );
};

export default observer(SideNav);

