import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, HelpCircle, ShieldCheck, Info, Menu, X, Newspaper, UserCog } from 'lucide-react';
import { Button } from '@/ui/button';
import { Link } from 'react-scroll';
import DarkModeToggle from '@/components/DarkModeToggle';

const Header = ({ onAdminOpen }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: 'inicio', label: 'Inicio', icon: Home },
    { to: 'como-votar', label: 'Cómo votar', icon: HelpCircle },
    { to: 'informacion', label: 'Información', icon: Info },
    { to: 'transparencia', label: 'Seguridad', icon: ShieldCheck },
    { to: 'noticias', label: 'Noticias', icon: Newspaper },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/9e/Escudo_nacional_del_Per%C3%BA.svg" alt="Peru" className="h-9 w-9" />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-foreground text-lg">Votación</span>
              <span className="text-[10px] text-muted-foreground tracking-widest uppercase">República del Perú</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
              >
                <Button variant="ghost" className="text-muted-foreground hover:text-primary hover:bg-accent/50 transition-colors">
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onAdminOpen}
              className="hidden md:flex text-muted-foreground hover:text-primary hover:bg-accent/50"
              title="Administrador"
            >
              <UserCog className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-foreground hover:bg-accent/50" 
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden shadow-xl"
          >
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  spy={true}
                  smooth={true}
                  offset={-80}
                  duration={500}
                  onClick={() => setIsOpen(false)}
                >
                  <Button variant="ghost" className="w-full justify-start h-12 text-lg px-4 text-foreground hover:bg-accent/50">
                    <item.icon className="mr-3 h-5 w-5 text-primary" />
                    {item.label}
                  </Button>
                </Link>
              ))}
              <div className="h-px bg-border my-2 mx-4" />
              <Button 
                variant="outline" 
                className="w-full justify-start h-12 px-4 border-primary/30 text-primary hover:bg-primary/10"
                onClick={() => { setIsOpen(false); onAdminOpen(); }}
              >
                <UserCog className="mr-3 h-5 w-5" />
                Acceso Administrativo
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;