import React from 'react';
import { motion } from 'framer-motion';
import { Home, HelpCircle, BarChart2, ShieldCheck, Info, Newspaper } from 'lucide-react';
import { Button } from '@/ui/button';
import { Link } from 'react-scroll';

const Header = ({ onAdminOpen }) => {
  const navItems = [
    { to: 'inicio', label: 'Inicio', icon: Home },
    { to: 'como-votar', label: 'Cómo votar', icon: HelpCircle },
    { to: 'informacion', label: 'Información', icon: Info },
    { to: 'transparencia', label: 'Transparencia', icon: ShieldCheck },
    { to: 'noticias', label: 'Noticias', icon: Newspaper },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold tracking-tight text-white">
                Votación Ciudadana
              </span>
              <span className="text-xs text-gray-400 hidden md:block">República del Perú</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
                className="cursor-pointer"
              >
                <Button variant="ghost" className="text-gray-300 hover:bg-white/10 hover:text-white">
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
       <div className="flex items-center space-x-2">
         <Button 
           variant="ghost" 
           className="text-gray-300 hover:bg-white/10 hover:text-white flex items-center" 
           onClick={() => onAdminOpen && onAdminOpen()}
         >
           <BarChart2 className="h-5 w-5" />
           <span className="hidden md:inline ml-2">Administrador</span>
         </Button>
       </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;