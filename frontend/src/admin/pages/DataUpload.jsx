// frontend/src/admin/components/DataTable.jsx
import React from 'react';

export default function DataTable({ rows = [] }){
  if (!rows || rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-slate-500">
        <p>No hay datos para mostrar</p>
      </div>
    );
  }
  
  const headers = Object.keys(rows[0] || {});
  
  return (
    <div className="w-full overflow-hidden bg-[#0f172a]">
      <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs font-bold text-slate-400 uppercase bg-slate-900 sticky top-0 z-10 shadow-sm">
            <tr>
              {headers.map(h => (
                <th key={h} className="px-6 py-4 tracking-wider border-b border-slate-800 whitespace-nowrap">
                  {h.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {rows.map((r, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30 transition-colors group">
                {headers.map(h => (
                  <td key={h} className="px-6 py-3 whitespace-nowrap text-slate-300 font-medium group-hover:text-white">
                    {typeof r[h] === 'number' 
                      ? <span className="font-mono text-emerald-400">{r[h].toLocaleString()}</span> 
                      : r[h]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-900/50 px-6 py-2 border-t border-slate-800">
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Total: {rows.length} registros</span>
      </div>
    </div>
  )
}