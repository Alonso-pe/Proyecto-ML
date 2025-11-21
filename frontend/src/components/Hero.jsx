import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = ({ onCtaClick }) => {
  return (
    <section id="inicio" className="relative min-h-[calc(100vh-80px)] flex items-center justify-start overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-gradient-to-r from-[#0A192F] via-[#0A192F] to-transparent"></div>
           <img class="w-full h-full object-cover opacity-10" alt="Vista panorámica nocturna de la ciudad de Lima iluminada, representando el progreso y futuro del Perú" src="https://images.unsplash.com/photo-1608225572678-56879dca2b2e" />
        </div>

      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="max-w-3xl"
        >
            <p className="text-lg font-medium text-[#D4AF37] mb-4">Plataforma Oficial de Votación Electrónica del Perú</p>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 !leading-tight tracking-tighter">
                El Futuro del Perú, <br/>Decidido por su Gente.
            </h1>
            <p className="max-w-2xl text-lg text-[#a8b2d1] mb-12">
                Ejerza su derecho democrático con una plataforma segura, moderna y transparente. Su voz, su voto, su país.
            </p>
        
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex items-center gap-6"
            >
                <Button 
                    onClick={onCtaClick}
                    className="bg-[#D4AF37] text-[#0A192F] hover:bg-[#b89a31] h-14 px-10 text-lg font-bold rounded-lg shadow-lg shadow-[#D4AF37]/20 transition-all transform hover:scale-105 group"
                >
                    Iniciar Votación
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
                <div className="flex items-center gap-2 text-sm text-[#a8b2d1]">
                    <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                    <span>Voto seguro y encriptado</span>
                </div>
            </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;