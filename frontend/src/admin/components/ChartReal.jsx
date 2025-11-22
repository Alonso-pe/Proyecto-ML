// frontend/src/admin/components/ChartReal.jsx

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
// 1. Importamos el plugin para los NÚMEROS SOBRE LAS BARRAS
import ChartDataLabels from 'chartjs-plugin-datalabels'; 
import { Bar, Line } from 'react-chartjs-2';

// 2. Registramos el plugin
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
  
  // Opciones de estilo por defecto para TODOS los gráficos
  const defaultOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'hsl(var(--muted-foreground))', // Color de leyenda (ej: "Votos")
          font: { size: 14 }
        }
      },
      
      // --- ARREGLO PARA EL HOVER (Tooltip) ---
      tooltip: {
        enabled: true,
        backgroundColor: 'hsl(var(--card))', // Fondo oscuro (como tus tarjetas)
        titleColor: 'hsl(var(--primary))',   // ¡TÍTULO EN ROJO!
        bodyColor: 'hsl(var(--foreground))', // Texto del cuerpo en blanco
        borderColor: 'hsl(var(--border))',   // Borde sutil
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        // EL BLOQUE 'callbacks' HA SIDO ELIMINADO.
        // Esto permite que el cuadradito de color use el color de la barra (rojo)
        // y el texto use los 'titleColor' y 'bodyColor' que definimos arriba.
      },
      // --- FIN DEL ARREGLO DE HOVER ---

      // --- CONFIGURACIÓN PARA NÚMEROS NOTABLES ---
      datalabels: {
        display: true, // Mostrar por defecto
        color: 'hsl(var(--foreground))', // Color blanco (notable)
        anchor: 'end', // Ponerla al final (arriba) de la barra
        align: 'end', // Alinearla al final de la barra
        offset: -4, // Un pequeño espacio hacia abajo
        font: {
          weight: 'bold', // En negrita
          size: 12,
        },
        // Formato con comas (1500 -> 1,500)
        formatter: (value) => {
          if (typeof value === 'number') {
            return value.toLocaleString();
          }
          return value;
        },
      }
    },
    // --- ARREGLO PARA LETRAS DE EJES ---
    scales: {
      y: {
        ticks: { 
          color: 'hsl(var(--muted-foreground))', // LETRAS DEL EJE Y (Claras)
          beginAtZero: true 
        },
        grid: { color: 'hsla(var(--border), 0.3)' } // Líneas de cuadrícula sutiles
      },
      x: {
        ticks: { color: 'hsl(var(--muted-foreground))' }, // LETRAS DEL EJE X (Claras)
        grid: { color: 'hsla(var(--border), 0.3)' }
      }
    }
    // --- FIN ARREGLO LETRAS DE EJES ---
  };

  // Hacemos un "deep merge" de las opciones (para que las de Dashboard.jsx funcionen)
  const finalOptions = { 
    ...defaultOptions, 
    ...options,
    plugins: { ...defaultOptions.plugins, ...options.plugins },
    scales: { ...defaultOptions.scales, ...options.scales },
  };

  if (type === 'line') return <Line data={data} options={finalOptions} />;
  return <Bar data={data} options={finalOptions} />;
}