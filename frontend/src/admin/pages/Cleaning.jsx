import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';
import DataTable from '../components/DataTable';

function loadRaw(type){
  try{ return JSON.parse(localStorage.getItem(`${type}_raw`)||'[]'); }catch(e){return []}
}

export default function Cleaning(){
  const [presRaw, setPresRaw] = useState([]);
  const [congRaw, setCongRaw] = useState([]);
  const [munRaw, setMunRaw] = useState([]);

  useEffect(()=>{
    setPresRaw(loadRaw('presidenciales'));
    setCongRaw(loadRaw('congresales'));
    setMunRaw(loadRaw('municipales'));
  },[]);

  const cleanDataset = (rows) => {
    // Mock cleaning: remove exact duplicates and rows missing 'dni' or 'voto'
    const seen = new Set();
    const clean = [];
    const removed = [];
    rows.forEach(r=>{
      const key = JSON.stringify(r);
      if (seen.has(key)) { removed.push({...r, reason:'duplicate'}); return; }
      seen.add(key);
      if (!r.dni || !r.voto) { removed.push({...r, reason:'missing'}); return; }
      // Normalize: lowercase candidate
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
    setTimeout(()=>{
      setPresRaw(loadRaw('presidenciales'));
      setCongRaw(loadRaw('congresales'));
      setMunRaw(loadRaw('municipales'));
    },300);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Limpieza de Datos (visual)</h2>
      <p className="text-gray-300">Revise los datos antes y después. Presione <strong>Limpiar datos</strong> para aplicar las reglas de mock: eliminar duplicados, manejar nulos y normalizar nombres.</p>

      <div className="flex justify-end">
        <button className="px-4 py-2 rounded bg-primary" onClick={handleCleanAll}>Limpiar datos</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Presidenciales — raw (preview)</CardTitle></CardHeader>
          <CardContent><DataTable rows={presRaw.slice(0,20)} /></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Congresales — raw (preview)</CardTitle></CardHeader>
          <CardContent><DataTable rows={congRaw.slice(0,20)} /></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Municipales — raw (preview)</CardTitle></CardHeader>
          <CardContent><DataTable rows={munRaw.slice(0,20)} /></CardContent>
        </Card>
      </div>

      <div className="text-sm text-gray-400">Después de limpiar, revise las tablas *_clean y *_removed en localStorage (mock).</div>
    </div>
  )
}
