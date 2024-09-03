import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, RectangleElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

// Register the components of Chart.js
ChartJS.register(
  LineElement,
  PointElement,
  RectangleElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Analytics = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Sample Data',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Sample Data 2',
        data: [],
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      }
    ]
  });

  useEffect(() => {
    // Simulate fetching data
    const fetchData = () => {
      // Example data
      const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
      const data1 = [65, 59, 80, 81, 56, 55, 40];
      const data2 = [28, 48, 40, 19, 86, 27, 90];
      setData({
        labels,
        datasets: [
          {
            label: 'Dataset 1',
            data: data1,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
          },
          {
            label: 'Dataset 2',
            data: data2,
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            fill: true,
          }
        ]
      });
    };

    fetchData();
  }, []);

  return (
    <div className="analytics">
      <h2>Dashboard Analytics</h2>
      <div className="charts">
        <div className="chart-container">
          <h3>Line Chart</h3>
          <Line data={data} />
        </div>
        <div className="chart-container">
          <h3>Bar Chart</h3>
          <Bar data={data} />
        </div>
      </div>
      <style jsx>{`
        .analytics {
          padding: 20px;
          background: #f9f9f9;
        }
        .charts {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .chart-container {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        h2 {
          margin-bottom: 20px;
        }
        h3 {
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default Analytics;
