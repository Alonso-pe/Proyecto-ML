import React, { useState } from 'react';

// Simulación de una base de datos de votantes
const mockVoters = {
  '12345678': {
    name: 'Juan Alberto Pérez García',
    district: 'San Isidro, Lima',
    status: 'Habilitado para votar',
  },
  '87654321': {
    name: 'María Fernanda Castillo Rojas',
    district: 'Miraflores, Lima',
    status: 'Voto emitido',
  },
   '11111111': {
    name: 'Carlos Andrés Villena Soto',
    district: 'Santiago de Surco, Lima',
    status: 'Habilitado para votar',
  },
  '60773713': {
    name: 'Brat Ocaña Paredes',
    district: 'Comas, Lima',
    status: 'Habilitado para votar',
  },
  '70868955': {
    name: 'Beatriz Chipillo Mendoza',
    district: 'Yungay, Ancash',
    status: 'Habilitado para votar',
  },
  '70620660': {
    name: 'Cristin Andia Chaves',
    district: 'Barranca, Lima',
    status: 'Habilitado para votar',
  }
};

export const useVoterData = () => {
  const [dni, setDni] = useState('');
  const [voterData, setVoterData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidDni, setIsValidDni] = useState(true);

  const handleDniChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo números
    setDni(value);
    setVoterData(null);
    setError(null);
    if (value.length > 0 && value.length < 8) {
      setIsValidDni(false);
    } else {
      setIsValidDni(true);
    }
  };

  const validateDni = () => {
    if (dni.length !== 8) {
      setError('El DNI debe tener 8 dígitos.');
      setIsValidDni(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setVoterData(null);

    // Llamada real al backend `/dni/{dni}`; si falla, caemos al mock local
    fetch(`http://localhost:8082/dni/${dni}`, { method: 'GET' })
      .then(async (res) => {
        if (!res.ok) {
          // fallback to mock
          const data = mockVoters[dni];
          if (data) {
            setVoterData(data);
          } else {
            setError('DNI no encontrado o servicio no disponible.');
          }
        } else {
          const body = await res.json();
          // Map backend response to voterData shape expected by UI
          const uiData = {
            name: (body.nombre ? `${body.nombre} ${body.apellido || ''}`.trim() : ''),
            district: body.direccion || 'Desconocido',
            status: 'Habilitado para votar',
          };
          setVoterData(uiData);
        }
      })
      .catch(() => {
        const data = mockVoters[dni];
        if (data) {
          setVoterData(data);
        } else {
          setError('DNI no encontrado o servicio no disponible.');
        }
      })
      .finally(() => setIsLoading(false));
  };

  return {
    dni,
    voterData,
    error,
    isLoading,
    isValidDni,
    handleDniChange,
    validateDni,
  };
};