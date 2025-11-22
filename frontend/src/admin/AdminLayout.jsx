import React, { useState } from 'react';
import { 
  LayoutGrid, Database, Trash2, FileText, LogOut, 
  Bell, BarChartHorizontal, Settings, BookDown, Menu, 
  ShieldCheck, Search, User, Power, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/ui/dropdown-menu';

// Importación de páginas
import Dashboard from './pages/Dashboard';
import DataUpload from './pages/DataUpload';
import Cleaning from './pages/Cleaning';
import VotesReal from './pages/VotesReal';
import ElectionResults from './pages/ElectionResults';
import Reportes from './pages/Reportes';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Panel de Control', icon: LayoutGrid },
  { id: 'upload', label: 'Ingesta de Datos', icon: Database },
  { id: 'cleaning', label: 'Calidad de Datos', icon: Trash2 },
  { id: 'votes', label: 'Monitor en Vivo', icon: FileText },
  { id: 'elections', label: 'Resultados Finales', icon: BarChartHorizontal },
  { id: 'reportes', label: 'Reportes & Logs', icon: BookDown },
];

// --- COMPONENTE SIDEBAR (Barra Lateral) ---
function Sidebar({ active, setActive, mobileOpen, setMobileOpen, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  // Al hacer clic en un link en móvil, cerramos el menú
  const handleNavClick = (id) => {
    setActive(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* 1. OVERLAY OSCURO (Solo Móvil) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[140] lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* 2. SIDEBAR (Móvil y Desktop unificado) */}
      <aside 
        className={`
          fixed top-0 left-0 z-[150] h-full bg-[#0b1121] border-r border-slate-800 flex flex-col
          transition-all duration-300 ease-in-out shadow-2xl
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 lg:static lg:h-screen
          ${collapsed ? 'lg:w-20' : 'lg:w-72'}
          w-72
        `}
      >
        {/* Header del Sidebar */}
        <div className="h-16 lg:h-20 flex items-center justify-between px-5 border-b border-slate-800 bg-[#0f172a] shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative flex-shrink-0 flex items-center justify-center w-10 h-10 bg-blue-600 rounded-xl shadow-lg border border-white/10">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            {/* Texto: Visible en móvil, y en desktop si no está colapsado */}
            <div className={`whitespace-nowrap overflow-hidden transition-opacity duration-200 ${collapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100'}`}>
              <h2 className="text-sm font-extrabold text-white tracking-tight leading-none uppercase">SISTEMA ELECTORAL</h2>
              <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mt-1">Acceso Admin</p>
            </div>
          </div>
          
          {/* BOTÓN CERRAR (Solo Móvil) */}
          <button 
            onClick={() => setMobileOpen(false)} 
            className="lg:hidden p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Lista de Navegación */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          <p className={`px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 transition-opacity ${collapsed ? 'lg:opacity-0' : 'opacity-100'}`}>
            Módulos
          </p>
          
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={collapsed ? item.label : ''}
                className={`
                  group w-full flex items-center py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden
                  ${collapsed ? 'justify-center px-0' : 'gap-3 px-4'}
                  ${isActive 
                    ? 'text-white bg-blue-600/10 border border-blue-500/20 shadow-lg' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-full"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  />
                )}
                <Icon className={`h-5 w-5 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                
                {/* Texto del botón */}
                <span className={`whitespace-nowrap transition-all duration-200 ${collapsed ? 'lg:w-0 lg:opacity-0 lg:overflow-hidden' : 'w-auto opacity-100'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Botón Colapsar (Solo Desktop) */}
          <div className="mt-4 hidden lg:block">
             <button 
                onClick={() => setCollapsed(!collapsed)} 
                className="w-full flex justify-center py-3 text-slate-500 hover:text-white transition-colors bg-slate-800/30 hover:bg-slate-800/50 rounded-lg"
             >
                {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
             </button>
          </div>
        </div>

        {/* Footer Perfil */}
        <div className="p-4 border-t border-slate-800 bg-[#0a0f1e] shrink-0">
          <div className={`flex items-center transition-all p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer group border border-transparent hover:border-slate-700 ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white ring-2 ring-slate-900">
              AD
            </div>
            <div className={`flex-1 min-w-0 transition-all duration-200 ${collapsed ? 'lg:w-0 lg:opacity-0 lg:overflow-hidden' : 'w-auto opacity-100'}`}>
              <p className="text-sm font-medium text-white truncate">Admin General</p>
              <p className="text-[10px] text-emerald-400 truncate font-mono flex items-center gap-1">● Online</p>
            </div>
            <div className={`transition-all duration-200 ${collapsed ? 'lg:hidden' : 'block'}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10" onClick={onLogout} title="Cerrar Sesión">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// --- COMPONENTE HEADER ---
function AdminHeader({ title, onMenuClick, onLogout }) {
  return (
    <header className="h-16 lg:h-20 bg-[#0b1121]/90 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40 transition-all duration-300 shrink-0">
      <div className="flex items-center gap-3 lg:gap-4">
        {/* BOTÓN HAMBURGUESA (Solo Móvil) */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden text-slate-200 hover:bg-slate-800 -ml-2" 
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick();
          }}
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        <div>
          <h1 className="text-base lg:text-xl font-bold text-white tracking-tight line-clamp-1">{title}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex h-1.5 w-1.5 lg:h-2 lg:w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500"></span>
            </span>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold hidden sm:block">Sincronización: En Tiempo Real</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-6">
        <div className="hidden md:flex items-center bg-slate-900 border border-slate-700/50 rounded-full px-4 py-2 w-64 focus-within:border-blue-500/50 focus-within:bg-slate-800 transition-all shadow-inner">
          <Search className="h-4 w-4 text-slate-500 mr-2" />
          <input 
            type="text" 
            placeholder="Buscar acta..." 
            className="bg-transparent border-none focus:outline-none text-sm text-white placeholder:text-slate-600 w-full"
          />
        </div>

        <div className="h-6 w-px bg-slate-800 mx-1 hidden md:block" />

        <div className="flex items-center gap-1 lg:gap-2">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors hidden sm:flex" onClick={onLogout} title="Salir">
            <Power className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800 relative rounded-full">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0f172a] animate-pulse" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-full">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800 text-slate-200 rounded-xl shadow-2xl p-2 z-[200]">
              <DropdownMenuLabel className="text-xs text-slate-500 uppercase tracking-wider">Configuración</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer rounded-lg my-1">
                <User className="mr-2 h-4 w-4" /> Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem className="focus:bg-red-900/20 focus:text-red-400 text-red-400 cursor-pointer rounded-lg my-1 font-medium" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

// --- LAYOUT PRINCIPAL ---
export default function AdminLayout({ onLogout }) {
  const [active, setActive] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const CurrentPage = () => {
    switch(active) {
      case 'dashboard': return <Dashboard />;
      case 'upload': return <DataUpload onNext={() => setActive('cleaning')} />;
      case 'cleaning': return <Cleaning />;
      case 'votes': return <VotesReal />;
      case 'elections': return <ElectionResults />;
      case 'reportes': return <Reportes />;
      default: return <Dashboard />;
    }
  };

  const activeLabel = NAV_ITEMS.find(item => item.id === active)?.label || 'Panel Principal';

  return (
    <div className="h-screen flex bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden">
      
      <Sidebar 
        active={active} 
        setActive={setActive} 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
        onLogout={onLogout}
      />
      
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Fondo ambiental */}
        <div className="absolute top-[-20%] left-[20%] w-[60%] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none z-0" />
        
        <AdminHeader 
          title={activeLabel} 
          onMenuClick={() => setMobileOpen(true)} 
          onLogout={onLogout}
        />
        
        <main className="flex-1 overflow-y-auto p-3 md:p-6 scroll-smooth relative z-10 custom-scrollbar w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="max-w-[2200px] mx-auto h-full pb-6"
            >
              <CurrentPage />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}