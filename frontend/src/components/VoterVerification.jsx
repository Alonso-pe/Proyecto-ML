import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, CheckCircle, XCircle, Loader2, ArrowRight, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/card.jsx';
import { Button } from '@/ui/button.jsx';
import { Input } from '@/ui/input.jsx';
import { useVoterData } from '@/hooks/useVoterData';
import { useToast } from '@/ui/use-toast';


// --- 1. PRIMER CAMBIO: Acepta la prop 'onVerificationSuccess' ---
const VoterVerification = ({ onVerificationSuccess }) => {
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

  // --- 2. SEGUNDO CAMBIO: Llama a la función 'onVerificationSuccess' ---
  const handleContinue = () => {
    toast({
      title: '🚧 Votación en Proceso',
      description: 'Serás redirigido al módulo de votación. ¡Gracias por participar! 🚀',
    });
    
    // ¡AQUÍ ESTÁ LA LÍNEA QUE FALTABA!
    // Esto le "avisa" al App.jsx que debe cambiar de vista.
    onVerificationSuccess(); 
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="bg-card/70 border-white/20 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-lg">
        <CardHeader className="text-center p-8">
          <CardTitle className="text-3xl font-bold text-white">Verifique su Identidad</CardTitle>
          <CardDescription className="text-gray-300 mt-2">Ingrese su número de DNI para continuar.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0 space-y-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Ingrese su DNI (8 dígitos)"
              value={dni}
              onChange={handleDniChange}
              maxLength="8"
              className={`h-14 text-lg pr-28 text-center bg-black/30 border-2 ${!isValidDni && dni.length > 0 ? 'border-red-500' : 'border-white/30'} focus:border-primary focus:ring-primary`}
            />
            <Button 
              onClick={validateDni}
              disabled={isLoading || dni.length !== 8}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-11 px-4 bg-primary hover:bg-primary/90 disabled:bg-gray-500"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Verificar'}
            </Button>
          </div>
          
          <AnimatePresence>
            {!isValidDni && dni.length > 0 && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-400 text-sm text-center"
              >
                El DNI debe contener 8 dígitos.
              </motion.p>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-center space-x-2 text-red-400"
              >
                <XCircle className="h-5 w-5" />
                <p>{error}</p>
              </motion.div>
            )}
            {voterData && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="bg-black/20 p-6 rounded-lg border border-white/10 space-y-4"
              >
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-300" />
                  <span className="text-white">{voterData.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-300" />
                  <span className="text-white">{voterData.district}</span>
                </div>
                <div className="flex items-center space-x-3">
                  {voterData.status === 'Habilitado para votar' ? 
                    <CheckCircle className="h-5 w-5 text-green-400" /> : 
                    <XCircle className="h-5 w-5 text-yellow-400" />}
                  <span className={`font-semibold ${voterData.status === 'Habilitado para votar' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {voterData.status}
                  </span>
                </div>

                {voterData.status === 'Habilitado para votar' && (
                  // Este botón ahora llama a 'handleContinue', que está modificado
                  <Button onClick={handleContinue} className="w-full mt-4 h-12 text-lg font-bold bg-green-600 hover:bg-green-700">
                    Ingresar al proceso de votación <ArrowRight className="ml-2 h-5 w-5"/>
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="text-center text-xs text-gray-400 pt-4 flex items-center justify-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Sus datos están protegidos bajo los estándares del Estado Peruano.</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VoterVerification;