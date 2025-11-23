// frontend/src/admin/utils/dataUtils.js

const STATIC_DATA = {
  presidenciales: {
    byCandidate: { 
      'Pedro Castillo': 1850, 
      'Keiko Fujimori': 1650, 
      'Rafael López Aliaga': 1420, 
      'Verónika Mendoza': 1280, 
      'Hernando de Soto': 980,
      'Daniel Urresti': 750,
      'Julio Guzmán': 620
    },
    byRegion: { 
      'Lima': 3200, 'Arequipa': 1450, 'La Libertad': 1200, 'Piura': 1100, 
      'Cusco': 980, 'Lambayeque': 850, 'Junín': 720, 'Cajamarca': 680, 
      'Ancash': 650, 'Puno': 580
    }
  },
  // CAMBIO: Estructura para Alcaldía
  alcaldia: {
    byCandidate: {
      'Rafael López Aliaga': 2150, 
      'George Forsyth': 1890,      
      'Daniel Urresti': 1650,      
      'Rafael A.': 1200,
      'George F.': 950,
      'Daniel O.': 800
    },
    byDistrict: {
      'Lima Cercado': 5000,
      'San Juan de Lurigancho': 4200,
      'San Martín de Porres': 3800,
      'Ate': 3500,
      'Comas': 3200,
      'Villa El Salvador': 2800,
      'Villa María del Triunfo': 2500
    }
  },
  congresales: {
    byCandidate: { 'Fuerza Popular': 24, 'Perú Libre': 37, 'Renovación Popular': 13, 'Avanza País': 7, 'Acción Popular': 16 },
  },
  mapData: {
    'PE-LMA': 85, 'PE-ARE': 78, 'PE-CUS': 75, 'PE-LAL': 72, 'PE-PIU': 70, 'PE-JUN': 68,
    'PE-PUN': 65, 'PE-CAJ': 63, 'PE-ANC': 60, 'PE-AYA': 58, 'PE-HUV': 55, 'PE-PAS': 54,
    'PE-HUC': 53, 'PE-APU': 52, 'PE-MOQ': 51, 'PE-TAC': 50, 'PE-TUM': 49, 'PE-LAM': 48,
    'PE-AMA': 45, 'PE-UCA': 44, 'PE-LOR': 42, 'PE-MDD': 40, 'PE-SMT': 38, 'PE-CAL': 88
  }
};

export function getAggregates(){
  return {
    pres: STATIC_DATA.presidenciales,
    mun: STATIC_DATA.alcaldia,
    cong: STATIC_DATA.congresales,
    mapData: STATIC_DATA.mapData,
    pres_raw: STATIC_DATA.presidenciales.byRegion,
    mun_raw: STATIC_DATA.alcaldia.byDistrict
  };
}

export function getRealVotes() {
  try {
    return JSON.parse(localStorage.getItem('realVotes') || '[]');
  } catch (e) {
    return [];
  }
}

export function getPresidentialVotes() {
  const allVotes = getRealVotes();
  const presVotes = allVotes.filter(v => v.voteType === 'presidencial');
  const byCandidate = { ...STATIC_DATA.presidenciales.byCandidate };
  
  presVotes.forEach(vote => {
    const name = vote.candidate?.name;
    if (name) byCandidate[name] = (byCandidate[name] || 0) + 1;
  });
  
  return { byCandidate };
}

export function getMunicipalVotes() {
  const allVotes = getRealVotes();
  const munVotes = allVotes.filter(v => v.voteType === 'alcaldia');
  const byCandidate = { ...STATIC_DATA.alcaldia.byCandidate };
  
  munVotes.forEach(vote => {
    if (vote.candidate?.name) {
      const name = vote.candidate.name;
      byCandidate[name] = (byCandidate[name] || 0) + 1;
    }
  });
  
  return { byCandidate };
}

export function loadJSON(key){
  try{ return JSON.parse(localStorage.getItem(key) || 'null'); }catch(e){ return null; }
}