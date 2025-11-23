import React, { useState, useMemo, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Gavel, Building, ArrowRight, ArrowLeft, BookOpen, CheckCircle, Lock } from 'lucide-react'; 

const Card = ({ className, children, onClick }) => (
  <div onClick={onClick} className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>{children}</div>
);
const CardHeader = ({ className, children }) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
const CardTitle = ({ className, children }) => <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardDescription = ({ className, children }) => <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>;
const CardContent = ({ className, children }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const Button = ({ className, children, onClick, disabled, variant }) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none ring-offset-background
    ${variant === 'ghost' ? 'hover:bg-accent hover:text-accent-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/90'} 
    ${className}`}
  >
    {children}
  </button>
);

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, when: "beforeChildren" } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 150, damping: 12 } },
};

const TiltCard = ({ icon: Icon, title, description, onClick, isLocked = false }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [10, -10]);
  const rotateY = useTransform(x, [-50, 50], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width * 100 - 50);
    y.set((e.clientY - rect.top) / rect.height * 100 - 50);
  };

  return (
    <motion.div style={{ perspective: 1000 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
      <motion.div
        style={isLocked ? {} : { rotateX, rotateY }}
        onMouseMove={!isLocked ? handleMouseMove : undefined}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        onClick={!isLocked ? onClick : undefined}
        className={isLocked ? "cursor-not-allowed" : "cursor-pointer"}
      >
        <Card className={`bg-card/80 border-white/10 shadow-xl h-full flex flex-col backdrop-blur-sm transition-all duration-300 ${isLocked ? 'opacity-60 border-red-500/30' : 'hover:border-primary/50 hover:shadow-primary/20'}`}>
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
            <CardDescription className={isLocked ? "text-gray-500 pt-2" : "text-gray-300 pt-2"}>{isLocked ? 'Ya has emitido tu voto en este apartado' : description}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 flex-grow flex flex-col justify-end">
            <div className="flex justify-end items-center mt-4">
              {isLocked ? (
                <div className="flex items-center space-x-2 text-red-400"><Lock className="h-4 w-4" /><span className="text-sm font-semibold">Bloqueado</span></div>
              ) : (
                <><span className="text-primary text-sm font-semibold">Ingresar</span><ArrowRight className="h-5 w-5 text-primary ml-2" /></>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, voteData, type }) => {
  if (!isOpen || !voteData) return null;
  const { primary, secondary } = voteData;
  const title = 'Voto Confirmado';

  let primaryLabel = "Candidato";
  let secondaryLabel = "Secundario";
  
  if (type === 'presidencial') {
    primaryLabel = "Presidente";
  } else if (type === 'alcaldia') {
    primaryLabel = "Alcalde Provincial";
    secondaryLabel = "Alcalde Distrital";
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-white">{title}</h3>
              <p className="text-slate-400 mt-2">Tu selección ha sido registrada exitosamente.</p>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">{primaryLabel}</p>
                <p className="text-lg font-bold text-white">{primary.name}</p>
                <p className="text-sm text-slate-400">{primary.party}</p>
              </div>
              
              {secondary && (
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">{secondaryLabel}</p>
                  <p className="text-lg font-bold text-white">{secondary.name}</p>
                  <p className="text-sm text-slate-400">{secondary.party}</p>
                </div>
              )}
            </div>

            <Button onClick={onClose} className="w-full mt-6 h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white font-bold">
              Finalizar y Volver
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CandidateCard = ({ candidate, type, isSelected, onSelect }) => {
  const accentClass = (type === 'president') ? 'border-primary shadow-primary/40' : 'border-emerald-500 shadow-emerald-500/40';
  
  const handleImageError = (e) => {
    e.target.onerror = null; 
    e.target.src = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"; 
  };

  return (
      <Card onClick={onSelect} className={`bg-card/80 border-2 backdrop-blur-sm cursor-pointer transition-all duration-300 ${isSelected ? `bg-card/90 ${accentClass} scale-[1.01] ring-2 ring-offset-2 ring-offset-black` : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}>
        <CardContent className="p-4 flex items-center space-x-4">
          <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 ${isSelected ? 'border-primary bg-primary' : 'border-gray-500'} flex items-center justify-center`}>
            {isSelected && <div className="w-3 h-3 rounded-full bg-white"></div>}
          </div>
          
          <div className="relative w-16 h-16 flex-shrink-0">
            <img 
                src={candidate.imageUrl} 
                alt={candidate.name} 
                className="w-full h-full rounded-full object-cover border-2 border-white/10 bg-gray-800" 
                onError={handleImageError}
            />
            {candidate.logo && candidate.logo.length < 5 && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center text-[8px] font-bold text-black border border-gray-300 shadow-sm overflow-hidden">
                    {candidate.logo}
                </div>
            )}
          </div>

          <div className="flex-grow min-w-0">
            <p className="text-lg font-semibold text-white truncate">{candidate.name}</p>
            <p className="text-sm text-gray-400">{candidate.party}</p>
            {candidate.description && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{candidate.description}</p>}
          </div>
        </CardContent>
      </Card>
  );
};

export default function ElectionSelection({ onGoBack }) {
  const [currentView, setCurrentView] = useState('main');
  const [votedSections, setVotedSections] = useState({ presidencial: false, alcaldia: false });
  const [isFullComplete, setIsFullComplete] = useState(false);

  const [selectedPresident, setSelectedPresident] = useState(null);
  const [selectedProvincial, setSelectedProvincial] = useState(null);
  const [selectedDistrital, setSelectedDistrital] = useState(null);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [finalVote, setFinalVote] = useState(null);
  const [voteType, setVoteType] = useState(null);

  useEffect(() => {
    const verifiedDni = localStorage.getItem('verifiedDni');
    if (verifiedDni) {
      const allVotesData = JSON.parse(localStorage.getItem('votedSectionsByDni') || '{}');
      const myVotes = allVotesData[verifiedDni] || { presidencial: false, alcaldia: false };
      if (myVotes.regionales !== undefined && myVotes.alcaldia === undefined) {
        myVotes.alcaldia = myVotes.regionales;
      }
      setVotedSections(myVotes);
      if (myVotes.presidencial && myVotes.alcaldia) {
        setIsFullComplete(true);
      }
    }
  }, [currentView]);

  const handleVoteComplete = (type) => {
    const verifiedDni = localStorage.getItem('verifiedDni');
    if (verifiedDni) {
      const allVotesData = JSON.parse(localStorage.getItem('votedSectionsByDni') || '{}');
      const myVotes = allVotesData[verifiedDni] || { presidencial: false, alcaldia: false };
      
      if (type === 'presidencial') myVotes.presidencial = true;
      if (type === 'alcaldia') myVotes.alcaldia = true;
      
      allVotesData[verifiedDni] = myVotes;
      localStorage.setItem('votedSectionsByDni', JSON.stringify(allVotesData));
      setVotedSections(myVotes);
      
      setSelectedPresident(null);
      setSelectedProvincial(null);
      setSelectedDistrital(null);

      if (myVotes.presidencial && myVotes.alcaldia) {
        setIsFullComplete(true);
      } else {
        setCurrentView('main');
      }
    }
  };

  const handleSubmitPresidentialVote = () => {
    if (!selectedPresident) return;
    const pres = presidentialCandidates.find(p => p.id === selectedPresident);
    setFinalVote({ primary: pres });
    setVoteType('presidencial');
    setShowConfirmationModal(true);
  };

  const handleSubmitMunicipalVote = () => {
    if (!selectedProvincial || !selectedDistrital) return;
    const provincial = provincialCandidates.find(r => r.id === selectedProvincial);
    const distrital = distritalCandidates.find(m => m.id === selectedDistrital);
    setFinalVote({ primary: provincial, secondary: distrital });
    setVoteType('alcaldia');
    setShowConfirmationModal(true);
  };

  const handleCloseModal = () => {
    setShowConfirmationModal(false);
    if (voteType) handleVoteComplete(voteType);
    setFinalVote(null);
    setVoteType(null);
  };

  const presidentialCandidates = [
    { id: 'p1', name: 'Keiko Fujimori', party: 'Fuerza Popular', logo: 'K', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Keiko_Fujimori_por_el_Per%C3%BA.jpg/220px-Keiko_Fujimori_por_el_Per%C3%BA.jpg', description: 'Mano dura y reactivación económica.' },
    { id: 'p2', name: 'Pedro Castillo', party: 'Perú Libre', logo: 'PL', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Pedro_Castillo_por_el_Per%C3%BA_-_2.jpg/220px-Pedro_Castillo_por_el_Per%C3%BA_-_2.jpg', description: 'Nueva constitución y reforma agraria.' },
    { id: 'p3', name: 'Rafael López Aliaga', party: 'Renovación Popular', logo: 'R', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Rafael_L%C3%B3pez_Aliaga_Caz%C3%B3rla.jpg/220px-Rafael_L%C3%B3pez_Aliaga_Caz%C3%B3rla.jpg', description: 'Capitalismo popular y eficiencia estatal.' },
    { id: 'p4', name: 'Hernando de Soto', party: 'Avanza País', logo: 'AP', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Hernando_de_Soto_Polar_-_World_Economic_Forum_Annual_Meeting_2011.jpg/220px-Hernando_de_Soto_Polar_-_World_Economic_Forum_Annual_Meeting_2011.jpg', description: 'Formalización y libre mercado.' },
    { id: 'p5', name: 'Verónika Mendoza', party: 'Juntos por el Perú', logo: 'JP', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Ver%C3%B3nika_Mendoza_en_agosto_de_2021.jpg/220px-Ver%C3%B3nika_Mendoza_en_agosto_de_2021.jpg', description: 'Cambios profundos y justicia social.' },
  ];

  // CANDIDATOS ALCALDÍA PROVINCIAL (LIMA)
  const provincialCandidates = [
    { id: 'm1', name: 'Rafael López Aliaga', party: 'Renovación', logo: 'R', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Rafael_L%C3%B3pez_Aliaga_Caz%C3%B3rla.jpg/220px-Rafael_L%C3%B3pez_Aliaga_Caz%C3%B3rla.jpg', description: 'Lima Potencia Mundial.' },
    { id: 'm2', name: 'George Forsyth', party: 'Somos Perú', logo: 'SP', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Alcalde_George_Forsyth.jpg/320px-Alcalde_George_Forsyth.jpg', description: 'Seguridad y orden.' },
    { id: 'm3', name: 'Daniel Urresti', party: 'Podemos', logo: 'P', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Daniel_Urresti.jpg/220px-Daniel_Urresti.jpg', description: 'Mano dura contra la delincuencia.' },
  ];

  // CANDIDATOS ALCALDÍA DISTRITAL (MOCK)
  const distritalCandidates = [
    { id: 'd1', name: 'Carlos Burgos', party: 'Avanza País', logo: 'AP', imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg', description: 'Gestión distrital eficiente.' },
    { id: 'd2', name: 'Francis Allison', party: 'APP', logo: 'A', imageUrl: 'https://randomuser.me/api/portraits/men/45.jpg', description: 'Obras vecinales.' },
    { id: 'd3', name: 'Renzo Reggiardo', party: 'Renovación', logo: 'R', imageUrl: 'https://randomuser.me/api/portraits/men/11.jpg', description: 'Seguridad Inteligente.' },
  ];

  if (isFullComplete) {
    return (
      <main className="flex-grow flex flex-col items-center justify-center min-h-screen py-20 px-4 bg-[#020617] text-white">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center space-y-8">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
            className="mx-auto w-32 h-32 bg-emerald-500/20 rounded-full flex items-center justify-center ring-4 ring-emerald-500/30"
          >
            <CheckCircle className="h-16 w-16 text-emerald-400" />
          </motion.div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">¡Votación Completada!</h1>
            <p className="text-lg text-gray-300">Has cumplido con tu deber cívico en todos los apartados disponibles.</p>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <p className="text-sm text-slate-400">Tus votos han sido encriptados y registrados correctamente en el Blockchain.</p>
            </div>
          </div>

          <Button onClick={onGoBack} className="h-12 px-8 text-lg w-full bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20">
            <ArrowLeft className="h-5 w-5 mr-2" /> Volver al Inicio
          </Button>
        </motion.div>
      </main>
    );
  }

  if (currentView === 'presidencial') {
    return (
      <div className="min-h-screen bg-[#020617] py-12 px-4 flex justify-center">
        <div className="w-full max-w-3xl space-y-8">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setCurrentView('main')} className="text-gray-400 hover:text-white"><ArrowLeft className="mr-2 h-4 w-4"/> Volver</Button>
            <h2 className="text-2xl font-bold text-white">Elección Presidencial</h2>
          </div>
          <div className="space-y-4">
            {presidentialCandidates.map(c => (
              <CandidateCard key={c.id} candidate={c} type="president" isSelected={selectedPresident === c.id} onSelect={() => setSelectedPresident(c.id)} />
            ))}
          </div>
          <div className="pt-6">
            <Button onClick={handleSubmitPresidentialVote} disabled={!selectedPresident} className="w-full h-14 text-lg font-bold">CONFIRMAR VOTO PRESIDENCIAL</Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'alcaldia') {
    return (
      <div className="min-h-screen bg-[#020617] py-12 px-4 flex justify-center">
        <div className="w-full max-w-3xl space-y-8">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setCurrentView('main')} className="text-gray-400 hover:text-white"><ArrowLeft className="mr-2 h-4 w-4"/> Volver</Button>
            <h2 className="text-2xl font-bold text-white">Elección Municipal</h2>
          </div>
          
          <div className="space-y-6">
            <div>
                <h3 className="text-primary font-bold mb-3 uppercase text-sm tracking-wider">Alcalde Provincial</h3>
                <div className="space-y-3">
                    {provincialCandidates.map(c => (
                    <CandidateCard key={c.id} candidate={c} type="municipal" isSelected={selectedProvincial === c.id} onSelect={() => setSelectedProvincial(c.id)} />
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-emerald-500 font-bold mb-3 uppercase text-sm tracking-wider">Alcalde Distrital</h3>
                <div className="space-y-3">
                    {distritalCandidates.map(c => (
                    <CandidateCard key={`d-${c.id}`} candidate={c} type="municipal" isSelected={selectedDistrital === c.id} onSelect={() => setSelectedDistrital(c.id)} />
                    ))}
                </div>
            </div>
          </div>

          <div className="pt-6">
            <Button onClick={handleSubmitMunicipalVote} disabled={!selectedProvincial || !selectedDistrital} className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-700">CONFIRMAR VOTOS MUNICIPALES</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-grow flex flex-col items-center min-h-screen py-20 px-4 bg-[#020617] text-white">
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="mb-12 text-center relative">
            <Button variant="ghost" onClick={onGoBack} className="absolute left-0 top-0 text-slate-400 hover:text-white hidden md:flex"><ArrowLeft className="mr-2 h-4 w-4"/> Salir</Button>
            <h1 className="text-5xl font-extrabold text-white mb-4">Plataforma de Consulta</h1>
            <p className="text-xl text-gray-400">Selecciona una categoría para emitir tu voto.</p>
        </div>

        <motion.div initial="hidden" animate="visible" variants={listVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <TiltCard 
            icon={Gavel} 
            title="Presidencial" 
            description="Elige al Presidente de la República." 
            onClick={() => setCurrentView('presidencial')} 
            isLocked={votedSections.presidencial} 
          />
          <TiltCard 
            icon={Building} 
            title="Alcaldía" 
            description="Elige Alcalde Provincial y Distrital." 
            onClick={() => setCurrentView('alcaldia')} 
            isLocked={votedSections.alcaldia} 
          />
          <motion.div variants={itemVariants} className="lg:col-span-1">
             <Card className="bg-slate-900/50 border-white/10 h-full flex flex-col">
                <CardHeader><div className="flex items-center gap-3"><BookOpen className="text-blue-400"/> <CardTitle>Información</CardTitle></div></CardHeader>
                <CardContent className="text-sm text-gray-400 space-y-4">
                    <p>Recuerda que el voto es obligatorio para mayores de 18 años.</p>
                    <div className="p-3 bg-blue-900/20 rounded border border-blue-500/20">
                        <span className="text-blue-400 font-bold">Estado:</span> Votación Abierta
                    </div>
                </CardContent>
             </Card>
          </motion.div>
        </motion.div>
        
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