import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; 
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler,
  ChartDataLabels 
);

export default function ChartReal({ type = 'bar', labels = [], datasets = [], options = {} }) {
  const data = { labels, datasets };
  
  const defaultOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8',
          font: { size: 12, family: "'Inter', sans-serif" }
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 4,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 }
      },
      datalabels: {
        display: false, // Por defecto ocultamos los números para limpieza
        color: '#fff',
        anchor: 'end',
        align: 'end',
        offset: -4,
        font: { weight: 'bold', size: 11 }
      }
    },
    scales: {
      y: {
        ticks: { color: '#64748b', font: { size: 10 } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        border: { display: false }
      },
      x: {
        ticks: { color: '#64748b', font: { size: 10 } },
        grid: { display: false },
        border: { display: false }
      }
    }
  };

  const finalOptions = { 
    ...defaultOptions, 
    ...options,
    plugins: { 
      ...defaultOptions.plugins, 
      ...options.plugins,
      datalabels: { ...defaultOptions.plugins.datalabels, ...(options.plugins?.datalabels || {}) }
    },
    scales: { 
      ...defaultOptions.scales, 
      ...options.scales 
    },
  };

  if (type === 'line') return <Line data={data} options={finalOptions} />;
  return <Bar data={data} options={finalOptions} />;
}