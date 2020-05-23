import React, { useContext, useState } from "react";
import { PageHeader, Tabs, Button, Spin } from "antd";
import PredictionQuantity from "./PredictionQuantity";
import PredictionRevenue from "./PredictionRevenue";
import { observer } from "mobx-react-lite";
import PredictionStore from "../../app/stores/prediction.store";
import { CategoryRevenue } from "./CategoryRevenue";
import { Services } from "../../app/api/agent";
import download from "downloadjs";
const { TabPane } = Tabs;

interface IProps {
  setZeros: (value: boolean) => void;
}

const PredictionResult: React.FC<IProps> = ({ setZeros }) => {
  const { tableLoading, toggleShowForm, showForm, tableData } = useContext(
    PredictionStore
  );

  const [loading, setLoading] = useState(false);

  const handleDownloadCSV = async () => {
    setLoading(true);
    const result = await Services.ExportService.exportCSV(tableData);
    setLoading(false);
    download(result, "Report.csv");
  };

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Prediction Result"
        extra={[
          <Button
            key="0"
            type="primary"
            onClick={handleDownloadCSV}
            loading={loading}
          >
            Export Result
          </Button>,
          <Button key="1" onClick={() => toggleShowForm(!showForm)}>
            Toggle Prediction Input
          </Button>,
        ]}
      />
      <Spin spinning={tableLoading}>
        <Tabs defaultActiveKey="1" style={{ margin: "0 20px" }}>
          <TabPane tab="Quantity" key="1">
            <PredictionQuantity setZeros={setZeros} />
          </TabPane>
          <TabPane tab="Category Split" key="2">
            <CategoryRevenue />
          </TabPane>
          <TabPane tab="Revenue Graph" key="3">
            <PredictionRevenue />
          </TabPane>
        </Tabs>
      </Spin>
    </div>
  );
};

export default observer(PredictionResult);
