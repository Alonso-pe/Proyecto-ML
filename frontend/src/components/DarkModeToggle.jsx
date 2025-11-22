import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/ui/button';
import useTheme from '@/hooks/useTheme';

const DarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 w-10 h-10"
      aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="relative w-5 h-5"
        >
          {theme === 'dark' ? (
            <Moon className="absolute inset-0 w-full h-full text-primary" />
          ) : (
            <Sun className="absolute inset-0 w-full h-full text-yellow-500" />
          )}
        </motion.div>
      </AnimatePresence>
    </Button>
  );
};

export default DarkModeToggle;

