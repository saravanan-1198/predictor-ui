import React, { useContext, useEffect, useState } from "react";
import { Result, Button, message } from "antd";
import AppStore from "../../app/stores/app.store";
import { RouteComponentProps } from "react-router-dom";
import { observer } from "mobx-react-lite";

const VerifiedUser: React.FC<RouteComponentProps> = ({ history }) => {
  const { isVerified, sendPasswordUpdate, logout } = useContext(AppStore);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    if (isVerified) {
      history.push("/");
    }
  }, []);

  const handleLogin = () => {
    logout();
    history.push("/loader");
    setTimeout(() => {
      history.push("/login");
    }, 2000);
  };

  const handleResend = () => {
    try {
      sendPasswordUpdate();
      setDisable(true);
      message.success("Password Reset Email Sent!");
    } catch (error) {
      message.error(
        "Unable to send password reset email. Please contact admin"
      );
    }
  };

  return (
    <Result
      title="Welcome to Predictor UI"
      status="success"
      subTitle="We have sent you a password reset link to your registered Email ID. Click on Resend Button if you haven't received it. Please update the password and Login again"
      extra={[
        <Button type="primary" key="dd" onClick={handleLogin}>
          Login
        </Button>,
        <Button key="ds" disabled={disable} onClick={handleResend}>
          Resend
        </Button>,
      ]}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translateX(-50%) translateY(-50%)",
      }}
    />
  );
};

export default observer(VerifiedUser);
