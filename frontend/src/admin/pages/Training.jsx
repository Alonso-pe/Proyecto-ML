import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';

function simulateTraining(ms = 2500, onProgress){
  let t = 0;
  const iv = setInterval(()=>{
    t += 10;
    onProgress && onProgress(Math.min(100, t));
    if (t>=100) clearInterval(iv);
  }, ms/10);
  return new Promise(res=> setTimeout(()=>res({ accuracy: (Math.random()*0.2+0.75).toFixed(3), f1: (Math.random()*0.2+0.7).toFixed(3) }), ms));
}

export default function Training(){
  const [mlStatus, setMlStatus] = useState('idle');
  const [mlProgress, setMlProgress] = useState(0);
  const [mlMetrics, setMlMetrics] = useState(null);

  const trainML = async ()=>{
    setMlStatus('running'); setMlProgress(0); const p = simulateTraining(2000, setMlProgress); const res = await p; setMlMetrics(res); setMlStatus('done');
  }

  const [dlStatus, setDlStatus] = useState('idle');
  const [dlProgress, setDlProgress] = useState(0);
  const [dlMetrics, setDlMetrics] = useState(null);
  const trainDL = async ()=>{
    setDlStatus('running'); setDlProgress(0); const p = simulateTraining(3500, setDlProgress); const res = await p; setDlMetrics(res); setDlStatus('done');
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Entrenamiento de Modelos (simulado)</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Machine Learning (ML)</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-300">Modelo ML clásico. Usa las tablas *_clean (mock).</p>
            <div className="my-3">
              <button className="px-4 py-2 bg-primary rounded" onClick={trainML}>Entrenar modelo</button>
            </div>
            <div className="text-sm text-gray-300">Estado: {mlStatus} {mlStatus==='running' && ` — ${mlProgress}%`}</div>
            {mlMetrics && <div className="mt-3 text-gray-200">Métricas: accuracy {mlMetrics.accuracy} — f1 {mlMetrics.f1}</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Deep Learning (DL)</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-300">Modelo DL sencillo (simulación). Botón único para entrenar.</p>
            <div className="my-3">
              <button className="px-4 py-2 bg-primary rounded" onClick={trainDL}>Entrenar modelo</button>
            </div>
            <div className="text-sm text-gray-300">Estado: {dlStatus} {dlStatus==='running' && ` — ${dlProgress}%`}</div>
            {dlMetrics && <div className="mt-3 text-gray-200">Métricas: accuracy {dlMetrics.accuracy} — f1 {dlMetrics.f1}</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
