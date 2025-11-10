// frontend/src/admin/pages/Cleaning.jsx

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';
import DataTable from '../components/DataTable';
import { Button } from '@/ui/button';
import { motion } from 'framer-motion';
import { loadJSON } from '../utils/dataUtils'; // Importamos el loadJSON

// Animaciones
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Cleaning(){
  const [presRaw, setPresRaw] = useState([]);
  const [congRaw, setCongRaw] = useState([]);
  const [munRaw, setMunRaw] = useState([]);

  useEffect(()=>{
    setPresRaw(loadJSON('presidenciales_raw') || []); // Usamos loadJSON
    setCongRaw(loadJSON('congresales_raw') || []); // Usamos loadJSON
    setMunRaw(loadJSON('municipales_raw') || []); // Usamos loadJSON
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

  const handleCleanAll = ()=>{
    const p = cleanDataset(presRaw); localStorage.setItem('presidenciales_clean', JSON.stringify(p.clean)); localStorage.setItem('presidenciales_removed', JSON.stringify(p.removed));
    const c = cleanDataset(congRaw); localStorage.setItem('congresales_clean', JSON.stringify(c.clean)); localStorage.setItem('congresales_removed', JSON.stringify(c.removed));
    const m = cleanDataset(munRaw); localStorage.setItem('municipales_clean', JSON.stringify(m.clean)); localStorage.setItem('municipales_removed', JSON.stringify(m.removed));
    alert('Limpieza aplicada (mock). Se generaron tablas clean y removed.');
    window.location.reload();
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <p className="text-muted-foreground max-w-2xl">
          Revise los datos cargados desde su CSV. Presione <strong>Limpiar datos</strong> para aplicar las reglas de mock: eliminar duplicados, manejar nulos y normalizar.
        </p>
        <Button className="bg-primary text-primary-foreground font-semibold text-base py-6 px-6" onClick={handleCleanAll}>
          Ejecutar Limpieza de Datos
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6">
        <Card className="bg-card/80 border-border backdrop-blur-sm">
          <CardHeader><CardTitle>Presidenciales — RAW (preview)</CardTitle></CardHeader>
          <CardContent><DataTable rows={presRaw.slice(0,20)} /></CardContent>
        </Card>
        <Card className="bg-card/80 border-border backdrop-blur-sm">
          <CardHeader><CardTitle>Congresales — RAW (preview)</CardTitle></CardHeader>
          <CardContent><DataTable rows={congRaw.slice(0,20)} /></CardContent>
        </Card>
        <Card className="bg-card/80 border-border backdrop-blur-sm">
          <CardHeader><CardTitle>Municipales — RAW (preview)</CardTitle></CardHeader>
          <CardContent><DataTable rows={munRaw.slice(0,20)} /></CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}