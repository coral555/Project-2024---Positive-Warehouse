import React from 'react';
import { Pie } from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js'
Chart.register(ArcElement);

const Charts = ({ info }) => {
  // Extract labels (item names) and data (quantities) from info prop
  const labels = info.map(item => item[0]); // Extract item names
  const data = info.map(item => item[1]);   // Extract quantities

  // Function to generate random colors
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Generate random colors for each data point
  const backgroundColors = data.map(() => getRandomColor());

  console.log(info);

  // Define data for the pie chart
  const chartData = {
    labels: labels,
    datasets: [{
      data: data,
      backgroundColor: backgroundColors,
      hoverBackgroundColor: backgroundColors // Use same colors for hover effect
    }]
  };

  console.log(chartData);

  return (
    <div style={{width:'100%', height:'100%'}}>
      <h2>גרף עוגה</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default Charts;
