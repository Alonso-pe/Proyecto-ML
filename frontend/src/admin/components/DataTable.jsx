import React from 'react';

export default function DataTable({ rows = [] }){
  if (!rows || rows.length===0) return <div className="text-gray-400">Sin datos (preview)</div>;
  const headers = Object.keys(rows[0] || {});
  return (
    <div className="overflow-auto max-h-64">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left text-gray-300">
            {headers.map(h=> <th key={h} className="pr-4 pb-2">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r,idx)=> (
            <tr key={idx} className={`border-t border-white/5 ${idx%2? 'bg-white/1':''}`}>
              {headers.map(h=> <td key={h} className="py-2 pr-4 text-gray-200">{String(r[h] ?? '')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
