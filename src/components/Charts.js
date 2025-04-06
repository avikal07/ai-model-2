import React from "react";
import { Pie } from "react-chartjs-2";

const Charts = ({ allocation }) => {
  if (!allocation) return null;

  const data = {
    labels: Object.keys(allocation),
    datasets: [
      {
        data: Object.values(allocation),
        backgroundColor: ["#4CAF50", "#FF9800", "#2196F3", "#FF5722", "#9C27B0"],
      },
    ],
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-3">Allocation Chart</h2>
      <Pie data={data} />
    </div>
  );
};

export default Charts;
