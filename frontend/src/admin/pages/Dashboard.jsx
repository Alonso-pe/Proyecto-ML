import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';
import ChartReal from '../components/ChartReal';
import { getAggregates } from '../utils/dataUtils';

export default function Dashboard() {
  const agg = getAggregates();
  const pres = agg.pres;
  const regionLabels = Object.keys(pres.byRegion || {});
  const regionData = Object.values(pres.byRegion || {});
  const candLabels = Object.keys(pres.byCandidate || {});
  const candData = Object.values(pres.byCandidate || {});

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard — Administrador</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Total votantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{(regionData.reduce((a,b)=>a+b,0) || 0).toLocaleString()}</div>
            <div className="text-sm text-gray-300">Estimado (mock)</div>
          </CardContent>
        </Card>
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Total votos reales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{(candData.reduce((a,b)=>a+b,0) || 0).toLocaleString()}</div>
            <div className="text-sm text-gray-300">Estimado (mock)</div>
          </CardContent>
        </Card>
        <Card className="p-4">
          <CardHeader>
            <CardTitle>% participación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{Math.min(100, Math.round((candData.reduce((a,b)=>a+b,0) || 0) / ((regionData.reduce((a,b)=>a+b,0) || 1)) * 10000)/100)}%</div>
            <div className="text-sm text-gray-300">Estimado (mock)</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Votos por región</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartReal labels={regionLabels} datasets={[{ label: 'Votos', data: regionData, backgroundColor: 'rgba(99,102,241,0.8)' }]} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Votos por candidato</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartReal labels={candLabels} datasets={[{ label: 'Votos', data: candData, backgroundColor: 'rgba(16,185,129,0.8)' }]} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
