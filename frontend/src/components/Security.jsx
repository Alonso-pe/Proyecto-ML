import React from 'react';
import { ShieldCheck, Database } from 'lucide-react';

const Feature = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-300 mt-1">{description}</p>
    </div>
  </div>
);

const Security = () => {
  return (
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
      <div className="space-y-8">
        <div>
          <span className="text-primary font-semibold uppercase tracking-wide">Confianza y Fiabilidad</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-2">Seguridad de Nivel Mundial</h2>
          <p className="text-xl text-gray-300 mt-4">
            Nuestra plataforma se construye sobre los pilares de la transparencia y la seguridad inquebrantable, utilizando tecnología de punta para garantizar la integridad de cada voto.
          </p>
        </div>
        <div className="space-y-6">
          <Feature 
            icon={ShieldCheck} 
            title="Voto Encriptado de Extremo a Extremo" 
            description="Cada voto es cifrado en su dispositivo y solo se descifra en la urna digital, asegurando un secreto inviolable." 
          />
          <Feature 
            icon={Database} 
            title="Base de Datos Inmutable (Blockchain)" 
            description="Utilizamos tecnología de cadena de bloques para registrar los votos, garantizando que no puedan ser alterados ni eliminados." 
          />
        </div>
      </div>
      <div className="flex items-center justify-center">
        {/* Puedes cambiar esta imagen si la subes a /public, o dejar el placeholder */}
        {/* <img src="/escudo-tezos.png" alt="Escudo de Seguridad" className="w-full max-w-xs md:max-w-sm" /> */}
        <div className="w-80 h-80 bg-card/80 rounded-lg flex items-center justify-center border border-border">
          <ShieldCheck className="w-32 h-32 text-primary/50" />
        </div>
      </div>
    </div>
  );
};

export default Security;