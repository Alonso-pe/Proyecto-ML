import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, ChevronRight, X, MousePointerClick } from 'lucide-react';

const COLORS = { 
  base: '#1e293b', 
  hover: '#334155', 
  stroke: 'rgba(255,255,255,0.1)', 
  selected: '#ef4444', 
  glow: 'drop-shadow(0 0 15px rgba(239, 68, 68, 0.5))' 
};

const DEPARTMENTS_CONFIG = [
  { id: 'PE-TUM', name: 'Tumbes', path: 'M72,58 L90,55 L95,60 L100,58 L105,65 L90,75 L85,70 L80,72 L72,58 Z' },
  { id: 'PE-PIU', name: 'Piura', path: 'M35,90 L72,58 L85,70 L90,75 L120,70 L125,80 L135,100 L110,115 L80,145 L60,135 L35,110 L40,100 Z' },
  { id: 'PE-LAM', name: 'Lambayeque', path: 'M80,145 L95,135 L115,125 L125,140 L120,155 L90,165 L80,145 Z' },
  { id: 'PE-LAL', name: 'La Libertad', path: 'M90,165 L120,155 L150,145 L155,180 L160,195 L110,215 L100,190 Z' },
  { id: 'PE-CAJ', name: 'Cajamarca', path: 'M115,125 L120,70 L150,65 L155,80 L145,100 L155,145 L120,155 L125,140 Z' },
  { id: 'PE-AMA', name: 'Amazonas', path: 'M150,65 L185,60 L195,110 L190,130 L155,145 L155,80 L150,65 Z' },
  { id: 'PE-LOR', name: 'Loreto', path: 'M185,60 L250,30 L380,60 L460,170 L430,220 L320,230 L280,240 L200,160 L195,110 L185,60 Z' },
  { id: 'PE-SMT', name: 'San Martín', path: 'M155,145 L190,130 L200,160 L210,190 L170,205 L160,195 L155,145 Z' },
  { id: 'PE-ANC', name: 'Ancash', path: 'M110,215 L160,195 L165,240 L125,260 L115,240 Z' },
  { id: 'PE-HUC', name: 'Huánuco', path: 'M170,205 L215,190 L225,230 L185,245 L165,240 Z' },
  { id: 'PE-PAS', name: 'Pasco', path: 'M185,245 L225,230 L225,265 L195,275 Z' },
  { id: 'PE-JUN', name: 'Junín', path: 'M195,275 L245,270 L255,320 L200,310 Z' },
  { id: 'PE-UCA', name: 'Ucayali', path: 'M215,190 L280,220 L310,240 L290,330 L245,300 L225,230 Z' },
  { id: 'PE-LMA', name: 'Lima', path: 'M140,260 L185,270 L195,320 L160,330 L145,300 L135,280 Z' },
  { id: 'PE-CAL', name: 'Callao', path: 'M74.9 172.3l-5 -2l-2 5l3 4l4 -3Z' }, 
  { id: 'PE-ICA', name: 'Ica', path: 'M165,330 L205,340 L215,390 L190,400 L175,370 Z' },
  { id: 'PE-HUV', name: 'Huancavelica', path: 'M205,320 L245,315 L250,350 L215,360 Z' },
  { id: 'PE-AYA', name: 'Ayacucho', path: 'M225,340 L255,335 L265,390 L235,400 L225,360 Z' },
  { id: 'PE-APU', name: 'Apurímac', path: 'M255,350 L295,345 L305,380 L265,390 Z' },
  { id: 'PE-CUS', name: 'Cusco', path: 'M275,330 L325,320 L345,380 L295,390 L265,350 Z' },
  { id: 'PE-MDD', name: 'Madre de Dios', path: 'M330,320 L430,330 L410,400 L345,380 Z' },
  { id: 'PE-PUN', name: 'Puno', path: 'M315,400 L385,390 L395,460 L335,465 L315,440 Z' },
  { id: 'PE-ARE', name: 'Arequipa', path: 'M235,400 L295,395 L315,440 L270,460 L225,420 Z' },
  { id: 'PE-MOQ', name: 'Moquegua', path: 'M300,470 L330,465 L335,495 L310,500 Z' },
  { id: 'PE-TAC', name: 'Tacna', path: 'M315,500 L345,495 L340,530 L315,520 Z' }
];

const CardTooltip = ({ data, position, containerRect }) => {
  if (!data || !containerRect) return null;
  const tooltipWidth = 150; 
  let left = position.x + 15; 
  let top = position.y - 50;
  if (left + tooltipWidth > containerRect.width) { left = position.x - tooltipWidth - 15; }
  if (left < 5) { left = 5; }
  if (top < 5) { top = position.y + 20; }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15 }}
      className="absolute z-50 pointer-events-none"
      style={{ left, top }}
    >
      <div className="w-40 bg-slate-950/70 backdrop-blur-md border border-white/10 rounded-lg shadow-xl overflow-hidden">
        <div className="p-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <h2 className="text-xs font-bold text-white uppercase tracking-tight truncate max-w-[65%]">{data.name}</h2>
            <div className="px-1 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30">
               <span className="text-[8px] font-bold text-emerald-400 leading-none block">VIVO</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-slate-300 text-[8px] font-bold uppercase tracking-wider">Participación</span>
            <span className="text-xl font-black text-yellow-400 tabular-nums">{data.value}%</span>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.8)]"
              initial={{ width: 0 }}
              animate={{ width: `${data.value}%` }}
              transition={{ duration: 0.3 }} 
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function PeruMap({ data = {}, onDepartmentHover, onDepartmentClick, selectedRegion }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [isListOpen, setIsListOpen] = useState(window.innerWidth > 1024);
  
  const containerRef = useRef(null);
  const [containerRect, setContainerRect] = useState(null);

  const departments = useMemo(() => DEPARTMENTS_CONFIG.map(d => ({ ...d, value: data[d.id] || Math.floor(Math.random() * 40) + 50 })), [data]);
  const filteredDepts = useMemo(() => departments.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase())), [departments, searchTerm]);
  const activeData = useMemo(() => (hoveredId ? departments.find(d => d.id === hoveredId) : null), [hoveredId, departments]);

  useEffect(() => {
    if (containerRef.current) setContainerRect(containerRef.current.getBoundingClientRect());
    const handleResize = () => { if (window.innerWidth > 1024) setIsListOpen(true); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setContainerRect(rect); 
    }
  };

  const handleBackgroundClick = (e) => {
     if (e.target.tagName !== 'path' && onDepartmentClick) onDepartmentClick(null);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full flex items-center justify-center bg-[#0b1121] overflow-hidden select-none group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredId(null)}
      onClick={handleBackgroundClick}
    >
      {/* Mensaje Central si no hay selección */}
      {!selectedRegion && onDepartmentClick && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 hidden sm:block animate-pulse">
            <div className="bg-slate-900/60 text-slate-300 text-xs px-3 py-1 rounded-full border border-white/5 flex items-center gap-2 backdrop-blur-sm">
                <MousePointerClick className="w-3 h-3" />
                <span>Selecciona una región</span>
            </div>
        </div>
      )}

      {/* Badge de VIVO (Derecha) */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span className="text-[8px] font-bold text-emerald-400 tracking-wider">VIVO</span>
        </div>
      </div>
      
      {/* BUSCADOR Y LISTA FLOTANTE (Esquina Inferior Izquierda) */}
      <div className="absolute bottom-4 left-4 z-30 flex flex-col gap-2 pointer-events-auto items-start max-w-[200px]">
        <AnimatePresence>
          {(isListOpen) && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ duration: 0.2 }}
              className="w-full bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-lg overflow-hidden shadow-2xl flex flex-col max-h-[220px] mb-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-2 py-2 border-b border-slate-700/50 bg-slate-950/50">
                <div className="relative">
                    <Search className="w-3 h-3 text-slate-500 absolute left-2 top-2" />
                    <input 
                    type="text" placeholder="Buscar región..." 
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded px-2 py-1.5 pl-7 text-[10px] text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600" 
                    onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} 
                    />
                </div>
              </div>
              <div className="overflow-y-auto custom-scrollbar p-1 space-y-0.5 flex-1">
                {filteredDepts.map(dept => (
                  <button 
                    key={dept.id} 
                    onClick={(e) => { 
                       e.stopPropagation(); 
                       onDepartmentClick && onDepartmentClick(dept.name); 
                       if(window.innerWidth <= 1024) setIsListOpen(false); 
                    }} 
                    onMouseEnter={() => setHoveredId(dept.id)} 
                    onMouseLeave={() => setHoveredId(null)} 
                    className={`w-full text-left px-2 py-1.5 rounded-md text-[10px] font-medium flex items-center justify-between transition-all ${selectedRegion === dept.name ? 'bg-blue-600 text-white shadow-sm' : hoveredId === dept.id ? 'bg-slate-800 text-slate-200' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                  >
                    <span className="truncate">{dept.name}</span>
                    {selectedRegion === dept.name && <ChevronRight className="w-3 h-3 text-white/80 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={(e) => { e.stopPropagation(); setIsListOpen(!isListOpen); }}
          className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-white text-[10px] font-bold px-3 py-2 rounded-lg shadow-lg hover:bg-slate-800 transition-all lg:hidden"
        >
          {isListOpen ? <X className="w-3 h-3 text-red-400"/> : <Search className="w-3 h-3" />}
          {isListOpen ? "Cerrar" : "Buscar Región"}
        </button>
      </div>

      <AnimatePresence>{activeData && <CardTooltip data={activeData} position={tooltipPos} containerRect={containerRect} />}</AnimatePresence>

      {/* SVG DEL MAPA */}
      <div className="w-full h-full flex items-center justify-center p-2 sm:p-6 z-0">
        <motion.svg viewBox="0 0 500 600" className="w-full h-full max-h-[90vh] filter drop-shadow-[0_0_25px_rgba(0,0,0,0.6)]" preserveAspectRatio="xMidYMid meet">
          <g transform="translate(10, 10)">
            {departments.map((dept) => {
              const isActive = hoveredId === dept.id || selectedRegion === dept.name;
              let fillColor = COLORS.base;
              if (selectedRegion === dept.name) fillColor = COLORS.selected;
              else if (hoveredId === dept.id) fillColor = COLORS.hover;
              
              return (
                <motion.path key={dept.id} d={dept.path} stroke={isActive ? "#ffffff" : COLORS.stroke} strokeWidth={isActive ? 1.5 : 0.5} initial={false} animate={{ fill: fillColor, scale: isActive ? 1.015 : 1, opacity: (selectedRegion && !isActive) ? 0.3 : 1, filter: selectedRegion === dept.name ? COLORS.glow : 'none', zIndex: isActive ? 50 : 1 }} transition={{ duration: 0.3 }} onClick={(e) => { e.stopPropagation(); onDepartmentClick && onDepartmentClick(dept.name); }} onMouseEnter={() => { setHoveredId(dept.id); onDepartmentHover && onDepartmentHover({ name: dept.name, value: dept.value }); }} className="cursor-pointer focus:outline-none" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
              );
            })}
          </g>
        </motion.svg>
      </div>
    </div>
  );
}