import React, { useContext } from "react";
import { PageHeader, Tabs, Button, Spin } from "antd";
import PredictionQuantity from "./PredictionQuantity";
import PredictionRevenue from "./PredictionRevenue";
import { observer } from "mobx-react-lite";
import PredictionStore from "../../app/stores/prediction.store";
import { CategoryRevenue } from "./CategoryRevenue";
const { TabPane } = Tabs;

const PredictionResult = () => {
  const { tableLoading } = useContext(PredictionStore);

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Prediction Result"
        extra={<Button type="primary">Export Result</Button>}
      />
      <Spin spinning={tableLoading}>
        <Tabs defaultActiveKey="1" style={{ margin: "0 20px" }}>
          <TabPane tab="Quantity" key="1">
            <PredictionQuantity />
          </TabPane>
          <TabPane tab="Revenue - Category" key="2">
            <CategoryRevenue />
          </TabPane>
          <TabPane tab="Revenue - Overall" key="3">
            <PredictionRevenue />
          </TabPane>
        </Tabs>
      </Spin>
    </div>
  );
};

export default observer(PredictionResult);
