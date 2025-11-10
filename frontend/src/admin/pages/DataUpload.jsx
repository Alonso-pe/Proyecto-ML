// frontend/src/admin/pages/DataUpload.jsx

import React, { useState } from 'react';
import { Card, CardContent } from '@/ui/card';
import FileUploader from '../components/FileUploader';
import { ArrowRight, FileCheck, Info } from 'lucide-react';
import { Button } from '@/ui/button';

export default function DataUpload({ onNext }) {
  const [status, setStatus] = useState('idle');

  const handleFiles = (parsed) => {
    localStorage.setItem('presidenciales_raw', JSON.stringify(parsed));
    localStorage.setItem('congresales_raw', JSON.stringify(parsed));
    localStorage.setItem('municipales_raw', JSON.stringify(parsed));
    setStatus('uploaded');
    setTimeout(() => onNext && onNext(), 800);
  };

  const loadSample = () => {
    const sampleData = [
      { dni: '11111111', candidato: 'Perez', region: 'Lima', fecha: '2025-11-03', voto: 'Perez' },
      { dni: '22222222', candidato: 'Gonzales', region: 'Cusco', fecha: '2025-11-03', voto: 'Gonzales' },
      { dni: '33333333', candidato: 'Lopez', region: 'Lima', fecha: '2025-11-04', voto: 'Lopez' },
    ];
    
    localStorage.setItem('presidenciales_raw', JSON.stringify(sampleData));
    localStorage.setItem('congresales_raw', JSON.stringify(sampleData));
    localStorage.setItem('municipales_raw', JSON.stringify(sampleData));
    localStorage.setItem('votes_real', JSON.stringify(sampleData));
    
    setStatus('sample-loaded');
    setTimeout(() => onNext && onNext(), 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="bg-card/80 border-border backdrop-blur-sm shadow-xl">
        <CardContent className="pt-8">
          <FileUploader onParsed={handleFiles} />
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {status === 'idle' && <Info className="w-5 h-5 text-blue-400" />}
          {status === 'uploaded' && <FileCheck className="w-5 h-5 text-green-500" />}
          {status === 'sample-loaded' && <FileCheck className="w-5 h-5 text-green-500" />}
          
          <span>
            {status === 'idle' && 'Esperando archivo CSV para análisis...'}
            {status === 'uploaded' && 'Archivo procesado. Listo para limpiar.'}
            {status ==='sample-loaded' && 'Datos de ejemplo cargados. Listo para limpiar.'}
          </span>
        </div>
        
        <Button
          variant="outline"
          className="bg-card/80 border-border text-primary hover:text-primary hover:border-primary hover:bg-accent"
          onClick={loadSample}
        >
          Usar datos de ejemplo
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}