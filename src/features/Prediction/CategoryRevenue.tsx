import React, { useEffect, useContext } from "react";
import { Pie } from "@antv/g2plot";
import PredictionStore from "../../app/stores/prediction.store";

export const CategoryRevenue = () => {
  const { pieData, setPiePlot, piePlot } = useContext(PredictionStore);

  useEffect(() => {
    if (piePlot === null) {
      const pie = new Pie(document.getElementById("piePlot")!, {
        forceFit: true,
        title: {
          visible: true,
          text: "Revenue on each category",
          alignTo: "middle",
        },
        radius: 0.8,
        data: pieData,
        animation: true,
        angleField: "value",
        colorField: "type",
        label: {
          visible: true,
          type: "outer",
        },
      });

      pie.render();
      setPiePlot(pie);
    } else {
      piePlot.destroy();
      const pie = new Pie(document.getElementById("piePlot")!, {
        forceFit: true,
        title: {
          visible: true,
          text: "Revenue on each category",
          alignTo: "middle",
        },
        radius: 0.8,
        data: pieData,
        animation: true,
        angleField: "value",
        colorField: "type",
        label: {
          visible: true,
          type: "outer",
        },
      });

      pie.render();
      setPiePlot(pie);
    }
  }, [pieData, setPiePlot]);

  return <div id="piePlot"></div>;
};
