import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Loader2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/card.jsx';
import { Button } from '@/ui/button.jsx';
import { Input } from '@/ui/input.jsx';
import { useToast } from '@/ui/use-toast';

// Este componente es un modal que maneja el login de administrador
export default function AdminLogin({ onClose }) {
  const { toast } = useToast();
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  const handleAdminLogin = async () => {
    setAdminError('');
    if (!adminEmail || !adminEmail.includes('@')) {
      setAdminError('Ingrese un correo institucional válido.');
      return;
    }
    if (!adminPassword || adminPassword.length < 6) {
      setAdminError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      setIsAdminLoading(true);
      
      // Simular una llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (adminEmail === 'admin@onpe.gob.pe' && adminPassword === 'admin123') {
        toast({
          title: '✅ Acceso correcto',
          description: 'Bienvenido, Administrador. Redirigiendo...',
        });
        
        // Habilitar acceso admin y recargar la página
        localStorage.setItem('isAdmin', 'true');
        // Usamos un pequeño delay para que el toast sea visible antes de recargar
        setTimeout(() => {
          window.location.reload();
        }, 1000);

      } else {
        setAdminError('Credenciales inválidas. Pruebe con admin@onpe.gob.pe / admin123');
        toast({
          variant: "destructive",
          title: "❌ Error de acceso",
          description: "Credenciales incorrectas. Intente nuevamente.",
        });
        setIsAdminLoading(false);
      }
    } catch (err) {
      setAdminError('Ocurrió un error inesperado.');
      setIsAdminLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <Card className="w-full max-w-md bg-card/90 border-white/20 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-lg relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
        <CardHeader className="text-center p-8">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold text-white">Acceso de Administrador</CardTitle>
          <CardDescription className="text-gray-300 mt-2">
            Ingrese su correo institucional y contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0 space-y-6">
          <div className="space-y-4">
            <Input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="Correo institucional"
              className="h-14 text-lg bg-black/30 border-2 border-white/30 focus:border-primary focus:ring-primary"
            />
            <Input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Contraseña"
              className="h-14 text-lg bg-black/30 border-2 border-white/30 focus:border-primary focus:ring-primary"
            />
            {adminError && (
              <p className="text-center text-sm text-red-400">{adminError}</p>
            )}
            <Button
              onClick={handleAdminLogin}
              disabled={isAdminLoading}
              className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90"
            >
              {isAdminLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Ingresar'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}