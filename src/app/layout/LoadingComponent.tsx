import React from "react";
import { Spin } from "antd";

export const LoadingComponent = () => {
  return (
    <Spin className="center-spinner" size="large">
      <div className="loader" />
    </Spin>
  );
};
