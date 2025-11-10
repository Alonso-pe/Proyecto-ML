// frontend/src/admin/utils/dataUtils.js

// Datos estáticos para modo mock (los datos "de antes" que sí se veían)
// HE AÑADIDO MÁS DATOS PARA QUE SE VEA MEJOR
const STATIC_DATA = {
  presidenciales: {
    byCandidate: { 'Perez': 1500, 'Gonzales': 1200, 'Lopez': 900, 'Martinez': 750, 'Sanchez': 500 },
    byRegion: { 'Lima': 2000, 'Arequipa': 800, 'Cusco': 500, 'Trujillo': 300, 'Piura': 600 },
    timeMap: {
      '2025-11-03': 500, '2025-11-04': 600, '2025-11-05': 800, '2025-11-06': 750, '2025-11-07': 950
    }
  },
  congresales: {
    byCandidate: { 'Partido A': 1250, 'Partido B': 900, 'Partido C': 1050, 'Partido D': 700 },
    byRegion: { 'Lima': 1000, 'Arequipa': 500, 'Cusco': 300, 'La Libertad': 450 },
    timeMap: {
      '2025-11-03': 300, '2025-11-04': 400, '2025-11-05': 500, '2025-11-06': 600
    }
  },
  municipales: {
    byCandidate: { 'Distrito 1': 400, 'Distrito 2': 300, 'Distrito 3': 200 },
    byRegion: { 'Lima': 500, 'Trujillo': 400, 'Arequipa': 250 },
    timeMap: {
      '2025-11-03': 200, '2025-11-04': 300, '2025-11-05': 400
    }
  },
  // Datos para el mapa (Participación por Departamento)
  mapData: {
    'PE-LMA': 85, 'PE-ARE': 78, 'PE-CUS': 75, 'PE-LAL': 72, 'PE-PIU': 70, 'PE-JUN': 68,
    'PE-PUN': 65, 'PE-CAJ': 63, 'PE-ANC': 60, 'PE-AYA': 58, 'PE-HUV': 55, 'PE-PAS': 54,
    'PE-HUC': 53, 'PE-APU': 52, 'PE-MOQ': 51, 'PE-TAC': 50, 'PE-TUM': 49, 'PE-LAM': 48,
    'PE-AMA': 45, 'PE-UCA': 44, 'PE-LOR': 42, 'PE-MDD': 40, 'PE-SMT': 38, 'PE-CAL': 88
  }
};

// ¡ARREGLO IMPORTANTE!
// Esta función ahora ignora el localStorage y SIEMPRE devuelve los datos de simulación.
export function getAggregates(){
  return {
    pres: STATIC_DATA.presidenciales,
    cong: STATIC_DATA.congresales,
    mun: STATIC_DATA.municipales,
    mapData: STATIC_DATA.mapData,
    votes: STATIC_DATA.presidenciales.byRegion, // 'votes_real' usará los datos presidenciales como mock
    pres_raw: STATIC_DATA.presidenciales.byRegion,
    cong_raw: STATIC_DATA.congresales.byRegion,
    mun_raw: STATIC_DATA.municipales.byRegion
  };
}

// --- Dejamos estas funciones por si 'Cleaning.jsx' las usa ---
export function loadJSON(key){
  try{ return JSON.parse(localStorage.getItem(key) || 'null'); }catch(e){ return null; }
}