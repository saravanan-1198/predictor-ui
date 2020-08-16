import React, { useContext, useEffect } from "react";
import { Result, Button } from "antd";
import predictionStore from "../../app/stores/prediction.store";
import compareStore from "../../app/stores/compare.store";
import inputStore from "../../app/stores/input.store";
import dashboardStore from "../../app/stores/dashboard.store";
import appStore from "../../app/stores/app.store";
import { history } from "../../index";

export const SessionExpired = () => {
  const { reset: appRestore, logout } = useContext(appStore);
  const { reset: predictionRestore } = useContext(predictionStore);
  const { reset: compareRestore } = useContext(compareStore);
  const { reset: inputRestore } = useContext(inputStore);
  const { reset: dashbaordRestore } = useContext(dashboardStore);

  useEffect(() => {
    logout();
    appRestore();
    predictionRestore();
    compareRestore();
    inputRestore();
    dashbaordRestore();
  }, []);

  return (
    <Result
      status="403"
      title="Session Expired"
      subTitle="Sorry, the session has expired. Login again to continue."
      extra={
        <Button type="primary" onClick={() => history.push("/login")}>
          Login
        </Button>
      }
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translateX(-50%) translateY(-50%)",
      }}
    />
  );
};
