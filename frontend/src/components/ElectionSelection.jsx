// src/components/ElectionSelection.jsx (Versión Platino 8.0 - Vistas Totalmente Diferenciadas con Descripciones)
// Implementación con estilos de acento únicos (Azul, Dorado, Verde) y descripciones detalladas para candidatos principales.

import React, { useState, useMemo } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Gavel, Landmark, Building, ArrowRight, ArrowLeft, BookOpen, CheckCircle } from 'lucide-react'; 

// (Estos son componentes UI ficticios de shadcn/ui. Si no los tienes,
// puedes reemplazarlos por <div> y <button> estándar de HTML)
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props} />
));
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
));
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props} />
));
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={`text-sm text-muted-foreground ${className}`} {...props} />
));
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
));
const Button = React.forwardRef(({ className, variant, ...props }, ref) => (
  <button
    ref={ref}
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
      ${variant === 'outline' ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' : ''}
      ${variant === 'ghost' ? 'hover:bg-accent hover:text-accent-foreground' : ''}
      ${!variant ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}
      ${className}`}
    {...props}
  />
));
// --- Fin de componentes UI ficticios ---


// --- FRAMER MOTION VARIANTS para animación escalonada ---
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Retraso entre cada elemento de la lista
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 12,
    },
  },
};


/**
 * --- SUB-COMPONENTE: Tarjeta 3D Inclinable (Navegación) ---
 */
const TiltCard = ({ icon: Icon, title, description, onClick }) => {
  // Lógica para el efecto 3D
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [10, -10]);
  const rotateY = useTransform(x, [-50, 50], [-10, 10]);

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
      style={{ perspective: 1000 }} 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
      className="lg:col-span-1"
    >
      <motion.div
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onClick={onClick}
        className="cursor-pointer"
      >
        <Card className="bg-card/80 border-white/10 shadow-xl h-full flex flex-col backdrop-blur-sm overflow-hidden 
                         transition-all duration-300 ease-out 
                         hover:border-primary/50 hover:shadow-primary/20">
          <CardHeader className="text-center p-8">
            <Icon className="h-12 w-12 text-primary mx-auto mb-5" />
            <CardTitle className="text-2xl text-white">{title}</CardTitle>
            <CardDescription className="text-gray-300 pt-2">{description}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 flex-grow flex flex-col justify-end">
            <div className="flex justify-end items-center mt-4">
              <span className="text-primary text-sm font-semibold">Ver Apartado</span>
              <ArrowRight className="h-5 w-5 text-primary ml-2" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};


/**
 * --- SUB-COMPONENTE: Modal de Confirmación de Voto (Mejorado) ---
 */
const ConfirmationModal = ({ isOpen, onClose, voteData, type }) => {
  if (!isOpen || !voteData) return null;

  const title = type === 'generales' ? 'Voto General Confirmado' : type === 'municipales' ? 'Voto Municipal Confirmado' : 'Voto Regional Confirmado';
  const { primary, secondary } = voteData; // primary: Presidente/Alcalde/Gobernador, secondary: Congreso/Regidores/Consejeros

  // Determinar los labels y color de acento para el modal
  let primaryLabel, secondaryLabel, accentColor;
  if (type === 'generales') {
    primaryLabel = 'Presidente';
    secondaryLabel = 'Congreso';
    accentColor = 'border-primary/40 shadow-primary/30';
  } else if (type === 'municipales') {
    primaryLabel = 'Alcalde';
    secondaryLabel = 'Regidores';
    accentColor = 'border-emerald-500/40 shadow-emerald-500/30';
  } else {
    primaryLabel = 'Gobernador Regional';
    secondaryLabel = 'Consejeros Regionales';
    accentColor = 'border-yellow-500/40 shadow-yellow-500/30';
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            key="modal-content"
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`bg-card/95 border ${accentColor} rounded-xl shadow-2xl w-full max-w-md 
                       transform transition duration-300`}
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="text-center pb-4">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4 animate-pulse" />
              <CardTitle className="text-3xl text-white font-extrabold">{title}</CardTitle>
              <CardDescription className="text-gray-300 pt-2 text-base">
                Tu selección ha sido registrada exitosamente (simulación).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-8 py-6">
              <div className="border border-white/20 rounded-lg p-4 bg-white/10 shadow-inner">
                <p className="text-sm font-semibold text-primary uppercase tracking-wider">{primaryLabel}</p>
                <p className="text-xl text-white">{primary.name}</p>
                <p className="text-md text-gray-400">{primary.party}</p>
              </div>
              <div className="border border-white/20 rounded-lg p-4 bg-white/10 shadow-inner">
                <p className="text-sm font-semibold text-primary uppercase tracking-wider">{secondaryLabel}</p>
                <p className="text-xl text-white">{secondary.name}</p>
              </div>
              <Button 
                onClick={onClose} 
                className="w-full h-12 text-lg mt-6 bg-primary hover:bg-primary/90"
              >
                Finalizar y Volver
              </Button>
            </CardContent>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


/**
 * --- SUB-COMPONENTE: Tarjeta de Candidato (Para Votación - Mejorada) ---
 */
const CandidateCard = ({ candidate, type, isSelected, onSelect }) => {
  // Define el color de acento basado en el tipo de elección
  const accentClass = useMemo(() => {
    if (type === 'president' || type === 'congress') return 'border-primary shadow-primary/40 ring-primary/30';
    if (type === 'mayor' || type === 'council') return 'border-emerald-500 shadow-emerald-500/40 ring-emerald-500/30';
    if (type === 'governor' || type === 'councilor') return 'border-yellow-500 shadow-yellow-500/40 ring-yellow-500/30';
    return 'border-primary shadow-primary/40 ring-primary/30'; // Default
  }, [type]);

  return (
      <Card 
        onClick={onSelect}
        className={`bg-card/80 border-2 backdrop-blur-sm cursor-pointer transition-all duration-300 ease-in-out
                    ${isSelected 
                        ? `bg-card/90 ${accentClass} scale-[1.01] ring-4` // Añadido bg-card/90 para cambio de fondo
                        : 'border-white/10 hover:border-white/20 hover:bg-white/5'}
                  `}
      >
        <CardContent className="p-4 flex items-center space-x-4">
          {/* Visual de Radio Button */}
          <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0
                          ${isSelected ? 'border-primary bg-primary' : 'border-gray-500'}
                          flex items-center justify-center transition-all duration-300`}
          >
            {isSelected && <div className="w-3 h-3 rounded-full bg-card"></div>}
          </div>
          
          {/* Logo del Partido */}
          <img 
            src={candidate.imageUrl}
            alt={`Logo ${candidate.name}`}
            className="w-12 h-12 rounded-full border-2 border-primary/50 flex-shrink-0 object-cover bg-gray-700"
            onError={(e) => {
              // Fallback simple si la imagen falla
              e.currentTarget.src = `https://placehold.co/64x64/555/FFF?text=?&font=lora`;
            }}
          />

          {/* Info del Candidato/Partido */}
          <div className="flex-grow min-w-0">
            <p className="text-lg font-semibold text-white truncate">{candidate.name}</p>
            {/* Solo muestra el partido para Presidente, Alcalde y Gobernador */}
            {(type === 'president' || type === 'mayor' || type === 'governor') && (
              <>
                <p className="text-sm text-gray-400">{candidate.party}</p>
                {/* NUEVO: Descripción del candidato */}
                {candidate.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{candidate.description}</p>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
  );
};


/**
 * --- COMPONENTE PRINCIPAL: Dashboard de Consulta ---
 */
export default function ElectionSelection({ onGoBack }) {
  
  const [currentView, setCurrentView] = useState('main');

  // --- ESTADOS DE VOTACIÓN ---
  const [selectedPresident, setSelectedPresident] = useState(null);
  const [selectedCongress, setSelectedCongress] = useState(null);
  const [selectedMayor, setSelectedMayor] = useState(null);
  const [selectedCouncil, setSelectedCouncil] = useState(null);
  const [selectedGovernor, setSelectedGovernor] = useState(null);
  const [selectedCouncilor, setSelectedCouncilor] = useState(null);

  // --- ESTADO PARA el modal de confirmación ---
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [finalVote, setFinalVote] = useState(null);
  const [voteType, setVoteType] = useState(null); // 'generales', 'municipales', o 'regionales'


  /**
   * --- DATOS MOCK (Actualizados con 'description') ---
   */
  const presidentialCandidates = [
    { id: 'p1', name: 'Keiko Fujimori', party: 'Fuerza Popular', logo: 'K', imageUrl: 'https://placehold.co/64x64/2D3748/FFFFFF?text=K&font=lora', description: 'Candidata con experiencia previa en el Congreso. Promete estabilidad económica y orden.' },
    { id: 'p2', name: 'Pedro Castillo', party: 'Perú Libre', logo: 'PL', imageUrl: 'https://placehold.co/64x64/2D3748/FFFFFF?text=PL&font=lora', description: 'Líder sindical y profesor. Su enfoque se centra en la reestructuración del Estado y la salud pública.' },
    { id: 'p3', name: 'Rafael López Aliaga', party: 'Renovación Popular', logo: 'R', imageUrl: 'https://placehold.co/64x64/2D3748/FFFFFF?text=R&font=lora', description: 'Empresario con enfoque en la inversión privada y la seguridad ciudadana. Propuestas conservadoras.' },
    { id: 'p4', name: 'Hernando de Soto', party: 'Avanza País', logo: 'AP', imageUrl: 'https://placehold.co/64x64/2D3748/FFFFFF?text=AP&font=lora', description: 'Economista de renombre internacional. Propone formalizar la economía y defender la propiedad.' },
    { id: 'p5', name: 'Julio Guzmán', party: 'Partido Morado', logo: 'PM', imageUrl: 'https://placehold.co/64x64/2D3748/FFFFFF?text=PM&font=lora', description: 'Ex-candidato presidencial. Aboga por políticas progresistas y modernización del sector público.' }
  ];

  const congressionalCandidates = [
    { id: 'c1', name: 'Fuerza Popular', logo: 'K', imageUrl: 'https://placehold.co/64x64/2D3748/FFFFFF?text=K&font=lora' },
    { id: 'c2', name: 'Perú Libre', logo: 'PL', imageUrl: 'https://placehold.co/64x64/2D3748/FFFFFF?text=PL&font=lora' },
    { id: 'c3', name: 'Renovación Popular', logo: 'R', imageUrl: 'https://placehold.co/64x64/2D3748/FFFFFF?text=R&font=lora' },
    { id: 'c4', name: 'Avanza País', logo: 'AP', imageUrl: 'https://placehold.co/64x64/2D3748/FFFFFF?text=AP&font=lora' },
    { id: 'c5', name: 'Partido Morado', logo: 'PM', imageUrl: 'https://placehold.co/64x64/2D3748/FFFFFF?text=PM&font=lora' }
  ];

  const municipalCandidates = {
    mayors: [
      { id: 'm1', name: 'Rafael A. (Alcalde)', party: 'Unión por el Perú', logo: 'UP', imageUrl: 'https://placehold.co/64x64/2B4E8C/FFFFFF?text=UP&font=lora', description: 'Enfoque en infraestructura urbana y transporte público eficiente.' },
      { id: 'm2', name: 'George F. (Alcalde)', party: 'Podemos Perú', logo: 'PP', imageUrl: 'https://placehold.co/64x64/883997/FFFFFF?text=PP&font=lora', description: 'Prioridad en la limpieza pública y descentralización de servicios municipales.' },
      { id: 'm3', name: 'Daniel O. (Alcalde)', party: 'Victoria Nacional', logo: 'VN', imageUrl: 'https://placehold.co/64x64/E37000/FFFFFF?text=VN&font=lora', description: 'Propuestas para fortalecer el comercio local y el apoyo a pequeños empresarios.' },
    ],
    council: [ // Voto por la lista de Regidores
      { id: 'l1', name: 'Lista Regidores UPP', logo: 'UP', imageUrl: 'https://placehold.co/64x64/2B4E8C/FFFFFF?text=UP&font=lora' },
      { id: 'l2', name: 'Lista Regidores PP', logo: 'PP', imageUrl: 'https://placehold.co/64x64/883997/FFFFFF?text=PP&font=lora' },
      { id: 'l3', name: 'Lista Regidores VN', logo: 'VN', imageUrl: 'https://placehold.co/64x64/E37000/FFFFFF?text=VN&font=lora' },
    ]
  };
  
  const regionalCandidates = {
    governors: [
      { id: 'g1', name: 'Rohel Sánchez', party: 'Yo Arequipa', logo: 'YA', imageUrl: 'https://placehold.co/64x64/E0A800/FFFFFF?text=R1&font=lora', description: 'Estrategia centrada en el desarrollo de proyectos de irrigación y minería responsable.' },
      { id: 'g2', name: 'Elmer Cáceres', party: 'Arequipa Renace', logo: 'AR', imageUrl: 'https://placehold.co/64x64/800080/FFFFFF?text=R2&font=lora', description: 'Foco en la mejora de la educación rural y la promoción del turismo regional.' },
      { id: 'g3', name: 'Werner Salcedo', party: 'Inka Pachakuteq', logo: 'IP', imageUrl: 'https://placehold.co/64x64/008080/FFFFFF?text=R3&font=lora', description: 'Impulso a la inversión en tecnología y la gestión eficiente de recursos hídricos.' },
    ],
    councilors: [ // Voto por la lista de Consejeros Regionales
      { id: 'c1', name: 'Lista Consejeros YA', logo: 'YA', imageUrl: 'https://placehold.co/64x64/E0A800/FFFFFF?text=R1&font=lora' },
      { id: 'c2', name: 'Lista Consejeros AR', logo: 'AR', imageUrl: 'https://placehold.co/64x64/800080/FFFFFF?text=R2&font=lora' },
      { id: 'c3', name: 'Lista Consejeros IP', logo: 'IP', imageUrl: 'https://placehold.co/64x64/008080/FFFFFF?text=R3&font=lora' },
    ]
  };


  /**
   * --- MANEJADOR: Para emitir el voto General ---
   */
  const handleSubmitGeneralVote = () => {
    if (!selectedPresident || !selectedCongress) {
      console.error("Falta selección General");
      return;
    }
    
    const pres = presidentialCandidates.find(p => p.id === selectedPresident);
    const cong = congressionalCandidates.find(c => c.id === selectedCongress);

    setFinalVote({ primary: pres, secondary: cong });
    setVoteType('generales');
    setShowConfirmationModal(true);
  };

  /**
   * --- MANEJADOR: Para emitir el voto Municipal ---
   */
  const handleSubmitMunicipalVote = () => {
    if (!selectedMayor || !selectedCouncil) {
      console.error("Falta selección Municipal");
      return;
    }

    const mayor = municipalCandidates.mayors.find(m => m.id === selectedMayor);
    const council = municipalCandidates.council.find(c => c.id === selectedCouncil);

    setFinalVote({ primary: mayor, secondary: council });
    setVoteType('municipales');
    setShowConfirmationModal(true);
  };
  
  /**
   * --- MANEJADOR: Para emitir el voto Regional ---
   */
  const handleSubmitRegionalVote = () => {
    if (!selectedGovernor || !selectedCouncilor) {
      console.error("Falta selección Regional");
      return;
    }

    const governor = regionalCandidates.governors.find(g => g.id === selectedGovernor);
    const councilor = regionalCandidates.councilors.find(c => c.id === selectedCouncilor);

    setFinalVote({ primary: governor, secondary: councilor });
    setVoteType('regionales');
    setShowConfirmationModal(true);
  };


  /**
   * --- MANEJADOR: Para cerrar el modal y resetear ---
   */
  const handleCloseModal = () => {
    setShowConfirmationModal(false);
    setFinalVote(null);
    setVoteType(null);
    // Reseteamos y volvemos al menú principal
    setCurrentView('main');
    // También reseteamos las selecciones
    setSelectedPresident(null);
    setSelectedCongress(null);
    setSelectedMayor(null);
    setSelectedCouncil(null);
    setSelectedGovernor(null);
    setSelectedCouncilor(null);
  };

  // --- Textos del Encabezado ---
  const titles = {
    main: "Plataforma de Consulta",
    generales: "Elecciones Generales",
    regionales: "Elecciones Regionales",
    municipales: "Elecciones Municipales"
  };
  const subtitles = {
    main: "Selecciona una categoría para ver los seleccionados.",
    generales: "Selecciona tu voto presidencial y congresal.",
    regionales: "Selecciona tu voto de gobernador y consejeros.",
    municipales: "Selecciona tu voto de alcalde y regidores.", 
  };


  // Función para renderizar el contenido de las vistas
  const renderViewContent = useMemo(() => {
    switch (currentView) {
      case 'generales':
        return (
          <motion.div 
            key="generales-view"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
          >
            
            {/* --- Columna Izquierda: Congresistas (AZUL PRIMARIO) --- */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
              className="space-y-6"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white text-center border-b-2 border-primary/30 pb-4">
                Voto Congresal
              </h2>
              {/* LISTA CON ANIMACIÓN ESCALONADA */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={listVariants}
                className="space-y-4"
              >
                {congressionalCandidates.map((partido) => (
                  <motion.div key={partido.id} variants={itemVariants}>
                    <CandidateCard
                      candidate={partido}
                      type="congress"
                      isSelected={selectedCongress === partido.id}
                      onSelect={() => setSelectedCongress(partido.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            {/* --- Columna Derecha: Presidentes (AZUL PRIMARIO) --- */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
              className="space-y-6"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white text-center border-b-2 border-primary/30 pb-4">
                Voto Presidencial
              </h2>
              {/* LISTA CON ANIMACIÓN ESCALONADA */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={listVariants}
                className="space-y-4"
              >
                {presidentialCandidates.map((candidato) => (
                  <motion.div key={candidato.id} variants={itemVariants}>
                    <CandidateCard
                      candidate={candidato}
                      type="president"
                      isSelected={selectedPresident === candidato.id}
                      onSelect={() => setSelectedPresident(candidato.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* --- Botón de Votar (AZUL) --- */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
              className="lg:col-span-2 flex justify-center mt-8"
            >
              <Button 
                className="w-full max-w-md h-16 text-2xl font-bold bg-primary/90 hover:bg-primary shadow-lg shadow-primary/20 disabled:bg-gray-500"
                onClick={handleSubmitGeneralVote}
                disabled={!selectedPresident || !selectedCongress}
              >
                Emitir Voto General
              </Button>
            </motion.div>

          </motion.div>
        );

      case 'regionales':
        return (
          <motion.div 
            key="regionales-vote-view"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
          >
            
            {/* --- Columna Izquierda: Consejeros Regionales (DORADO/AMARILLO) --- */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
              className="space-y-6"
            >
              {/* ESTILO ÚNICO PARA DIFERENCIACIÓN */}
              <h2 className="text-3xl lg:text-4xl font-bold text-white text-center border-b-4 border-yellow-500/50 pb-4">
                Voto Consejeros Regionales
              </h2>
              {/* LISTA CON ANIMACIÓN ESCALONADA */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={listVariants}
                className="space-y-4"
              >
                {regionalCandidates.councilors.map((list) => (
                  <motion.div key={list.id} variants={itemVariants}>
                    <CandidateCard
                      candidate={list}
                      type="councilor"
                      isSelected={selectedCouncilor === list.id}
                      onSelect={() => setSelectedCouncilor(list.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            {/* --- Columna Derecha: Gobernador Regional (DORADO/AMARILLO) --- */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
              className="space-y-6"
            >
              {/* ESTILO ÚNICO PARA DIFERENCIACIÓN */}
              <h2 className="text-3xl lg:text-4xl font-bold text-white text-center border-b-4 border-yellow-500/50 pb-4">
                Voto Gobernador Regional
              </h2>
              {/* LISTA CON ANIMACIÓN ESCALONADA */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={listVariants}
                className="space-y-4"
              >
                {regionalCandidates.governors.map((candidato) => (
                  <motion.div key={candidato.id} variants={itemVariants}>
                    <CandidateCard
                      candidate={candidato}
                      type="governor"
                      isSelected={selectedGovernor === candidato.id}
                      onSelect={() => setSelectedGovernor(candidato.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* --- Botón de Votar (DORADO) --- */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
              className="lg:col-span-2 flex justify-center mt-8"
            >
              <Button 
                className="w-full max-w-md h-16 text-2xl font-bold bg-yellow-600 hover:bg-yellow-700 shadow-lg shadow-yellow-500/30 disabled:bg-gray-500"
                onClick={handleSubmitRegionalVote}
                disabled={!selectedGovernor || !selectedCouncilor}
              >
                Emitir Voto Regional
              </Button>
            </motion.div>

          </motion.div>
        );

      case 'municipales':
        return (
          <motion.div 
            key="municipales-vote-view"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
          >
            
            {/* --- Columna Izquierda: Regidores (VERDE ESMERALDA) --- */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
              className="space-y-6"
            >
              {/* ESTILO ÚNICO PARA DIFERENCIACIÓN */}
              <h2 className="text-3xl lg:text-4xl font-bold text-white text-center border-b-4 border-emerald-500/70 pb-4">
                Voto Regidores
              </h2>
              {/* LISTA CON ANIMACIÓN ESCALONADA */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={listVariants}
                className="space-y-4"
              >
                {municipalCandidates.council.map((list) => (
                  <motion.div key={list.id} variants={itemVariants}>
                    <CandidateCard
                      candidate={list}
                      type="council"
                      isSelected={selectedCouncil === list.id}
                      onSelect={() => setSelectedCouncil(list.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            {/* --- Columna Derecha: Alcalde (VERDE ESMERALDA) --- */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
              className="space-y-6"
            >
              {/* ESTILO ÚNICO PARA DIFERENCIACIÓN */}
              <h2 className="text-3xl lg:text-4xl font-bold text-white text-center border-b-4 border-emerald-500/70 pb-4">
                Voto Alcalde
              </h2>
              {/* LISTA CON ANIMACIÓN ESCALONADA */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={listVariants}
                className="space-y-4"
              >
                {municipalCandidates.mayors.map((candidato) => (
                  <motion.div key={candidato.id} variants={itemVariants}>
                    <CandidateCard
                      candidate={candidato}
                      type="mayor"
                      isSelected={selectedMayor === candidato.id}
                      onSelect={() => setSelectedMayor(candidato.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* --- Botón de Votar (VERDE) --- */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
              className="lg:col-span-2 flex justify-center mt-8"
            >
              <Button 
                className="w-full max-w-md h-16 text-2xl font-bold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 disabled:bg-gray-500"
                onClick={handleSubmitMunicipalVote}
                disabled={!selectedMayor || !selectedCouncil}
              >
                Emitir Voto Municipal
              </Button>
            </motion.div>

          </motion.div>
        );

      case 'main':
      default:
        return (
          <motion.div 
            key="main-dashboard"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          >
            {/* Tarjeta 1: Generales */}
            <TiltCard
              icon={Gavel}
              title="Generales"
              description="Consulta el Poder Ejecutivo y Legislativo."
              onClick={() => setCurrentView('generales')}
            />
            {/* Tarjeta 2: Regionales */}
            <TiltCard
              icon={Landmark}
              title="Regionales"
              description="Consulta los gobiernos de tu región."
              onClick={() => setCurrentView('regionales')}
            />
            {/* Tarjeta 3: Municipales */}
            <TiltCard
              icon={Building}
              title="Municipales"
              description="Consulta las autoridades de tu localidad."
              onClick={() => setCurrentView('municipales')}
            />
            
            {/* Tarjeta 4: Panel de Enlaces Oficiales */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 } }}
              className="lg:col-span-1"
            >
              <Card className="bg-card/80 border-white/10 shadow-xl h-full flex flex-col backdrop-blur-sm">
                <CardHeader className="pb-4"><div className="flex items-center space-x-3"><BookOpen className="h-6 w-6 text-primary" /><CardTitle className="text-2xl text-white">Enlaces Oficiales</CardTitle></div></CardHeader>
                <CardContent className="flex-grow flex flex-col justify-start space-y-4 pt-4">
                  <p className="text-gray-400 text-sm pb-2">Visita los portales oficiales.</p>
                  <Button variant="ghost" className="group w-full text-left p-5 text-lg justify-between bg-white/5 border border-white/10 hover:bg-white/10 text-white" onClick={() => window.open('https://www.congreso.gob.pe/', '_blank')}><span>Congreso</span><ArrowRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1" /></Button>
                  <Button variant="ghost" className="group w-full text-left p-5 text-lg justify-between bg-white/5 border border-white/10 hover:bg-white/10 text-white" onClick={() => window.open('https://www.jne.gob.pe/', '_blank')}><span>JNE</span><ArrowRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1" /></Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        );
    }
  }, [currentView, selectedPresident, selectedCongress, selectedMayor, selectedCouncil, selectedGovernor, selectedCouncilor]);


  return (
    <main className="flex-grow flex flex-col items-center min-h-screen py-20 px-4 
                     bg-animated-gradient overflow-hidden text-white">
      
      <div className="w-full max-w-screen-xl mx-auto">
        
        {/* --- Encabezado Dinámico --- */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative w-full mx-auto mb-16"
        >
          <Button 
            variant="ghost" 
            className="absolute left-0 -top-12 text-gray-300 hover:text-white"
            onClick={() => currentView === 'main' ? onGoBack() : setCurrentView('main')} 
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {currentView === 'main' ? 'Volver a la App' : 'Volver al Menú Principal'}
          </Button>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-white text-center">
            {titles[currentView] || titles.main}
          </h1>
          <p className="text-xl text-center text-gray-400 mt-4">
            {subtitles[currentView] || subtitles.main}
          </p>
        </motion.div>

        {/* --- Contenedor de Vistas --- */}
        <AnimatePresence mode="wait">
          {renderViewContent}
        </AnimatePresence>

        {/* --- Render del Modal de Confirmación --- */}
        <ConfirmationModal 
          isOpen={showConfirmationModal}
          onClose={handleCloseModal}
          voteData={finalVote}
          type={voteType}
        />

      </div>
    </main>
  );
}