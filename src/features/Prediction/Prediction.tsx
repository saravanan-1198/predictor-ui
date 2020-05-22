import React, { useContext } from "react";
import "./Prediction.css";
import { Row, Col, Typography } from "antd";
import { UserInput } from "../UserInput/UserInput";
import PredictionResult from "./PredictionResult";
import PredictionStore from "../../app/stores/prediction.store";
import { observer } from "mobx-react-lite";

const { Title } = Typography;

const Prediction = () => {
  const { showResult } = useContext(PredictionStore);

  return (
    <Row>
      <Col span={7}>
        <UserInput />
      </Col>
      <Col span={17}>
        {showResult ? (
          <PredictionResult />
        ) : (
          <div className="prediction-title">
            <Title>Prediction</Title>
            <Title level={4}>Make a prediction to view the results</Title>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default observer(Prediction);
