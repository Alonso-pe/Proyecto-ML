import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const IdentityVerification = ({ role, onSuccess, onBack }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    dni: '',
    firstName: '',
    lastName: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [isVerifying, setIsVerifying] = useState(false);

  const validateDNI = (dni) => {
    const dniRegex = /^\d{8}$/;
    return dniRegex.test(dni);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name) => {
    return name.trim().length >= 2;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!validateDNI(formData.dni)) {
      newErrors.dni = 'El DNI debe tener exactamente 8 dígitos';
    }
    
    if (!validateName(formData.firstName)) {
      newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (!validateName(formData.lastName)) {
      newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
    }
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: "Error de validación",
        description: "Por favor corrige los errores en el formulario",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);

    // Simulate backend verification
    setTimeout(() => {
      // Simulate successful verification
      const userData = {
        dni: formData.dni,
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        role: role
      };

      toast({
        title: "✓ Verificación exitosa",
        description: `Bienvenido/a ${userData.fullName}`,
      });

      onSuccess(userData);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg"
      >
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-6 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Verificación de Identidad
            </h2>
            <p className="text-slate-600">
              {role === 'voter' ? 'Ingresa tus datos para votar' : 'Acceso administrativo'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="dni" className="block text-sm font-medium text-slate-700 mb-2">
                DNI *
              </label>
              <input
                type="text"
                id="dni"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                maxLength="8"
                placeholder="12345678"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                  errors.dni ? 'border-red-500' : 'border-slate-200'
                }`}
              />
              {errors.dni && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.dni}
                </motion.p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                  Nombres *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Juan"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                    errors.firstName ? 'border-red-500' : 'border-slate-200'
                  }`}
                />
                {errors.firstName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.firstName}
                  </motion.p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                  Apellidos *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Pérez"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                    errors.lastName ? 'border-red-500' : 'border-slate-200'
                  }`}
                />
                {errors.lastName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.lastName}
                  </motion.p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Correo Electrónico *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                  errors.email ? 'border-red-500' : 'border-slate-200'
                }`}
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </motion.p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Verificar Identidad
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-800 flex items-start gap-2">
              <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                Tus datos están protegidos y serán utilizados únicamente para el proceso de votación.
              </span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default IdentityVerification;