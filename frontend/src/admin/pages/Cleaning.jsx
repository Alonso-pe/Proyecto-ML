// frontend/src/admin/pages/Cleaning.jsx

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/tabs';
import DataTable from '../components/DataTable';
import { Button } from '@/ui/button';
import { motion } from 'framer-motion';
import { loadJSON } from '../utils/dataUtils';

// Animaciones
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

// Datos simulados de votantes
const generateMockVoters = (type) => {
  const mockData = [];
  const candidates = type === 'presidencial' 
    ? ['Pedro Castillo', 'Keiko Fujimori', 'Rafael López Aliaga', 'Verónika Mendoza', 'Yonhy Lescano']
    : ['Carlos Rojas - Presidente Regional', 'María González - Alcalde', 'Juan Pérez - Presidente Regional', 'Ana Martínez - Alcalde'];
  
  const regions = ['Lima', 'Arequipa', 'Cusco', 'La Libertad', 'Piura', 'Lambayeque', 'Junín', 'Cajamarca', 'Ancash', 'Puno'];
  const provinces = {
    'Lima': ['Lima', 'Callao', 'Huaura', 'Barranca'],
    'Arequipa': ['Arequipa', 'Caylloma', 'Camana'],
    'Cusco': ['Cusco', 'Quispicanchi', 'Canchis'],
    'La Libertad': ['Trujillo', 'Chepen', 'Pacasmayo'],
    'Piura': ['Piura', 'Sullana', 'Talara'],
    'Lambayeque': ['Chiclayo', 'Lambayeque'],
    'Junín': ['Huancayo', 'Jauja', 'Tarma'],
    'Cajamarca': ['Cajamarca', 'Jaén', 'Cutervo'],
    'Ancash': ['Huaraz', 'Chimbote', 'Yungay'],
    'Puno': ['Puno', 'Juliaca', 'Azángaro']
  };

  for (let i = 0; i < 50; i++) {
    const region = regions[Math.floor(Math.random() * regions.length)];
    const regionProvinces = provinces[region] || [region];
    const province = regionProvinces[Math.floor(Math.random() * regionProvinces.length)];
    const dni = String(Math.floor(10000000 + Math.random() * 90000000));
    
    mockData.push({
      dni: dni,
      nombre: `Votante ${i + 1}`,
      region: region,
      provincia: province,
      candidato: candidates[Math.floor(Math.random() * candidates.length)],
      voto: type === 'presidencial' ? 'Presidencial' : 'Regional',
      fecha: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  }
  
  return mockData;
};

export default function Cleaning(){
  const [presRaw, setPresRaw] = useState([]);
  const [regRaw, setRegRaw] = useState([]);
  const [activeTab, setActiveTab] = useState('presidencial');

  useEffect(()=>{
    // Cargar datos reales si existen, sino usar datos simulados
    const presData = loadJSON('presidenciales_raw');
    const regData = loadJSON('regionales_raw');
    
    setPresRaw(presData && presData.length > 0 ? presData : generateMockVoters('presidencial'));
    setRegRaw(regData && regData.length > 0 ? regData : generateMockVoters('regional'));
  },[]);

  const cleanDataset = (rows) => {
    const seen = new Set();
    const clean = [];
    const removed = [];
    rows.forEach(r=>{
      const key = JSON.stringify(r);
      if (seen.has(key)) { removed.push({...r, reason:'duplicate'}); return; }
      seen.add(key);
      if (!r.dni || !r.voto) { removed.push({...r, reason:'missing'}); return; }
      const normalized = {...r, candidato: r.candidato? String(r.candidato).trim().toLowerCase(): r.candidato };
      clean.push(normalized);
    });
    return { clean, removed };
  }

  const handleCleanPresidencial = ()=>{
    const p = cleanDataset(presRaw); 
    localStorage.setItem('presidenciales_clean', JSON.stringify(p.clean)); 
    localStorage.setItem('presidenciales_removed', JSON.stringify(p.removed));
    alert('Limpieza de datos presidenciales aplicada. Se generaron tablas clean y removed.');
    window.location.reload();
  }

  const handleCleanRegional = ()=>{
    const r = cleanDataset(regRaw); 
    localStorage.setItem('regionales_clean', JSON.stringify(r.clean)); 
    localStorage.setItem('regionales_removed', JSON.stringify(r.removed));
    alert('Limpieza de datos regionales aplicada. Se generaron tablas clean y removed.');
    window.location.reload();
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger 
              value="presidencial" 
              className="text-base font-semibold data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:hover:bg-slate-600"
            >
              Votación Presidencial
            </TabsTrigger>
            <TabsTrigger 
              value="regional" 
              className="text-base font-semibold data-[state=active]:bg-indigo-700 data-[state=active]:text-white data-[state=active]:hover:bg-indigo-600"
            >
              Votación Regional
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="presidencial" className="mt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Tabla de Votantes Presidenciales</h3>
                  <p className="text-sm text-gray-400">Total de registros: {presRaw.length}</p>
                </div>
                <Button 
                  className="bg-primary text-primary-foreground font-semibold text-base py-6 px-8 hover:bg-primary/90" 
                  onClick={handleCleanPresidencial}
                >
                  Limpiar Datos Presidenciales
                </Button>
              </div>
              <Card className="bg-card/80 border-border backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-white font-semibold">Presidenciales — RAW (preview)</CardTitle>
                  <p className="text-sm text-gray-400 mt-1">Datos sin procesar de votación presidencial</p>
                </CardHeader>
                <CardContent>
                  <DataTable rows={presRaw} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="regional" className="mt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Tabla de Votantes Regionales</h3>
                  <p className="text-sm text-gray-400">Total de registros: {regRaw.length}</p>
                </div>
                <Button 
                  className="bg-primary text-primary-foreground font-semibold text-base py-6 px-8 hover:bg-primary/90" 
                  onClick={handleCleanRegional}
                >
                  Limpiar Datos Regionales
                </Button>
              </div>
              <Card className="bg-card/80 border-border backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-white font-semibold">Regionales — RAW (preview)</CardTitle>
                  <p className="text-sm text-gray-400 mt-1">Datos sin procesar de votación regional</p>
                </CardHeader>
                <CardContent>
                  <DataTable rows={regRaw} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}