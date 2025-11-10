// frontend/src/admin/components/PeruMap.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Función para asignar color. ¡Usamos tu tema ROJO!
// Mapea la participación (30-90) a la luminosidad de tu color primario
const getColor = (value) => {
  if (!value) return 'fill-muted/20'; // Color base si no hay datos
  
  // HSL(349, 75%, L%)
  // Mapeamos el valor (ej: 40% a 90%) a un rango de luminosidad (ej: 20% a 50%)
  const lightness = (value - 30) * (35 / 60) + 20;
  return `fill-[hsl(var(--primary-h,349),var(--primary-s,75%),${lightness}%)]`;
};

// Tooltip flotante
const Tooltip = ({ tooltip }) => {
  if (!tooltip) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-0 left-0 -translate-y-full rounded-md bg-card border border-border p-3 text-sm z-10 shadow-lg pointer-events-none"
    >
      <div className="font-bold text-white">{tooltip.name}</div>
      <div className="text-muted-foreground">Participación: <span className="text-primary font-bold">{tooltip.value}%</span></div>
    </motion.div>
  );
};

// Componente del Mapa SVG (100% funcional sin internet)
export default function PeruMap({ data }) {
  const [tooltip, setTooltip] = useState(null);

  // Mapeamos los datos de dataUtils.js a los departamentos
  const departmentData = {
    'PE-LMA': { name: 'Lima', value: data['PE-LMA'] },
    'PE-CUS': { name: 'Cusco', value: data['PE-CUS'] },
    'PE-ARE': { name: 'Arequipa', value: data['PE-ARE'] },
    'PE-PIU': { name: 'Piura', value: data['PE-PIU'] },
    'PE-LOR': { name: 'Loreto', value: data['PE-LOR'] },
    'PE-PUN': { name: 'Puno', value: data['PE-PUN'] },
    'PE-JUN': { name: 'Junín', value: data['PE-JUN'] },
    'PE-CAL': { name: 'Callao', value: data['PE-CAL'] },
    // Añadimos los demás para que no se vean vacíos
    'PE-LAL': { name: 'La Libertad', value: data['PE-LAL'] },
    'PE-CAJ': { name: 'Cajamarca', value: data['PE-CAJ'] },
    'PE-ANC': { name: 'Ancash', value: data['PE-ANC'] },
    'PE-AYA': { name: 'Ayacucho', value: data['PE-AYA'] },
  };

  const handleMouseEnter = (id) => {
    if (departmentData[id]) {
      setTooltip(departmentData[id]);
    }
  };
  
  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <div className="relative" onMouseLeave={handleMouseLeave}>
      <Tooltip tooltip={tooltip} />
      
      <motion.svg
        viewBox="0 0 380 500" // Ajustado para un mejor encuadre
        className="w-full h-full"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.05 } }
        }}
      >
        <g stroke="hsl(var(--background))" strokeWidth="1.5">
          {/* Este es un mapa SVG simplificado de Perú. Cada 'path' es un departamento. */}
          {/* Loreto (PE-LOR) */}
          <motion.path
            d="M233.1 3.5l-37.6 28.2-16.7 34.6-26.1 26.1-23.9 14.5-16.7 20.3-2.2 41.3 12.3 22.5-12.3 32.4 13.4 20.3 22.8 19.1 28.2 11.2 33.5 13.4 39.1 2.2 44.7-19.1 11.2-22.5H356l-10.1-43.6-14.5-31.3-30.2-39.1-13.4-29.3-15.6-29.3-8.9-34.6-37.1-26Z"
            className={`${departmentData['PE-LOR'] ? getColor(departmentData['PE-LOR'].value) : 'fill-muted/20'} transition-all hover:fill-primary/80`}
            onMouseEnter={() => handleMouseEnter('PE-LOR')}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          />
          {/* Piura (PE-PIU) */}
          <motion.path
            d="M109.5 58.2l-14.5 13.4-16.7 39.1-20.3-1.1-10.1-13.4-13.4-11.2L20.9 66l-1.1-17.9 13.4-14.5 24.9-20.3 15.6 1.1 23.9 14.5 14.5 13.4Z"
            className={`${departmentData['PE-PIU'] ? getColor(departmentData['PE-PIU'].value) : 'fill-muted/20'} transition-all hover:fill-primary/80`}
            onMouseEnter={() => handleMouseEnter('PE-PIU')}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          />
          {/* Arequipa (PE-ARE) */}
          <motion.path
            d="M107.3 355.6l-14.5 28.2-22.5 19-33.5 16.8-17.9-10.1-20.3-29.3-4.5-23.7 13.4-19.1 10.1-19.1 12.3-32.4 20.3-13.4 12.3-10.1 24.9-1.1 14.5 10.1 20.3 16.8 24.9 13.4Z"
            className={`${departmentData['PE-ARE'] ? getColor(departmentData['PE-ARE'].value) : 'fill-muted/20'} transition-all hover:fill-primary/80`}
            onMouseEnter={() => handleMouseEnter('PE-ARE')}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          />
          {/* Cusco (PE-CUS) */}
          <motion.path
            d="M123.9 290.4l-12.3 32.4 10.1 19.1 13.4 19.1-4.5 23.7-20.3 29.3-7.8-3.4-19-33.5-31.3-20.3-2.2-24.9 20.3-13.4 12.3-10.1 24.9-1.1 14.5 10.1Z"
            className={`${departmentData['PE-CUS'] ? getColor(departmentData['PE-CUS'].value) : 'fill-muted/20'} transition-all hover:fill-primary/80`}
            onMouseEnter={() => handleMouseEnter('PE-CUS')}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          />
          {/* Puno (PE-PUN) */}
          <motion.path
            d="M130.8 322.9l-13.4-19.1-10.1-19.1 12.3-32.4-1.1-5.6-11.2-12.3 2.2-12.3 19-15.6 24.9 13.4 20.3 16.8 14.5 10.1 24.9-1.1 12.3 10.1 10.1 19.1 4.5 23.7-13.4 19.1-10.1 19.1-22.5 19Z"
            className={`${departmentData['PE-PUN'] ? getColor(departmentData['PE-PUN'].value) : 'fill-muted/20'} transition-all hover:fill-primary/80`}
            onMouseEnter={() => handleMouseEnter('PE-PUN')}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          />
          {/* Lima (PE-LMA) */}
          <motion.path
            d="M103.9 194.8l-12.3 22.5 2.2 41.3-16.7 20.3-12.3-10.1-20.3-13.4 2.2-24.9-11.2-23.7-21.5-20.3-13.4-38-1.1-22.5 13.4-19.1 11.2-20.3 20.3-1.1 16.7 39.1 14.5 13.4 22.5 15.6Z"
            className={`${departmentData['PE-LMA'] ? getColor(departmentData['PE-LMA'].value) : 'fill-muted/20'} transition-all hover:fill-primary/80`}
            onMouseEnter={() => handleMouseEnter('PE-LMA')}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          />
          {/* Junín (PE-JUN) */}
          <motion.path
            d="M123.9 290.4l14.5-10.1 24.9-1.1 12.3-10.1 11.2-12.3 1.1-5.6-12.3-32.4-20.3-13.4-24.9-1.1-14.5-10.1-12.3 10.1 2.2 12.3-19 15.6-2.2 12.3 11.2 12.3 1.1 5.6Z"
            className={`${departmentData['PE-JUN'] ? getColor(departmentData['PE-JUN'].value) : 'fill-muted/20'} transition-all hover:fill-primary/80`}
            onMouseEnter={() => handleMouseEnter('PE-JUN')}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          />
           {/* Callao (PE-CAL) - Pequeño, cerca de Lima */}
          <motion.path
            d="M74.9 172.3l-5 -2l-2 5l3 4l4 -3Z"
            className={`${departmentData['PE-CAL'] ? getColor(departmentData['PE-CAL'].value) : 'fill-muted/20'} transition-all hover:fill-primary/80`}
            onMouseEnter={() => handleMouseEnter('PE-CAL')}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          />
          {/* La Libertad (PE-LAL) */}
          <motion.path
            d="M109.5 110.7l-11.2 20.3-13.4 19.1-1.1 22.5 1.1 20.3-22.5-15.6-14.5-13.4-16.7-39.1 10.1-13.4 16.7-39.1 14.5 13.4 20.3 1.1Z"
            className={`${departmentData['PE-LAL'] ? getColor(departmentData['PE-LAL'].value) : 'fill-muted/20'} transition-all hover:fill-primary/80`}
            onMouseEnter={() => handleMouseEnter('PE-LAL')}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          />
          {/* Cajamarca (PE-CAJ) */}
          <motion.path
            d="M123.9 92.8l-14.5-13.4-23.9-14.5-15.6-1.1-10.1 13.4 16.7 39.1 10.1 13.4 20.3 1.1 11.2-20.3 13.4-19.1Z"
            className={`${departmentData['PE-CAJ'] ? getColor(departmentData['PE-CAJ'].value) : 'fill-muted/20'} transition-all hover:fill-primary/80`}
            onMouseEnter={() => handleMouseEnter('PE-CAJ')}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          />
          {/* Ancash (PE-ANC) */}
          <motion.path
            d="M116.2 131l-11.2 20.3-13.4 19.1-1.1 22.5 1.1 20.3-11.2-7-10.1-13.4 13.4-19.1 11.2-20.3 20.3-1.1 16.7 39.1 12.3-11.2 1.1-23.7-10.1-20.3-12.3-11.2Z"
            className={`${departmentData['PE-ANC'] ? getColor(departmentData['PE-ANC'].value) : 'fill-muted/20'} transition-all hover:fill-primary/80`}
            onMouseEnter={() => handleMouseEnter('PE-ANC')}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          />
          {/* Ayacucho (PE-AYA) */}
          <motion.path
            d="M107.3 278.1l-24.9 1.1-12.3 10.1-20.3 13.4 2.2 24.9-31.3-20.3-19-33.5-7.8-3.4 19 33.5 7.8 3.4-1.1-20.3-10.1-22.5 11.2-23.7 2.2-24.9 20.3-13.4 12.3-10.1Z"
            className={`${departmentData['PE-AYA'] ? getColor(departmentData['PE-AYA'].value) : 'fill-muted/20'} transition-all hover:fill-primary/80`}
            onMouseEnter={() => handleMouseEnter('PE-AYA')}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          />
        </g>
      </motion.svg>
    </div>
  );
}