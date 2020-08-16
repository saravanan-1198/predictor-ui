import React, { useContext } from "react";
import { Row, Col, PageHeader,  Select, Timeline, Card, Tag } from "antd";
import { UploadButtons } from "./UploadButtons";
import { ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import PredictionStore from "../../app/stores/prediction.store";
import { DashboardStatus } from "../../app/models/training-status.enum";

const FileUpload = () => {
  const {
    FileUploadStatus,
    PipelineInitiatedStatus,
    TrainingCompletedStatus,
    ModelReadyStatus,
    StartedStatus,
    PipelineInitiated,
    TrainingStarted,
    TrainingComplete,
    ModelsDeployed,
    replaceOptions,
    timeStarted, 
    LastUploadDetail,
    replaceOption,
    nextdateparamter, 
  } = useContext(PredictionStore);

  const getDotInput = (status: DashboardStatus) => {
    if (status === DashboardStatus.Pending) return undefined;
    else if (status === DashboardStatus.Incomplete)
      return <ClockCircleOutlined className="timeline-clock-icon" />;
    else return <CheckCircleOutlined className="timeline-clock-icon" />;
  };

  const getColorInput = (status: DashboardStatus) => {
    if (status === DashboardStatus.Pending) return undefined;
    else if (status === DashboardStatus.Incomplete) return "red";
    else return "green";
  };

  const  MakeItem = function(X: String) {
    return <option>{X}</option>;
  };


  return (
    <div>
      <Row style={{ margin: "0 20px", height: "70vh" }}>
        <Col span={14}>
          <PageHeader
            className="site-page-header"
            title="Upload Data"
            subTitle="Help us improve our predictions"
            extra={<Select
              placeholder="Select"
              size="middle"
              style={{ width: 100 }}
              >{replaceOptions.map(MakeItem)}
              </Select>}
          />
          <div style={{ width: "100%", height: "100%" }}>
            <UploadButtons />
          </div>
        </Col>
        <Col span={10}>
          <PageHeader
            // className="site-page-header"
            title="Training Timeline"
            subTitle=""
            tags = {
              <Tag color="blue">
              { `Next Training - ${new Date(String(nextdateparamter)).toDateString()}` } 
             </Tag>}
          />
          <Card
            style={{ margin: "0 2px", height: "100%", position: "relative" , padding : 0}}
          >
           
         
          <div style={{
                position: "absolute",
                top: "10%",
                left: "17%" ,
                fontSize : 16,
             }}>
            Updated Before - <span>  </span>
                <strong> { LastUploadDetail }</strong>
                   
          </div>
          <div style={{
                position: "absolute",
                top: "15%",
                left: "17%" ,
                fontSize : 16,
             }}>
            Replace Option - <span>  </span>
                <strong> { replaceOption }</strong>
                 
                       
          </div>
          <span/>
          <div style={{
                position: "absolute",
                top: "20%",
                left: "17%" ,
                fontSize : 16,
             }}>
            Status -  <span> <strong> Started  </strong >
           </span>
             
          </div>
         <span/>
         <div>
          <Card 
          style={{ margin: "23% 13%", height: "50%", width: "70%", position: "absolute", background: "#F6F7F7" }}
          >
            <Timeline
              style={{
                // position: "absolute",
                top: "70%",
                left: "45%",
                // transform: "translateX(-50%) translateY(-50%)",
              }}
              mode="left"
            >
              <Timeline.Item
                dot={getDotInput(StartedStatus)}
                color={getColorInput(StartedStatus)}
                label= { (StartedStatus === DashboardStatus.Complete) ? <Tag color="green">
                {timeStarted} 
              </Tag> : <Tag color="red">
                Incomplete
              </Tag>  } 
              >
                Started 
              </Timeline.Item>
              <Timeline.Item
                dot={getDotInput(PipelineInitiated)}
                color={getColorInput(PipelineInitiated)}
                label= { (PipelineInitiated === DashboardStatus.Complete) ? <Tag color="green">
                {timeStarted} 
              </Tag> : <Tag color="red">
                Incomplete
              </Tag> } 
              >
                Pipeline Initiated 
              </Timeline.Item>     
              <Timeline.Item
                dot={getDotInput(TrainingStarted)}
                color={getColorInput(TrainingStarted)}
                label= { (TrainingStarted === DashboardStatus.Complete) ? <Tag color="green">
                {timeStarted} 
              </Tag> : <Tag color="red">
                Incomplete
              </Tag> } 
              >
                Training Started 
              </Timeline.Item>
              <Timeline.Item
                dot={getDotInput(TrainingComplete)}
                color={getColorInput(TrainingComplete)}
                label= { (TrainingComplete === DashboardStatus.Complete) ? <Tag color="green">
                {timeStarted} 
              </Tag> : <Tag color="red">
                Incomplete
              </Tag>} 
              >
                Training Completed
              </Timeline.Item>
              <Timeline.Item
                dot={getDotInput(ModelsDeployed )}
                color={getColorInput(ModelsDeployed )}
                label={ (ModelsDeployed === DashboardStatus.Complete) ? <Tag color="green">
                {timeStarted} 
              </Tag> : <Tag color="red">
                Incomplete
              </Tag> } 
              >
                Model ready for use 
              </Timeline.Item>
            </Timeline>
            </Card>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default observer(FileUpload);
