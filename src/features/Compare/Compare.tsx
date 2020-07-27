import React, { useContext, useState } from "react";
import { Row, Col, PageHeader, message, Spin } from "antd";
import UserInput from "../UserInput/UserInput";
import { RouteComponentProps } from "react-router-dom";
import { InboxOutlined } from "@ant-design/icons";
import Dragger from "antd/lib/upload/Dragger";
import CompareStore from "../../app/stores/compare.store";
import CompareResult from "./CompareResult";
import { observer } from "mobx-react-lite";
import { Services } from "../../app/api/agent";

const Compare: React.FC<RouteComponentProps> = ({ history }) => {
  const {
    showCompareForm,
    showCompareResult,
    setCompareOuput,
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
    headers: { "x-auth-token": localStorage.getItem("x-auth-token") ?? "" },
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
    <div>
      {showCompareForm && (
        <Spin spinning={loading}>
          <Row>
            <Col span={7}>
              <PageHeader
                className="site-page-header"
                title="Compare Fly"
                subTitle="Provide the inputs"
              />
              <UserInput
                route={history.location.pathname}
                setCompareLoading={setLoading}
              />
            </Col>
            <Col span={17}>
              <PageHeader
                className="site-page-header"
                title="Compare Upload"
                subTitle="Upload the report"
              />
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
            </Col>
          </Row>
        </Spin>
      )}
      {showCompareResult && <CompareResult />}
    </div>
  );
};

export default observer(Compare);
