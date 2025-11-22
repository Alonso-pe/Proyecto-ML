import React from 'react';
import ChartReal from '../components/ChartReal';
import { getAggregates } from '../utils/dataUtils';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';

export default function Results(){
  const agg = getAggregates();
  const timeline = agg.pres ? agg.pres.timeMap : {};
  const labels = Object.keys(timeline);
  const values = Object.values(timeline);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Resultados de Entrenamiento (simulados)</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Resumen</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-300">Aquí se muestran métricas e interpretaciones breves de los entrenamientos ML y DL (mock).</p>
            <ul className="text-gray-200 mt-3 list-disc pl-5">
              <li>ML: accuracy 0.82 — f1 0.78</li>
              <li>DL: accuracy 0.86 — f1 0.81</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Curva de Entrenamiento</CardTitle></CardHeader>
          <CardContent>
            <ChartReal type="line" labels={labels} datasets={[{ label: 'Historico (mock)', data: values, borderColor: 'rgba(59,130,246,0.9)', backgroundColor: 'rgba(59,130,246,0.2)' }]} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
