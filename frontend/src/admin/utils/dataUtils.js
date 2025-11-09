// Utilities to build aggregated mock data for charts from localStorage

// Datos estáticos para modo mock
const STATIC_DATA = {
  presidenciales: {
    byCandidate: { 'Perez': 1500, 'Gonzales': 1200, 'Lopez': 900 },
    byRegion: { 'Lima': 2000, 'Arequipa': 800, 'Cusco': 500, 'Trujillo': 300 },
    timeMap: {
      '2025-11-03': 500,
      '2025-11-04': 600,
      '2025-11-05': 800,
      '2025-11-06': 750,
      '2025-11-07': 950
    }
  },
  congresales: {
    byCandidate: { 'Partido A': 800, 'Partido B': 600, 'Partido C': 400 },
    byRegion: { 'Lima': 1000, 'Arequipa': 500, 'Cusco': 300 },
    timeMap: {
      '2025-11-03': 300,
      '2025-11-04': 400,
      '2025-11-05': 500,
      '2025-11-06': 600
    }
  },
  municipales: {
    byCandidate: { 'Distrito 1': 400, 'Distrito 2': 300, 'Distrito 3': 200 },
    byRegion: { 'Lima': 500, 'Trujillo': 400 },
    timeMap: {
      '2025-11-03': 200,
      '2025-11-04': 300,
      '2025-11-05': 400
    }
  }
};

export function loadJSON(key){
  try{ return JSON.parse(localStorage.getItem(key) || 'null'); }catch(e){ return null; }
}

function buildFromRows(rows){
  // expects rows with fields: candidato, region, fecha (optional)
  const byCandidate = {};
  const byRegion = {};
  const timeMap = {};
  (rows || []).forEach(r=>{
    const cand = (r.candidato || r.candidate || 'sin_nombre').toString();
    const reg = (r.region || r.departamento || 'sin_region').toString();
    const fecha = (r.fecha || r.date || new Date().toISOString().slice(0,10)).toString();
    byCandidate[cand] = (byCandidate[cand]||0)+1;
    byRegion[reg] = (byRegion[reg]||0)+1;
    timeMap[fecha] = (timeMap[fecha]||0)+1;
  });
  return { byCandidate, byRegion, timeMap };
}

export function getAggregates(){
  // try cleaned first, otherwise raw, otherwise generate synthetic
  const pres = loadJSON('presidenciales_clean') || loadJSON('presidenciales_raw');
  const cong = loadJSON('congresales_clean') || loadJSON('congresales_raw');
  const mun = loadJSON('municipales_clean') || loadJSON('municipales_raw');
  const votes = loadJSON('votes_real');

  const presAgg = pres ? buildFromRows(pres) : null;
  const congAgg = cong ? buildFromRows(cong) : null;
  const munAgg = mun ? buildFromRows(mun) : null;
  const votesAgg = votes ? buildFromRows(votes) : null;

  // return static mock data
  function synthetic(type){
    if (type === 'pres') return STATIC_DATA.presidenciales;
    if (type === 'cong') return STATIC_DATA.congresales;
    return STATIC_DATA.municipales;
  }

  return {
    pres: presAgg || synthetic('pres'),
    cong: congAgg || synthetic('cong'),
    mun: munAgg || synthetic('mun'),
    votes: votesAgg || synthetic('votes')
  };
}
