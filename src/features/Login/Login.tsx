import React, { useContext } from "react";
import "./Login.css";
import {
  Layout,
  PageHeader,
  Form,
  Button,
  Input,
  Checkbox,
  notification,
} from "antd";
import { RouteComponentProps } from "react-router-dom";
import AppStore from "../../app/stores/app.store";
import { observer } from "mobx-react-lite";

const { Content, Footer } = Layout;

const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const { login, loggingIn } = useContext(AppStore);

  const onFinish = async (values: any) => {
    const success = await login(values.email, values.password);

    if (success) {
      notification["success"]({
        message: "Login Successful",
        description:
          "Welcome back to Predictor UI. Hope our predictions help you in managing your business. Help us improve our predictions by uploading your past sales record",
      });
      history.push("/");
    }
  };

  return (
    <Layout
      style={{ height: "100vh" }}
      className="
    site-layout"
    >
      <Content>
        <div
          className="site-layout-background"
          style={{ padding: 24, margin: "15px 15px" }}
        >
          <PageHeader
            className="site-page-header"
            title="Predictor UI"
            subTitle="A Sales Prediction Tool"
          />
          <Form
            style={{ width: 400, margin: "60px auto", textAlign: "center" }}
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Please enter your email address!" },
              ]}
            >
              <Input type="email" placeholder="example@xyz.com" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password type="password" placeholder="Password" />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              style={{ textAlign: "left" }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loggingIn}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>Foodstheword ©2020</Footer>
    </Layout>
  );
};

export default observer(Login);
