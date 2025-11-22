import React, { useState, useMemo, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/tabs';
import PeruMap from '../components/PeruMap';
import ActivityFeed from '../components/ActivityFeed';
import StatCard from '../components/StatCard';
import { getAggregates, getPresidentialVotes } from '../utils/dataUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Vote, TrendingUp, Archive, MapPin, Activity, BarChart3, PieChart } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ChartDataLabels);

// --- Barra de Progreso Minimalista ---
const LinearBar = ({ label, value, maxValue, color = "bg-blue-500" }) => {
  const percentage = maxValue > 0 ? Math.min(100, Math.max(0, (value / maxValue) * 100)) : 0;
  return (
    <div className="py-3 border-b border-slate-800/50 last:border-0 group hover:bg-white/[0.02] px-2 rounded transition-colors">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs sm:text-sm font-medium text-slate-300 truncate max-w-[65%]">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-white tabular-nums">{value.toLocaleString()}</span>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded-sm min-w-[3rem] text-center">
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
        <motion.div 
          className={`h-full rounded-full ${color} shadow-[0_0_8px_rgba(var(--color-ref),0.4)]`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// --- Gráfico de Tendencia Responsivo ---
const TrendChart = ({ color = '#3b82f6', label = 'Tendencia' }) => {
  const data = {
    labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
    datasets: [{
      label: label,
      data: [1500, 3200, 5800, 8500, 12200, 15600].map(v => v + Math.random() * 1000), 
      borderColor: color,
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, `${color}33`); 
        gradient.addColorStop(1, `${color}00`); 
        return gradient;
      },
      borderWidth: 2,
      tension: 0.35,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: color,
    }],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, datalabels: { display: false }, tooltip: { mode: 'index', intersect: false } },
    scales: { y: { display: false }, x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 } } } },
    interaction: { mode: 'nearest', axis: 'x', intersect: false }
  };

  return (
    <div className="w-full h-[180px] sm:h-[220px] bg-[#0b1121] p-5 rounded-xl border border-slate-800 shadow-lg flex flex-col relative overflow-hidden group">
      <div className="flex justify-between items-start mb-2 relative z-10">
         <div>
            <h4 className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">{label}</h4>
            <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-white tracking-tight">+12.5%</p>
                <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">▲ Hoy</span>
            </div>
         </div>
         <span className="flex h-2 w-2 relative mt-1.5">
            <span style={{ backgroundColor: color }} className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"></span>
            <span style={{ backgroundColor: color }} className="relative inline-flex rounded-full h-2 w-2"></span>
         </span>
      </div>
      <div className="flex-1 w-full min-h-0 relative z-10">
        <Line data={data} options={options} />
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full pointer-events-none" />
    </div>
  );
};

// --- Fila de Candidato con Avatar ---
const CandidateRow = ({ rank, label, value, maxValue, color = "bg-blue-500" }) => {
  const percentage = maxValue > 0 ? ((value / maxValue) * 100).toFixed(1) : 0;
  
  return (
    <div className="relative py-3 px-4 border-b border-slate-800/50 last:border-0 group hover:bg-white/[0.02] transition-all rounded-lg">
      <div className="flex items-center gap-4 mb-2">
        <div className="flex items-center gap-3 min-w-[140px] flex-1">
          <span className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${rank === 1 ? 'bg-yellow-500/20 text-yellow-500' : rank === 2 ? 'bg-slate-400/20 text-slate-400' : 'text-slate-600'}`}>
            {rank}
          </span>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${rank === 1 ? 'bg-blue-600 ring-2 ring-blue-500/30' : 'bg-slate-700'}`}>
            {label.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-200 truncate">{label}</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Partido Político</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-white tabular-nums">{value.toLocaleString()}</div>
          <div className="text-[10px] font-medium text-emerald-400">{percentage}%</div>
        </div>
      </div>
      <div className="h-1.5 w-full bg-slate-900/80 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full rounded-full ${color} relative`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <div className="absolute top-0 right-0 bottom-0 w-full bg-gradient-to-r from-transparent to-white/20" />
        </motion.div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const staticData = getAggregates();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [activeTab, setActiveTab] = useState("presidencial");

  const presVotes = useMemo(() => getPresidentialVotes(), []);
  const totalPresVotes = Object.values(presVotes.byCandidate).reduce((a,b)=>a+b,0) || 1;
  const sortedPresCandidates = Object.entries(presVotes.byCandidate).sort(([,a], [,b]) => b - a);

  const regVotes = useMemo(() => staticData.reg_raw || {}, [staticData]);
  const totalRegVotes = Object.values(regVotes).reduce((a,b)=>a+b,0) || 1;
  const sortedRegData = Object.entries(regVotes).sort(([,a], [,b]) => b - a);

  const handleTabChange = (val) => {
    setActiveTab(val);
    setSelectedRegion(null);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 p-2 sm:p-4 max-w-[1600px] mx-auto">
      
      {/* 1. BARRA SUPERIOR */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-[#0f172a] p-2 rounded-xl border border-slate-800 shadow-lg gap-4 sticky top-0 z-30 backdrop-blur-md bg-opacity-90">
          <div className="flex items-center gap-3 px-2 w-full sm:w-auto">
              <div className="p-2 bg-blue-600/10 rounded-lg border border-blue-500/20 shrink-0">
                <BarChart3 className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white leading-none">Panel de Control</h2>
                <p className="text-[10px] text-slate-400 mt-1 hidden sm:block">Resultados preliminares al 98%</p>
              </div>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-2 bg-slate-950/50 p-1 h-10 border border-slate-800 rounded-lg">
                  <TabsTrigger value="presidencial" className="text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all rounded-md shadow-sm">PRESIDENCIAL</TabsTrigger>
                  <TabsTrigger value="regional" className="text-xs font-bold data-[state=active]:bg-amber-600 data-[state=active]:text-white transition-all rounded-md shadow-sm">REGIONAL</TabsTrigger>
              </TabsList>
          </Tabs>
      </div>

      {/* 2. TARJETAS DE ESTADÍSTICAS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        <StatCard title="Electores" value="24,200" description="Padrón Total" icon={Users} colorClass="text-indigo-400" />
        <StatCard 
            title={activeTab === 'presidencial' ? "Votos Válidos" : "Votos Reg."} 
            value={(activeTab === 'presidencial' ? totalPresVotes : totalRegVotes).toLocaleString()} 
            description="Conteo Rápido" icon={Vote} colorClass={activeTab === 'presidencial' ? "text-blue-400" : "text-amber-400"} 
            glowEffect 
        />
        <StatCard title="Participación" value="82.4%" description="A nivel nacional" icon={TrendingUp} colorClass="text-emerald-400" />
        <StatCard title="Actas" value="94.5%" description="Contabilizadas" icon={Archive} colorClass="text-purple-400" />
      </div>

      {/* 3. CONTENIDO PRINCIPAL */}
      <div className="min-h-[600px]">
        <AnimatePresence mode="wait">
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full"
            >
                {/* COLUMNA IZQUIERDA: MAPA */}
                <div className="lg:col-span-7 bg-[#0f172a] border border-slate-800 rounded-xl shadow-xl flex flex-col overflow-hidden h-[550px] lg:h-[680px] relative">
                    <div className="absolute top-4 left-4 z-10 pointer-events-none">
                        <div className="bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10 shadow-lg">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Vista Actual</p>
                            <p className={`text-sm font-bold ${activeTab === 'presidencial' ? 'text-blue-400' : 'text-amber-400'}`}>
                                {activeTab === 'presidencial' ? 'Nacional (Perú)' : (selectedRegion || 'Seleccione Región')}
                            </p>
                        </div>
                    </div>
                    <PeruMap 
                        data={staticData.mapData} 
                        selectedRegion={selectedRegion}
                        onDepartmentClick={activeTab === 'regional' ? setSelectedRegion : undefined} 
                    />
                </div>

                {/* COLUMNA DERECHA: DATOS */}
                <div className="lg:col-span-5 flex flex-col gap-4 h-auto lg:h-[680px]">
                    <TrendChart 
                        color={activeTab === 'presidencial' ? '#3b82f6' : '#f59e0b'} 
                        label={activeTab === 'presidencial' ? 'Tendencia Presidencial' : 'Actividad Regional'} 
                    />
                    
                    <div className="flex-1 bg-[#0f172a] border border-slate-800 rounded-xl p-0 flex flex-col shadow-lg min-h-[400px] overflow-hidden relative">
                        <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/30 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-white flex items-center gap-2 text-base">
                                    {activeTab === 'presidencial' ? <Users className="w-4 h-4 text-blue-500"/> : <MapPin className="w-4 h-4 text-amber-500"/>}
                                    {activeTab === 'presidencial' ? "Conteo Rápido" : (selectedRegion ? selectedRegion : "Provincias")}
                                </h3>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1 font-semibold">Ordenado por mayoría</p>
                            </div>
                            <div className="bg-slate-800 text-[10px] px-2 py-1 rounded border border-slate-700 text-slate-400">Top 5</div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                            {activeTab === 'presidencial' ? (
                                sortedPresCandidates.map(([cand, val], idx) => (
                                    <CandidateRow 
                                        key={cand} rank={idx + 1} label={cand} value={val} maxValue={totalPresVotes}
                                        color={idx === 0 ? "bg-emerald-500" : "bg-blue-600"}
                                    />
                                ))
                            ) : (
                                selectedRegion ? (
                                    <div className="p-2 space-y-1">
                                        <CandidateRow rank={1} label="Movimiento Regional A" value={4500} maxValue={10000} color="bg-amber-500" />
                                        <CandidateRow rank={2} label="Partido B" value={3200} maxValue={10000} color="bg-slate-600" />
                                        <CandidateRow rank={3} label="Alianza C" value={1800} maxValue={10000} color="bg-slate-600" />
                                    </div>
                                ) : (
                                    sortedRegData.map(([prov, val], idx) => (
                                        <CandidateRow 
                                            key={prov} rank={idx + 1} label={prov} value={val} maxValue={Math.max(...Object.values(regVotes))}
                                            color="bg-amber-600"
                                        />
                                    ))
                                )
                            )}
                            
                            {activeTab === 'regional' && !selectedRegion && sortedRegData.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50 min-h-[200px]">
                                    <PieChart className="w-12 h-12 mb-2" />
                                    <p className="text-sm">Sin datos disponibles</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full bg-[#0f172a] border border-slate-800 rounded-xl p-0 h-48 overflow-hidden flex flex-col shadow-lg mb-6 relative group">
         <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50"></div>
         <div className="flex items-center gap-2 px-4 py-3 text-slate-300 text-xs font-bold uppercase tracking-widest border-b border-slate-800 bg-slate-900/30">
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" /> Transmisión de Actas en Vivo
         </div>
         <div className="flex-1 overflow-hidden relative p-2">
            <ActivityFeed />
         </div>
      </div>

    </div>
  );
}