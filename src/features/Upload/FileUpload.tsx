import React, { useContext } from "react";
import { Row, Col, PageHeader, Timeline, Card } from "antd";
import { UploadButtons } from "./UploadButtons";
import { ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import PredictionStore from "../../app/stores/prediction.store";
import { TrainingStatus } from "../../app/models/training-status.enum";

const FileUpload = () => {
  const {
    FileUploadStatus,
    PipelineInitiatedStatus,
    TrainingCompletedStatus,
    ModelReadyStatus,
  } = useContext(PredictionStore);

  const getDotInput = (status: TrainingStatus) => {
    if (status === TrainingStatus.Pending) return undefined;
    else if (status === TrainingStatus.InProgress)
      return <ClockCircleOutlined className="timeline-clock-icon" />;
    else return <CheckCircleOutlined className="timeline-clock-icon" />;
  };

  const getColorInput = (status: TrainingStatus) => {
    if (status === TrainingStatus.Pending) return undefined;
    else if (status === TrainingStatus.InProgress) return "red";
    else return "green";
  };

  return (
    <div>
      <Row style={{ margin: "0 20px", height: "70vh" }}>
        <Col span={14}>
          <PageHeader
            className="site-page-header"
            title="Upload Data"
            subTitle="Help us improve our predictions"
          />
          <div style={{ width: "100%", height: "100%" }}>
            <UploadButtons />
          </div>
        </Col>
        <Col span={10}>
          <PageHeader
            className="site-page-header"
            title="Training Timeline"
            subTitle=""
          />
          <Card
            style={{ margin: "0 10px", height: "100%", position: "relative" }}
          >
            <Timeline
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translateX(-50%) translateY(-50%)",
              }}
            >
              <Timeline.Item
                dot={getDotInput(FileUploadStatus)}
                color={getColorInput(FileUploadStatus)}
              >
                File Uploaded
              </Timeline.Item>
              <Timeline.Item
                dot={getDotInput(PipelineInitiatedStatus)}
                color={getColorInput(PipelineInitiatedStatus)}
              >
                Pipeline Initiated
              </Timeline.Item>
              <Timeline.Item
                dot={getDotInput(TrainingCompletedStatus)}
                color={getColorInput(TrainingCompletedStatus)}
              >
                Training Completed
              </Timeline.Item>
              <Timeline.Item
                dot={getDotInput(ModelReadyStatus)}
                color={getColorInput(ModelReadyStatus)}
              >
                Model ready for use
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default observer(FileUpload);
