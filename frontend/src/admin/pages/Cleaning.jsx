import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/tabs';
import DataTable from '../components/DataTable';
import { Button } from '@/ui/button';
import { motion } from 'framer-motion';
import { loadJSON } from '../utils/dataUtils';
import { Eraser, RefreshCw, FileCheck, AlertTriangle, CheckCircle, Database, Activity, SlidersHorizontal } from 'lucide-react';
import { useToast } from '@/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';

// --- GENERADOR DE DATOS MOCK ---
const generateMockData = (type) => {
  const baseData = [
    { dni: '40192834', region: 'Lima', provincia: 'Lima', fecha: '2025-11-22', voto: 'Keiko Fujimori' },
    { dni: '72839401', region: 'Arequipa', provincia: 'Arequipa', fecha: '2025-11-22', voto: 'Pedro Castillo' },
    { dni: '10293847', region: 'Cusco', provincia: 'Cusco', fecha: '2025-11-22', voto: 'Rafael López Aliaga' },
    { dni: '40192834', region: 'Lima', provincia: 'Lima', fecha: '2025-11-22', voto: 'Keiko Fujimori' }, // Duplicado
    { dni: '123', region: 'Piura', provincia: 'Piura', fecha: '2025-11-22', voto: 'Nulo' }, // Inválido
  ];

  if (type === 'regional') {
    return baseData.map(d => ({
      ...d,
      candidato_regional: d.region === 'Lima' ? 'Carlos Añaños' : 'Werner Salcedo',
      candidato_alcalde: 'Rafael A.',
      voto: undefined 
    }));
  }
  return baseData.map(({ provincia, ...rest }) => rest);
};

const cleanDataset = (rows) => {
  const uniqueMap = new Map();
  const errors = [];
  let duplicates = 0;
  let invalidDni = 0;
  
  rows.forEach((row) => {
    let error = null;
    if (!/^\d{8}$/.test(row.dni)) {
      error = 'Formato DNI Inválido';
      invalidDni++;
    } else if (uniqueMap.has(row.dni)) {
      error = 'Registro Duplicado';
      duplicates++;
    }

    if (error) {
      errors.push({ ...row, error_type: error });
    } else {
      uniqueMap.set(row.dni, row);
    }
  });

  return { 
    clean: Array.from(uniqueMap.values()), 
    removed: errors,
    stats: { duplicates, invalidDni }
  };
};

// Tarjeta de Estadística (Responsive)
const QualityStat = ({ icon: Icon, title, value, subtext, color = "blue" }) => {
    const colors = {
        blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        green: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        red: "bg-red-500/10 text-red-500 border-red-500/20",
    };

    return (
        <div className="flex items-start p-4 bg-[#0f172a] rounded-xl border border-slate-800 shadow-sm">
            <div className={`p-3 rounded-lg border ${colors[color]} mr-4 flex-shrink-0`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate">{title}</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-0.5 tabular-nums truncate">{value}</p>
                {subtext && <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 truncate">{subtext}</p>}
            </div>
        </div>
    );
};

export default function Cleaning() {
  const { toast } = useToast();
  const [presRaw, setPresRaw] = useState([]);
  const [regRaw, setRegRaw] = useState([]);
  const [activeTab, setActiveTab] = useState('presidencial');
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanStats, setCleanStats] = useState(null);

  useEffect(() => {
    const presData = loadJSON('presidenciales_raw') || generateMockData('presidencial');
    const regData = loadJSON('regionales_raw') || generateMockData('regional');
    setPresRaw(presData);
    setRegRaw(regData);
  }, []);

  const handleClean = async (type) => {
    setIsCleaning(true);
    setCleanStats(null); 

    await new Promise(resolve => setTimeout(resolve, 1000)); 

    const raw = type === 'presidencial' ? presRaw : regRaw;
    const { clean, removed, stats } = cleanDataset(raw);
    const prefix = type === 'presidencial' ? 'presidenciales' : 'regionales';
    
    localStorage.setItem(`${prefix}_clean`, JSON.stringify(clean));
    localStorage.setItem(`${prefix}_removed`, JSON.stringify(removed));
    
    if (type === 'presidencial') setPresRaw(clean);
    else setRegRaw(clean);

    setCleanStats(stats);
    setIsCleaning(false);

    toast({
      title: "✅ Proceso Finalizado",
      description: `Se limpiaron ${removed.length} registros incorrectos.`,
      className: "bg-slate-900 border-slate-800 text-white"
    });
  };

  return (
    <motion.div className="space-y-6 w-full max-w-[1600px] mx-auto p-2 sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      
      {/* Encabezado Principal (Responsive) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0f172a] p-4 sm:p-6 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" /> Calidad de Datos
          </h2>
          <p className="text-sm text-slate-400 mt-1">Gestión y depuración de registros.</p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()} className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white gap-2">
          <RefreshCw className="w-4 h-4" /> <span className="sm:inline">Recargar</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Lista de Pestañas (Full width en móvil) */}
        <TabsList className="bg-[#0f172a] border border-slate-800 p-1 h-auto rounded-xl w-full sm:w-auto flex sm:inline-flex">
          <TabsTrigger value="presidencial" className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all justify-center">
             Presidencial
          </TabsTrigger>
          <TabsTrigger value="regional" className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 text-sm data-[state=active]:bg-amber-600 data-[state=active]:text-white rounded-lg transition-all justify-center">
             Regional
          </TabsTrigger>
        </TabsList>
        
        {['presidencial', 'regional'].map((type) => {
          const data = type === 'presidencial' ? presRaw : regRaw;
          
          // Lógica: Ocultar región/provincia en presidencial para limpiar la vista
          const displayData = type === 'presidencial' ? data.map(({ region, provincia, ...rest }) => rest) : data;
          
          const totalRows = data.length;
          const estimatedErrors = data.filter(r => !/^\d{8}$/.test(r.dni)).length; 
          const errorRate = totalRows > 0 ? ((estimatedErrors / totalRows) * 100).toFixed(1) : 0;

          return (
            <TabsContent key={type} value={type} className="mt-6 space-y-6 focus-visible:outline-none">
              
              {/* 1. Panel de Métricas (Grid Responsive) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <QualityStat 
                    icon={Database} 
                    title="Registros" 
                    value={totalRows.toLocaleString()} 
                    subtext="Total cargado"
                    color="blue" 
                />
                <QualityStat 
                    icon={AlertTriangle} 
                    title="Calidad" 
                    value={`${100 - errorRate}%`} 
                    subtext={`~${estimatedErrors} errores detectados`}
                    color={errorRate > 0 ? "amber" : "green"} 
                />
                <QualityStat 
                    icon={cleanStats ? CheckCircle : Activity} 
                    title="Estado" 
                    value={cleanStats ? "Limpio" : "Pendiente"} 
                    subtext={cleanStats ? "Listo para uso" : "Requiere acción"}
                    color={cleanStats ? "green" : "red"} 
                />
              </div>

              {/* 2. Panel Principal (Acción + Tabla) */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                 
                 {/* Tarjeta de Acción */}
                 <Card className="xl:col-span-1 bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 shadow-lg h-fit">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2 text-lg">
                            <Eraser className="w-5 h-5 text-emerald-400" /> Limpieza Automática
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>Validar DNI (8 dígitos)</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>Eliminar duplicados</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>Estandarizar texto</span>
                            </div>
                        </div>
                        
                        <Button 
                            onClick={() => handleClean(type)} 
                            disabled={isCleaning || totalRows === 0}
                            className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all rounded-xl"
                        >
                            {isCleaning ? "Procesando..." : "Ejecutar Limpieza"}
                        </Button>
                        
                        {/* Resumen Post-Limpieza */}
                        {cleanStats && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }} 
                                animate={{ opacity: 1, height: 'auto' }}
                                className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-2"
                            >
                                <div className="text-center p-2 bg-red-500/10 rounded border border-red-500/20">
                                    <p className="text-[10px] text-red-400 uppercase font-bold">Duplicados</p>
                                    <p className="text-lg font-bold text-white">{cleanStats.duplicates}</p>
                                </div>
                                <div className="text-center p-2 bg-amber-500/10 rounded border border-amber-500/20">
                                    <p className="text-[10px] text-amber-400 uppercase font-bold">DNI Inválido</p>
                                    <p className="text-lg font-bold text-white">{cleanStats.invalidDni}</p>
                                </div>
                            </motion.div>
                        )}
                    </CardContent>
                 </Card>

                 {/* Vista de Tabla (Con Scroll Horizontal) */}
                 <Card className="xl:col-span-2 bg-[#0f172a] border-slate-800 flex flex-col overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shrink-0">
                        <h3 className="font-bold text-white text-sm flex items-center gap-2">
                            <FileCheck className="w-4 h-4 text-blue-400" />
                            Vista Previa ({type === 'regional' ? 'Regional' : 'Nacional'})
                        </h3>
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-3 h-3 text-slate-500" />
                            <span className="text-[10px] text-slate-400 uppercase font-bold">
                                Muestra: 100 filas
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden p-0 relative">
                        {/* Contenedor con scroll horizontal para móviles */}
                        <div className="overflow-x-auto custom-scrollbar max-h-[400px]">
                             <div className="min-w-[600px] lg:min-w-full p-0">
                                <DataTable rows={displayData.slice(0, 100)} />
                             </div>
                        </div>
                    </div>
                 </Card>
              </div>

            </TabsContent>
          );
        })}
      </Tabs>
    </motion.div>
  );
}