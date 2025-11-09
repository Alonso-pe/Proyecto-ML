import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ id, title, children, className }) => {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            {title}
          </h2>
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default Section;