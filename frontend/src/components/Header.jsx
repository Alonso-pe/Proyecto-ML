import React from 'react';
import { motion } from 'framer-motion';
import { Home, HelpCircle, BarChart2, ShieldCheck, Info, Newspaper } from 'lucide-react';
import { Button } from '@/ui/button';
import { Link } from 'react-scroll';

const Header = () => {
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
          <div className="flex items-center space-x-3">
            <img src="https://horizons-cdn.hostinger.com/faebab8c-5e00-4302-9124-6ab376c2b556/8b97dea24d1a605ae14c9158800a5f84.png" alt="Logo Votación" className="h-12 w-12" />
            <span className="text-xl font-bold tracking-tight text-white">
              Votación Ciudadana
            </span>
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
          <div className="md:hidden">
             {/* Mobile menu can be added here */}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;