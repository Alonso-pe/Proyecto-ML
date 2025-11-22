import React, { useState } from 'react';
import { Card, CardContent } from '@/ui/card';
import FileUploader from '../components/FileUploader';
import DataTable from '../components/DataTable'; 
import { ArrowRight, Database, CheckCircle2 } from 'lucide-react';
import { Button } from '@/ui/button';

export default function DataUpload({ onNext }) {
  const [status, setStatus] = useState('idle');
  const [previewData, setPreviewData] = useState([]); 

  const handleFiles = (parsed) => {
    localStorage.setItem('presidenciales_raw', JSON.stringify(parsed));
    localStorage.setItem('congresales_raw', JSON.stringify(parsed));
    localStorage.setItem('municipales_raw', JSON.stringify(parsed));
    
    setPreviewData(parsed);
    setStatus('uploaded');
  };

  const loadSample = () => {
    const sampleData = [
      { dni: '11111111', candidato: 'Perez', region: 'Lima', fecha: '2025-11-03', voto: 'Perez' },
      { dni: '22222222', candidato: 'Gonzales', region: 'Cusco', fecha: '2025-11-03', voto: 'Gonzales' },
      { dni: '33333333', candidato: 'Lopez', region: 'Lima', fecha: '2025-11-04', voto: 'Lopez' },
      { dni: '44444444', candidato: 'Soto', region: 'Arequipa', fecha: '2025-11-04', voto: 'Soto' },
      { dni: '55555555', candidato: 'Perez', region: 'Piura', fecha: '2025-11-05', voto: 'Perez' },
    ];
    
    handleFiles(sampleData);
    setStatus('sample-loaded');
  };

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-white">Ingesta de Datos</h2>
          <p className="text-slate-400">
            Sube un archivo CSV con los datos electorales para alimentar el sistema.
          </p>
        </div>
        {status !== 'idle' && (
           <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700 text-white">
             Continuar a Limpieza <ArrowRight className="ml-2 w-4 h-4" />
           </Button>
        )}
      </div>

      <Card className="border-2 border-dashed border-slate-700 bg-[#0f172a]/50">
        <CardContent className="pt-6">
          <FileUploader onParsed={handleFiles} />
        </CardContent>
      </Card>

      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/50 rounded-lg border border-slate-800">
        <div className="flex items-center gap-2 text-sm">
          <Database className={`w-4 h-4 ${status === 'idle' ? 'text-slate-500' : 'text-emerald-400'}`} />
          <span className="text-slate-400 font-medium">
            {status === 'idle' && 'Esperando archivo...'}
            {status === 'uploaded' && 'Archivo procesado y guardado en memoria local.'}
            {status === 'sample-loaded' && 'Datos de prueba cargados exitosamente.'}
          </span>
        </div>
        
        {status === 'idle' && (
          <button
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors underline decoration-blue-400/30"
            onClick={loadSample}
          >
            Cargar datos de ejemplo
          </button>
        )}
      </div>

      {previewData.length > 0 && (
        <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-semibold">Vista Previa ({previewData.length} registros)</h3>
          </div>
          <DataTable rows={previewData.slice(0, 100)} /> 
          {previewData.length > 100 && (
            <p className="text-xs text-center text-slate-500 italic pt-2">
              Mostrando los primeros 100 registros de {previewData.length}.
            </p>
          )}
        </div>
      )}
    </div>
  );
}