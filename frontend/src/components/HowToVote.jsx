import React from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, CheckSquare, Lock } from 'lucide-react';

const steps = [
  {
    icon: Fingerprint,
    title: '1. Verifica tu Identidad',
    description: 'Ingresa tu DNI para validar tus datos y confirmar que estás habilitado para votar en nuestro sistema seguro.',
  },
  {
    icon: CheckSquare,
    title: '2. Elige tu Opción',
    description: 'Accede a la cédula de votación digital y selecciona al candidato o la opción de tu preferencia de forma intuitiva.',
  },
  {
    icon: Lock,
    title: '3. Emite tu Voto',
    description: 'Revisa tu selección y confirma. Tu voto será encriptado, anonimizado y registrado de forma inviolable.',
  },
];

const HowToVote = () => {
  return (
    <section id="como-votar" className="py-24 bg-[#0A192F]">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Un Proceso Simple y Seguro</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-[#a8b2d1]">Votar nunca fue tan fácil. Sigue estos tres pasos.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-[#172a45] p-8 rounded-lg border border-transparent hover:border-[#D4AF37]/30 shadow-lg transition-all transform hover:-translate-y-2"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-[#D4AF37]/10 mb-6">
                <step.icon className="h-8 w-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-[#a8b2d1]">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToVote;