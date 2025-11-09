import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';
import FileUploader from '../components/FileUploader';

export default function DataUpload({ onNext }) {
  const [status, setStatus] = useState('idle');

  const handleFiles = (parsed) => {
    // parsed: { type: 'pres'|'cong'|'mun', rows: [...] }
    // Save mocks into localStorage
    const key = `${parsed.type}_raw`;
    localStorage.setItem(key, JSON.stringify(parsed.rows));
    setStatus('uploaded');
    setTimeout(() => onNext && onNext(), 800);
  };

  const loadSample = () => {
    // Dataset estático para demostración
    const pres = [
      { dni: '11111111', candidato: 'Perez', region: 'Lima', fecha: '2025-11-03', voto: 'Perez' },
      { dni: '22222222', candidato: 'Gonzales', region: 'Cusco', fecha: '2025-11-03', voto: 'Gonzales' },
      { dni: '33333333', candidato: 'Lopez', region: 'Lima', fecha: '2025-11-04', voto: 'Lopez' },
      { dni: '44444444', candidato: 'Perez', region: 'Arequipa', fecha: '2025-11-04', voto: 'Perez' },
      { dni: '55555555', candidato: 'Gonzales', region: 'Trujillo', fecha: '2025-11-05', voto: 'Gonzales' }
    ];
    const cong = [
      { dni: '66666666', candidato: 'Partido A', region: 'Lima', fecha: '2025-11-03', voto: 'Partido A' },
      { dni: '77777777', candidato: 'Partido B', region: 'Arequipa', fecha: '2025-11-04', voto: 'Partido B' },
      { dni: '88888888', candidato: 'Partido C', region: 'Cusco', fecha: '2025-11-05', voto: 'Partido C' }
    ];
    const mun = [
      { dni: '99999999', candidato: 'Distrito 1', region: 'Lima', fecha: '2025-11-03', voto: 'Distrito 1' },
      { dni: '10101010', candidato: 'Distrito 2', region: 'Trujillo', fecha: '2025-11-04', voto: 'Distrito 2' },
      { dni: '12121212', candidato: 'Distrito 3', region: 'Lima', fecha: '2025-11-05', voto: 'Distrito 3' }
    ];
    const votes = [
      { id: 1, tipo: 'presidenciales', candidato: 'Perez', region: 'Lima', fecha: '2025-11-03' },
      { id: 2, tipo: 'presidenciales', candidato: 'Lopez', region: 'Lima', fecha: '2025-11-04' },
      { id: 3, tipo: 'congresales', candidato: 'Partido A', region: 'Arequipa', fecha: '2025-11-05' }
    ];
    localStorage.setItem('presidenciales_raw', JSON.stringify(pres));
    localStorage.setItem('congresales_raw', JSON.stringify(cong));
    localStorage.setItem('municipales_raw', JSON.stringify(mun));
    localStorage.setItem('votes_real', JSON.stringify(votes));
    setStatus('sample-loaded');
    setTimeout(()=> onNext && onNext(), 600);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Carga de Datos (CSV)</h2>
      <p className="text-gray-300">Selecciona CSV para Presidenciales, Congresales o Municipales. La carga es mock y se guardará localmente.</p>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Presidenciales (raw)</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUploader type="presidenciales" onParsed={(rows)=>handleFiles({type:'presidenciales', rows})} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Congresales (raw)</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUploader type="congresales" onParsed={(rows)=>handleFiles({type:'congresales', rows})} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Municipales (raw)</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUploader type="municipales" onParsed={(rows)=>handleFiles({type:'municipales', rows})} />
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">Estado: {status}</div>
        <div className="space-x-2">
          <button className="px-3 py-2 rounded bg-white/5 text-sm hover:bg-white/10" onClick={loadSample}>
            Cargar datos de ejemplo
          </button>
          <button
            className="px-3 py-2 rounded bg-primary/20 text-primary hover:bg-primary/30"
            onClick={() => {
              // Dataset pequeño estático (5 votos presidenciales)  
              const small = {
                presidenciales: Array.from({length: 5}).map((_, i) => ({
                  dni: `P${String(i+1).padStart(8,'0')}`,
                  candidato: ['Perez','Gonzales','Lopez'][Math.floor(i/2)],
                  region: ['Lima','Cusco'][Math.floor(i/3)],
                  fecha: '2025-11-0' + (Math.floor(i/3) + 3),
                  voto: ['Perez','Gonzales','Lopez'][Math.floor(i/2)]
                })),
                congresales: Array.from({length: 3}).map((_, i) => ({
                  dni: `C${String(i+1).padStart(8,'0')}`,
                  candidato: ['Partido A','Partido B','Partido C'][i],
                  region: ['Lima','Cusco'][Math.floor(i/2)],
                  fecha: '2025-11-0' + (Math.floor(i/2) + 3), 
                  voto: ['Partido A','Partido B','Partido C'][i]
                })),
                municipales: Array.from({length: 2}).map((_, i) => ({
                  dni: `M${String(i+1).padStart(8,'0')}`,
                  candidato: ['Distrito 1','Distrito 2'][i],
                  region: ['Lima'],
                  fecha: '2025-11-0' + (i + 3),
                  voto: ['Distrito 1','Distrito 2'][i]
                }))
              };
              
              localStorage.setItem('presidenciales_raw', JSON.stringify(small.presidenciales));
              localStorage.setItem('congresales_raw', JSON.stringify(small.congresales));  
              localStorage.setItem('municipales_raw', JSON.stringify(small.municipales));
              localStorage.setItem('votes_real', JSON.stringify(small.presidenciales.slice(0,3))); // subset for votes
              
              setStatus('small-dataset-loaded');
              setTimeout(()=> onNext && onNext(), 600);
            }}>
            Cargar datos pequeños
          </button>
          <button 
            className="px-3 py-2 rounded bg-primary/20 text-primary hover:bg-primary/30" 
            onClick={() => {
              // Dataset completo estático (más de 1000 votos)
              // Números exactos: 215, 198, 172, 240, 189, 186
              const EXACT_NUMBERS = [215, 198, 172, 240, 189, 186];
              const total = EXACT_NUMBERS.reduce((sum, n) => sum + n, 0); // 1200 total

              const deterministic = {
                presidenciales: Array.from({length: total}).map((_, i) => {
                  let candidato;
                  if (i < EXACT_NUMBERS[0]) candidato = 'Perez';          // 215 votos
                  else if (i < EXACT_NUMBERS[0] + EXACT_NUMBERS[1]) candidato = 'Gonzales';  // 198 votos
                  else candidato = 'Lopez';                                // 172 votos

                  return {
                    dni: `P${String(i+1).padStart(8,'0')}`,
                    candidato,
                    region: ['Lima','Lima','Cusco','Arequipa','Trujillo','Piura'][Math.floor((i * 47) % 6)],
                    fecha: '2025-11-0' + (Math.floor((i * 17) % 7) + 3),
                    voto: candidato
                  };
                }),
                congresales: Array.from({length: total}).map((_, i) => {
                  let candidato;
                  if (i < EXACT_NUMBERS[3]) candidato = 'Partido A';      // 240 votos
                  else if (i < EXACT_NUMBERS[3] + EXACT_NUMBERS[4]) candidato = 'Partido B';  // 189 votos
                  else candidato = 'Partido C';                           // 186 votos

                  return {
                    dni: `C${String(i+1).padStart(8,'0')}`,
                    candidato,
                    region: ['Lima','Lima','Cusco','Arequipa','Trujillo'][Math.floor((i * 41) % 5)],
                    fecha: '2025-11-0' + (Math.floor((i * 19) % 7) + 3),
                    voto: candidato
                  };
                }),
                municipales: Array.from({length: total}).map((_, i) => {
                  let candidato;
                  if (i < EXACT_NUMBERS[0]) candidato = 'Distrito 1';     // 215 votos
                  else if (i < EXACT_NUMBERS[0] + EXACT_NUMBERS[2]) candidato = 'Distrito 2'; // 172 votos
                  else candidato = 'Distrito 3';                          // restantes

                  return {
                    dni: `M${String(i+1).padStart(8,'0')}`,
                    candidato,
                    region: ['Lima','Lima','Lima','Trujillo','Arequipa'][Math.floor((i * 43) % 5)],
                    fecha: '2025-11-0' + (Math.floor((i * 29) % 7) + 3),
                    voto: candidato
                  };
                })
              };

              // Guardar datos raw
              localStorage.setItem('presidenciales_raw', JSON.stringify(deterministic.presidenciales));
              localStorage.setItem('congresales_raw', JSON.stringify(deterministic.congresales));
              localStorage.setItem('municipales_raw', JSON.stringify(deterministic.municipales));

              // Guardar una muestra más grande para votes_real
              const votesReal = [
                ...deterministic.presidenciales.slice(0, 400).map(v => ({
                  id: 'P' + v.dni,
                  tipo: 'presidenciales',
                  candidato: v.candidato,
                  region: v.region,
                  fecha: v.fecha
                })),
                ...deterministic.congresales.slice(0, 300).map(v => ({
                  id: 'C' + v.dni,
                  tipo: 'congresales',
                  candidato: v.candidato,
                  region: v.region,
                  fecha: v.fecha
                })),
                ...deterministic.municipales.slice(0, 200).map(v => ({
                  id: 'M' + v.dni,
                  tipo: 'municipales',
                  candidato: v.candidato,
                  region: v.region,
                  fecha: v.fecha
                }))
              ];
              localStorage.setItem('votes_real', JSON.stringify(votesReal));
              
              setStatus('deterministic-loaded');
              setTimeout(()=> onNext && onNext(), 600);
            }}>
            Cargar datos reproducibles
          </button>
        </div>
      </div>
    </div>
  );
}
