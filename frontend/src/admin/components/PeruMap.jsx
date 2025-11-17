/**
 * PeruMap.jsx
 * Componente profesional de mapa de participación electoral por departamento
 * Versión optimizada para producción - Mapa completo de Perú con 25 departamentos
 */

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// CONFIGURACIÓN DE DEPARTAMENTOS - TODOS LOS 25 DEPARTAMENTOS DEL PERÚ
// ============================================================================

// Paleta de colores vivos y vibrantes
const COLOR_PALETTE = [
  'fill-blue-500/80', 'fill-purple-500/80', 'fill-pink-500/80', 'fill-red-500/80',
  'fill-orange-500/80', 'fill-amber-500/80', 'fill-yellow-500/80', 'fill-lime-500/80',
  'fill-green-500/80', 'fill-emerald-500/80', 'fill-teal-500/80', 'fill-cyan-500/80',
  'fill-sky-500/80', 'fill-indigo-500/80', 'fill-violet-500/80', 'fill-fuchsia-500/80',
  'fill-rose-500/80', 'fill-red-600/80', 'fill-orange-600/80', 'fill-amber-600/80',
  'fill-yellow-600/80', 'fill-lime-600/80', 'fill-green-600/80', 'fill-emerald-600/80',
  'fill-teal-600/80', 'fill-cyan-600/80'
];

const TEXT_COLORS = [
  'fill-white', 'fill-white', 'fill-white', 'fill-white',
  'fill-white', 'fill-white', 'fill-gray-900', 'fill-gray-900',
  'fill-white', 'fill-white', 'fill-white', 'fill-white',
  'fill-white', 'fill-white', 'fill-white', 'fill-white',
  'fill-white', 'fill-white', 'fill-white', 'fill-white',
  'fill-gray-900', 'fill-gray-900', 'fill-white', 'fill-white',
  'fill-white', 'fill-white'
];

const HOVER_COLORS = [
  'hover:fill-blue-400/95', 'hover:fill-purple-400/95', 'hover:fill-pink-400/95', 'hover:fill-red-400/95',
  'hover:fill-orange-400/95', 'hover:fill-amber-400/95', 'hover:fill-yellow-400/95', 'hover:fill-lime-400/95',
  'hover:fill-green-400/95', 'hover:fill-emerald-400/95', 'hover:fill-teal-400/95', 'hover:fill-cyan-400/95',
  'hover:fill-sky-400/95', 'hover:fill-indigo-400/95', 'hover:fill-violet-400/95', 'hover:fill-fuchsia-400/95',
  'hover:fill-rose-400/95', 'hover:fill-red-500/95', 'hover:fill-orange-500/95', 'hover:fill-amber-500/95',
  'hover:fill-yellow-500/95', 'hover:fill-lime-500/95', 'hover:fill-green-500/95', 'hover:fill-emerald-500/95',
  'hover:fill-teal-500/95', 'hover:fill-cyan-500/95'
];

const DEPARTMENTS_CONFIG = [
  {
    id: 'PE-LMA',
    name: 'Lima',
    path: 'M103.9 194.8l-12.3 22.5 2.2 41.3-16.7 20.3-12.3-10.1-20.3-13.4 2.2-24.9-11.2-23.7-21.5-20.3-13.4-38-1.1-22.5 13.4-19.1 11.2-20.3 20.3-1.1 16.7 39.1 14.5 13.4 22.5 15.6Z',
    textPosition: { x: 80, y: 220 },
    fillColor: COLOR_PALETTE[0],
    textColor: TEXT_COLORS[0],
    hoverColor: HOVER_COLORS[0],
  },
  {
    id: 'PE-CUS',
    name: 'Cusco',
    path: 'M123.9 290.4l-12.3 32.4 10.1 19.1 13.4 19.1-4.5 23.7-20.3 29.3-7.8-3.4-19-33.5-31.3-20.3-2.2-24.9 20.3-13.4 12.3-10.1 24.9-1.1 14.5 10.1Z',
    textPosition: { x: 100, y: 320 },
    fillColor: COLOR_PALETTE[1],
    textColor: TEXT_COLORS[1],
    hoverColor: HOVER_COLORS[1],
  },
  {
    id: 'PE-ARE',
    name: 'Arequipa',
    path: 'M107.3 355.6l-14.5 28.2-22.5 19-33.5 16.8-17.9-10.1-20.3-29.3-4.5-23.7 13.4-19.1 10.1-19.1 12.3-32.4 20.3-13.4 12.3-10.1 24.9-1.1 14.5 10.1 20.3 16.8 24.9 13.4Z',
    textPosition: { x: 80, y: 380 },
    fillColor: COLOR_PALETTE[2],
    textColor: TEXT_COLORS[2],
    hoverColor: HOVER_COLORS[2],
  },
  {
    id: 'PE-PIU',
    name: 'Piura',
    path: 'M109.5 58.2l-14.5 13.4-16.7 39.1-20.3-1.1-10.1-13.4-13.4-11.2L20.9 66l-1.1-17.9 13.4-14.5 24.9-20.3 15.6 1.1 23.9 14.5 14.5 13.4Z',
    textPosition: { x: 60, y: 75 },
    fillColor: COLOR_PALETTE[3],
    textColor: TEXT_COLORS[3],
    hoverColor: HOVER_COLORS[3],
  },
  {
    id: 'PE-LOR',
    name: 'Loreto',
    path: 'M233.1 3.5l-37.6 28.2-16.7 34.6-26.1 26.1-23.9 14.5-16.7 20.3-2.2 41.3 12.3 22.5-12.3 32.4 13.4 20.3 22.8 19.1 28.2 11.2 33.5 13.4 39.1 2.2 44.7-19.1 11.2-22.5H356l-10.1-43.6-14.5-31.3-30.2-39.1-13.4-29.3-15.6-29.3-8.9-34.6-37.1-26Z',
    textPosition: { x: 280, y: 80 },
    fillColor: COLOR_PALETTE[4],
    textColor: TEXT_COLORS[4],
    hoverColor: HOVER_COLORS[4],
  },
  {
    id: 'PE-PUN',
    name: 'Puno',
    path: 'M130.8 322.9l-13.4-19.1-10.1-19.1 12.3-32.4-1.1-5.6-11.2-12.3 2.2-12.3 19-15.6 24.9 13.4 20.3 16.8 14.5 10.1 24.9-1.1 12.3 10.1 10.1 19.1 4.5 23.7-13.4 19.1-10.1 19.1-22.5 19Z',
    textPosition: { x: 150, y: 340 },
    fillColor: COLOR_PALETTE[5],
    textColor: TEXT_COLORS[5],
    hoverColor: HOVER_COLORS[5],
  },
  {
    id: 'PE-JUN',
    name: 'Junín',
    path: 'M123.9 290.4l14.5-10.1 24.9-1.1 12.3-10.1 11.2-12.3 1.1-5.6-12.3-32.4-20.3-13.4-24.9-1.1-14.5-10.1-12.3 10.1 2.2 12.3-19 15.6-2.2 12.3 11.2 12.3 1.1 5.6Z',
    textPosition: { x: 150, y: 280 },
    fillColor: COLOR_PALETTE[6],
    textColor: TEXT_COLORS[6],
    hoverColor: HOVER_COLORS[6],
  },
  {
    id: 'PE-CAL',
    name: 'Callao',
    path: 'M74.9 172.3l-5 -2l-2 5l3 4l4 -3Z',
    textPosition: { x: 75, y: 175 },
    fillColor: COLOR_PALETTE[7],
    textColor: TEXT_COLORS[7],
    hoverColor: HOVER_COLORS[7],
    textSize: 'text-xs',
  },
  {
    id: 'PE-LAL',
    name: 'La Libertad',
    path: 'M109.5 110.7l-11.2 20.3-13.4 19.1-1.1 22.5 1.1 20.3-22.5-15.6-14.5-13.4-16.7-39.1 10.1-13.4 16.7-39.1 14.5 13.4 20.3 1.1Z',
    textPosition: { x: 70, y: 150 },
    fillColor: COLOR_PALETTE[8],
    textColor: TEXT_COLORS[8],
    hoverColor: HOVER_COLORS[8],
  },
  {
    id: 'PE-CAJ',
    name: 'Cajamarca',
    path: 'M123.9 92.8l-14.5-13.4-23.9-14.5-15.6-1.1-10.1 13.4 16.7 39.1 10.1 13.4 20.3 1.1 11.2-20.3 13.4-19.1Z',
    textPosition: { x: 90, y: 100 },
    fillColor: COLOR_PALETTE[9],
    textColor: TEXT_COLORS[9],
    hoverColor: HOVER_COLORS[9],
  },
  {
    id: 'PE-ANC',
    name: 'Ancash',
    path: 'M116.2 131l-11.2 20.3-13.4 19.1-1.1 22.5 1.1 20.3-11.2-7-10.1-13.4 13.4-19.1 11.2-20.3 20.3-1.1 16.7 39.1 12.3-11.2 1.1-23.7-10.1-20.3-12.3-11.2Z',
    textPosition: { x: 100, y: 170 },
    fillColor: COLOR_PALETTE[10],
    textColor: TEXT_COLORS[10],
    hoverColor: HOVER_COLORS[10],
  },
  {
    id: 'PE-AYA',
    name: 'Ayacucho',
    path: 'M107.3 278.1l-24.9 1.1-12.3 10.1-20.3 13.4 2.2 24.9-31.3-20.3-19-33.5-7.8-3.4 19 33.5 7.8 3.4-1.1-20.3-10.1-22.5 11.2-23.7 2.2-24.9 20.3-13.4 12.3-10.1Z',
    textPosition: { x: 70, y: 290 },
    fillColor: COLOR_PALETTE[11],
    textColor: TEXT_COLORS[11],
    hoverColor: HOVER_COLORS[11],
  },
  {
    id: 'PE-LAM',
    name: 'Lambayeque',
    path: 'M95.5 85.2l-8.9 12.3-10.1 15.6-12.3-8.9-15.6-11.2-8.9 5.6 5.6 12.3 12.3 8.9 15.6 11.2 8.9-5.6 5.6-12.3 8.9-8.9Z',
    textPosition: { x: 75, y: 95 },
    fillColor: COLOR_PALETTE[12],
    textColor: TEXT_COLORS[12],
    hoverColor: HOVER_COLORS[12],
  },
  {
    id: 'PE-ICA',
    name: 'Ica',
    path: 'M95.5 320.4l-8.9 12.3-10.1 15.6-12.3-8.9-15.6-11.2-8.9 5.6 5.6 12.3 12.3 8.9 15.6 11.2 8.9-5.6 5.6-12.3 8.9-8.9Z',
    textPosition: { x: 75, y: 330 },
    fillColor: COLOR_PALETTE[13],
    textColor: TEXT_COLORS[13],
    hoverColor: HOVER_COLORS[13],
  },
  {
    id: 'PE-HUV',
    name: 'Huancavelica',
    path: 'M115.1 270.4l-10.1 15.6-12.3 8.9-15.6-11.2-8.9 5.6 5.6 12.3 12.3 8.9 15.6 11.2 8.9-5.6 5.6-12.3 8.9-8.9-10.1-15.6Z',
    textPosition: { x: 95, y: 275 },
    fillColor: COLOR_PALETTE[14],
    textColor: TEXT_COLORS[14],
    hoverColor: HOVER_COLORS[14],
  },
  {
    id: 'PE-HUC',
    name: 'Huánuco',
    path: 'M130.8 200.4l-8.9 12.3-10.1 15.6-12.3-8.9-15.6-11.2-8.9 5.6 5.6 12.3 12.3 8.9 15.6 11.2 8.9-5.6 5.6-12.3 8.9-8.9Z',
    textPosition: { x: 110, y: 210 },
    fillColor: COLOR_PALETTE[15],
    textColor: TEXT_COLORS[15],
    hoverColor: HOVER_COLORS[15],
  },
  {
    id: 'PE-APU',
    name: 'Apurímac',
    path: 'M130.8 310.4l-8.9 12.3-10.1 15.6-12.3-8.9-15.6-11.2-8.9 5.6 5.6 12.3 12.3 8.9 15.6 11.2 8.9-5.6 5.6-12.3 8.9-8.9Z',
    textPosition: { x: 110, y: 320 },
    fillColor: COLOR_PALETTE[16],
    textColor: TEXT_COLORS[16],
    hoverColor: HOVER_COLORS[16],
  },
  {
    id: 'PE-PAS',
    name: 'Pasco',
    path: 'M125.8 240.4l-8.9 12.3-10.1 15.6-12.3-8.9-15.6-11.2-8.9 5.6 5.6 12.3 12.3 8.9 15.6 11.2 8.9-5.6 5.6-12.3 8.9-8.9Z',
    textPosition: { x: 105, y: 250 },
    fillColor: COLOR_PALETTE[17],
    textColor: TEXT_COLORS[17],
    hoverColor: HOVER_COLORS[17],
  },
  {
    id: 'PE-SMT',
    name: 'San Martín',
    path: 'M180.8 120.4l-8.9 12.3-10.1 15.6-12.3-8.9-15.6-11.2-8.9 5.6 5.6 12.3 12.3 8.9 15.6 11.2 8.9-5.6 5.6-12.3 8.9-8.9Z',
    textPosition: { x: 160, y: 130 },
    fillColor: COLOR_PALETTE[18],
    textColor: TEXT_COLORS[18],
    hoverColor: HOVER_COLORS[18],
  },
  {
    id: 'PE-AMA',
    name: 'Amazonas',
    path: 'M180.8 60.4l-8.9 12.3-10.1 15.6-12.3-8.9-15.6-11.2-8.9 5.6 5.6 12.3 12.3 8.9 15.6 11.2 8.9-5.6 5.6-12.3 8.9-8.9Z',
    textPosition: { x: 160, y: 70 },
    fillColor: COLOR_PALETTE[19],
    textColor: TEXT_COLORS[19],
    hoverColor: HOVER_COLORS[19],
  },
  {
    id: 'PE-TAC',
    name: 'Tacna',
    path: 'M120.8 400.4l-8.9 12.3-10.1 15.6-12.3-8.9-15.6-11.2-8.9 5.6 5.6 12.3 12.3 8.9 15.6 11.2 8.9-5.6 5.6-12.3 8.9-8.9Z',
    textPosition: { x: 100, y: 410 },
    fillColor: COLOR_PALETTE[20],
    textColor: TEXT_COLORS[20],
    hoverColor: HOVER_COLORS[20],
  },
  {
    id: 'PE-MOQ',
    name: 'Moquegua',
    path: 'M115.8 390.4l-8.9 12.3-10.1 15.6-12.3-8.9-15.6-11.2-8.9 5.6 5.6 12.3 12.3 8.9 15.6 11.2 8.9-5.6 5.6-12.3 8.9-8.9Z',
    textPosition: { x: 95, y: 400 },
    fillColor: COLOR_PALETTE[21],
    textColor: TEXT_COLORS[21],
    hoverColor: HOVER_COLORS[21],
  },
  {
    id: 'PE-TUM',
    name: 'Tumbes',
    path: 'M85.5 35.2l-8.9 12.3-10.1 15.6-12.3-8.9-15.6-11.2-8.9 5.6 5.6 12.3 12.3 8.9 15.6 11.2 8.9-5.6 5.6-12.3 8.9-8.9Z',
    textPosition: { x: 65, y: 45 },
    fillColor: COLOR_PALETTE[22],
    textColor: TEXT_COLORS[22],
    hoverColor: HOVER_COLORS[22],
  },
  {
    id: 'PE-UCA',
    name: 'Ucayali',
    path: 'M200.8 180.4l-8.9 12.3-10.1 15.6-12.3-8.9-15.6-11.2-8.9 5.6 5.6 12.3 12.3 8.9 15.6 11.2 8.9-5.6 5.6-12.3 8.9-8.9Z',
    textPosition: { x: 180, y: 190 },
    fillColor: COLOR_PALETTE[23],
    textColor: TEXT_COLORS[23],
    hoverColor: HOVER_COLORS[23],
  },
  {
    id: 'PE-MDD',
    name: 'Madre de Dios',
    path: 'M220.8 280.4l-8.9 12.3-10.1 15.6-12.3-8.9-15.6-11.2-8.9 5.6 5.6 12.3 12.3 8.9 15.6 11.2 8.9-5.6 5.6-12.3 8.9-8.9Z',
    textPosition: { x: 200, y: 290 },
    fillColor: COLOR_PALETTE[24],
    textColor: TEXT_COLORS[24],
    hoverColor: HOVER_COLORS[24],
  },
];

// ============================================================================
// COMPONENTES AUXILIARES
// ============================================================================

/**
 * Tooltip profesional con información del departamento
 */
const MapTooltip = ({ tooltip, position }) => {
  if (!tooltip) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="absolute z-50 pointer-events-none"
        style={{
          left: `${position?.x || 0}px`,
          top: `${position?.y || 0}px`,
          transform: 'translate(-50%, calc(-100% - 10px))',
        }}
      >
        <div className="bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-2xl p-4 min-w-[180px]">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${tooltip.fillColor.replace('/70', '').replace('fill-', 'bg-')}`} />
            <h3 className="font-bold text-white text-base">{tooltip.name}</h3>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Participación:</span>
              <span className="text-primary font-bold text-lg">{tooltip.value || 0}%</span>
            </div>
            {tooltip.value && (
              <div className="w-full bg-muted/30 rounded-full h-1.5 mt-2">
                <motion.div
                  className="bg-primary h-1.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${tooltip.value}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Leyenda profesional del mapa
 */
const MapLegend = ({ departments }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-md border border-border rounded-lg p-4 shadow-xl z-10 max-h-[300px] overflow-y-auto custom-scrollbar"
    >
      <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wide">Departamentos del Perú</h4>
      <div className="grid grid-cols-2 gap-2">
        {departments.map((dept) => (
          <div key={dept.id} className="flex items-center gap-2 text-xs">
            <div className={`w-3 h-3 rounded ${dept.fillColor.replace('/70', '')} flex-shrink-0`} />
            <span className="text-muted-foreground truncate">{dept.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

/**
 * Componente principal del mapa de Perú
 * @param {Object} data - Datos de participación por departamento
 * @param {Function} onDepartmentHover - Callback cuando se hace hover sobre un departamento
 */
export default function PeruMap({ data = {}, onDepartmentHover }) {
  const [tooltip, setTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Procesar datos de departamentos con información completa
  const departments = useMemo(() => {
    return DEPARTMENTS_CONFIG.map((config) => ({
      ...config,
      value: data[config.id] || null,
      hasData: !!data[config.id],
    }));
  }, [data]);

  // Manejar eventos de mouse
  const handleMouseEnter = (department, event) => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const pathRect = event.currentTarget.getBoundingClientRect();
    
    setTooltip({
      ...department,
      fillColor: department.fillColor,
    });
    
    // Calcular posición relativa al contenedor
    setTooltipPosition({
      x: pathRect.left - containerRect.left + pathRect.width / 2,
      y: pathRect.top - containerRect.top - 10,
    });

    if (onDepartmentHover) {
      onDepartmentHover({
        name: department.name,
        value: department.value,
      });
    }
  };
  
  const handleMouseLeave = () => {
    setTooltip(null);
    if (onDepartmentHover) {
      onDepartmentHover(null);
    }
  };

  const handleMouseMove = (event) => {
    if (tooltip && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: event.clientX - containerRect.left,
        y: event.clientY - containerRect.top - 10,
      });
    }
  };

  // Variantes de animación
  const pathVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: 0.1,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[600px]">
      {/* Tooltip */}
      <MapTooltip tooltip={tooltip} position={tooltipPosition} />

      {/* Leyenda */}
      <MapLegend departments={departments} />

      {/* Mapa SVG */}
      <motion.svg
        viewBox="0 0 380 500"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.02,
              delayChildren: 0.1,
            },
          },
        }}
      >
        {/* Fondo del mapa */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grupo de departamentos */}
        <g stroke="hsl(var(--border))" strokeWidth="1.5" strokeLinejoin="round">
          {departments.map((department) => (
            <g key={department.id}>
              {/* Path del departamento */}
          <motion.path
                d={department.path}
                className={`
                  ${department.hasData ? department.fillColor : 'fill-muted/10'}
                  ${department.hoverColor}
                  transition-all duration-300 ease-out
                  cursor-pointer
                `}
                onMouseEnter={(e) => handleMouseEnter(department, e)}
                variants={pathVariants}
                filter={department.hasData ? 'url(#glow)' : undefined}
              />

              {/* Texto del departamento - Siempre visible */}
              <motion.text
                x={department.textPosition.x}
                y={department.textPosition.y}
                className={`
                  ${department.textColor}
                  ${department.textSize || 'text-xs'}
                  font-bold
                  pointer-events-none
                  drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
                `}
                textAnchor="middle"
                dominantBaseline="middle"
                stroke="rgba(0,0,0,0.6)"
                strokeWidth="1"
                paintOrder="stroke fill"
                variants={textVariants}
              >
                {department.name}
              </motion.text>
            </g>
          ))}
        </g>
      </motion.svg>

      {/* Estilos personalizados para scrollbar de leyenda */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
      `}</style>
    </div>
  );
}
