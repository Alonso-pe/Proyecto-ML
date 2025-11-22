// frontend/src/admin/utils/dataUtils.js

// Datos estáticos simulados profesionales y ordenados
const STATIC_DATA = {
  presidenciales: {
    byCandidate: { 
      'Pedro Castillo': 1850, 
      'Keiko Fujimori': 1650, 
      'Rafael López Aliaga': 1420, 
      'Verónika Mendoza': 1280, 
      'Yonhy Lescano': 980,
      'Daniel Urresti': 750,
      'Julio Guzmán': 620
    },
    byRegion: { 
      'Lima': 3200, 
      'Arequipa': 1450, 
      'La Libertad': 1200, 
      'Piura': 1100, 
      'Cusco': 980,
      'Lambayeque': 850,
      'Junín': 720,
      'Cajamarca': 680,
      'Ancash': 650,
      'Puno': 580
    },
    timeMap: {
      '2025-11-03': 500, '2025-11-04': 600, '2025-11-05': 800, '2025-11-06': 750, '2025-11-07': 950
    }
  },
  regionales: {
    byCandidate: {
      'Carlos Rojas - Presidente Regional': 1250,
      'María González - Alcalde': 1180,
      'Juan Pérez - Presidente Regional': 1050,
      'Ana Martínez - Alcalde': 980,
      'Luis Sánchez - Presidente Regional': 920,
      'Carmen López - Alcalde': 850,
      'Roberto Torres - Presidente Regional': 780,
      'Patricia Ramírez - Alcalde': 720
    },
    byProvince: {
      'Lima': 1850,
      'Arequipa': 1200,
      'Cusco': 980,
      'La Libertad': 920,
      'Piura': 850,
      'Lambayeque': 780,
      'Junín': 650,
      'Cajamarca': 620,
      'Ancash': 580,
      'Puno': 520
    },
    timeMap: {
      '2025-11-03': 300, '2025-11-04': 400, '2025-11-05': 500, '2025-11-06': 600
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

// Función que devuelve datos simulados profesionales
export function getAggregates(){
  return {
    pres: STATIC_DATA.presidenciales,
    reg: STATIC_DATA.regionales,
    cong: STATIC_DATA.congresales,
    mun: STATIC_DATA.municipales,
    mapData: STATIC_DATA.mapData,
    votes: STATIC_DATA.presidenciales.byRegion,
    pres_raw: STATIC_DATA.presidenciales.byRegion,
    reg_raw: STATIC_DATA.regionales.byProvince,
    cong_raw: STATIC_DATA.congresales.byRegion,
    mun_raw: STATIC_DATA.municipales.byRegion
  };
}

// Función para obtener votos reales de los usuarios
export function getRealVotes() {
  try {
    return JSON.parse(localStorage.getItem('realVotes') || '[]');
  } catch (e) {
    return [];
  }
}

// Función para procesar votos presidenciales (combina reales con simulados)
export function getPresidentialVotes() {
  const allVotes = getRealVotes();
  const presVotes = allVotes.filter(v => v.voteType === 'presidencial');
  
  // Inicializar con datos simulados
  const byCandidate = { ...STATIC_DATA.presidenciales.byCandidate };
  const byRegion = { ...STATIC_DATA.presidenciales.byRegion };
  
  // Agregar votos reales si existen
  presVotes.forEach(vote => {
    const candidateName = vote.candidate?.name || 'Desconocido';
    const district = vote.voterDistrict || 'Desconocido';
    const parts = district.split(',');
    const region = parts.length > 1 ? parts[parts.length - 1].trim() : district;
    
    byCandidate[candidateName] = (byCandidate[candidateName] || 0) + 1;
    byRegion[region] = (byRegion[region] || 0) + 1;
  });
  
  return {
    byCandidate,
    byRegion,
    total: Object.values(byCandidate).reduce((a, b) => a + b, 0)
  };
}

// Función para procesar votos regionales (combina reales con simulados)
export function getRegionalVotes() {
  const allVotes = getRealVotes();
  const regionalVotes = allVotes.filter(v => 
    v.voteType === 'presidente-regional' || 
    v.voteType === 'alcalde' || 
    v.voteType === 'regionales'
  );
  
  // Inicializar con datos simulados
  const byCandidate = { ...STATIC_DATA.regionales.byCandidate };
  const byProvince = { ...STATIC_DATA.regionales.byProvince };
  
  // Agregar votos reales si existen
  regionalVotes.forEach(vote => {
    if (vote.candidate) {
      const candidateName = vote.candidate.name || 'Desconocido';
      byCandidate[candidateName] = (byCandidate[candidateName] || 0) + 1;
    }
    
    if (vote.secondaryCandidate) {
      const secondaryName = vote.secondaryCandidate.name || 'Desconocido';
      byCandidate[secondaryName] = (byCandidate[secondaryName] || 0) + 1;
    }
    
    const district = vote.voterDistrict || 'Desconocido';
    const parts = district.split(',');
    const province = parts.length > 1 ? parts[parts.length - 1].trim() : district;
    
    byProvince[province] = (byProvince[province] || 0) + 1;
  });
  
  return {
    byCandidate,
    byProvince,
    total: Object.values(byCandidate).reduce((a, b) => a + b, 0)
  };
}

// --- Dejamos estas funciones por si 'Cleaning.jsx' las usa ---
export function loadJSON(key){
  try{ return JSON.parse(localStorage.getItem(key) || 'null'); }catch(e){ return null; }
}