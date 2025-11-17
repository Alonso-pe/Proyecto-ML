// src/components/ElectionSelection.jsx (Versión Platino 8.0 - Vistas Totalmente Diferenciadas con Descripciones)
// Implementación con estilos de acento únicos (Azul, Dorado, Verde) y descripciones detalladas para candidatos principales.

import React, { useState, useMemo, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Gavel, Building, Landmark, ArrowRight, ArrowLeft, BookOpen, CheckCircle, Lock } from 'lucide-react'; 

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
const TiltCard = ({ icon: Icon, title, description, onClick, isLocked = false }) => {
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
        style={isLocked ? {} : { rotateX, rotateY }}
        onMouseMove={isLocked ? undefined : handleMouseMove}
        onMouseLeave={isLocked ? undefined : handleMouseLeave}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onClick={isLocked ? undefined : onClick}
        className={isLocked ? "cursor-not-allowed" : "cursor-pointer"}
      >
        <Card className={`bg-card/80 border-white/10 shadow-xl h-full flex flex-col backdrop-blur-sm overflow-hidden 
                         transition-all duration-300 ease-out 
                         ${isLocked 
                           ? 'opacity-60 border-red-500/30' 
                           : 'hover:border-primary/50 hover:shadow-primary/20'}`}>
          <CardHeader className="text-center p-8">
            {isLocked ? (
              <div className="relative">
                <Icon className="h-12 w-12 text-gray-500 mx-auto mb-5" />
                <Lock className="h-8 w-8 text-red-400 absolute top-0 right-0 left-0 mx-auto" />
              </div>
            ) : (
              <Icon className="h-12 w-12 text-primary mx-auto mb-5" />
            )}
            <CardTitle className={`text-2xl ${isLocked ? 'text-gray-400' : 'text-white'}`}>{title}</CardTitle>
            <CardDescription className={isLocked ? "text-gray-500 pt-2" : "text-gray-300 pt-2"}>
              {isLocked ? 'Ya has emitido tu voto en este apartado' : description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 flex-grow flex flex-col justify-end">
            <div className="flex justify-end items-center mt-4">
              {isLocked ? (
                <div className="flex items-center space-x-2 text-red-400">
                  <Lock className="h-4 w-4" />
                  <span className="text-sm font-semibold">Bloqueado</span>
                </div>
              ) : (
                <>
                  <span className="text-primary text-sm font-semibold">Ver Apartado</span>
                  <ArrowRight className="h-5 w-5 text-primary ml-2" />
                </>
              )}
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

  const titleMap = {
    'presidencial': 'Voto Presidencial Confirmado',
    'presidente-regional': 'Voto Presidente Regional Confirmado',
    'alcalde': 'Voto Alcalde Confirmado',
    'regionales': 'Voto Regional Confirmado'
  };
  const title = titleMap[type] || 'Voto Confirmado';
  const { primary, secondary } = voteData; // primary: Presidente/Presidente Regional/Alcalde

  // Determinar los labels y color de acento para el modal
  let primaryLabel, secondaryLabel, accentColor;
  if (type === 'presidencial') {
    primaryLabel = 'Presidente';
    accentColor = 'border-primary/40 shadow-primary/30';
  } else if (type === 'presidente-regional') {
    primaryLabel = 'Presidente Regional';
    accentColor = 'border-slate-500/40 shadow-slate-500/30';
  } else if (type === 'alcalde') {
    primaryLabel = 'Alcalde';
    accentColor = 'border-slate-500/40 shadow-slate-500/30';
  } else if (type === 'regionales') {
    primaryLabel = 'Alcalde';
    secondaryLabel = 'Presidente Regional';
    accentColor = 'border-slate-500/40 shadow-slate-500/30';
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
              {secondary && (
                <div className="border border-white/20 rounded-lg p-4 bg-white/10 shadow-inner">
                  <p className="text-sm font-semibold text-primary uppercase tracking-wider">{secondaryLabel || 'Otro'}</p>
                  <p className="text-xl text-white">{secondary.name}</p>
                  {secondary.party && <p className="text-md text-gray-400">{secondary.party}</p>}
                </div>
              )}
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
    if (type === 'governor' || type === 'councilor') return 'border-slate-500 shadow-slate-500/40 ring-slate-500/30';
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
  const [votedSections, setVotedSections] = useState({
    presidencial: false,
    regionales: false
  });

  // --- ESTADOS DE VOTACIÓN ---
  const [selectedPresident, setSelectedPresident] = useState(null);
  const [selectedRegionalPresident, setSelectedRegionalPresident] = useState(null);
  const [selectedMayor, setSelectedMayor] = useState(null);

  // --- ESTADO PARA el modal de confirmación ---
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [finalVote, setFinalVote] = useState(null);
  const [voteType, setVoteType] = useState(null); // 'presidencial', 'presidente-regional', o 'alcalde'

  // Función para obtener los apartados votados por el DNI actual
  const getVotedSections = () => {
    const verifiedDni = localStorage.getItem('verifiedDni');
    if (!verifiedDni) return { presidencial: false, regionales: false };
    
    const votedSectionsData = JSON.parse(localStorage.getItem('votedSectionsByDni') || '{}');
    return votedSectionsData[verifiedDni] || { presidencial: false, regionales: false };
  };

  // Verificar qué apartados ya votó al cargar el componente y cuando cambia la vista
  useEffect(() => {
    const sections = getVotedSections();
    setVotedSections(sections);
  }, [currentView]);


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

  const regionalCandidates = {
    regionalPresidents: [
      { id: 'rp1', name: 'Rohel Sánchez', party: 'Yo Arequipa', logo: 'YA', imageUrl: 'https://placehold.co/64x64/E0A800/FFFFFF?text=RP1&font=lora', description: 'Estrategia centrada en el desarrollo de proyectos de irrigación y minería responsable.' },
      { id: 'rp2', name: 'Elmer Cáceres', party: 'Arequipa Renace', logo: 'AR', imageUrl: 'https://placehold.co/64x64/800080/FFFFFF?text=RP2&font=lora', description: 'Foco en la mejora de la educación rural y la promoción del turismo regional.' },
      { id: 'rp3', name: 'Werner Salcedo', party: 'Inka Pachakuteq', logo: 'IP', imageUrl: 'https://placehold.co/64x64/008080/FFFFFF?text=RP3&font=lora', description: 'Impulso a la inversión en tecnología y la gestión eficiente de recursos hídricos.' },
    ],
    mayors: [
      { id: 'm1', name: 'Rafael A. (Alcalde)', party: 'Unión por el Perú', logo: 'UP', imageUrl: 'https://placehold.co/64x64/2B4E8C/FFFFFF?text=UP&font=lora', description: 'Enfoque en infraestructura urbana y transporte público eficiente.' },
      { id: 'm2', name: 'George F. (Alcalde)', party: 'Podemos Perú', logo: 'PP', imageUrl: 'https://placehold.co/64x64/883997/FFFFFF?text=PP&font=lora', description: 'Prioridad en la limpieza pública y descentralización de servicios municipales.' },
      { id: 'm3', name: 'Daniel O. (Alcalde)', party: 'Victoria Nacional', logo: 'VN', imageUrl: 'https://placehold.co/64x64/E37000/FFFFFF?text=VN&font=lora', description: 'Propuestas para fortalecer el comercio local y el apoyo a pequeños empresarios.' },
    ]
  };

  /**
   * --- MANEJADOR: Para emitir el voto Presidencial ---
   */
  const handleSubmitPresidentialVote = () => {
    if (!selectedPresident) {
      console.error("Falta selección Presidencial");
      return;
    }
    
    const pres = presidentialCandidates.find(p => p.id === selectedPresident);

    setFinalVote({ primary: pres });
    setVoteType('presidencial');
    setShowConfirmationModal(true);
  };

  /**
   * --- MANEJADOR: Para emitir el voto de Presidente Regional ---
   */
  const handleSubmitRegionalPresidentVote = () => {
    if (!selectedRegionalPresident) {
      console.error("Falta selección de Presidente Regional");
      return;
    }

    const regionalPres = regionalCandidates.regionalPresidents.find(rp => rp.id === selectedRegionalPresident);

    setFinalVote({ primary: regionalPres });
    setVoteType('presidente-regional');
    setShowConfirmationModal(true);
  };

  /**
   * --- MANEJADOR: Para emitir el voto de Alcalde ---
   */
  const handleSubmitMayorVote = () => {
    if (!selectedMayor) {
      console.error("Falta selección de Alcalde");
      return;
    }

    const mayor = regionalCandidates.mayors.find(m => m.id === selectedMayor);

    setFinalVote({ primary: mayor });
    setVoteType('alcalde');
    setShowConfirmationModal(true);
  };


  /**
   * --- MANEJADOR: Para cerrar el modal y resetear ---
   */
  const handleCloseModal = () => {
    // Marcar que el usuario ha votado en el apartado específico y guardar el voto
    const verifiedDni = localStorage.getItem('verifiedDni');
    const voterInfo = JSON.parse(localStorage.getItem('voterInfo') || '{}');
    const voterData = voterInfo[verifiedDni] || {};
    
    if (verifiedDni && voteType && finalVote) {
      const votedSectionsData = JSON.parse(localStorage.getItem('votedSectionsByDni') || '{}');
      
      if (!votedSectionsData[verifiedDni]) {
        votedSectionsData[verifiedDni] = { presidencial: false, regionales: false };
      }
      
      // Guardar el voto real
      const allVotes = JSON.parse(localStorage.getItem('realVotes') || '[]');
      const voteRecord = {
        dni: verifiedDni,
        voterName: voterData.name || 'Usuario',
        voterDistrict: voterData.district || 'Desconocido',
        voteType: voteType,
        candidate: finalVote.primary,
        secondaryCandidate: finalVote.secondary || null,
        timestamp: new Date().toISOString()
      };
      allVotes.push(voteRecord);
      localStorage.setItem('realVotes', JSON.stringify(allVotes));
      
      // Marcar el apartado correspondiente como votado
      if (voteType === 'presidencial') {
        votedSectionsData[verifiedDni].presidencial = true;
      } else if (voteType === 'presidente-regional' || voteType === 'alcalde' || voteType === 'regionales') {
        votedSectionsData[verifiedDni].regionales = true;
      }
      
      localStorage.setItem('votedSectionsByDni', JSON.stringify(votedSectionsData));
      
      // Actualizar el estado local
      setVotedSections(votedSectionsData[verifiedDni]);
    }
    
    setShowConfirmationModal(false);
    setFinalVote(null);
    setVoteType(null);
    // Reseteamos y volvemos al menú principal
    setCurrentView('main');
    // También reseteamos las selecciones
    setSelectedPresident(null);
    setSelectedRegionalPresident(null);
    setSelectedMayor(null);
  };

  // --- Textos del Encabezado ---
  const titles = {
    main: "Plataforma de Consulta",
    presidencial: "Elecciones Presidenciales",
    regionales: "Elecciones Regionales"
  };
  const subtitles = {
    main: "Selecciona una categoría para ver los seleccionados.",
    presidencial: "Selecciona tu voto presidencial.",
    regionales: "Selecciona tu voto para Alcalde y/o Presidente Regional.", 
  };


  // Función para renderizar el contenido de las vistas
  const renderViewContent = useMemo(() => {
    switch (currentView) {
      case 'presidencial':
        return (
          <motion.div 
            key="presidencial-view"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="grid grid-cols-1 gap-8 lg:gap-12 max-w-4xl mx-auto"
          >
            
            {/* --- Columna: Candidatos Presidenciales (AZUL PRIMARIO) --- */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
              className="space-y-6"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white text-center border-b-2 border-primary/30 pb-4">
                Candidatos Presidenciales
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
              className="flex justify-center mt-8"
            >
              <Button 
                className="w-full max-w-md h-16 text-2xl font-bold bg-primary/90 hover:bg-primary shadow-lg shadow-primary/20 disabled:bg-gray-500"
                onClick={handleSubmitPresidentialVote}
                disabled={!selectedPresident}
              >
                Emitir Voto Presidencial
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
            
            {/* --- Columna Izquierda: Alcalde (DORADO/AMARILLO) --- */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
              className="space-y-6"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white text-center border-b-4 border-slate-500/50 pb-4">
                Alcalde
              </h2>
              {/* LISTA CON ANIMACIÓN ESCALONADA */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={listVariants}
                className="space-y-4"
              >
                {regionalCandidates.mayors.map((candidato) => (
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
            
            {/* --- Columna Derecha: Presidente Regional (DORADO/AMARILLO) --- */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
              className="space-y-6"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white text-center border-b-4 border-slate-500/50 pb-4">
                Presidente Regional
              </h2>
              {/* LISTA CON ANIMACIÓN ESCALONADA */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={listVariants}
                className="space-y-4"
              >
                {regionalCandidates.regionalPresidents.map((candidato) => (
                  <motion.div key={candidato.id} variants={itemVariants}>
                    <CandidateCard
                      candidate={candidato}
                      type="governor"
                      isSelected={selectedRegionalPresident === candidato.id}
                      onSelect={() => setSelectedRegionalPresident(candidato.id)}
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
                className="w-full max-w-md h-16 text-2xl font-bold bg-slate-700 hover:bg-slate-600 shadow-lg shadow-slate-500/30 disabled:bg-gray-500"
                onClick={() => {
                  // Permitir votar por cualquiera de los dos o ambos
                  if (selectedMayor && selectedRegionalPresident) {
                    // Si ambos están seleccionados, mostrar opción para elegir cuál confirmar
                    // Por ahora, confirmamos ambos en un solo voto
                    const mayor = regionalCandidates.mayors.find(m => m.id === selectedMayor);
                    const regionalPres = regionalCandidates.regionalPresidents.find(rp => rp.id === selectedRegionalPresident);
                    setFinalVote({ primary: mayor, secondary: regionalPres });
                    setVoteType('regionales');
                    setShowConfirmationModal(true);
                  } else if (selectedMayor) {
                    handleSubmitMayorVote();
                  } else if (selectedRegionalPresident) {
                    handleSubmitRegionalPresidentVote();
                  }
                }}
                disabled={!selectedMayor && !selectedRegionalPresident}
              >
                Emitir Voto
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
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Tarjeta 1: Presidencial */}
            <TiltCard
              icon={Gavel}
              title="Presidencial"
              description="Consulta los candidatos presidenciales."
              onClick={() => {
                if (!votedSections.presidencial) {
                  setCurrentView('presidencial');
                }
              }}
              isLocked={votedSections.presidencial}
            />
            {/* Tarjeta 2: Regionales */}
            <TiltCard
              icon={Building}
              title="Regionales"
              description="Consulta las autoridades de tu localidad."
              onClick={() => {
                if (!votedSections.regionales) {
                  setCurrentView('regionales');
                }
              }}
              isLocked={votedSections.regionales}
            />
            
            {/* Tarjeta 3: Panel de Enlaces Oficiales */}
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
  }, [currentView, selectedPresident, selectedRegionalPresident, selectedMayor, votedSections]);


  // Función para verificar si puede acceder a una vista
  const canAccessView = (viewName) => {
    if (viewName === 'presidencial') {
      return !votedSections.presidencial;
    } else if (viewName === 'regionales') {
      return !votedSections.regionales;
    }
    return true;
  };

  // Si intenta acceder a un apartado ya votado, mostrar pantalla de bloqueo
  if ((currentView === 'presidencial' && votedSections.presidencial) ||
      (currentView === 'regionales' && votedSections.regionales)) {
    return (
      <main className="flex-grow flex flex-col items-center justify-center min-h-screen py-20 px-4 
                       bg-animated-gradient overflow-hidden text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center space-y-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-32 h-32 bg-red-500/20 rounded-full flex items-center justify-center"
          >
            <Lock className="h-16 w-16 text-red-400" />
          </motion.div>
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">
              Ya has emitido tu voto
            </h1>
            <p className="text-xl text-gray-300">
              Ya has votado en el apartado de <strong>{currentView === 'presidencial' ? 'Presidencial' : 'Regionales'}</strong>.
            </p>
            <p className="text-gray-400">
              Por seguridad electoral, no se permite votar nuevamente en este apartado.
            </p>
          </div>

          <div className="bg-card/50 border border-white/10 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <CheckCircle className="h-6 w-6" />
              <span className="font-semibold">Voto confirmado y registrado</span>
            </div>
            <p className="text-sm text-gray-400">
              Gracias por participar en el proceso electoral. Tu voto es importante para la democracia.
            </p>
          </div>

          <Button
            onClick={() => setCurrentView('main')}
            className="h-12 px-8 text-lg font-semibold bg-primary hover:bg-primary/90"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver al menú principal
          </Button>
        </motion.div>
      </main>
    );
  }

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