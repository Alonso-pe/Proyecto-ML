// frontend/src/admin/components/ActivityFeed.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Vote } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';

const mockEvents = [
  { type: 'Voto', user: '45****78', region: 'Lima' },
  { type: 'Voto', user: '71****23', region: 'Arequipa' },
  { type: 'Consulta', user: '10****56', region: 'Cusco' },
  { type: 'Voto', user: '25****90', region: 'La Libertad' },
  { type: 'Voto', user: '08****12', region: 'Piura' },
];

function getRandomEvent() {
  const event = mockEvents[Math.floor(Math.random() * mockEvents.length)];
  return { ...event, id: Date.now(), time: new Date().toLocaleTimeString() };
}

export default function ActivityFeed() {
  const [events, setEvents] = useState(() => [
    { id: 1, type: 'Sistema', user: 'En línea', region: 'Nacional', time: new Date().toLocaleTimeString() }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(prev => [getRandomEvent(), ...prev.slice(0, 5)]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-card/80 border-border backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center">
          <Clock className="w-5 h-5 mr-2 text-primary" />
          Feed de Actividad en Vivo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {events.map((event, idx) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`flex items-center space-x-3 p-3 rounded-lg ${idx === 0 ? 'bg-accent/50' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${event.type === 'Voto' ? 'bg-green-500/20' : 'bg-blue-500/20'}`}>
                  <Vote className={`w-5 h-5 ${event.type === 'Voto' ? 'text-green-400' : 'text-blue-400'}`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">{event.type} de {event.user}</p>
                  <p className="text-sm text-muted-foreground">en {event.region}</p>
                </div>
                <p className="text-xs text-muted-foreground">{event.time}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}