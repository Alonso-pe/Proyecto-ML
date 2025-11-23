// frontend/src/admin/pages/VotesReal.jsx

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';
import DataTable from '../components/DataTable';
import StatCard from '../components/StatCard'; // Importamos la tarjeta de stats
import ActivityFeed from '../components/ActivityFeed'; // Importamos el feed en vivo
import { getAggregates } from '../utils/dataUtils';
import { motion } from 'framer-motion';
import { Vote, Clock, Archive } from 'lucide-react';

// Variantes de animación
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

// Hook simple para simular valores en vivo
const useLiveValue = (initialValue, increment, interval = 2000) => {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    const timer = setInterval(() => {
      setValue(v => v + Math.floor(increment * Math.random() + 1));
    }, interval);
    return () => clearInterval(timer);
  }, [initialValue, increment, interval]);
  return value;
};

export default function VotesReal() {
  const [voteData, setVoteData] = useState({});
  const [tableRows, setTableRows] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCandidate, setNewCandidate] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('http://localhost:8081/admin/votes/summary', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        const byCandidate = {};
        if (Array.isArray(data)) {
          data.forEach(item => {
            if (item && item.candidateId !== undefined && item.count !== undefined) {
              byCandidate[item.candidateId] = Number(item.count);
            }
          });
        }
        setVoteData(byCandidate);
        setTableRows(Object.entries(byCandidate).map(([candidato, votos]) => ({ candidato, votos })));
      } catch (e) {
        // fallback to aggregates if backend unavailable
        const agg = getAggregates();
        const fallback = agg.pres.byCandidate;
        setVoteData(fallback);
        setTableRows(Object.entries(fallback).map(([candidato, votos]) => ({ candidato, votos })));
      }
    };
    load();
  }, []);

  // --- Datos en Vivo Simulados para mesas/vpm (solo UI) ---
  const totalVotos = Object.values(voteData).reduce((a, b) => a + b, 0) || 0;
  const votosPorMinuto = useLiveValue(25, 3, 3000);
  const mesasEscrutadas = useLiveValue(1350, 1, 2000);
  const totalMesas = 1500;
  // ---

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Tarjetas de Estadísticas en Vivo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Votos Reales Totales" 
          value={totalVotos.toLocaleString()} 
          description="Conteo en tiempo real (simulado)"
          icon={Vote}
          colorClass="text-green-500"
          glowEffect={true}
        />
        <StatCard 
          title="Votos por Minuto" 
          value={votosPorMinuto}
          description="Tendencia de ingreso"
          icon={Clock}
          colorClass="text-blue-400"
        />
        <StatCard 
          title="Mesas Escrutadas" 
          value={`${mesasEscrutadas.toLocaleString()} / ${totalMesas.toLocaleString()}`}
          description={`${((mesasEscrutadas / totalMesas) * 100).toFixed(1)}% completado`}
          icon={Archive}
          colorClass="text-white"
        />
      </div>

      {/* 2. Contenido Principal (Tabla y Feed) */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* Columna de la Tabla de Votos */}
        <motion.div variants={itemVariants} className="col-span-2">
          <Card className="bg-card/80 border-border backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle>Resumen de Votos por Candidato (Simulado)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Resumen de votos reales (tomados desde el backend cuando esté disponible).
              </p>

              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Nombre del candidato"
                  value={newCandidate}
                  onChange={(e) => setNewCandidate(e.target.value)}
                  className="flex-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-sm"
                />
                <button
                  className="px-4 py-2 bg-emerald-500 text-white rounded"
                  onClick={async () => {
                    if (!newCandidate || newCandidate.trim().length === 0) return;
                    setIsSubmitting(true);
                    try {
                      const payload = { candidateId: newCandidate.trim(), voterId: 'web-ui' };
                      const res = await fetch('http://localhost:8081/vote', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                      });
                      if (!res.ok) throw new Error('Failed to submit');
                      // update local view
                      const current = { ...voteData };
                      current[newCandidate.trim()] = (current[newCandidate.trim()] || 0) + 1;
                      setVoteData(current);
                      setTableRows(Object.entries(current).map(([candidato, votos]) => ({ candidato, votos })));
                      setNewCandidate('');
                    } catch (err) {
                      console.error('Submit vote failed', err);
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Agregar voto'}
                </button>
              </div>

              <DataTable rows={tableRows} />
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Columna del Feed de Actividad */}
        <motion.div variants={itemVariants}>
          <ActivityFeed />
        </motion.div>
      </div>
    </motion.div>
  );
}