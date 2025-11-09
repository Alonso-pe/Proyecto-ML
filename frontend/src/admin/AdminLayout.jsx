import React, { useState } from 'react';
import { Users, Database, Trash2, Cpu, Play, FileText, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import DataUpload from './pages/DataUpload';
import Cleaning from './pages/Cleaning';
import Training from './pages/Training';
import Results from './pages/Results';
import VotesReal from './pages/VotesReal';
import ElectionResults from './pages/ElectionResults';
import { Button } from '@/ui/button';

const nav = [
  { id: 'dashboard', label: 'Dashboard', icon: Users },
  { id: 'upload', label: 'Carga de Datos', icon: Database },
  { id: 'cleaning', label: 'Limpieza', icon: Trash2 },
  { id: 'training', label: 'Entrenamiento', icon: Cpu },
  { id: 'results', label: 'Resultados Entrenamiento', icon: Play },
  { id: 'votes', label: 'Votos Reales', icon: FileText },
  { id: 'elections', label: 'Resultados Electorales', icon: FileText }
];

export default function AdminLayout({ onLogout }) {
  const [active, setActive] = useState('dashboard');

  return (
    <div className="min-h-screen flex bg-background text-white">
      <aside className="w-72 p-6 border-r border-white/10 bg-card/40">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <p className="text-sm text-gray-300">Gestión de votaciones — modo mock</p>
          </div>
          <div>
            <Button variant="ghost" size="icon" onClick={onLogout}><LogOut className="h-5 w-5" /></Button>
          </div>
        </div>
        <nav className="space-y-2">
          {nav.map((n) => {
            const Icon = n.icon;
            return (
              <button key={n.id} onClick={() => setActive(n.id)} className={`w-full text-left py-2 px-3 rounded-md flex items-center space-x-3 hover:bg-white/5 ${active===n.id? 'bg-white/5':''}`}>
                <Icon className="h-5 w-5 text-primary" />
                <span className="font-medium">{n.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="mt-6 text-sm text-gray-400">Estado: <span className="text-white">Mock</span></div>
      </aside>

      <main className="flex-1 p-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {active === 'dashboard' && <Dashboard />}
          {active === 'upload' && <DataUpload onNext={() => setActive('cleaning')} />}
          {active === 'cleaning' && <Cleaning />}
          {active === 'training' && <Training />}
          {active === 'results' && <Results />}
          {active === 'votes' && <VotesReal />}
          {active === 'elections' && <ElectionResults />}
        </motion.div>
      </main>
    </div>
  );
}
