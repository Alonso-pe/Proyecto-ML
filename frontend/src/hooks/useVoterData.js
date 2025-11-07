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
    
    // Simular una llamada a API
    setTimeout(() => {
      const data = mockVoters[dni];
      if (data) {
        setVoterData(data);
      } else {
        setError('DNI no encontrado. Verifique el número e intente de nuevo.');
      }
      setIsLoading(false);
    }, 1500);
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