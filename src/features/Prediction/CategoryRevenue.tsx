import React, { useEffect, useContext } from "react";
import { Pie } from "@antv/g2plot";
import PredictionStore from "../../app/stores/prediction.store";
import { Row, Col } from "antd";

export const CategoryRevenue = () => {
  const {
    pieDataQuantity,
    pieDataRevenue,
    setPiePlotQuantity,
    setPiePlotRevenue,
    piePlotQuantity,
    piePlotRevenue,
  } = useContext(PredictionStore);

  const quantityTitle = "Items sold in each Category (Units)";
  const revenueTitle = "Revenue in each category (₹)";

  useEffect(() => {
    if (piePlotQuantity === null && piePlotRevenue === null) {
      const pieQ = new Pie(document.getElementById("piePlotQuantity")!, {
        forceFit: true,
        title: {
          visible: true,
          text: quantityTitle,
          alignTo: "middle",
        },
        radius: 0.8,
        data: pieDataQuantity,
        animation: true,
        angleField: "value",
        colorField: "type",
        label: {
          visible: true,
          type: "outer",
        },
      });

      const pieR = new Pie(document.getElementById("piePlotRevenue")!, {
        forceFit: true,
        title: {
          visible: true,
          text: revenueTitle,
          alignTo: "middle",
        },
        radius: 0.8,
        data: pieDataRevenue,
        animation: true,
        angleField: "value",
        colorField: "type",
        label: {
          visible: true,
          type: "outer",
        },
      });

      pieQ.render();
      pieR.render();

      setPiePlotQuantity(pieQ);
      setPiePlotRevenue(pieR);
    } else {
      piePlotQuantity!.destroy();
      piePlotRevenue!.destroy();

      const pieQ = new Pie(document.getElementById("piePlotQuantity")!, {
        forceFit: true,
        title: {
          visible: true,
          text: quantityTitle,
          alignTo: "middle",
        },
        radius: 0.8,
        data: pieDataQuantity,
        animation: true,
        angleField: "value",
        colorField: "type",
        label: {
          visible: true,
          type: "outer",
        },
      });

      const pieR = new Pie(document.getElementById("piePlotRevenue")!, {
        forceFit: true,
        title: {
          visible: true,
          text: revenueTitle,
          alignTo: "middle",
        },
        radius: 0.8,
        data: pieDataRevenue,
        animation: true,
        angleField: "value",
        colorField: "type",
        label: {
          visible: true,
          type: "outer",
        },
      });

      pieQ.render();
      pieR.render();

      setPiePlotQuantity(pieQ);
      setPiePlotRevenue(pieR);
    }
  }, [pieDataQuantity, pieDataRevenue, setPiePlotQuantity, setPiePlotRevenue]);

  return (
    <Row>
      <Col span={12}>
        <div id="piePlotQuantity"></div>
      </Col>
      <Col span={12}>
        <div id="piePlotRevenue"></div>
      </Col>
    </Row>
  );
};
