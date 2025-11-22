// frontend/src/admin/pages/Reportes.jsx

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';
import { Button } from '@/ui/button';
import { FileDown, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Reportes() {
  const reports = [
    { title: 'Reporte General de Participación', format: 'PDF' },
    { title: 'Resultados Presidenciales (Detallado)', format: 'CSV' },
    { title: 'Resultados Congresales (por Región)', format: 'PDF' },
    { title: 'Registro de Votos (Auditoría)', format: 'CSV' },
  ];

  return (
    <motion.div
      className="max-w-4xl space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <p className="text-lg text-muted-foreground">
        Genere y descargue reportes detallados del proceso electoral simulado.
      </p>
      <Card className="bg-card/80 border-border backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Generador de Reportes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reports.map((report, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="flex items-center justify-between p-4 bg-background border border-border rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-primary" />
                <span className="text-lg font-medium text-white">{report.title}</span>
              </div>
              <Button>
                <FileDown className="w-4 h-4 mr-2" />
                Descargar .{report.format}
              </Button>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}