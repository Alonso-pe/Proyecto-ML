import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';
import { Cpu, Activity, Download } from 'lucide-react';

function simulateTraining(ms = 2500, onProgress){
  let t = 0;
  const history = [];
  const steps = 20;
  const stepMs = Math.max(40, Math.floor(ms / steps));

  return new Promise(res=>{
    const iv = setInterval(()=>{
      t = Math.min(100, t + Math.floor(100/steps));
      // push a mock loss/accuracy value for the sparkline
      const val = Math.min(1, 0.6 + Math.random() * 0.4 - (t/200));
      history.push(val);
      onProgress && onProgress(t, history.slice());
      if (t>=100){
        clearInterval(iv);
        // final metrics
        const accuracy = (Math.random()*0.12 + 0.78).toFixed(3);
        const f1 = (Math.random()*0.12 + 0.72).toFixed(3);
        setTimeout(()=>res({ accuracy, f1, history }), 250);
      }
    }, stepMs);
  });
}

function Sparkline({data = []}){
  if (!data || data.length === 0) return null;
  const w = 160, h = 40, pad = 4;
  const max = Math.max(...data), min = Math.min(...data);
  const len = data.length;
  const points = data.map((v,i)=>{
    const x = pad + (i/(len-1 || 1))*(w-2*pad);
    const y = pad + (1 - (v - min)/(max - min || 1))*(h-2*pad);
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} className="mx-auto">
      <polyline fill="none" stroke="#60a5fa" strokeWidth="2" points={points} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Training(){
  const [mlStatus, setMlStatus] = useState('idle');
  const [mlProgress, setMlProgress] = useState(0);
  const [mlMetrics, setMlMetrics] = useState(null);
  const [mlHistory, setMlHistory] = useState([]);

  const trainML = async ()=>{
    setMlStatus('running'); setMlProgress(0); setMlMetrics(null); setMlHistory([]);
    const p = simulateTraining(2000, (pct, history)=>{ setMlProgress(pct); setMlHistory(history); });
    const res = await p; setMlMetrics(res); setMlStatus('done');
  }

  const [dlStatus, setDlStatus] = useState('idle');
  const [dlProgress, setDlProgress] = useState(0);
  const [dlMetrics, setDlMetrics] = useState(null);
  const [dlHistory, setDlHistory] = useState([]);
  const trainDL = async ()=>{
    setDlStatus('running'); setDlProgress(0); setDlMetrics(null); setDlHistory([]);
    const p = simulateTraining(3500, (pct, history)=>{ setDlProgress(pct); setDlHistory(history); });
    const res = await p; setDlMetrics(res); setDlStatus('done');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Entrenamiento de Modelos (simulado)</h2>
        <div className="text-sm text-gray-400">Interfaz visual para simular procesos de entrenamiento</div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Cpu className="w-4 h-4"/> Machine Learning (ML)</CardTitle>
              <div className="text-xs text-gray-400">Clásico</div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">Modelo ML clásico. Usa las tablas <code>*_clean</code> (mock).</p>

            <div className="my-4 flex items-center gap-3">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${mlStatus==='running' ? 'bg-gray-600 text-gray-100 cursor-not-allowed' : 'bg-primary text-white'}`}
                onClick={trainML}
                disabled={mlStatus==='running'}
              >
                {mlStatus === 'running' ? 'Entrenando...' : 'Entrenar modelo'}
              </button>
              {mlStatus === 'done' && (
                <button className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-sm rounded-md">
                  <Download className="w-4 h-4"/> Descargar modelo
                </button>
              )}
            </div>

            <div className="mt-3">
              <div className="w-full bg-gray-800 h-3 rounded overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-blue-500 to-cyan-400 transition-all" style={{width: `${mlProgress}%`}} />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                <span>Estado: <span className="text-gray-200">{mlStatus}</span></span>
                <span>{mlStatus==='running' ? `${mlProgress}%` : mlStatus==='done' ? '100%' : '0%'}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="space-y-1">
                <div className="text-xs text-gray-400">Accuracy</div>
                <div className="text-lg font-semibold">{mlMetrics ? mlMetrics.accuracy : '—'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-gray-400">F1 score</div>
                <div className="text-lg font-semibold">{mlMetrics ? mlMetrics.f1 : '—'}</div>
              </div>
              <div className="ml-auto w-40">
                <Sparkline data={mlHistory} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Activity className="w-4 h-4"/> Deep Learning (DL)</CardTitle>
              <div className="text-xs text-gray-400">Neuronal</div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">Modelo DL sencillo (simulación). Entrenamiento con estado visual y curva.</p>

            <div className="my-4 flex items-center gap-3">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${dlStatus==='running' ? 'bg-gray-600 text-gray-100 cursor-not-allowed' : 'bg-primary text-white'}`}
                onClick={trainDL}
                disabled={dlStatus==='running'}
              >
                {dlStatus === 'running' ? 'Entrenando...' : 'Entrenar modelo'}
              </button>
              {dlStatus === 'done' && (
                <button className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-sm rounded-md">
                  <Download className="w-4 h-4"/> Descargar modelo
                </button>
              )}
            </div>

            <div className="mt-3">
              <div className="w-full bg-gray-800 h-3 rounded overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-pink-500 to-red-400 transition-all" style={{width: `${dlProgress}%`}} />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                <span>Estado: <span className="text-gray-200">{dlStatus}</span></span>
                <span>{dlStatus==='running' ? `${dlProgress}%` : dlStatus==='done' ? '100%' : '0%'}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="space-y-1">
                <div className="text-xs text-gray-400">Accuracy</div>
                <div className="text-lg font-semibold">{dlMetrics ? dlMetrics.accuracy : '—'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-gray-400">F1 score</div>
                <div className="text-lg font-semibold">{dlMetrics ? dlMetrics.f1 : '—'}</div>
              </div>
              <div className="ml-auto w-40">
                <Sparkline data={dlHistory} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
