import React from 'react';
import ReactDOM from 'react-dom/client';
// USA RUTAS RELATIVAS (./)
import App from './App.jsx';
import './index.css';
import { Toaster } from '@/ui/toaster';

// Inicializar tema antes de renderizar
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.classList.add(savedTheme);

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Toaster />
  </>
);