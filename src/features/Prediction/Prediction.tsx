import React, { useContext, useState } from "react";
import "./Prediction.css";
import { Row, Col, Typography } from "antd";
import UserInput from "../UserInput/UserInput";
import PredictionResult from "./PredictionResult";
import PredictionStore from "../../app/stores/prediction.store";
import { observer } from "mobx-react-lite";

const { Title } = Typography;

const Prediction = () => {
  const { showResult, showForm } = useContext(PredictionStore);

  const [zeros, setZeros] = useState(false);

  const handleZeroValues = (value: boolean) => {
    setZeros(value);
  };

  return (
    <Row>
      {showForm && (
        <Col span={7}>
          <UserInput route={"/predict"} setCompareLoading={undefined} />
        </Col>
      )}

      <Col span={showForm ? 17 : 24} className="pre-parent">
        {showResult ? (
          <PredictionResult setZeros={handleZeroValues} />
        ) : zeros ? (
          <div className="prediction-title">
            <Title>No Sales</Title>
            <Title level={4}>
              No non zero sales data found for given input
            </Title>
          </div>
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
