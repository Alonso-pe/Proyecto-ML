import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, BarChart3, Vote, Users, CheckCircle2, MapPin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';
import ChartReal from '../components/ChartReal';
import { getAggregates, getPresidentialVotes, getMunicipalVotes } from '../utils/dataUtils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/tabs';

// --- COMPONENTE: TARJETA DE GANADOR (Responsive & Premium) ---
const WinnerCard = ({ title, candidate, party, votes, percentage, color = "from-blue-600 to-blue-400" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    className="mb-8"
  >
    <div className={`rounded-2xl p-1 bg-gradient-to-r ${color} shadow-2xl`}>
      <div className="bg-[#0f172a] rounded-xl p-4 sm:p-8 relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className={`absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 bg-gradient-to-bl ${color} opacity-10 rounded-bl-full pointer-events-none`} />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* Sección Identidad: Icono + Nombre */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left w-full md:w-auto">
            <div className={`w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-lg shadow-blue-500/20 border-4 border-[#0f172a] ring-4 ring-slate-800`}>
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            
            <div>
              <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 justify-center sm:justify-start mb-1">
                 <span className="bg-yellow-500/20 text-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded border border-yellow-500/30 uppercase tracking-wider whitespace-nowrap">Virtual Ganador</span>
                 <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest text-center sm:text-left">{title}</p>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-white leading-tight mb-1 break-words">{candidate}</h3>
              <p className="text-base sm:text-lg text-slate-300 font-medium">{party}</p>
            </div>
          </div>
          
          {/* Sección Estadísticas: Votos y Porcentaje */}
          <div className="flex w-full md:w-auto justify-between sm:justify-center items-center gap-4 sm:gap-8 bg-slate-900/60 p-4 sm:p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md mt-2 md:mt-0">
            <div className="text-center flex-1 sm:flex-none">
              <p className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold mb-1">Total Votos</p>
              <p className="text-xl sm:text-3xl font-bold text-white tabular-nums">{votes}</p>
            </div>
            <div className="w-px h-10 sm:h-12 bg-slate-700"></div>
            <div className="text-center flex-1 sm:flex-none">
              <p className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold mb-1">Preferencia</p>
              <p className={`text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${color}`}>
                {percentage}%
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </motion.div>
);

// Colores para gráficos
const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444', '#6366f1'];

export default function ElectionResults() {
  const [activeTab, setActiveTab] = useState("presidencial");
  
  // --- 1. PROCESAMIENTO PRESIDENCIAL ---
  const presVotes = useMemo(() => getPresidentialVotes(), []);
  const presValues = Object.values(presVotes.byCandidate);
  const presLabels = Object.keys(presVotes.byCandidate);
  const totalPresVotes = presValues.reduce((a, b) => a + b, 0);
  
  const maxPresVal = Math.max(...presValues);
  const maxPresIdx = presValues.indexOf(maxPresVal);
  const presWinnerName = presLabels[maxPresIdx];
  const presWinnerPct = ((maxPresVal / totalPresVotes) * 100).toFixed(1);

  // --- 2. PROCESAMIENTO MUNICIPAL (Antes Congresal) ---
  const munVotes = useMemo(() => getMunicipalVotes(), []);
  const munValues = Object.values(munVotes.byCandidate);
  const munLabels = Object.keys(munVotes.byCandidate);
  const totalMunVotes = munValues.reduce((a, b) => a + b, 0);

  const maxMunVal = Math.max(...munValues);
  const maxMunIdx = munValues.indexOf(maxMunVal);
  const munWinnerName = munLabels[maxMunIdx];
  const munWinnerPct = totalMunVotes > 0 ? ((maxMunVal / totalMunVotes) * 100).toFixed(1) : "0.0";

  // Mapeo simple de partidos para el ganador municipal (simulado para visualización)
  const getParty = (name) => {
    if(name.includes('López Aliaga')) return 'Renovación Popular';
    if(name.includes('Forsyth')) return 'Somos Perú';
    if(name.includes('Urresti')) return 'Podemos Perú';
    return 'Movimiento Independiente';
  };

  // Opciones limpias para gráficos
  const cleanChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      datalabels: { display: false },
      legend: { position: 'bottom', labels: { color: '#94a3b8' } }
    },
    scales: {
        y: { grid: { display: false }, ticks: { color: '#cbd5e1' } },
        x: { grid: { display: false }, ticks: { display: false } }
    }
  };

  return (
    <div className="space-y-6 p-4 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
      
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Resultados Finales</h2>
          <p className="text-slate-400 text-sm sm:text-base">Informe oficial de cierre de escrutinio.</p>
        </div>
        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Datos Verificados</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-900 border border-slate-800 mb-6 w-full sm:w-auto flex h-auto p-1 rounded-lg">
            <TabsTrigger value="presidencial" className="flex-1 sm:flex-none px-6 py-2 data-[state=active]:bg-blue-600 text-sm font-bold">Presidencial</TabsTrigger>
            {/* CAMBIO: Ahora dice Municipal */}
            <TabsTrigger value="municipal" className="flex-1 sm:flex-none px-6 py-2 data-[state=active]:bg-amber-600 text-sm font-bold">Municipal</TabsTrigger>
        </TabsList>

        {/* --- PESTAÑA PRESIDENCIAL --- */}
        <TabsContent value="presidencial" className="mt-0">
            <WinnerCard 
                title="Presidencia de la República"
                candidate={presWinnerName}
                party="Partido Político Líder"
                votes={maxPresVal.toLocaleString()}
                percentage={presWinnerPct}
                color="from-blue-600 to-cyan-400"
            />

            <Card className="bg-[#0f172a] border-slate-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white"><BarChart3 className="text-blue-500"/> Distribución Total de Votos</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ChartReal 
                        type="bar"
                        labels={presLabels}
                        datasets={[{
                            label: 'Votos',
                            data: presValues,
                            backgroundColor: presValues.map((_, i) => i === maxPresIdx ? '#2563eb' : '#475569'),
                            borderRadius: 4,
                            barPercentage: 0.6
                        }]}
                        options={cleanChartOptions}
                    />
                </CardContent>
            </Card>
        </TabsContent>

        {/* --- PESTAÑA MUNICIPAL (Antes Congresal) --- */}
        <TabsContent value="municipal" className="mt-0">
             {/* TARJETA GANADOR ALCALDÍA */}
             <WinnerCard 
                title="Alcaldía Provincial"
                candidate={munWinnerName}
                party={getParty(munWinnerName)}
                votes={maxMunVal.toLocaleString()}
                percentage={munWinnerPct}
                color="from-amber-500 to-orange-500"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* GRÁFICO MUNICIPAL */}
                <Card className="bg-[#0f172a] border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white"><MapPin className="text-amber-500"/> Resultados Provinciales</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        <ChartReal 
                            type="bar"
                            labels={munLabels}
                            datasets={[{
                                label: 'Votos',
                                data: munValues,
                                backgroundColor: munValues.map((_, i) => i === maxMunIdx ? '#f59e0b' : '#475569'),
                                borderRadius: 4,
                                barPercentage: 0.6
                            }]}
                            options={{
                                ...cleanChartOptions,
                                indexAxis: 'y', // Horizontal para nombres largos
                                layout: { padding: { right: 40 } },
                                plugins: {
                                    legend: { display: false },
                                    datalabels: { 
                                        display: true, 
                                        color: 'white', 
                                        anchor: 'end', 
                                        align: 'end',
                                        font: { weight: 'bold' }
                                    }
                                }
                            }}
                        />
                    </CardContent>
                </Card>
                
                {/* Estadísticas Generales */}
                <div className="grid grid-cols-2 gap-4">
                     {[
                        { l: 'Votos Válidos', v: totalMunVotes.toLocaleString(), c: 'text-white' },
                        { l: 'Ausentismo', v: '18.2%', c: 'text-amber-400' },
                        { l: 'Votos Blancos', v: '4.5%', c: 'text-slate-400' },
                        { l: 'Votos Nulos', v: '6.1%', c: 'text-red-400' },
                     ].map((s, i) => (
                        <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl flex flex-col items-center justify-center p-4 text-center">
                            <span className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold">{s.l}</span>
                            <span className={`text-2xl sm:text-3xl font-black ${s.c}`}>{s.v}</span>
                        </div>
                     ))}
                </div>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}