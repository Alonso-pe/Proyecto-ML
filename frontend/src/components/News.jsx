import React from 'react';
import { motion } from 'framer-motion';

const newsItems = [
    {
        date: '17 NOV, 2025',
        title: "Participación récord en primera fase de voto electrónico",
        description: "La ONPE ha confirmado una afluencia histórica de votantes durante las primeras 48 horas del nuevo sistema de votación digital.",
        link: "#",
    },
    {
        date: '16 NOV, 2025',
        title: "Observadores internacionales elogian la seguridad del sistema",
        description: "Delegaciones de veedores electorales han calificado la plataforma como 'robusta, segura y un ejemplo para la región'.",
        link: "#",
    },
    {
        date: '15 NOV, 2025',
        title: "Todo listo para el inicio de las elecciones digitales",
        description: "Tras meses de pruebas exhaustivas, la plataforma de Votación Soberana se abre hoy a todos los ciudadanos peruanos.",
        link: "#",
    },
];

const News = () => {
    return (
        <section id="noticias" className="py-24 bg-gradient-to-b from-[#051121] to-[#0A192F]">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6 }}
                  className="mb-16"
                >
                    <p className="text-lg font-medium text-[#D4AF37] mb-3">Manténgase Informado</p>
                    <h2 className="text-4xl font-extrabold text-white tracking-tight">Últimas Noticias y Actualizaciones</h2>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {newsItems.map((item, index) => (
                        <motion.a
                          key={index}
                          href={item.link}
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ duration: 0.6, delay: index * 0.2 }}
                          className="bg-[#172a45] p-8 rounded-lg border border-transparent hover:border-[#D4AF37]/30 shadow-lg flex flex-col group transition-all transform hover:-translate-y-2"
                        >
                            <p className="text-sm font-semibold text-[#D4AF37] mb-2">{item.date}</p>
                            <h3 className="text-xl font-bold text-white mb-4 flex-grow">{item.title}</h3>
                            <p className="text-[#a8b2d1] mb-6 flex-grow">{item.description}</p>
                            <span className="font-semibold text-[#D4AF37] transition-colors duration-200 self-start">
                                Leer más <span className="inline-block transform group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default News;