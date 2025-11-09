import React, { useRef, useState } from 'react';
import { Button } from '@/ui/button';

// Very small CSV parser (naive) — splits by lines and commas
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj = {};
    headers.forEach((h,i)=> obj[h||`col${i}`] = values[i] ?? '');
    return obj;
  });
  return { headers, rows };
}

export default function FileUploader({ type = 'generic', onParsed }) {
  const ref = useRef();
  const [name, setName] = useState(null);

  const handle = (file) => {
    if (!file) return;
    setName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = parseCSV(e.target.result || '');
        onParsed(parsed.rows || []);
      } catch (err) {
        alert('Error parsing CSV (mock)');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-2">
      <input ref={ref} type="file" accept=".csv" onChange={e=>handle(e.target.files[0])} />
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-300">{name || 'Ningún archivo'}</div>
        <Button variant="ghost" onClick={()=>{ if(ref.current) ref.current.value=''; setName(null); }}>Limpiar</Button>
      </div>
    </div>
  );
}
