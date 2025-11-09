import React from 'react';

export default function ChartPlaceholder({ label = 'Chart' }){
  return (
    <div className="h-48 flex items-center justify-center bg-white/3 rounded">
      <div className="text-gray-200">{label} (gráfico mock)</div>
    </div>
  );
}
