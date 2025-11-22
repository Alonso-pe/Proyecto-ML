import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ id, title, children, className }) => {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          // CORRECCIÓN: 'margin' negativo fuerza la animación a activarse antes
          viewport={{ once: true, margin: "-50px" }} 
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4 drop-shadow-sm">
              {title}
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full shadow-sm"></div>
          </div>
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default Section;