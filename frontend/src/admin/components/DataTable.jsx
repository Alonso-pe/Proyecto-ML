// frontend/src/admin/components/DataTable.jsx

import React from 'react';

export default function DataTable({ rows = [] }){
  if (!rows || rows.length===0) return <div className="text-muted-foreground p-4">Sin datos para mostrar (preview)</div>;
  const headers = Object.keys(rows[0] || {});
  return (
    <div className="overflow-auto max-h-[60vh] border border-border rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-accent/50 sticky top-0 backdrop-blur-md">
          <tr className="text-left text-muted-foreground">
            {headers.map(h=> (
              <th key={h} className="pr-4 pl-4 py-3 font-semibold uppercase tracking-wider text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r,idx)=> (
            <tr key={idx} className="hover:bg-accent/40 transition-colors">
              {headers.map(h=> (
                <td key={h} className="py-2.5 pr-4 pl-4 text-foreground whitespace-nowrap">
                  {/* Formateamos los números con comas */}
                  {typeof r[h] === 'number' ? r[h].toLocaleString() : String(r[h] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}