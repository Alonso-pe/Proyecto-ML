import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, name: 'Facebook', url: 'https://www.facebook.com/ONPEoficial/' },
    { icon: Twitter, name: 'Twitter', url: 'https://twitter.com/onpe_oficial' },
    { icon: Instagram, name: 'Instagram', url: 'https://www.instagram.com/onpe_oficial/' },
    { icon: Youtube, name: 'YouTube', url: 'https://www.youtube.com/user/onpeprensa' },
  ];

  return (
    <footer className="w-full bg-card/80 backdrop-blur-sm border-t border-primary/30 mt-16">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex flex-wrap justify-center gap-6">
            <a 
              href="https://www.onpe.gob.pe/portal/politica-de-privacidad/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-gray-300 hover:text-primary transition-colors font-medium"
            >
              Política de privacidad
            </a>
            <a 
              href="https://www.onpe.gob.pe/portal/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-gray-300 hover:text-primary transition-colors font-medium"
            >
              Términos de uso
            </a>
            <a 
              href="https://www.onpe.gob.pe/portal/ayuda/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-gray-300 hover:text-primary transition-colors font-medium"
            >
              Ayuda
            </a>
          </div>
          <div className="flex space-x-6">
            {socialLinks.map((social) => (
              <a 
                key={social.name} 
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
              >
                <span className="sr-only">{social.name}</span>
                <social.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-primary/20 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/9/9e/Escudo_nacional_del_Per%C3%BA.svg" 
              alt="Escudo del Perú" 
              className="h-6 w-6 opacity-70"
            />
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Sistema de Votación Ciudadana del Perú
            </p>
          </div>
          <p className="text-xs text-gray-500">
            Desarrollado en colaboración con la Oficina Nacional de Procesos Electorales (ONPE)
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;