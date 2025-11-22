import { useState } from "react";

export default function useVoterData() {
  const [dni, setDni] = useState("");
  const [voterData, setVoterData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidDni, setIsValidDni] = useState(false);

  const validateDni = async () => {
    if (dni.length !== 8) {
      setError("El DNI debe tener 8 dígitos.");
      setIsValidDni(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setVoterData(null);

    try {
      const response = await fetch(`http://localhost:8080/api/dni/${dni}`);

      if (!response.ok) {
        throw new Error("No encontrado");
      }

      const data = await response.json();

      // Ajusta la estructura para que coincida con el frontend
      setVoterData({
        name: `${data.nombre} ${data.apellido}`,
        district: data.direccion,
        status: "Habilitado para votar"
      });

      setIsValidDni(true);
    } catch (err) {
      setError("DNI no encontrado. Verifique el número e intente de nuevo.");
      setIsValidDni(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    dni,
    setDni,
    voterData,
    error,
    isLoading,
    isValidDni,
    validateDni,
  };
}
