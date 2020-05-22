import React from "react";
import { Row, Col, PageHeader } from "antd";
import { UploadButtons } from "./UploadButtons";

export const FileUpload = () => {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Upload Data"
        subTitle="Help us improve our predictions"
      />
      <Row style={{ margin: "0 20px", height: 500 }}>
        <Col span={24} style={{ marginLeft: 5 }}>
          <UploadButtons />
        </Col>
      </Row>
    </div>
  );
};
