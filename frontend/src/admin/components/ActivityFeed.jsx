import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Vote, UserCheck } from 'lucide-react';

const mockEvents = [
  { type: 'Voto', user: '45****78', region: 'Lima', icon: Vote, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  { type: 'Consulta', user: '10****56', region: 'Cusco', icon: UserCheck, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { type: 'Voto', user: '71****23', region: 'Arequipa', icon: Vote, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
];

function getRandomEvent() {
  const event = mockEvents[Math.floor(Math.random() * mockEvents.length)];
  return { ...event, id: Date.now(), time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) };
}

export default function ActivityFeed() {
  const [events, setEvents] = useState([{ ...mockEvents[0], id: 1, time: new Date().toLocaleTimeString() }]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(prev => [getRandomEvent(), ...prev].slice(0, 5));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 space-y-2 h-full overflow-hidden">
      <AnimatePresence initial={false}>
        {events.map((event, idx) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center space-x-3 p-2.5 rounded-lg border ${event.border} ${event.bg} mb-2`}
          >
            <div className={`p-2 rounded-full ${event.bg}`}>
              <event.icon className={`w-4 h-4 ${event.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {event.type} de {event.user}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                en {event.region}
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-500">{event.time}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}