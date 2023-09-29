import React from "react";
import { Bar } from "react-chartjs-2";


const BarChart = ({ chartData }) => {
    const monthNames = [
        "Ocak",
        "Şubat",
        "Mart",
        "Nisan",
        "Mayıs",
        "Haziran",
        "Temmuz",
        "Ağustos",
        "Eylül",
        "Ekim",
        "Kasım",
        "Aralık",
    ];
  const data = {
    labels: chartData.labels.map((monthIndex) => monthNames[monthIndex - 1]), // Ay adlarını kullanın
    datasets: [
      {
        label: "Monthly Earnings",
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
          text: "Months",
        },
      },
      y: {
        title: {
          display: true,
          text: "Earnings",
        },
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
