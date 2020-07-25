import React, { useEffect, useState, useContext } from "react";
import "./Dashboard.css";
import {
  Typography,
  Row,
  Col,
  Statistic,
  Card,
  PageHeader,
  Button,
  Tooltip,
  Tag,
  List,
  Spin,
  message,
} from "antd";
import moment from "moment";
import { Services } from "../../app/api/agent";
import predictionStore from "../../app/stores/prediction.store";
import PredictionRevenue from "../Prediction/PredictionRevenue";
import {
  SearchOutlined,
  RightOutlined,
  InboxOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import dashboardStore from "../../app/stores/dashboard.store";
import download from "downloadjs";

const Dashboard: React.FC<RouteComponentProps> = ({ history }) => {
  const {
    setPredictionOutput,
    setTableLoading,
    setShowResult,
    totalQuantity,
    totalRevenue,
  } = useContext(predictionStore);

  const { setTmrData, setAccData, tmrData, accData, lastTraining } = useContext(
    dashboardStore
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const getNextDayPrediction = async () => {
      const nextday = moment(Date.now()).add(1, "day");
      const input = {
        criteria: 2,
        branch: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        category: [
          {
            super: "TOSAI",
            sub: [
              "Signature Tosai",
              "Economic Tosai",
              "Chilli Tosai",
              "Chilli Cheese Tosai",
              "Double Burst",
              "Triple Burst",
              "Masala Junction",
              "Schezwan Junction",
              "Special Combos",
              "Variety Junction",
              "Kaju Junction",
              "Make your Own Tosai",
              "Swiggy POP",
            ],
          },
          {
            super: "South Indian",
            sub: [
              "Classic Dosa",
              "Desi Combo Company",
              "Special Breakfast",
              "Breakfast",
              "Indian Bread",
              "Thali",
              "Briyani",
              "Soups",
              "South Indian Starters",
              "Rice/Noodles",
              "Swiggy POP",
              "Snacks",
            ],
          },
          {
            super: "Continental",
            sub: [
              "Soups",
              "Salads",
              "Continental Starters",
              "Italian Main Course",
              "Desi Combo Company",
              "Swiggy POP",
            ],
          },
          {
            super: "North Indian",
            sub: [
              "Soups",
              "Briyani",
              "Rice/Noodles",
              "Curries",
              "Thali",
              "Desi Combo Company",
              "Swiggy POP",
              "Breakfast",
            ],
          },
          {
            super: "Chinese",
            sub: [
              "Soups",
              "Chinese Starters",
              "Rice/Noodles",
              "Indian Bread",
              "Desi Combo Company",
            ],
          },
          {
            super: "Tandoori",
            sub: ["Tandoori Starters", "Indian Bread", "Curries"],
          },
          {
            super: "Halwai",
            sub: ["Desserts", "Ice Creams", "GMT Ice Creams", "Dessert"],
          },
          {
            super: "Drinks",
            sub: ["Juices", "Milkshakes", "Lassi", "Crushers", "Beverages"],
          },
          {
            super: "Snacks",
            sub: ["Snacks"],
          },
          {
            super: "Other",
            sub: ["Other"],
          },
        ],
        years: [
          // {
          //   year: nextday.year(),
          //   months: [
          //     {
          //       month: nextday.month() + 1,
          //       dates: [nextday.date()],
          //     },
          //   ],
          // },
          {
            year: 2020,
            months: [
              {
                month: 2,
                dates: [3],
              },
            ],
          },
        ],
      };
      try {
        const result = await Services.PredictionService.getPrediction(input);
        if (mounted) {
          setPredictionOutput(result);
          setTmrData(result);
        }
      } catch (error) {
        message.error("Unable to connect to server. Try again later.");
        if (mounted) setLoading(false);
      }
    };

    const getAccData = async () => {
      try {
        const result = await Services.PredictionService.getAccuracy();
        if (mounted) {
          setAccData(result);
        }
      } catch (error) {
        message.error("Unable to connect to server. Try again later.");
        if (mounted) setLoading(false);
      }
    };

    const getData = async () => {
      setLoading(true);
      if (!tmrData) {
        await getNextDayPrediction();
        if (!accData) {
          await getAccData();
        }
      } else {
        setPredictionOutput(tmrData);
      }
      setLoading(false);
    };

    getData();

    return () => {
      mounted = false;
    };
  }, []);

  const handleMoreClick = () => {
    setShowResult(true);
    history.push("/predict");
  };

  const handleAccMoreClick = () => {
    history.push("/accuracy");
  };

  return (
    <Spin spinning={loading}>
      <div className="dashboard container">
        <Card className="grid-item grid-item-1" style={{ textAlign: "center" }}>
          <PageHeader
            className="site-page-header"
            title="Tomorrow's Prediction"
            style={{ padding: 0 }}
            tags={<Tag color="blue">{new Date().toDateString()}</Tag>}
          />
          <div>
            <div className="statistics">
              <Statistic
                title="Quantity"
                suffix="Units"
                value={totalQuantity}
                className="stat-item"
              />

              <Statistic
                title="Revenue"
                prefix="₹"
                precision={2}
                value={totalRevenue}
                className="stat-item"
              />
            </div>
          </div>

          <Button
            type="primary"
            onClick={handleMoreClick}
            style={{ position: "absolute", bottom: 0, right: 0, margin: 20 }}
          >
            More
          </Button>
        </Card>
        <Card className="grid-item grid-item-2" style={{ padding: 0 }}>
          <div>
            <PageHeader
              className="site-page-header"
              title="Model"
              style={{ padding: 0 }}
              tags={
                <Tag color="blue">
                  Last Training - {new Date(lastTraining).toUTCString()}
                </Tag>
              }
            />
            <div className="statistics">
              <Statistic
                title="Accuracy"
                suffix="%"
                precision={2}
                value={
                  accData === undefined
                    ? Number.parseFloat("0.00")
                    : Number.parseFloat(accData.accuracy)
                }
                className="stat-item"
              />

              <Statistic
                title="Zeros"
                suffix="%"
                precision={2}
                value={
                  accData === undefined
                    ? Number.parseFloat("0.00")
                    : Number.parseFloat(accData.non_zeros)
                }
                className="stat-item"
              />
              <Statistic
                title="Non-Zeros"
                suffix="%"
                precision={2}
                value={
                  accData === undefined
                    ? Number.parseFloat("0.00")
                    : Number.parseFloat(accData.zeros)
                }
                className="stat-item"
              />
            </div>
            <Button
              type="primary"
              onClick={handleAccMoreClick}
              style={{ position: "absolute", bottom: 0, right: 0, margin: 20 }}
            >
              More
            </Button>
          </div>
        </Card>

        <Card className="grid-item grid-item-3" style={{ textAlign: "center" }}>
          <PageHeader
            className="site-page-header"
            title="Training"
            style={{ padding: 0 }}
            tags={<Tag color="blue">Completed</Tag>}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -40%)",
              width: "100%",
            }}
          >
            <CheckCircleOutlined
              style={{
                fontSize: 50,
                display: "block",
                color: "#38a1f7",
                marginBottom: 20,
              }}
            />
            <p style={{ fontSize: 16 }}>Last Upload - 25/06/2020</p>
          </div>
          <Button
            type="primary"
            style={{ position: "absolute", bottom: 0, right: 0, margin: 20 }}
          >
            Upload
          </Button>
        </Card>
      </div>
    </Spin>
  );
};

export default observer(Dashboard);
