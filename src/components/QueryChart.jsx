// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const QueryChart = ({ data }) => {
//     // Heuristic to find the best columns for a chart
//     // Label: The first column with string data
//     // Data: The first column with numeric data
//     const headers = Object.keys(data[0]);
//     const labelKey = headers.find(h => typeof data[0][h] === 'string');
//     const dataKey = headers.find(h => typeof data[0][h] === 'number');

//     if (!labelKey || !dataKey) {
//         return <div className="p-4 text-center text-slate-500">Could not determine appropriate data for a chart.</div>;
//     }

//     const chartData = {
//         labels: data.map(row => row[labelKey]),
//         datasets: [{
//             label: `${dataKey} by ${labelKey}`,
//             data: data.map(row => row[dataKey]),
//             backgroundColor: 'rgba(59, 130, 246, 0.5)',
//             borderColor: 'rgba(59, 130, 246, 1)',
//             borderWidth: 1,
//         }]
//     };
    
//     const options = {
//         responsive: true,
//         plugins: {
//             legend: { position: 'top' },
//             title: { display: true, text: 'Query Result Visualization' },
//         },
//     };

//     return (
//         <div className="p-4">
//             <Bar options={options} data={chartData} />
//         </div>
//     );
// };

// export default QueryChart;

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

const QueryChart = ({ type, data }) => {
    // Heuristic (rule of thumb) to find the best columns for a chart
    // Label: The first column found that contains string data.
    // Data: The first column found that contains numeric data.
    const headers = Object.keys(data[0]);
    const labelKey = headers.find(h => typeof data[0][h] === 'string');
    const dataKey = headers.find(h => typeof data[0][h] === 'number');

    if (!labelKey || !dataKey) {
        return <div className="p-4 text-center text-slate-500">Could not determine appropriate data for a chart. Requires at least one text column (for labels) and one number column (for values).</div>;
    }

    const labels = data.map(row => row[labelKey]);
    
    const chartData = {
        labels: labels,
        datasets: [{
            label: `${dataKey} by ${labelKey}`,
            data: data.map(row => row[dataKey]),
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
                text: `Query Result: ${dataKey} by ${labelKey}` 
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