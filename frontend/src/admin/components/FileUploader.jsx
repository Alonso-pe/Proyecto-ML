// frontend/src/admin/components/FileUploader.jsx

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { CheckCircle, FileUp } from 'lucide-react';

export default function FileUploader({ onParsed }) {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          onParsed(results.data);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
        }
      });
    });
  }, [onParsed]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  return (
    <div 
      {...getRootProps()} 
      className={`
        border-2 border-dashed rounded-xl p-12
        transition-all duration-300 ease-in-out
        flex flex-col items-center justify-center
        min-h-[300px] w-full
        cursor-pointer outline-none
        ${isDragActive 
          ? 'border-primary bg-primary/10 shadow-2xl shadow-primary/10' // Resplandor rojo al arrastrar
          : 'border-border bg-background hover:border-primary/50' // Estado normal
        }
        ${acceptedFiles.length > 0 ? 'bg-green-500/5 border-green-500' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      {acceptedFiles.length > 0 ? (
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <p className="text-2xl font-semibold text-white">Archivo Aceptado</p>
          <p className="text-lg text-muted-foreground">{acceptedFiles[0].name}</p>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <FileUp className="w-16 h-16 text-muted-foreground mx-auto" />
          <p className="text-2xl font-semibold text-white">
            {isDragActive 
              ? 'Suelta el archivo aquí' 
              : 'Arrastra y suelta el archivo .CSV'
            }
          </p>
          <p className="text-lg text-muted-foreground">
            o haz clic para seleccionar
          </p>
        </div>
      )}
    </div>
  );
}