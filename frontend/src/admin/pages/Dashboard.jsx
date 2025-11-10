// frontend/src/admin/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/tabs';
import ChartReal from '../components/ChartReal';
import PeruMap from '../components/PeruMap';
import ActivityFeed from '../components/ActivityFeed';
import StatCard from '../components/StatCard'; // Importamos la nueva StatCard
import { getAggregates } from '../utils/dataUtils';
import { motion } from 'framer-motion';
import { Users, Vote, Percent, Archive } from 'lucide-react'; // Archive para Mesas Escrutadas

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

// Función para simular datos en vivo
const useLiveData = (initialData, totalMesas) => {
  const [data, setData] = useState(initialData);
  const [mesas, setMesas] = useState(9); // Empezamos en 9 como tu imagen

  useEffect(() => {
    const interval = setInterval(() => {
      // Simula un nuevo voto
      const regionKeys = Object.keys(data.byRegion);
      const candKeys = Object.keys(data.byCandidate);
      const randomRegion = regionKeys[Math.floor(Math.random() * regionKeys.length)];
      const randomCand = candKeys[Math.floor(Math.random() * candKeys.length)];
      
      // Simula el conteo de mesas
      setMesas(prev => (prev < totalMesas ? prev + 1 : prev));

      setData(prevData => ({
        ...prevData,
        byRegion: {
          ...prevData.byRegion,
          [randomRegion]: prevData.byRegion[randomRegion] + 17, // Votos más rápidos
        },
        byCandidate: {
          ...prevData.byCandidate,
          [randomCand]: prevData.byCandidate[randomCand] + 17,
        }
      }));
    }, 2000); // Actualiza cada 2 segundos

    return () => clearInterval(interval);
  }, [data, totalMesas]);

  return { liveData: data, mesasEscrutadas: mesas };
};

export default function Dashboard() {
  const staticData = getAggregates();
  const totalMesas = 1500;
  
  const { liveData: presData, mesasEscrutadas } = useLiveData(staticData.pres, totalMesas);
  const { liveData: congData } = useLiveData(staticData.cong, totalMesas);
  const mapData = staticData.mapData; 
  const [hoveredDep, setHoveredDep] = useState(null);

  const totalVotantes = 24200; // Valor fijo como en la imagen
  const totalVotos = (Object.values(presData.byCandidate).reduce((a,b)=>a+b,0) || 0);
  const participacion = ((totalVotos / totalVotantes) * 100).toFixed(2);
  const mesasPorcentaje = ((mesasEscrutadas / totalMesas) * 100).toFixed(1);

  // Opciones para Gráficos
  const barChartOptions = {
    scales: { y: { max: 2500, ticks: { callback: (v) => v >= 1000 ? `${v/1000}k` : v }}}
  };
  // Opciones de Gráfico de Línea (Ocultamos números)
  const lineChartOptions = {
    plugins: { datalabels: { display: false } },
    scales: { y: { max: 2000, ticks: { callback: (v) => v >= 1000 ? `${v/1000}k` : v }}}
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Tarjetas de Stats (Recreando image_250ce4.png) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Votantes (Padrón)" 
          value={totalVotantes.toLocaleString()} 
          description="Estimado oficial"
          icon={Users}
          colorClass="text-primary"
          glowEffect={true}
        />
        <StatCard 
          title="Votos Emitidos" 
          value={totalVotos.toLocaleString()} 
          description="Conteo en tiempo real"
          icon={Vote}
          colorClass="text-green-500"
        />
        <StatCard 
          title="% Participación" 
          value={`${participacion}%`} 
          description="Proyección actualizada"
          icon={Percent}
          colorClass="text-blue-400"
        />
        <StatCard 
          title="Mesas Escrutadas" 
          value={`${mesasEscrutadas} / ${totalMesas}`}
          description={`${mesasPorcentaje}% completado`}
          icon={Archive}
          colorClass="text-white"
        />
      </div>

      {/* 2. Vistas por Tipo de Votación (Pestañas) */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="presidencial" className="w-full">
          <TabsList>
            <TabsTrigger value="presidencial">Votación Presidencial</TabsTrigger>
            <TabsTrigger value="congresal">Votación Congresal</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presidencial">
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <Card className="bg-card/80 border-border backdrop-blur-sm">
                <CardHeader><CardTitle className="text-xl text-white">Votos por Región</CardTitle></CardHeader>
                <CardContent className="h-[350px]">
                  <ChartReal 
                    labels={Object.keys(presData.byRegion)} 
                    datasets={[{ 
                      label: 'Votos', 
                      data: Object.values(presData.byRegion), 
                      backgroundColor: 'hsla(349, 75%, 50%, 0.7)', // ROJO 
                    }]} 
                    options={barChartOptions} 
                  />
                </CardContent>
              </Card>
              <Card className="bg-card/80 border-border backdrop-blur-sm">
                <CardHeader><CardTitle className="text-xl text-white">Votos por Candidato</CardTitle></CardHeader>
                <CardContent className="h-[350px]">
                  <ChartReal 
                    type="line" 
                    labels={Object.keys(presData.byCandidate)} 
                    datasets={[{ 
                      label: 'Votos', 
                      data: Object.values(presData.byCandidate), 
                      borderColor: 'hsla(349, 75%, 50%, 1)', // ROJO
                      fill: true,
                      tension: 0.3,
                      backgroundColor: 'hsla(349, 75%, 50%, 0.1)',
                      pointBackgroundColor: 'hsla(349, 75%, 50%, 1)',
                      pointBorderColor: '#fff',
                    }]} 
                    options={lineChartOptions} 
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="congresal">
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <Card className="bg-card/80 border-border backdrop-blur-sm">
                <CardHeader><CardTitle className="text-xl text-white">Votos por Región</CardTitle></CardHeader>
                <CardContent className="h-[350px]">
                  <ChartReal 
                    labels={Object.keys(congData.byRegion)} 
                    datasets={[{ 
                      label: 'Votos', 
                      data: Object.values(congData.byRegion), 
                      backgroundColor: 'hsla(217, 33%, 25%, 0.7)', 
                    }]} 
                    options={barChartOptions} 
                  />
                </CardContent>
              </Card>
              <Card className="bg-card/80 border-border backdrop-blur-sm">
                <CardHeader><CardTitle className="text-xl text-white">Votos por Partido (Congresal)</CardTitle></CardHeader>
                <CardContent className="h-[350px]">
                  <ChartReal 
                    type="bar" // Cambiado a barras como en tu imagen
                    labels={Object.keys(congData.byCandidate)} 
                    datasets={[{ 
                      label: 'Votos', 
                      data: Object.values(congData.byCandidate), 
                      backgroundColor: 'hsla(217, 33%, 25%, 0.7)',
                    }]} 
                    options={barChartOptions} 
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* 3. Mapa y Feed en Vivo */}
      <div className="grid grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="col-span-2">
          <Card className="bg-card/80 border-border backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white">Mapa de Participación por Departamento</CardTitle>
              {hoveredDep && (
                <p className="text-lg text-muted-foreground">
                  {hoveredDep.name}: <span className="text-primary font-bold">{hoveredDep.value || 'N/A'}%</span>
                </p>
              )}
            </CardHeader>
            <CardContent>
              <PeruMap data={mapData} onDepartmentHover={setHoveredDep} />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <ActivityFeed />
        </motion.div>
      </div>

    </motion.div>
  );
}