import React from 'react';
import ReactDOM from 'react-dom/client';
// USA RUTAS RELATIVAS (./)
import App from './App.jsx';
import './index.css';
import { Toaster } from '@/ui/toaster';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Toaster />
  </>
);