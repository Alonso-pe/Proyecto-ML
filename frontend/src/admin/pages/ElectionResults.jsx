// frontend/src/admin/pages/ElectionResults.jsx

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';
import ChartReal from '../components/ChartReal';
import { getAggregates } from '../utils/dataUtils';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function ElectionResults() {
  const agg = getAggregates();
  const p = agg.pres;
  
  // Encontrar al candidato líder
  const pVals = Object.values(p.byCandidate || {});
  const pLabs = Object.keys(p.byCandidate || {});
  const maxVotes = Math.max(...pVals);
  const leaderIndex = pVals.indexOf(maxVotes);
  const leaderName = pLabs[leaderIndex] || 'Juan Pérez';
  const leaderParty = 'Partido A'; // Mock
  const totalVotes = pVals.reduce((a, b) => a + b, 0);
  const leaderPercentage = ((maxVotes / totalVotes) * 100).toFixed(1);
  const secondVotes = Math.max(...pVals.filter(v => v !== maxVotes));
  const advantage = (((maxVotes - secondVotes) / totalVotes) * 100).toFixed(1);

  // Opciones de Gráfico (sin números en las barras, como en tu imagen)
  const barChartOptions = {
    plugins: { datalabels: { display: false } }, // Ocultamos números aquí
    scales: { y: { ticks: { callback: (v) => v >= 1000 ? `${v/1000}k` : v }}}
  };

  return (
    <motion.div 
      className="space-y-8 max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.p variants={itemVariants} className="text-xl text-center text-muted-foreground">
        Resultados oficiales de las elecciones presidenciales al 100% de actas escrutadas (simulado).
      </motion.p>
      
      {/* Tarjeta de Candidato Líder */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card/80 border-border backdrop-blur-sm shadow-xl">
          <CardContent className="p-8">
            <div className="flex justify-between items-start">
              {/* Info del Líder */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-primary uppercase tracking-wider">Candidato Líder</p>
                <h2 className="text-5xl font-bold text-white">{leaderName}</h2>
                <p className="text-2xl text-muted-foreground">{leaderParty}</p>
              </div>
              <Trophy className="w-20 h-20 text-primary/70" strokeWidth={1.5} />
            </div>
            
            {/* Stats del Líder */}
            <div className="grid grid-cols-3 gap-6 mt-8 border-t border-border pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Votos</p>
                <p className="text-3xl font-semibold text-white">{maxVotes.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Porcentaje</p>
                <p className="text-3xl font-semibold text-white">{leaderPercentage}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ventaja</p>
                <p className="text-3xl font-semibold text-green-400 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2" /> +{advantage}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Gráfico de Distribución */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card/80 border-border backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">Distribución de Votos</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ChartReal 
              type="bar" 
              labels={pLabs} 
              datasets={[{ 
                label: 'Votos', 
                data: pVals, 
                backgroundColor: 'hsla(349, 75%, 50%, 0.7)' 
              }]} 
              options={barChartOptions} 
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}