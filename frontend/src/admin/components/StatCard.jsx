// frontend/src/admin/components/StatCard.jsx

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

export default function StatCard({ title, value, description, icon, glowEffect = false, colorClass = "text-primary" }) {
  const Icon = icon;
  
  return (
    <motion.div variants={itemVariants}>
      <Card className="bg-card/80 border-border relative overflow-hidden backdrop-blur-sm">
        {/* Animación de resplandor (opcional) */}
        {glowEffect && (
          <div className="absolute -top-1/4 -right-1/3 w-full h-[150%] bg-gradient-radial from-primary/10 to-transparent animate-soft-glow" />
        )}
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {Icon && <Icon className={`h-5 w-5 ${colorClass}`} />}
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-4xl font-bold text-white">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}