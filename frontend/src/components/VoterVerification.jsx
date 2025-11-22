import React from "react";
import useVoterData from "../hooks/useVoterData";
import { User, MapPin, CheckCircle, XCircle } from "lucide-react";
import Button from "../ui/button";
import Input from "../ui/input";

export default function VoterVerification() {
  const {
    dni,
    setDni,
    voterData,
    error,
    isLoading,
    isValidDni,
    validateDni,
  } = useVoterData();

  return (
    <div className="w-full max-w-lg mx-auto bg-gray-900 text-white p-6 rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">Verificación de Identidad</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Ingrese su DNI</label>
        <Input
          type="text"
          value={dni}
          maxLength={8}
          onChange={(e) => setDni(e.target.value)}
          placeholder="Ej: 70707070"
          className="bg-gray-800 text-white border-gray-700"
        />
      </div>

      <Button
        onClick={validateDni}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? "Validando..." : "Validar DNI"}
      </Button>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-400">
          <XCircle />
          <span>{error}</span>
        </div>
      )}

      {isValidDni && voterData && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="text-green-400" /> Datos del Votante
          </h3>

          <div className="flex items-center gap-2 mb-2">
            <User className="text-gray-400" />
            <span className="text-white">{voterData.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="text-gray-400" />
            <span className="text-white">{voterData.district}</span>
          </div>

          <p className="mt-3 text-green-400">{voterData.status}</p>
        </div>
      )}
    </div>
  );
}





// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { User, MapPin, CheckCircle, XCircle, Loader2, ArrowRight, Shield, X } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/card.jsx';
// import { Button } from '@/ui/button.jsx';
// import { Input } from '@/ui/input.jsx';
// import { useVoterData } from '@/hooks/useVoterData';
// import { useToast } from '@/ui/use-toast';

// const ROLE_OPTIONS = [
//   {
//     id: 'administrador',
//     label: 'Administrador',
//     icon: Shield,
//   },
//   {
//     id: 'usuario',
//     label: 'Usuario',
//     icon: User,
//   },
// ];

// // --- 1. PRIMER CAMBIO: Acepta la prop 'onVerificationSuccess' y 'mode' ---
// const VoterVerification = ({ onVerificationSuccess, mode = 'user', onClose }) => {
//   const { 
//     dni, 
//     voterData, 
//     error, 
//     isLoading, 
//     isValidDni,
//     handleDniChange, 
//     validateDni 
//   } = useVoterData();

//   // Estado de admin global
//   const [globalAdminState, setGlobalAdminState] = useState(localStorage.getItem('isAdmin') === 'true');
//   const { toast } = useToast();
//   // Si mode es 'admin', forzar selectedRole a 'administrador', si es 'user' a 'usuario'
//   const [selectedRole, setSelectedRole] = useState(mode === 'admin' ? 'administrador' : 'usuario');
//   const [adminEmail, setAdminEmail] = useState('');
//   const [adminPassword, setAdminPassword] = useState('');
//   const [adminError, setAdminError] = useState('');
//   const [isAdminLoading, setIsAdminLoading] = useState(false);

//   const resetAdminState = () => {
//     setAdminEmail('');
//     setAdminPassword('');
//     setAdminError('');
//     setIsAdminLoading(false);
//   };

//   const handleRoleChange = (roleId) => {
//     // Solo permitir cambio de rol si no hay un mode específico
//     if (!mode || mode === 'both') {
//       setSelectedRole(roleId);
//       if (roleId === 'usuario') {
//         resetAdminState();
//       }
//     }
//   };

//   // Verificar si el usuario ya votó
//   const hasVoted = () => {
//     if (selectedRole === 'usuario' && dni) {
//       const votedDnis = JSON.parse(localStorage.getItem('votedDnis') || '[]');
//       return votedDnis.includes(dni);
//     }
//     return false;
//   };

//   // --- 2. SEGUNDO CAMBIO: Llama a la función 'onVerificationSuccess' ---
//   const handleContinue = () => {
//     if (selectedRole === 'usuario') {
//       // Verificar si ya votó
//       if (hasVoted()) {
//         toast({
//           variant: "destructive",
//           title: '❌ Ya has votado',
//           description: 'Este DNI ya ha emitido su voto. No se permite votar nuevamente.',
//         });
//         return;
//       }
      
//       // Guardar el DNI verificado en localStorage
//       localStorage.setItem('verifiedDni', dni);
      
//       // Guardar información del votante para usar después
//       const voterInfo = JSON.parse(localStorage.getItem('voterInfo') || '{}');
//       voterInfo[dni] = {
//         name: voterData.name,
//         district: voterData.district
//       };
//       localStorage.setItem('voterInfo', JSON.stringify(voterInfo));
      
//       toast({
//         title: '🚧 Votación en Proceso',
//         description: 'Serás redirigido al módulo de votación. ¡Gracias por participar! 🚀',
//       });
//       onVerificationSuccess(); // Solo para usuarios normales
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       className="w-full max-w-md mx-auto relative"
//     >
//       <Card className="bg-card/70 border-white/20 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-lg">
//         {/* Botón para cerrar (solo si hay modo específico) */}
//         {mode && mode !== 'both' && onClose && (
//           <Button
//             variant="ghost"
//             onClick={onClose}
//             className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
//           >
//             <X className="h-5 w-5" />
//           </Button>
//         )}
//         <CardHeader className="text-center p-8">
//           <CardTitle className="text-3xl font-bold text-white">Verifique su Identidad</CardTitle>
//           <CardDescription className="text-gray-300 mt-2">
//             {selectedRole === 'administrador'
//               ? 'Ingrese su correo institucional y contraseña para continuar.'
//               : 'Ingrese su número de DNI para continuar.'}
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="p-8 pt-0 space-y-6">
//           {/* Solo mostrar selector de rol si no hay un mode específico */}
//           {!mode || mode === 'both' ? (
//             <div className="flex flex-col items-center space-y-3">
//               <div className="flex items-center gap-3 bg-black/30 border border-white/10 rounded-full p-2">
//                 {ROLE_OPTIONS.map((role) => {
//                   const Icon = role.icon;
//                   const isSelected = selectedRole === role.id;
//                   return (
//                     <Button
//                       key={role.id}
//                       type="button"
//                       variant="ghost"
//                       onClick={() => handleRoleChange(role.id)}
//                       className={`flex items-center gap-2 px-6 py-3 text-base md:text-lg font-semibold rounded-full transition-all duration-200 border 
//                         ${isSelected 
//                           ? 'bg-primary text-white border-primary shadow-lg scale-105' 
//                           : 'border-transparent text-gray-300 hover:text-white hover:bg-white/10'
//                         }`}
//                     >
//                       <Icon className="h-5 w-5" />
//                       {role.label}
//                     </Button>
//                   );
//                 })}
//               </div>
//               <p className="text-sm text-gray-400 uppercase tracking-wide">
//                 Perfil seleccionado: <span className="text-white font-semibold">{selectedRole === 'administrador' ? 'Administrador' : 'Usuario'}</span>
//               </p>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center space-y-3">
//               <div className="flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-6 py-3">
//                 {mode === 'admin' ? (
//                   <>
//                     <Shield className="h-5 w-5 text-primary" />
//                     <span className="text-white font-semibold">Acceso de Administrador</span>
//                   </>
//                 ) : (
//                   <>
//                     <User className="h-5 w-5 text-primary" />
//                     <span className="text-white font-semibold">Verificación de Usuario</span>
//                   </>
//                 )}
//               </div>
//             </div>
//           )}

//           {selectedRole === 'administrador' ? (
//             <div className="space-y-4">
//               <Input
//                 type="email"
//                 value={adminEmail}
//                 onChange={(e) => setAdminEmail(e.target.value)}
//                 placeholder="Correo institucional"
//                 className="h-14 text-lg bg-black/30 border-2 border-white/30 focus:border-primary focus:ring-primary"
//               />
//               <Input
//                 type="password"
//                 value={adminPassword}
//                 onChange={(e) => setAdminPassword(e.target.value)}
//                 placeholder="Contraseña"
//                 className="h-14 text-lg bg-black/30 border-2 border-white/30 focus:border-primary focus:ring-primary"
//               />
//               {adminError && (
//                 <p className="text-center text-sm text-red-400">{adminError}</p>
//               )}
//               <Button
//                 onClick={async () => {
//                   setAdminError('');
//                   if (!adminEmail || !adminEmail.includes('@')) {
//                     setAdminError('Ingrese un correo institucional válido.');
//                     return;
//                   }
//                   if (!adminPassword || adminPassword.length < 6) {
//                     setAdminError('La contraseña debe tener al menos 6 caracteres.');
//                     return;
//                   }

//                   try {
//                     setIsAdminLoading(true);
                    
//                     // Verificar credenciales de administrador
//                     if (adminEmail === 'admin@onpe.gob.pe' && adminPassword === 'admin123') {
//                       toast({
//                         title: '✅ Acceso correcto',
//                         description: 'Redirigiendo al panel de administración...',
//                       });
                      
//                       // Habilitar acceso admin
//                       localStorage.setItem('isAdmin', 'true');
//                       // Si hay callback, llamarlo, sino recargar
//                       if (onVerificationSuccess) {
//                         setTimeout(() => {
//                           onVerificationSuccess();
//                         }, 1000);
//                       } else {
//                         window.location.reload();
//                       }
//                     } else {
//                       setAdminError('Credenciales inválidas. Pruebe con admin@onpe.gob.pe / admin123');
//                       toast({
//                         variant: "destructive",
//                         title: "❌ Error de acceso",
//                         description: "Credenciales incorrectas. Intente nuevamente.",
//                       });
//                     }

//                   } finally {
//                     setIsAdminLoading(false);
//                   }
//                 }}
//                 disabled={isAdminLoading}
//                 className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90"
//               >
//                 {isAdminLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Ingresar'}
//               </Button>
//             </div>
//           ) : (
//             <div className="relative">
//               <Input
//                 type="text"
//                 placeholder="Ingrese su DNI (8 dígitos)"
//                 value={dni}
//                 onChange={handleDniChange}
//                 maxLength="8"
//                 className={`h-14 text-lg pr-28 text-center bg-black/30 border-2 ${!isValidDni && dni.length > 0 ? 'border-red-500' : 'border-white/30'} focus:border-primary focus:ring-primary`}
//               />
//               <Button 
//                 onClick={validateDni}
//                 disabled={isLoading || dni.length !== 8}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 h-11 px-4 bg-primary hover:bg-primary/90 disabled:bg-gray-500"
//               >
//                 {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Verificar'}
//               </Button>
//             </div>
//           )}
          
//           {selectedRole === 'usuario' && (
//             <AnimatePresence>
//               {!isValidDni && dni.length > 0 && (
//                 <motion.p
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   className="text-red-400 text-sm text-center"
//                 >
//                   El DNI debe contener 8 dígitos.
//                 </motion.p>
//               )}
//               {error && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   className="flex items-center justify-center space-x-2 text-red-400"
//                 >
//                   <XCircle className="h-5 w-5" />
//                   <p>{error}</p>
//                 </motion.div>
//               )}
//               {voterData && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: 'auto' }}
//                   transition={{ duration: 0.5, ease: 'easeInOut' }}
//                   className="bg-black/20 p-6 rounded-lg border border-white/10 space-y-4"
//                 >
//                   {hasVoted() ? (
//                     <div className="text-center space-y-4">
//                       <XCircle className="h-16 w-16 text-red-400 mx-auto" />
//                       <div>
//                         <h3 className="text-xl font-bold text-red-400 mb-2">Ya has votado</h3>
//                         <p className="text-gray-300">
//                           Este DNI ({dni}) ya ha emitido su voto en esta elección.
//                         </p>
//                         <p className="text-gray-400 text-sm mt-2">
//                           Por seguridad electoral, no se permite votar nuevamente.
//                         </p>
//                       </div>
//                     </div>
//                   ) : (
//                     <>
//                       <div className="flex items-center space-x-3">
//                         <User className="h-5 w-5 text-gray-300" />
//                         <span className="text-white">{voterData.name}</span>
//                       </div>
//                       <div className="flex items-center space-x-3">
//                         <MapPin className="h-5 w-5 text-gray-300" />
//                         <span className="text-white">{voterData.district}</span>
//                       </div>
//                       <div className="flex items-center space-x-3">
//                         {voterData.status === 'Habilitado para votar' ? 
//                           <CheckCircle className="h-5 w-5 text-green-400" /> : 
//                           <XCircle className="h-5 w-5 text-yellow-400" />}
//                         <span className={`font-semibold ${voterData.status === 'Habilitado para votar' ? 'text-green-400' : 'text-yellow-400'}`}>
//                           {voterData.status}
//                         </span>
//                       </div>

//                       {voterData.status === 'Habilitado para votar' && (
//                         // Este botón ahora llama a 'handleContinue', que está modificado
//                         <Button onClick={handleContinue} className="w-full mt-4 h-12 text-lg font-bold bg-green-600 hover:bg-green-700">
//                           Ingresar al proceso de votación <ArrowRight className="ml-2 h-5 w-5"/>
//                         </Button>
//                       )}
//                     </>
//                   )}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           )}
          
//           <div className="text-center text-xs text-gray-400 pt-4 flex items-center justify-center space-x-2">
//             <Shield className="h-4 w-4" />
//             <span>Sus datos están protegidos bajo los estándares del Estado Peruano.</span>
//           </div>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// };

// export default VoterVerification;