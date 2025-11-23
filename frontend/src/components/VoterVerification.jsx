import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, CheckCircle, XCircle, Loader2, ArrowRight, Shield, X, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/card.jsx';
import { Button } from '@/ui/button.jsx';
import { Input } from '@/ui/input.jsx';
import { useVoterData } from '@/hooks/useVoterData';
import { useToast } from '@/ui/use-toast';

const ROLE_OPTIONS = [
  { id: 'administrador', label: 'Administrador', icon: Shield },
  { id: 'usuario', label: 'Usuario', icon: User },
];

const VoterVerification = ({ onVerificationSuccess, mode = 'user', onClose }) => {
  const { 
    dni, 
    voterData, 
    error, 
    isLoading, 
    isValidDni,
    handleDniChange, 
    validateDni 
  } = useVoterData();

  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState(mode === 'admin' ? 'administrador' : 'usuario');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [alreadyVotedComplete, setAlreadyVotedComplete] = useState(false);

  useEffect(() => {
    if (dni && dni.length === 8) {
      const votedSectionsData = JSON.parse(localStorage.getItem('votedSectionsByDni') || '{}');
      const myVotes = votedSectionsData[dni];
      // Verifica 'alcaldia' o el viejo 'regionales'
      if (myVotes && myVotes.presidencial && (myVotes.alcaldia || myVotes.regionales)) {
        setAlreadyVotedComplete(true);
      } else {
        setAlreadyVotedComplete(false);
      }
    }
  }, [dni]);

  const resetAdminState = () => {
    setAdminEmail('');
    setAdminPassword('');
    setAdminError('');
    setIsAdminLoading(false);
  };

  const handleRoleChange = (roleId) => {
    if (!mode || mode === 'both') {
      setSelectedRole(roleId);
      if (roleId === 'usuario') resetAdminState();
    }
  };

  const handleContinue = () => {
    if (selectedRole === 'usuario') {
      localStorage.setItem('verifiedDni', dni);
      
      const voterInfo = JSON.parse(localStorage.getItem('voterInfo') || '{}');
      if (!voterInfo[dni] && voterData) {
        voterInfo[dni] = {
          name: voterData.name,
          district: voterData.district
        };
        localStorage.setItem('voterInfo', JSON.stringify(voterInfo));
      }
      
      if (alreadyVotedComplete) {
         toast({
          title: 'ℹ️ Consulta de Estado',
          description: 'Accediendo a la plataforma para verificar sus votos emitidos.',
        });
      } else {
        toast({
          title: '🚧 Votación en Proceso',
          description: 'Serás redirigido al módulo de votación. ¡Gracias por participar! 🚀',
        });
      }
      onVerificationSuccess(); 
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto relative px-4 sm:px-0"
    >
      <Card className="bg-[#0f172a]/95 border-white/10 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl">
        {mode && mode !== 'both' && onClose && (
          <Button
            variant="ghost"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white hover:bg-white/10 rounded-full h-8 w-8 p-0"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
        
        <CardHeader className="text-center pt-10 pb-6 px-6">
          <CardTitle className="text-3xl font-extrabold text-white tracking-tight">Verifique su Identidad</CardTitle>
          <CardDescription className="text-slate-400 mt-2 text-base">
            {selectedRole === 'administrador'
              ? 'Acceso restringido al personal autorizado.'
              : 'Ingrese su número de DNI para continuar.'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-6 pb-8 space-y-6">
          
          {!mode || mode === 'both' ? (
            <div className="flex justify-center">
              <div className="flex items-center gap-1 bg-slate-900/50 border border-white/10 rounded-full p-1">
                {ROLE_OPTIONS.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <Button
                      key={role.id}
                      type="button"
                      variant="ghost"
                      onClick={() => handleRoleChange(role.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200
                        ${isSelected 
                          ? 'bg-primary text-primary-foreground shadow-md font-bold' 
                          : 'text-slate-400 hover:text-white hover:bg-white/5 font-medium'
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      {role.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-5 py-2">
                {mode === 'admin' ? (
                  <>
                    <Shield className="h-4 w-4 text-amber-500" />
                    <span className="text-amber-500 font-bold text-sm uppercase tracking-wide">Administrador</span>
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4 text-amber-500" />
                    <span className="text-amber-500 font-bold text-sm uppercase tracking-wide">Usuario Votante</span>
                  </>
                )}
              </div>
            </div>
          )}

          {selectedRole === 'administrador' ? (
            <div className="space-y-4">
              <Input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="Correo institucional"
                className="h-14 text-base bg-slate-950/50 border-slate-700 focus:border-primary focus:ring-primary/20 text-white placeholder:text-slate-500 rounded-xl"
              />
              <Input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Contraseña"
                className="h-14 text-base bg-slate-950/50 border-slate-700 focus:border-primary focus:ring-primary/20 text-white placeholder:text-slate-500 rounded-xl"
              />
              {adminError && (
                <p className="text-center text-sm text-red-400 font-medium bg-red-500/10 py-2 rounded-lg">{adminError}</p>
              )}
              <Button
                onClick={async () => {
                  setAdminError('');
                  if (!adminEmail || !adminEmail.includes('@')) { setAdminError('Correo inválido.'); return; }
                  if (!adminPassword || adminPassword.length < 6) { setAdminError('Contraseña corta.'); return; }

                  try {
                    setIsAdminLoading(true);
                    if (adminEmail === 'admin@onpe.gob.pe' && adminPassword === 'admin123') {
                      toast({ title: '✅ Acceso Autorizado', description: 'Iniciando sesión segura...' });
                      localStorage.setItem('isAdmin', 'true');
                      if (onVerificationSuccess) {
                        setTimeout(() => onVerificationSuccess(), 800);
                      } else {
                        window.location.reload();
                      }
                    } else {
                      setAdminError('Credenciales no válidas.');
                      toast({ variant: "destructive", title: "Acceso Denegado", description: "Verifique sus credenciales." });
                    }
                  } finally {
                    setIsAdminLoading(false);
                  }
                }}
                disabled={isAdminLoading}
                className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all rounded-xl"
              >
                {isAdminLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Iniciar Sesión'}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                  <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">DNI</span>
                </div>
                <Input
                  type="text"
                  placeholder=""
                  value={dni}
                  onChange={handleDniChange}
                  maxLength="8"
                  className={`h-16 text-3xl text-center font-mono tracking-[0.15em] bg-slate-950/60 border-2 transition-all 
                    ${!isValidDni && dni.length > 0 ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-primary/50'} 
                    text-white rounded-xl shadow-inner focus:bg-slate-900`}
                />
                 {dni.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-slate-600 text-2xl tracking-widest opacity-50">********</span>
                    </div>
                 )}
              </div>

              <Button 
                onClick={validateDni}
                disabled={isLoading || dni.length !== 8}
                className="h-14 w-full text-lg font-bold bg-slate-700 hover:bg-slate-600 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-xl shadow-lg border border-slate-600/50"
              >
                {isLoading ? (
                  <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Verificando...</>
                ) : (
                  'Verificar'
                )}
              </Button>
            </div>
          )}
          
          {selectedRole === 'usuario' && (
            <AnimatePresence>
              {!isValidDni && dni.length > 0 && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-400 text-sm text-center font-medium">
                  El DNI debe tener exactamente 8 dígitos.
                </motion.p>
              )}
              
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-3 text-red-400 justify-center">
                  <XCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </motion.div>
              )}

              {voterData && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="bg-[#1e293b]/80 p-5 rounded-xl border border-slate-700 shadow-xl space-y-5 mt-2"
                >
                  {alreadyVotedComplete ? (
                    <div className="text-center py-2">
                      <div className="mx-auto w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center mb-3 border border-blue-500/30">
                        <CheckCircle className="h-7 w-7 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Votación Registrada</h3>
                      <p className="text-slate-400 text-sm mt-1 px-4">
                        Este DNI ya ha completado su participación en el proceso electoral.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-800 rounded-lg shrink-0 border border-slate-700 text-amber-400">
                          <User className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Votante</p>
                          <p className="text-white font-bold text-lg leading-tight">{voterData.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-800 rounded-lg shrink-0 border border-slate-700 text-amber-400">
                          <MapPin className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Ubicación</p>
                          <p className="text-white font-medium">{voterData.district}</p>
                        </div>
                      </div>

                      <div className="h-px bg-slate-700/50 my-2" />
                      
                      <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-2 rounded-lg border border-emerald-400/20">
                         <CheckCircle className="h-5 w-5" />
                         <span className="font-bold text-sm">Habilitado para votar</span>
                      </div>
                    </div>
                  )}

                  {voterData.status === 'Habilitado para votar' && (
                    <Button 
                        onClick={handleContinue} 
                        className={`w-full h-14 text-lg font-bold shadow-lg transition-transform active:scale-[0.98] rounded-xl
                          ${alreadyVotedComplete 
                            ? 'bg-slate-600 hover:bg-slate-500 text-white shadow-slate-900/20' 
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'}`
                        }
                    >
                      <span className="flex items-center justify-center gap-2">
                        {alreadyVotedComplete ? 'Ver Estado' : 'Continuar'} 
                        {alreadyVotedComplete ? <Eye className="h-5 w-5"/> : <ArrowRight className="h-5 w-5"/>}
                      </span>
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
          
          <div className="text-center flex items-center justify-center gap-2 opacity-40 hover:opacity-80 transition-opacity mt-4">
            <Shield className="h-3 w-3 text-slate-300" />
            <span className="text-[10px] text-slate-300 uppercase tracking-widest font-bold">Seguridad ONPE</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VoterVerification;