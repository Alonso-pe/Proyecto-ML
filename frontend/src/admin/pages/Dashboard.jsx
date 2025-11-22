import React, { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/tabs';
import PeruMap from '../components/PeruMap';
import ActivityFeed from '../components/ActivityFeed';
import StatCard from '../components/StatCard';
import { getAggregates, getPresidentialVotes } from '../utils/dataUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Vote, TrendingUp, Archive, MapPin, Activity, PieChart, BarChart3 } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// --- COMPONENTE: BARRA LINEAL ---
const LinearBar = ({ label, value, maxValue, color = "bg-blue-500" }) => {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));
  return (
    <div className="py-2.5 border-b border-slate-800/50 last:border-0 group hover:bg-white/[0.02] px-2 rounded transition-colors">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-medium text-slate-300 truncate max-w-[65%]">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white tabular-nums">{value.toLocaleString()}</span>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-1.5 rounded-sm">
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

// --- GRÁFICO DE TENDENCIA ---
const TrendChart = () => {
  const data = {
    labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
    datasets: [{
      label: 'Tendencia',
      data: [1500, 3200, 5800, 8500, 12200, 15600], 
      borderColor: '#fbbf24',
      backgroundColor: 'rgba(251, 191, 36, 0.0)',
      borderWidth: 3,
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: '#fbbf24',
      pointBorderColor: '#0f172a',
      pointBorderWidth: 2,
      pointHoverRadius: 7,
    }],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, border: { display: false }, grid: { color: 'rgba(255, 255, 255, 0.08)', borderDash: [4, 4] }, ticks: { color: '#64748b', font: { size: 10 } } },
      x: { border: { display: false }, grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 } } }
    }
  };
  return (
    <div className="w-full h-[220px] flex-shrink-0 bg-[#0b1121] p-4 rounded-xl border border-slate-800 shadow-inner flex flex-col mb-4">
      <div className="flex justify-between items-center mb-2">
         <h4 className="text-xs text-slate-400 uppercase font-bold tracking-wider">Tendencia Nacional</h4>
         <span className="text-[9px] text-green-400 bg-green-400/10 px-1.5 rounded border border-green-400/20 tracking-wide font-bold">ALTA</span>
      </div>
      <div className="flex-1 w-full min-h-0">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

// --- DATA HELPERS ---
const getProvincesForRegion = (regionName) => {
  if (!regionName) return null;
  const baseCount = Math.floor(Math.random() * 600) + 400;
  return {
    [`Provincia Capital`]: baseCount,
    [`Zona Norte`]: Math.floor(baseCount * 0.92),
    [`Zona Sur`]: Math.floor(baseCount * 0.85),
    [`Zona Este`]: Math.floor(baseCount * 0.77),
    [`Zona Oeste`]: Math.floor(baseCount * 0.65),
    [`Distrito Alto`]: Math.floor(baseCount * 0.55)
  };
};

const useLiveData = (initialData) => {
  const [data, setData] = useState(initialData);
  const [mesas, setMesas] = useState(1200);
  useEffect(() => { setData(initialData); }, [initialData]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setMesas(prev => prev + 1);
      setData(prev => {
        const newData = { ...prev };
        if (newData.byCandidate) {
           const keys = Object.keys(newData.byCandidate);
           if(keys.length) newData.byCandidate[keys[0]] += Math.floor(Math.random() * 5);
        }
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return { liveData: data, mesasEscrutadas: mesas };
};

export default function Dashboard() {
  const staticData = getAggregates();
  const totalMesas = 1500;
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredDep, setHoveredDep] = useState(null);
  const [activeTab, setActiveTab] = useState("presidencial");

  const handleRegionClick = (regionName) => {
    if (!regionName || selectedRegion === regionName) {
      setSelectedRegion(null);
      setActiveTab("presidencial");
    } else {
      setSelectedRegion(regionName);
      setActiveTab("regional");
    }
  };

  const presVotes = useMemo(() => getPresidentialVotes(), []);
  const provincesInitialData = useMemo(() => ({ byProvince: getProvincesForRegion(selectedRegion) }), [selectedRegion]);
  const { liveData: provincesLiveData } = useLiveData(provincesInitialData);
  const { liveData: finalPresData, mesasEscrutadas } = useLiveData({ byCandidate: presVotes.byCandidate });

  const totalVotos = Object.values(finalPresData.byCandidate).reduce((a,b)=>a+b,0);
  const sortedCandidates = Object.entries(finalPresData.byCandidate).sort(([,a], [,b]) => b - a);
  const totalPresVotes = Math.max(totalVotos, 1);

  return (
    // Eliminamos la altura fija y usamos w-full. El scroll lo maneja AdminLayout
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
      
      {/* 1. KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
        <StatCard title="Electores" value="24,200" description="Padrón" icon={Users} colorClass="text-indigo-400" />
        <StatCard title="Votos" value={totalVotos.toLocaleString()} description="En vivo" icon={Vote} colorClass="text-emerald-400" glowEffect />
        <StatCard title="Participación" value="82.4%" description="Nacional" icon={TrendingUp} colorClass="text-blue-400" />
        <StatCard title="Actas" value={`${((mesasEscrutadas/totalMesas)*100).toFixed(1)}%`} description="Procesadas" icon={Archive} colorClass="text-amber-400" />
      </div>

      {/* 2. Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        
        {/* IZQUIERDA: MAPA (Altura fija en móvil para no ocupar todo, Flexible en PC) */}
        <div className="lg:col-span-8 h-[500px] lg:h-[calc(100vh-16rem)] bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden relative shadow-xl flex flex-col">
           <PeruMap 
              data={staticData.mapData} 
              onDepartmentHover={setHoveredDep} 
              onDepartmentClick={handleRegionClick} 
              selectedRegion={selectedRegion} 
           />
        </div>

        {/* DERECHA: DATOS */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:h-[calc(100vh-16rem)]">
          
          {/* Panel de Resultados (Flexible) */}
          <div className="flex-1 bg-[#0f172a] border border-slate-800 rounded-xl shadow-lg flex flex-col overflow-hidden min-h-[500px] lg:min-h-0">
            <div className="p-3 border-b border-slate-800 bg-slate-900/50 shrink-0">
               <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-900 p-1 h-10 border border-slate-800/50">
                    <TabsTrigger value="presidencial" className="text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">PRESIDENCIAL</TabsTrigger>
                    <TabsTrigger value="regional" className="text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">REGIONAL</TabsTrigger>
                  </TabsList>
               </Tabs>
            </div>

            {/* Contenido Scrollable */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar relative">
               
               {/* VISTA PRESIDENCIAL */}
               <div className={activeTab === 'presidencial' ? 'flex flex-col h-full' : 'hidden'}>
                  <TrendChart />
                  
                  {/* Lista de Conteo Rápido */}
                  <div className="flex-1 flex flex-col min-h-0 bg-[#0b1121] rounded-xl border border-slate-800 p-3 shadow-inner">
                     <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2 shrink-0">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                           <Vote className="w-3 h-3 text-blue-400" /> Conteo Rápido
                        </h4>
                     </div>
                     {/* Flex-1 para que ocupe todo el espacio restante y active scroll si es necesario */}
                     <div className="flex-1 overflow-y-auto custom-scrollbar space-y-0.5 pr-1 min-h-[150px]">
                        {sortedCandidates.map(([cand, val], idx) => (
                           <LinearBar 
                              key={cand} label={cand} value={val} maxValue={totalPresVotes} 
                              color={idx === 0 ? "bg-emerald-500" : "bg-slate-600"}
                           />
                        ))}
                     </div>
                  </div>
               </div>

               {/* VISTA REGIONAL */}
               <div className={activeTab === 'regional' ? 'flex flex-col h-full' : 'hidden'}>
                  {selectedRegion ? (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-4 p-4 bg-[#0b1121] rounded-lg border border-amber-500/20 shrink-0 shadow-sm">
                           <div className="p-2.5 bg-amber-500/10 rounded-lg border border-amber-500/20">
                              <MapPin className="w-6 h-6 text-amber-500" />
                           </div>
                           <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Región</span>
                              <span className="text-xl font-black text-white uppercase tracking-tight">{selectedRegion}</span>
                           </div>
                        </div>
                        
                        <div className="bg-[#0b1121] rounded-xl border border-slate-800 p-4 flex-1 overflow-hidden flex flex-col shadow-inner">
                           <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-1 min-h-[200px]">
                              {provincesLiveData?.byProvince && Object.entries(provincesLiveData.byProvince).map(([prov, val]) => (
                                 <LinearBar 
                                    key={prov} label={prov} value={val} 
                                    maxValue={Math.max(...Object.values(provincesLiveData.byProvince))} 
                                    color="bg-amber-500" 
                                 />
                              ))}
                           </div>
                        </div>
                     </motion.div>
                  ) : (
                     <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 opacity-60">
                        <PieChart className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-sm font-medium text-slate-300">Sin región seleccionada</p>
                        <p className="text-xs mt-1 text-slate-500">Haga clic en el mapa para ver datos.</p>
                     </div>
                  )}
               </div>
            </div>
          </div>

          {/* Feed de Actividad (Fijo) */}
          <div className="h-[160px] flex-shrink-0 bg-[#0f172a] border border-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col">
             <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-900/50 flex items-center gap-2 shrink-0">
                <Activity className="w-3 h-3 text-emerald-400" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Actividad Reciente</span>
             </div>
             <div className="flex-1 overflow-hidden relative">
                <ActivityFeed />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}