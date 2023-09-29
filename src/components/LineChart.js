import React from "react";
import { Line } from "react-chartjs-2";

const LineChart = ({ chartData }) => {
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Monthly Earnings", // Y eksenine isim verildi
        data: chartData.datasets[0].data,
        backgroundColor: chartData.datasets[0].backgroundColor,
        borderColor: chartData.datasets[0].borderColor,
        borderWidth: chartData.datasets[0].borderWidth,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Months", // X eksenine isim verildi
        },
      },
      y: {
        title: {
          display: true,
          text: "Earnings", // Y eksenine isim verildi
        },
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
