// src/components/ElectionSelection.jsx (Versión Platino)

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Gavel, Landmark, Building, ArrowRight, ArrowLeft, Vote, CheckSquare, Clock } from 'lucide-react'; 

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/card.jsx';
import { Button } from '@/ui/button.jsx';

/**
 * --- SUB-COMPONENTE: Botón de Selección ---
 * Botón individual con estado de "completado".
 */
const SelectionButton = ({ title, onClick, isCompleted }) => (
  <Button 
    variant="ghost" 
    className={`group w-full text-left p-5 text-lg justify-between bg-white/5 border border-white/10 
                transition-all duration-300
                ${isCompleted 
                  ? 'border-green-500/30 bg-green-900/20' 
                  : 'hover:bg-white/10'
                }`}
    onClick={onClick}
    disabled={isCompleted}
  >
    <span className={isCompleted ? "text-gray-400 line-through" : "text-white"}>
      {title}
    </span>
    {isCompleted ? (
      <CheckSquare className="h-5 w-5 text-green-400" />
    ) : (
      <ArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
    )}
  </Button>
);

/**
 * --- SUB-COMPONENTE: Tarjeta 3D Inclinable ---
 * Tarjeta de apartado con el efecto 3D "tilt".
 */
const TiltCard = ({ icon: Icon, title, description, progressText, children }) => {
  // Lógica para el efecto 3D
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-50, 50], [10, -10]); // Inclinación vertical
  const rotateY = useTransform(x, [-50, 50], [-10, 10]); // Inclinación horizontal

  // Normaliza el movimiento del ratón
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set((mouseX / width) * 100 - 50);
    y.set((mouseY / height) * 100 - 50);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      // Aplica perspectiva al contenedor para que el 3D funcione
      style={{ perspective: 1000 }} 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
      className="lg:col-span-1"
    >
      <motion.div
        // Aplica la rotación 3D
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }} // Efecto de muelle
      >
        <Card className="bg-card/80 border-white/10 shadow-xl h-full flex flex-col backdrop-blur-sm overflow-hidden">
          <CardHeader className="text-center p-8">
            <Icon className="h-12 w-12 text-primary mx-auto mb-5" />
            <CardTitle className="text-2xl text-white">{title}</CardTitle>
            <CardDescription className="text-gray-300 pt-2">{description}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 flex-grow flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {children}
            </div>
            {/* Pie de tarjeta con progreso */}
            <div className="text-right text-sm text-primary pt-2">
              {progressText}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};


/**
 * --- COMPONENTE PRINCIPAL: Dashboard de Votación ---
 */
export default function ElectionSelection({ onGoBack }) {
  
  // Estado granular para cada botón
  const [votes, setVotes] = useState({
    presidente: false,
    congresista: false,
    presRegional: false,
    consRegional: false,
    provincial: false,
    distrital: false,
  });

  const handleVoteClick = (voteType) => {
    setVotes(prev => ({
      ...prev,
      [voteType]: true
    }));
  };

  // Cálculos para el panel de resumen
  const totalVotes = Object.values(votes).filter(Boolean).length;
  const totalElections = Object.keys(votes).length;
  const progressPercent = (totalVotes / totalElections) * 100;

  const genVotes = [votes.presidente, votes.congresista].filter(Boolean).length;
  const regVotes = [votes.presRegional, votes.consRegional].filter(Boolean).length;
  const munVotes = [votes.provincial, votes.distrital].filter(Boolean).length;

  return (
    // Aplicamos el fondo animado aquí
    <main className="flex-grow flex flex-col items-center justify-center min-h-screen py-20 px-4 
                   bg-animated-gradient overflow-hidden">
      
      <div className="w-full max-w-screen-xl mx-auto">
        
        {/* --- Encabezado --- */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative w-full mx-auto mb-16"
        >
          <Button 
            variant="ghost" 
            className="absolute left-0 -top-12 text-gray-300 hover:text-white"
            onClick={onGoBack} 
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver
          </Button>
          
          <h1 className="text-5xl lg:text-6xl font-extrabold text-white text-center">
            Dashboard de Votación
          </h1>
          <p className="text-xl text-center text-gray-400 mt-4">
            Selecciona una elección para emitir tu voto.
          </p>
        </motion.div>

        {/* --- Grid Principal del Dashboard (4 Columnas) --- */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } }
          }}
        >
          
          {/* --- APARTADO 1: Elecciones Generales --- */}
          <TiltCard
            icon={Gavel}
            title="Elecciones Generales"
            description="Elige Presidente y Congresistas."
            progressText={`${genVotes} de 2 completados`}
          >
            <SelectionButton title="Presidente" isCompleted={votes.presidente} onClick={() => handleVoteClick('presidente')} />
            <SelectionButton title="Congresista" isCompleted={votes.congresista} onClick={() => handleVoteClick('congresista')} />
          </TiltCard>

          {/* --- APARTADO 2: Elecciones Regionales --- */}
          <TiltCard
            icon={Landmark}
            title="Elecciones Regionales"
            description="Define el futuro de tu región."
            progressText={`${regVotes} de 2 completados`}
          >
            <SelectionButton title="Presidente Regional" isCompleted={votes.presRegional} onClick={() => handleVoteClick('presRegional')} />
            <SelectionButton title="Consejero Regional" isCompleted={votes.consRegional} onClick={() => handleVoteClick('consRegional')} />
          </TiltCard>

          {/* --- APARTADO 3: Elecciones Municipales --- */}
          <TiltCard
            icon={Building}
            title="Elecciones Municipales"
            description="Selecciona a tus alcaldes locales."
            progressText={`${munVotes} de 2 completados`}
          >
            <SelectionButton title="Alcalde Provincial" isCompleted={votes.provincial} onClick={() => handleVoteClick('provincial')} />
            <SelectionButton title="Alcalde Distrital" isCompleted={votes.distrital} onClick={() => handleVoteClick('distrital')} />
          </TiltCard>

          {/* --- APARTADO 4: Panel de Resumen --- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 } }}
            className="lg:col-span-1"
          >
            <Card className="bg-card/80 border-white/10 shadow-xl h-full flex flex-col backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <Vote className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl text-white">
                    Tu Progreso
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <div>
                  <div className="text-center my-6">
                    {/* Contador Animado */}
                    <div className="relative text-8xl font-extrabold text-primary">
                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={totalVotes}
                          initial={{ y: -30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 30, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          className="absolute w-full left-0"
                        >
                          {totalVotes}
                        </motion.span>
                      </AnimatePresence>
                      <span className="opacity-0">{totalVotes}</span>
                    </div>
                    <p className="text-2xl text-gray-300">de {totalElections}</p>
                    <p className="text-gray-400">votos emitidos</p>
                  </div>
                  
                  {/* Barra de Progreso */}
                  <div className="w-full bg-white/10 rounded-full h-2.5 mb-6">
                    <motion.div 
                      className="bg-primary h-2.5 rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                  
                  {/* Lista de progreso detallada */}
                  <div className="space-y-4 text-lg">
                    <div className="flex justify-between items-center">
                      <span className={votes.presidente && votes.congresista ? "text-gray-500 line-through" : "text-gray-300"}>Generales</span>
                      {votes.presidente && votes.congresista ? <CheckSquare className="h-6 w-6 text-green-400" /> : <Clock className="h-6 w-6 text-yellow-400" />}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={votes.presRegional && votes.consRegional ? "text-gray-500 line-through" : "text-gray-300"}>Regionales</span>
                      {votes.presRegional && votes.consRegional ? <CheckSquare className="h-6 w-6 text-green-400" /> : <Clock className="h-6 w-6 text-yellow-400" />}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={votes.provincial && votes.distrital ? "text-gray-500 line-through" : "text-gray-300"}>Municipales</span>
                      {votes.provincial && votes.distrital ? <CheckSquare className="h-6 w-6 text-green-400" /> : <Clock className="h-6 w-6 text-yellow-400" />}
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-8 h-12 text-lg" variant="outline">
                  Ver Constancia
                </Button>
              </CardContent>
            </Card>
          </motion.div>

        </motion.div>
      </div>
    </main>
  );
}