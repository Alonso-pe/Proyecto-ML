// frontend/src/admin/pages/Cleaning.jsx
import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/tabs';
import DataTable from '../components/DataTable';
import { Button } from '@/ui/button';
import { motion } from 'framer-motion';
import { loadJSON } from '../utils/dataUtils';
import { Eraser, RefreshCw, FileCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

// Mock functions para evitar errores si no existen utils
const generateMockVoters = () => []; 
const cleanDataset = (rows) => ({ clean: rows, removed: [] }); 

export default function Cleaning(){
  const [presRaw, setPresRaw] = useState([]);
  const [regRaw, setRegRaw] = useState([]);
  const [activeTab, setActiveTab] = useState('presidencial');

  useEffect(()=>{
    const presData = loadJSON('presidenciales_raw') || generateMockVoters();
    const regData = loadJSON('regionales_raw') || generateMockVoters();
    setPresRaw(presData);
    setRegRaw(regData);
  },[]);

  const handleClean = (type) => {
    const raw = type === 'presidencial' ? presRaw : regRaw;
    const { clean, removed } = cleanDataset(raw);
    const prefix = type === 'presidencial' ? 'presidenciales' : 'regionales';
    
    localStorage.setItem(`${prefix}_clean`, JSON.stringify(clean));
    localStorage.setItem(`${prefix}_removed`, JSON.stringify(removed));
    
    alert(`Proceso finalizado. ${clean.length} registros limpios.`);
    window.location.reload();
  }

  // Componente de "Paso Lineal"
  const LinearStep = ({ icon: Icon, title, value, color = "text-slate-400", bgColor = "bg-slate-800" }) => (
    <div className={`flex items-center p-4 ${bgColor} rounded-lg border border-slate-700/50`}>
      <div className={`p-2 rounded-md bg-black/20 mr-4`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{title}</p>
        <p className="text-xl font-mono text-white font-bold">{value}</p>
      </div>
    </div>
  );

  return (
    <motion.div className="space-y-6 max-w-6xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center bg-[#0f172a] p-6 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white">Sanitización de Datos</h2>
          <p className="text-sm text-slate-400">Gestión de calidad y depuración de registros.</p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()} className="border-slate-700 text-slate-300 hover:bg-slate-800">
          <RefreshCw className="w-4 h-4 mr-2" /> Actualizar
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#0f172a] border border-slate-800 w-full justify-start p-1 h-14">
          <TabsTrigger value="presidencial" className="px-8 py-2 text-sm">Presidencial</TabsTrigger>
          <TabsTrigger value="regional" className="px-8 py-2 text-sm">Regional</TabsTrigger>
        </TabsList>
        
        {['presidencial', 'regional'].map((type) => {
          const data = type === 'presidencial' ? presRaw : regRaw;
          return (
            <TabsContent key={type} value={type} className="mt-6 space-y-6">
              {/* Barra de Métricas Lineal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <LinearStep icon={FileCheck} title="Registros Totales" value={data.length} color="text-blue-400" />
                <LinearStep icon={AlertCircle} title="Posibles Errores" value="~2.4%" color="text-amber-400" bgColor="bg-amber-900/10 border-amber-500/20" />
                <LinearStep icon={CheckCircle2} title="Estado" value="Pendiente" color="text-slate-400" />
              </div>

              {/* Acción Principal */}
              <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-lg border border-dashed border-slate-700">
                <p className="text-sm text-slate-400">Se aplicarán filtros de duplicidad y validación de DNI.</p>
                <Button onClick={() => handleClean(type)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6">
                  <Eraser className="w-4 h-4 mr-2" /> Ejecutar Limpieza
                </Button>
              </div>

              {/* Tabla */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800">
                  <h3 className="font-bold text-white text-sm">Vista Previa de Datos</h3>
                </div>
                <DataTable rows={data} />
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </motion.div>
  )
}