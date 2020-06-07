import React, { useContext, useState } from "react";
import { Row, Col, PageHeader, Tabs, Typography, message, Spin } from "antd";
import UserInput from "../UserInput/UserInput";
import { RouteComponentProps } from "react-router-dom";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import Dragger from "antd/lib/upload/Dragger";
import CompareStore from "../../app/stores/compare.store";
import CompareResult from "./CompareResult";
import { observer } from "mobx-react-lite";
import { Services } from "../../app/api/agent";

const { TabPane } = Tabs;
const { Title } = Typography;

const Compare: React.FC<RouteComponentProps> = ({ history }) => {
  const {
    showCompareForm,
    showCompareResult,
    setCompareOuput,
    compareMethod,
    setCompareMethod,
    setCompareTableLoading,
    setShowCompareResult,
  } = useContext(CompareStore);
  const [loading, setLoading] = useState(false);

  const props = {
    name: "file",
    action: Services.UploadService.CompareUploadURL,
    accept: ".csv",
    height: 450,
    onChange(info: any) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      } else {
        setLoading(true);
        setCompareMethod(1);
      }

      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        setLoading(false);
        setCompareOuput(info.file.response);
        setCompareTableLoading(false);
        setShowCompareResult(true);
      } else if (info.file.status === "error") {
        setLoading(false);
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    showUploadList: false,
  };

  return (
    <Row>
      {showCompareForm && (
        <Col span={7}>
          <PageHeader
            className="site-page-header"
            title="Compare Input"
            subTitle="Provide the inputs"
          />
          <Tabs
            defaultActiveKey={compareMethod.toString()}
            style={{ margin: "0 20px" }}
          >
            <TabPane tab="Input" key="0">
              <UserInput route={history.location.pathname} />
            </TabPane>
            <TabPane tab="Upload" key="1">
              <Spin spinning={loading}>
                <Dragger {...props}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Upload the exported .csv file of previous predictions to
                    compare it with current predictions
                  </p>
                </Dragger>
              </Spin>
            </TabPane>
          </Tabs>
        </Col>
      )}

      <Col span={showCompareForm ? 17 : 24}>
        {showCompareResult ? (
          <CompareResult />
        ) : (
          <div className="prediction-title">
            <Title>Comparison</Title>
            <Title level={4}>Make a comparison to view the results</Title>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default observer(Compare);
