import React from "react";
import { Spin } from "antd";

export const LoadingComponent = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Spin size="large"></Spin>
    </div>
  );
};
