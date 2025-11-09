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
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export default function ChartReal({ type = 'bar', labels = [], datasets = [], options = {} }) {
  const data = { labels, datasets };
  if (type === 'line') return <Line data={data} options={options} />;
  return <Bar data={data} options={options} />;
}
