import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js'; // Import and register required components
import '../styles/SalesComparisonChart.css';

// Register Chart.js components
Chart.register(...registerables);

const SalesComparisonChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    const salesChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['1', '2', '3', '4', '5', '6'],
        datasets: [
          {
            label: '16 July 2024',
            data: [150, 200, 250, 300, 250, 200],
            borderColor: 'orange',
            borderWidth: 2,
          },
          {
            label: '17 July 2024',
            data: [200, 250, 300, 200, 250, 300],
            borderColor: 'blue',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (salesChart) {
        salesChart.destroy();
      }
    };
  }, []);

  return (
    <div className="chart-container">
      <canvas ref={chartRef} />
    </div>
  );
};

export default SalesComparisonChart;
