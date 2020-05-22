import React, { useEffect, useContext } from "react";
import { Line } from "@antv/g2plot";
import PredictionStore from "../../app/stores/prediction.store";
import { observer } from "mobx-react-lite";

const PredictionRevenue = () => {
  const { lineData, setLinePlot, linePlot } = useContext(PredictionStore);

  useEffect(() => {
    if (linePlot === null) {
      const line = new Line(document.getElementById("linePlot")!, {
        data: lineData,
        xField: "year",
        yField: "sales",
        animation: true,
        title: {
          text: "Sales Vs Year (Jan to Dec 2019)",
          visible: true,
          alignTo: "middle",
        },
      });

      line.render();
      setLinePlot(line);
    } else {
      linePlot.destroy();
      const line = new Line(document.getElementById("linePlot")!, {
        data: lineData,
        xField: "year",
        yField: "sales",
        animation: true,
        title: {
          text: "Sales Vs Year (Jan to Dec 2019)",
          visible: true,
          alignTo: "middle",
        },
      });

      line.render();
      setLinePlot(line);
    }
  }, [lineData, setLinePlot]);

  return <div id="linePlot"></div>;
};

export default observer(PredictionRevenue);
