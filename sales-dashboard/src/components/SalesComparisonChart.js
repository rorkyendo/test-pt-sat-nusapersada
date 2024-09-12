import React, { useState, useEffect, useRef } from 'react';
import { DatePicker, Button } from 'antd';
import { Chart, registerables } from 'chart.js';
import { salesChart } from '../redux/actions/saleActions'
import moment from 'moment';
import '../styles/SalesComparisonChart.css';

Chart.register(...registerables);

const SalesComparisonChart = () => {
  const [dateRange, setDateRange] = useState([moment().startOf('month'), moment()]);
  const [chartData, setChartData] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    fetchChartData(); // Fetch data on initial render

    return () => {
      // Cleanup chart on unmount
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    // Destroy old chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (chartData.length) {
      const ctx = chartRef.current.getContext('2d');

      const labels = chartData.map(item => moment(item.SALE_DATE).format('YYYY-MM-DD'));
      const dataset = {
        label: 'Total Sales',
        data: chartData.map(item => item.TOTAL_PRICE),
        borderColor: getRandomColor(), // Helper function for random colors
        borderWidth: 2,
        fill: false,
      };

      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [dataset],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Date'
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Total Sales'
              }
            },
          },
        },
      });
    }
  }, [chartData]);

  const fetchChartData = async () => {
    try {
      const date_start = dateRange[0]?.format('YYYY-MM-DD');
      const date_end = dateRange[1]?.format('YYYY-MM-DD');
      const response = await salesChart(date_start,date_end)
      if (response && Array.isArray(response.data)) {
        setChartData(response.data);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  return (
    <div className="chart-container">
      <DatePicker.RangePicker
        format="YYYY-MM-DD"
        onChange={handleDateChange}
        defaultValue={dateRange} // Set default value
      />
      <Button onClick={fetchChartData} type="primary" style={{ margin: '16px 0', marginLeft: '10px' }}>
        Update Chart
      </Button>
      <canvas ref={chartRef} />
    </div>
  );
};

// Helper function to generate random color for datasets
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default SalesComparisonChart;
