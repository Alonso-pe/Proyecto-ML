import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Users, Vote, BarChart3, PieChart, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';
import ChartReal from '../components/ChartReal';
import { getAggregates, getPresidentialVotes } from '../utils/dataUtils';
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

export default function ElectionResults() {
  const [activeTab, setActiveTab] = useState("presidencial");
  const agg = getAggregates();
  
  // Datos Presidenciales
  const presVotes = useMemo(() => getPresidentialVotes(), []);
  const presValues = Object.values(presVotes.byCandidate);
  const presLabels = Object.keys(presVotes.byCandidate);
  const totalPresVotes = presValues.reduce((a, b) => a + b, 0);
  
  // Ganador
  const maxVal = Math.max(...presValues);
  const maxIdx = presValues.indexOf(maxVal);
  const winnerName = presLabels[maxIdx];
  const winnerPct = ((maxVal / totalPresVotes) * 100).toFixed(1);

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
        <TabsList className="bg-slate-900 border border-slate-800 mb-6 w-full sm:w-auto flex h-auto p-1">
            <TabsTrigger value="presidencial" className="flex-1 sm:flex-none px-6 py-2 data-[state=active]:bg-blue-600">Presidencial</TabsTrigger>
            <TabsTrigger value="congresal" className="flex-1 sm:flex-none px-6 py-2 data-[state=active]:bg-purple-600">Congresal</TabsTrigger>
        </TabsList>

        <TabsContent value="presidencial" className="mt-0">
            {/* TARJETA DEL GANADOR */}
            <WinnerCard 
                title="Presidencia"
                candidate={winnerName}
                party="Partido Político Líder"
                votes={maxVal.toLocaleString()}
                percentage={winnerPct}
                color="from-blue-600 to-cyan-400"
            />

            {/* Gráfico Detallado */}
            <Card className="bg-[#0f172a] border-slate-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white"><BarChart3 className="text-blue-500"/> Distribución Total de Votos</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] sm:h-[350px]">
                    <ChartReal 
                        type="bar"
                        labels={presLabels}
                        datasets={[{
                            label: 'Votos',
                            data: presValues,
                            backgroundColor: presValues.map((_, i) => i === maxIdx ? '#2563eb' : '#475569'),
                            borderRadius: 4
                        }]}
                        options={{
                            plugins: { datalabels: { display: false } },
                            scales: { x: { grid: { display: false } }, y: { grid: { color: '#1e293b' } } }
                        }}
                    />
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="congresal" className="mt-0">
             {/* TARJETA CONGRESO */}
             <WinnerCard 
                title="Mayoría Parl."
                candidate="Fuerza Popular"
                party="35 Escaños Proyectados"
                votes="2,105,400"
                percentage="24.5"
                color="from-purple-600 to-pink-500"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[#0f172a] border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white"><Users className="text-purple-500"/> Composición por Bancada</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        <ChartReal 
                            type="bar"
                            labels={['FP', 'PL', 'RP', 'AP', 'PM', 'SP']}
                            datasets={[{
                                label: 'Escaños',
                                data: [35, 28, 22, 15, 12, 8],
                                backgroundColor: ['#f97316', '#ef4444', '#3b82f6', '#eab308', '#8b5cf6', '#ec4899'],
                                borderRadius: 4,
                                barPercentage: 0.6 
                            }]}
                            options={{ 
                                indexAxis: 'y', 
                                maintainAspectRatio: false,
                                layout: { padding: { right: 40 } },
                                plugins: { 
                                    legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 12 } } },
                                    datalabels: { 
                                        display: true, 
                                        color: 'white',
                                        anchor: 'end', 
                                        align: 'end',  
                                        font: { weight: 'bold', size: 12 },
                                        formatter: (value) => value
                                    } 
                                },
                                scales: {
                                    x: { grid: { display: false }, ticks: { display: false }, border: { display: false } },
                                    y: { grid: { display: false }, ticks: { color: '#ffffff', font: { weight: 'bold', size: 12 } }, border: { display: false } }
                                }
                            }}
                        />
                    </CardContent>
                </Card>
                
                {/* Estadísticas */}
                <div className="grid grid-cols-2 gap-4">
                     {[
                        { l: 'Votos Válidos', v: '14.5M', c: 'text-white' },
                        { l: 'Ausentismo', v: '18.2%', c: 'text-amber-400' },
                        { l: 'Votos Blancos', v: '4.5%', c: 'text-slate-400' },
                        { l: 'Votos Nulos', v: '6.1%', c: 'text-red-400' },
                     ].map((s, i) => (
                        <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl flex flex-col items-center justify-center p-4 text-center">
                            <span className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold mb-1">{s.l}</span>
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