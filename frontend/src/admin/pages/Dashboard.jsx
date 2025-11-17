// frontend/src/admin/pages/Dashboard.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/tabs';
import ChartReal from '../components/ChartReal';
import PeruMap from '../components/PeruMap';
import ActivityFeed from '../components/ActivityFeed';
import StatCard from '../components/StatCard'; // Importamos la nueva StatCard
import { getAggregates, getPresidentialVotes, getRegionalVotes } from '../utils/dataUtils';
import { motion } from 'framer-motion';
import { Users, Vote, Percent, Archive, MapPin } from 'lucide-react';
import { Button } from '@/ui/button';
import DataTable from '../components/DataTable';

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

  // Actualizar datos cuando cambia initialData
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simula un nuevo voto
      const regionKeys = Object.keys(data.byRegion || data.byProvince || {});
      const candKeys = Object.keys(data.byCandidate || {});
      
      if (regionKeys.length > 0) {
        const randomRegion = regionKeys[Math.floor(Math.random() * regionKeys.length)];
        
        // Simula el conteo de mesas
        setMesas(prev => (prev < totalMesas ? prev + 1 : prev));

        setData(prevData => {
          const newData = { ...prevData };
          
          // Actualizar región o provincia
          if (prevData.byRegion) {
            newData.byRegion = {
              ...prevData.byRegion,
              [randomRegion]: (prevData.byRegion[randomRegion] || 0) + 17,
            };
          } else if (prevData.byProvince) {
            newData.byProvince = {
              ...prevData.byProvince,
              [randomRegion]: (prevData.byProvince[randomRegion] || 0) + 17,
            };
          }
          
          // Actualizar candidatos si existen
          if (prevData.byCandidate && candKeys.length > 0) {
            const randomCand = candKeys[Math.floor(Math.random() * candKeys.length)];
            newData.byCandidate = {
              ...prevData.byCandidate,
              [randomCand]: (prevData.byCandidate[randomCand] || 0) + 17,
            };
          }
          
          return newData;
        });
      }
    }, 2000); // Actualiza cada 2 segundos

    return () => clearInterval(interval);
  }, [data, totalMesas]);

  return { liveData: data, mesasEscrutadas: mesas };
};

// Datos de provincias por región de Perú
const REGIONS_PROVINCES = {
  'Lima': {
    provincias: {
      'Lima': 1850,
      'Callao': 1200,
      'Huaura': 980,
      'Barranca': 850,
      'Cañete': 720,
      'Huaral': 650
    }
  },
  'Arequipa': {
    provincias: {
      'Arequipa': 1450,
      'Caylloma': 920,
      'Camana': 780,
      'Islay': 650,
      'Castilla': 580
    }
  },
  'Cusco': {
    provincias: {
      'Cusco': 1200,
      'Quispicanchi': 850,
      'Canchis': 720,
      'Urubamba': 650,
      'Calca': 580
    }
  },
  'La Libertad': {
    provincias: {
      'Trujillo': 1100,
      'Chepen': 850,
      'Pacasmayo': 720,
      'Otuzco': 650,
      'Santiago de Chuco': 580
    }
  },
  'Piura': {
    provincias: {
      'Piura': 980,
      'Sullana': 850,
      'Talara': 720,
      'Paita': 650,
      'Sechura': 580
    }
  },
  'Lambayeque': {
    provincias: {
      'Chiclayo': 920,
      'Lambayeque': 780,
      'Ferreñafe': 650
    }
  },
  'Junín': {
    provincias: {
      'Huancayo': 850,
      'Jauja': 720,
      'Tarma': 650,
      'Concepción': 580
    }
  },
  'Cajamarca': {
    provincias: {
      'Cajamarca': 780,
      'Jaén': 650,
      'Cutervo': 580,
      'Chota': 520
    }
  },
  'Ancash': {
    provincias: {
      'Huaraz': 720,
      'Chimbote': 650,
      'Carhuaz': 580,
      'Yungay': 520
    }
  },
  'Puno': {
    provincias: {
      'Puno': 680,
      'Juliaca': 580,
      'Azángaro': 520,
      'San Román': 480
    }
  }
};

export default function Dashboard() {
  const staticData = getAggregates();
  const totalMesas = 1500;
  const [refreshKey, setRefreshKey] = useState(0);
  const [hoveredDep, setHoveredDep] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [regionProvincesData, setRegionProvincesData] = useState(null);
  
  // Actualizar datos cada 2 segundos para reflejar nuevos votos
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Actualizar datos de provincias cuando se selecciona una región
  useEffect(() => {
    if (selectedRegion && REGIONS_PROVINCES[selectedRegion]) {
      const initialData = { ...REGIONS_PROVINCES[selectedRegion].provincias };
      setRegionProvincesData(initialData);
    } else {
      setRegionProvincesData(null);
    }
  }, [selectedRegion]);

  // Simular datos en vivo para provincias de la región seleccionada
  const provincesInitialData = useMemo(() => {
    if (selectedRegion && REGIONS_PROVINCES[selectedRegion]) {
      return { byProvince: { ...REGIONS_PROVINCES[selectedRegion].provincias } };
    }
    return { byProvince: {} };
  }, [selectedRegion]);

  const { liveData: provincesLiveData } = useLiveData(
    provincesInitialData,
    totalMesas
  );

  // Obtener datos simulados mejorados (se recalcula cuando cambia refreshKey)
  const presVotes = useMemo(() => getPresidentialVotes(), [refreshKey]);
  const regionalVotes = useMemo(() => getRegionalVotes(), [refreshKey]);
  
  // Preparar datos para visualización
  const presData = useMemo(() => ({
    byCandidate: presVotes.byCandidate,
    byRegion: presVotes.byRegion
  }), [presVotes]);
  
  const regionalData = useMemo(() => ({
    byCandidate: regionalVotes.byCandidate,
    byProvince: regionalVotes.byProvince
  }), [regionalVotes]);
  
  // Simular datos en vivo para animación
  const { liveData: presLiveData, mesasEscrutadas } = useLiveData(
    { byCandidate: presData.byCandidate, byRegion: presData.byRegion }, 
    totalMesas
  );
  
  const { liveData: regionalLiveData } = useLiveData(
    { byCandidate: regionalData.byCandidate, byProvince: regionalData.byProvince }, 
    totalMesas
  );
  
  // Usar datos simulados con animación en vivo
  const finalPresData = useMemo(() => presLiveData, [presLiveData]);
  const finalRegionalData = useMemo(() => ({
    byCandidate: regionalLiveData.byCandidate,
    byProvince: regionalLiveData.byProvince
  }), [regionalLiveData]);
  
  const mapData = staticData.mapData;

  const totalVotantes = 24200; // Valor fijo como en la imagen
  const totalVotosPres = (Object.values(finalPresData.byCandidate).reduce((a,b)=>a+b,0) || 0);
  const totalVotosReg = (Object.values(finalRegionalData.byCandidate).reduce((a,b)=>a+b,0) || 0);
  const totalVotos = totalVotosPres + totalVotosReg;
  const participacion = ((totalVotos / totalVotantes) * 100).toFixed(2);
  const mesasPorcentaje = ((mesasEscrutadas / totalMesas) * 100).toFixed(1);

  // Opciones profesionales para Gráficos de Barras
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Votos: ${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: { 
      y: { 
        beginAtZero: true,
        max: 3500,
        ticks: { 
          callback: (v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v,
          color: 'rgba(255, 255, 255, 0.7)',
          font: { size: 11 }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        }
      },
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: { size: 11 },
          maxRotation: 45,
          minRotation: 0
        },
        grid: {
          display: false
        }
      }
    }
  };
  
  // Opciones profesionales para Gráfico de Línea
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Votos: ${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: { 
      y: { 
        beginAtZero: true,
        max: 2000,
        ticks: { 
          callback: (v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v,
          color: 'rgba(255, 255, 255, 0.7)',
          font: { size: 11 }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        }
      },
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: { size: 11 },
          maxRotation: 45,
          minRotation: 0
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        }
      }
    },
    elements: {
      point: {
        radius: 5,
        hoverRadius: 7,
        borderWidth: 2
      },
      line: {
        tension: 0.4,
        borderWidth: 3
      }
    }
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
            <TabsTrigger 
              value="presidencial"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:hover:bg-slate-600"
            >
              Votación Presidencial
            </TabsTrigger>
            <TabsTrigger 
              value="regional"
              className="data-[state=active]:bg-indigo-700 data-[state=active]:text-white data-[state=active]:hover:bg-indigo-600"
            >
              Votación Regional
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="presidencial">
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <Card className="bg-card/80 border-border backdrop-blur-sm shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-white font-semibold">Votos por Región</CardTitle>
                  <p className="text-sm text-gray-400 mt-1">Distribución geográfica de votos presidenciales</p>
                </CardHeader>
                <CardContent className="h-[380px]">
                  <ChartReal 
                    labels={Object.keys(finalPresData.byRegion)} 
                    datasets={[{ 
                      label: 'Votos', 
                      data: Object.values(finalPresData.byRegion), 
                      backgroundColor: 'rgba(71, 85, 105, 0.8)', // Slate profesional
                      borderColor: 'rgba(71, 85, 105, 1)',
                      borderWidth: 2,
                      borderRadius: 6,
                      borderSkipped: false,
                    }]} 
                    options={barChartOptions} 
                  />
                </CardContent>
              </Card>
              <Card className="bg-card/80 border-border backdrop-blur-sm shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-white font-semibold">Votos por Candidato</CardTitle>
                  <p className="text-sm text-gray-400 mt-1">Tendencia de votos presidenciales en tiempo real</p>
                </CardHeader>
                <CardContent className="h-[380px]">
                  <ChartReal 
                    type="line" 
                    labels={Object.keys(finalPresData.byCandidate)} 
                    datasets={[{ 
                      label: 'Votos', 
                      data: Object.values(finalPresData.byCandidate), 
                      borderColor: 'rgba(71, 85, 105, 1)', // Slate
                      fill: true,
                      tension: 0.4,
                      backgroundColor: 'rgba(71, 85, 105, 0.15)',
                      pointBackgroundColor: 'rgba(71, 85, 105, 1)',
                      pointBorderColor: '#fff',
                      pointHoverBackgroundColor: '#fff',
                      pointHoverBorderColor: 'rgba(71, 85, 105, 1)',
                    }]} 
                    options={lineChartOptions} 
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="regional">
            <div className="space-y-6 mt-6">
              {/* Tabla de Regiones */}
              <Card className="bg-card/80 border-border backdrop-blur-sm shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-white font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Regiones del Perú
                  </CardTitle>
                  <p className="text-sm text-gray-400 mt-1">Seleccione una región para ver sus provincias</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {Object.keys(REGIONS_PROVINCES).map((region) => (
                      <Button
                        key={region}
                        onClick={() => setSelectedRegion(region)}
                        variant={selectedRegion === region ? "default" : "outline"}
                        className={`h-12 text-sm font-semibold transition-all duration-300 ${
                          selectedRegion === region
                            ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg'
                            : 'bg-card/50 hover:bg-card/70 border-primary/30 text-white'
                        }`}
                      >
                        {region}
                      </Button>
                    ))}
                  </div>
                  {selectedRegion && (
                    <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                      <p className="text-sm text-gray-300">
                        Región seleccionada: <span className="text-primary font-bold">{selectedRegion}</span>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Gráfico de Provincias - Línea */}
              <Card className="bg-card/80 border-border backdrop-blur-sm shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-white font-semibold">
                    {selectedRegion 
                      ? `Votos por Provincia - ${selectedRegion}` 
                      : 'Votos por Provincia'}
                  </CardTitle>
                  <p className="text-sm text-gray-400 mt-1">
                    {selectedRegion 
                      ? `Tendencia de votos en tiempo real por provincia en ${selectedRegion}`
                      : 'Seleccione una región para ver el gráfico de tendencia'}
                  </p>
                </CardHeader>
                <CardContent className="h-[450px]">
                  {selectedRegion && provincesLiveData?.byProvince && Object.keys(provincesLiveData.byProvince).length > 0 ? (
                    <ChartReal 
                      type="line"
                      labels={Object.keys(provincesLiveData.byProvince)} 
                      datasets={[{ 
                        label: 'Votos', 
                        data: Object.values(provincesLiveData.byProvince), 
                        borderColor: 'rgba(67, 56, 202, 1)', // Indigo profesional
                        fill: true,
                        tension: 0.4,
                        backgroundColor: 'rgba(67, 56, 202, 0.15)',
                        pointBackgroundColor: 'rgba(67, 56, 202, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(67, 56, 202, 1)',
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        borderWidth: 3,
                      }]} 
                      options={{
                        ...lineChartOptions,
                        scales: {
                          ...lineChartOptions.scales,
                          y: {
                            ...lineChartOptions.scales.y,
                            max: Math.max(...Object.values(provincesLiveData.byProvince)) * 1.2 || 2000
                          }
                        }
                      }} 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-xl font-semibold mb-2">Seleccione una región</p>
                        <p className="text-sm">Elija una región del Perú para ver el gráfico de tendencia de votos por provincia</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* 3. Mapa y Feed en Vivo */}
      <div className="grid grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="col-span-2">
          <Card className="bg-card/80 border-border backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-white font-semibold">Mapa de Participación por Departamento</CardTitle>
              <p className="text-sm text-gray-400 mt-1">Mapa completo del Perú con los 25 departamentos</p>
              {hoveredDep && (
                <div className="mt-3 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                  <p className="text-base text-white">
                    <span className="font-semibold">{hoveredDep.name}:</span>{' '}
                    <span className="text-primary font-bold text-lg">{hoveredDep.value || 'N/A'}%</span>
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-6">
              <div className="w-full h-[600px] rounded-lg overflow-hidden border border-border/50">
                <PeruMap data={mapData} onDepartmentHover={setHoveredDep} />
              </div>
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