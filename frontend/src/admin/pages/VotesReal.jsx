import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';
import DataTable from '../components/DataTable';

function loadVotes(){
  try{ return JSON.parse(localStorage.getItem('votes_real')||'[]'); }catch(e){ return []; }
}

export default function VotesReal(){
  const [rows,setRows] = useState([]);
  useEffect(()=> setRows(loadVotes()), []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Votos Reales (mock)</h2>
      <p className="text-gray-300">Lista paginada con filtros mínimos (tipo, candidato, región). Datos guardados en localStorage → <code>votes_real</code>.</p>
      <Card>
        <CardHeader><CardTitle>Tabla de votos</CardTitle></CardHeader>
        <CardContent>
          <DataTable rows={rows.slice(0,200)} />
        </CardContent>
      </Card>
    </div>
  )
}
