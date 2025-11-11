import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement // Added for Pie/Doughnut charts
} from 'chart.js';

// Register all necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Helper function to generate random colors for the pie chart
const getRandomColor = () => `rgba(${Math.floor(Math.random() * 200) + 55}, ${Math.floor(Math.random() * 200) + 55}, ${Math.floor(Math.random() * 200) + 55}, 0.6)`;

const QueryChart = ({ type, data, xKey, yKey }) => {
    
    // NEW: Check if the user has selected columns for the chart
    if (!xKey || !yKey) {
        return <div className="p-4 text-center text-slate-500">Please select a Label (Text) and Value (Number) column from the Chart Settings above to render the chart.</div>;
    }

    const labels = data.map(row => row[xKey]);
    
    const chartData = {
        labels: labels,
        datasets: [{
            label: `${yKey} by ${xKey}`,
            data: data.map(row => row[yKey]),
            backgroundColor: (type === 'pie') 
                ? labels.map(() => getRandomColor()) // Array of colors for pie
                : 'rgba(59, 130, 246, 0.5)', // Single color for bar
            borderColor: (type === 'pie')
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false, // Allows chart to fill container
        plugins: {
            legend: { 
                position: (type === 'pie') ? 'right' : 'top',
            },
            title: { 
                display: true, 
                text: `Query Result: ${yKey} by ${xKey}` 
            },
        },
    };

    if (type === 'pie') {
        return <Pie options={options} data={chartData} />;
    }
    
    // Default to Bar chart
    return <Bar options={options} data={chartData} />;
};

export default QueryChart;
