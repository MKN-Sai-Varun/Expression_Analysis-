import React from "react";
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function Pie({ emotions }) {
  const arr1 = [];
  const arr2 = [];
  const arr3 = [];

  emotions.forEach((data) => {
    // Add emoji beside the label
    if (data.label === "angry") {
      arr1.push("angry 😠");
      arr3.push("red");
    } else if (data.label === "sad") {
      arr1.push("sad 😢");
      arr3.push("blue");
    } else if (data.label === "happy") {
      arr1.push("happy 😊");
      arr3.push("#2bca4e");
    } else if (data.label === "surprise") {
      arr1.push("surprise 😲");
      arr3.push("yellow");
    } else if (data.label === "fear") {
      arr1.push("fear 😨");
      arr3.push("orange");
    } else if (data.label === "neutral") {
      arr1.push("neutral 😐");
      arr3.push("grey");
    } else if (data.label === "disgust") {
      arr1.push("disgust 🤢");
      arr3.push("green");
    }

    arr2.push(data.score);
  });

  let total = arr2.reduce((sum, element) => sum + element, 0);
  if (total < 1) {
    arr1.push("others ❓");
    arr2.push(1 - total);
    arr3.push("black");
  }

  const data = {
    labels: arr1,
    datasets: [
      {
        data: arr2,
        backgroundColor: arr3,
        hoverBackgroundColor: arr3,
      },
    ],
  };

  const options = {
    cutout: '50%',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 16, // Increase font size
          },
          color: '#fff', // Set text color to white
        },
      },
      tooltip: {
        bodyFont: {
          size: 14, // Increase font size for tooltip
        },
        callbacks: {
          labelTextColor: () => '#fff', // Set tooltip text color to white
        },
      },
    },
  };
  

  return <Doughnut data={data} options={options} />;
}

export default Pie;