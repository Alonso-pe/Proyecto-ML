import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';
import ChartReal from '../components/ChartReal';
import { getAggregates } from '../utils/dataUtils';

export default function ElectionResults(){
  const agg = getAggregates();
  const p = agg.pres;
  const c = agg.cong;
  const m = agg.mun;
  const pLabs = Object.keys(p.byCandidate || {});
  const pVals = Object.values(p.byCandidate || {});
  const cLabs = Object.keys(c.byCandidate || {});
  const cVals = Object.values(c.byCandidate || {});
  const mLabs = Object.keys(m.byRegion || {});
  const mVals = Object.values(m.byRegion || {});

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Resultados Electorales</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Presidenciales</CardTitle></CardHeader>
          <CardContent>
            <ChartReal labels={pLabs} datasets={[{ label: 'Votos', data: pVals, backgroundColor: 'rgba(99,102,241,0.8)' }]} />
            <div className="mt-3 text-gray-200">Tabla y conteos mock.</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Congresales</CardTitle></CardHeader>
          <CardContent>
            <ChartReal labels={cLabs} datasets={[{ label: 'Votos', data: cVals, backgroundColor: 'rgba(16,185,129,0.8)' }]} />
            <div className="mt-3 text-gray-200">Tabla y conteos mock.</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Municipales</CardTitle></CardHeader>
          <CardContent>
            <ChartReal labels={mLabs} datasets={[{ label: 'Votos', data: mVals, backgroundColor: 'rgba(249,115,22,0.85)' }]} />
            <div className="mt-3 text-gray-200">Tabla y conteos mock.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
