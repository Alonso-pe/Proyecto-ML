// frontend/src/admin/AdminLayout.jsx

import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Database, 
  Trash2, 
  FileText, 
  LogOut, 
  Bell,
  BarChartHorizontal,
  ChevronRight,
  Settings,
  BookDown // <-- Icono para Reportes
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import DataUpload from './pages/DataUpload';
import Cleaning from './pages/Cleaning';
import VotesReal from './pages/VotesReal';
import ElectionResults from './pages/ElectionResults';
import Reportes from './pages/Reportes'; // <-- 1. IMPORTAR NUEVA PÁGINA
import { Button } from '@/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';

// 2. AÑADIR REPORTES AL MENÚ
const nav = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'upload', label: 'Carga de Datos', icon: Database },
  { id: 'cleaning', label: 'Limpieza', icon: Trash2 },
  { id: 'votes', label: 'Votos Reales', icon: FileText },
  { id: 'elections', label: 'Resultados', icon: BarChartHorizontal },
  { id: 'reportes', label: 'Reportes', icon: BookDown }, // <-- AÑADIDO
];

function Sidebar({ active, setActive }) {
  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col p-6">
      <div className="flex items-center space-x-3 mb-10">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-red-600 rounded-lg flex items-center justify-center">
          <span className="font-bold text-xl text-white">V</span>
        </div>
        <h2 className="text-xl font-bold text-white">Sala de Control</h2>
      </div>
      
      <nav className="flex-1 space-y-2">
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`
                w-full flex items-center space-x-3 py-3 px-4 rounded-lg
                transition-all duration-200 group relative
                ${isActive 
                  ? 'text-white' 
                  : 'text-muted-foreground hover:text-white hover:bg-accent'}
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-primary/20 rounded-lg"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              <Icon className={`h-5 w-5 z-10 ${isActive ? 'text-primary' : ''}`} />
              <span className="font-medium z-10">{item.label}</span>
              <ChevronRight className={`h-4 w-4 ml-auto z-10 transition-transform ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0'} group-hover:translate-x-0 group-hover:opacity-100`} />
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function AdminHeader({ title, onLogout }) {
  return (
    <header className="flex items-center justify-between h-20 mb-8">
      <div>
        <h1 className="text-4xl font-extrabold text-foreground">
          {title}
        </h1>
      </div>
      <div className="flex items-center space-x-3">
        <Button variant="outline" size="icon" className="bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary">
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary relative">
          <Bell className="h-5 w-5" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-card" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-3 p-2 rounded-lg bg-card border border-border hover:bg-accent hover:border-primary transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-red-600 flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <div className="hidden md:block text-left">
                <div className="font-semibold text-foreground text-sm">Administrador</div>
                <div className="text-xs text-muted-foreground">admin@onpe.gob.pe</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default function AdminLayout({ onLogout }) {
  const [active, setActive] = useState('dashboard');

  const CurrentPage = () => {
    if (active === 'dashboard') return <Dashboard />;
    if (active === 'upload') return <DataUpload onNext={() => setActive('cleaning')} />;
    if (active === 'cleaning') return <Cleaning />;
    if (active === 'votes') return <VotesReal />;
    if (active === 'elections') return <ElectionResults />;
    if (active === 'reportes') return <Reportes />; // <-- 3. RENDERIZAR NUEVA PÁGINA
    return <Dashboard />;
  };

  const getActiveLabel = () => {
    return nav.find(item => item.id === active)?.label || 'Dashboard';
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar active={active} setActive={setActive} />
      <main className="flex-1 p-10 overflow-y-auto">
        <AdminHeader title={getActiveLabel()} onLogout={onLogout} />
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <CurrentPage />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}