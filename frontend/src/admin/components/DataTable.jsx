// frontend/src/admin/components/DataTable.jsx

import React from 'react';

export default function DataTable({ rows = [] }){
  if (!rows || rows.length===0) return <div className="text-muted-foreground p-4">Sin datos para mostrar (preview)</div>;
  const headers = Object.keys(rows[0] || {});
  
  return (
    // Contenedor con borde y scroll
    <div className="w-full overflow-hidden rounded-lg border border-border bg-slate-950/50">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-slate-900 text-slate-400 uppercase text-xs font-bold tracking-wider">
            <tr>
              {headers.map(h=> (
                <th key={h} className="px-6 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.map((r,idx)=> (
              <tr key={idx} className="hover:bg-white/5 transition-colors">
                {headers.map(h=> (
                  <td key={h} className="px-6 py-3 text-slate-300">
                    {typeof r[h] === 'number' ? r[h].toLocaleString() : String(r[h] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}