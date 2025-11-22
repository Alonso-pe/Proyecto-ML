import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

// Definición de los pasos (puedes recibir esto como prop)
const stepsData = [
  { id: 1, label: 'Iniciación' },
  { id: 2, label: 'Desarrollo' },
  { id: 3, label: 'Revisión' },
  { id: 4, label: 'Lanzamiento' },
];

const ProfessionalTimeline = () => {
  // Estado para controlar en qué paso estamos (comienza en 0 para el primer paso)
  // Para que se vea como tu imagen (Paso 2 activo), lo iniciamos en 1.
  const [currentStepIndex, setCurrentStepIndex] = useState(1);

  // Cálculo para el ancho de la barra de progreso animada
  const progressWidth = (currentStepIndex / (stepsData.length - 1)) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
       {/* Contenedor Principal y controles para demo */}
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Progreso del Proyecto</h2>
        <div className="space-x-4">
          <button
            onClick={() => setCurrentStepIndex(prev => Math.max(prev - 1, 0))}
            className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300 transition text-sm"
            disabled={currentStepIndex === 0}
          >
            Anterior
          </button>
          <button
            onClick={() => setCurrentStepIndex(prev => Math.min(prev + 1, stepsData.length - 1))}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
            disabled={currentStepIndex === stepsData.length - 1}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* --- INICIO DEL COMPONENTE TIMELINE --- */}
      <div className="relative">
        {/* 1. Líneas de fondo (La gris estática y la azul animada) */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 rounded-full"></div>
        <motion.div
          className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 rounded-full z-0"
          initial={{ width: '0%' }}
          animate={{ width: `${progressWidth}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        ></motion.div>

        {/* 2. Los Pasos (Círculos y Etiquetas) */}
        <div className="relative z-10 flex justify-between">
          {stepsData.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isActive = index === currentStepIndex;
            // const isPending = index > currentStepIndex;

            return (
              <div key={step.id} className="flex flex-col items-center">
                {/* Círculo indicador */}
                <motion.div
                  className={`relative flex items-center justify-center w-12 h-12 rounded-full border-4 font-bold text-lg transition-colors duration-300 ${
                    isActive
                      ? 'border-blue-600 bg-white text-blue-600 shadow-lg shadow-blue-600/20'
                      : isCompleted
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-200 bg-white text-slate-400'
                  }`}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.15 : 1, // El activo es ligeramente más grande
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Anillo exterior animado para el paso activo */}
                  {isActive && (
                    <motion.div
                      className="absolute -inset-2 rounded-full border-2 border-blue-400 opacity-0"
                      animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}

                  {/* Contenido del círculo: Check si está completo, número si no */}
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <Check size={24} strokeWidth={3} />
                      </motion.div>
                    ) : (
                      <motion.span
                        key="number"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {index + 1}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Etiqueta de texto debajo */}
                <motion.p
                  className={`mt-4 text-sm font-medium transition-colors duration-300 ${
                    isActive ? 'text-blue-800 font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                  }`}
                  animate={{ y: isActive ? 2 : 0 }} // Pequeño movimiento vertical si está activo
                >
                  {step.label}
                </motion.p>
              </div>
            );
          })}
        </div>
      </div>
       {/* --- FIN DEL COMPONENTE TIMELINE --- */}
    </div>
  );
};

export default ProfessionalTimeline;