// App.jsx (Conectado)

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { ArrowUp, CheckSquare, Lock, BarChart, FileText, Users, Calendar, Vote, Shield, TrendingUp, Search, UserCheck, ClipboardCheck, Settings, Hand, Gavel, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VoterVerification from '@/components/VoterVerification';
import Section from '@/components/Section';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card.jsx';
import { Button } from '@/ui/button.jsx';
import ElectionSelection from '@/components/ElectionSelection'; 
import AdminLayout from '@/admin/AdminLayout';

const StepCard = ({
  icon: Icon,
  title,
  description
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="bg-card/80 border-primary/30 text-center h-full hover:border-primary/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-primary/20">
      <CardHeader>
        <div className="mx-auto bg-primary/20 text-primary rounded-full h-20 w-20 flex items-center justify-center mb-4 border-2 border-primary/30 shadow-lg">
          <Icon className="h-10 w-10" />
        </div>
        <CardTitle className="text-xl md:text-2xl text-white font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

function App() {
  
  const [view, setView] = useState('landing');
  const [isAdmin, setIsAdmin] = useState(false);

  // Función para ir a la selección (la llama VoterVerification en modo usuario)
  const handleVerificationSuccess = () => {
    setView('selection');
  };

  // Función para ir al panel de administración (la llama VoterVerification en modo admin)
  const handleAdminVerificationSuccess = () => {
    setIsAdmin(true);
    setView('admin');
  };

  // --- 1. FUNCIÓN AGREGADA ---
  // Función para volver al inicio (la llama ElectionSelection)
  const handleGoBack = () => {
    setView('landing');
  };

  useEffect(() => {
    const stored = localStorage.getItem('isAdmin');
    if (stored === 'true') setIsAdmin(true);
  }, []);

  return <div className='min-h-screen flex flex-col bg-background'>
      
  {view === 'landing' ? (
        
        // --- VISTA "LANDING" (INICIO) ---
        <> 
          <Helmet>
            <title>Sistema de Votación Ciudadana del Perú</title>
            <meta name="description" content="Plataforma oficial para la emisión del voto electrónico en las elecciones del Perú. Verifique su identidad y participe de forma segura." />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet" />
          </Helmet>
          
          <Header onAdminOpen={() => {
              setView('admin-verification');
            }} />
          
          <main className='flex-grow'>
            <section id="inicio" className="relative flex items-center justify-center min-h-screen py-12 px-4 overflow-hidden">
              {/* Fondo con bandera del Perú */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Bandera del Perú */}
                <div 
                  className="absolute inset-0 z-0"
                  style={{
                    backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Peru.svg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    filter: 'brightness(0.7)'
                  }}
                ></div>
                {/* Overlay muy sutil para mantener legibilidad del texto */}
                <div className="absolute inset-0 z-10 bg-background/20"></div>
              </div>
              
              {/* Contenido principal */}
              <div className="relative z-20 w-full max-w-4xl mx-auto mt-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center space-y-6"
                >
                  <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 drop-shadow-2xl">
                    Sistema de Votación
                    <span className="block text-primary mt-2">Ciudadana del Perú</span>
                  </h1>
                  <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-2xl mx-auto leading-relaxed">
                    Participa de forma segura y transparente en las elecciones democráticas del Perú
                  </p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      onClick={() => setView('user-verification')}
                      className="h-14 px-10 text-lg font-bold bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/50 hover:shadow-primary/70 transition-all duration-300 transform hover:scale-105"
                      size="lg"
                    >
                      Iniciar Votación
                    </Button>
                  </motion.div>
                  
                </motion.div>
              </div>
            </section>

            <Section id="como-votar" title="¿Cómo Votar?">
              <div className="grid md:grid-cols-3 gap-8">
                <StepCard icon={Users} title="1. Verifica tu Identidad" description="Ingresa tu DNI en la sección principal para validar tus datos y confirmar que estás habilitado para votar." />
                <StepCard icon={CheckSquare} title="2. Elige tu Opción" description="Una vez dentro de la cabina de votación virtual, selecciona al candidato o la opción de tu preferencia." />
                <StepCard icon={Lock} title="3. Confirma y Emite tu Voto" description="Revisa tu selección y confirma. Tu voto será encriptado y registrado de forma anónima y segura." />
              </div>
            </Section>

            <Section id="informacion" title="Información del Proceso" className="bg-card/30">
              <div className="max-w-7xl mx-auto space-y-16">
                {/* Cronograma General */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-card/80 rounded-2xl p-8 md:p-12 border-2 border-primary/30 shadow-2xl"
                >
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Cronograma General</h3>
                  
                  {/* Timeline */}
                  <div className="relative">
                    <div className="absolute top-8 left-0 right-0 h-1 bg-primary/50 hidden md:block"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 relative">
                      {[
                        { date: '15 de mayo', title: 'Inicio de registro', icon: Calendar, color: 'bg-slate-600' },
                        { date: '22 de mayo', title: 'Inicio del votación', icon: Vote, color: 'bg-primary' },
                        { date: '30 de mayo', title: 'Cierre del proceso', icon: Lock, color: 'bg-slate-700' },
                        { date: '2 de junio', title: 'Cierre del Resultados finales', icon: TrendingUp, color: 'bg-indigo-600' }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="relative flex flex-col items-center text-center"
                        >
                          <div className={`${item.color} rounded-full p-4 mb-4 shadow-lg relative z-10`}>
                            <item.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                          </div>
                          <div className="bg-card/90 rounded-lg p-4 border border-primary/20 w-full">
                            <p className="text-primary font-bold text-sm md:text-base mb-1">{item.date}</p>
                            <p className="text-white text-xs md:text-sm">{item.title}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Etapas del Proceso */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Etapas del Proceso</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { 
                        title: 'Registro o verificación de identidad', 
                        description: 'Confirma tu identidad y accede al sistema.', 
                        icon: Search, 
                        color: 'bg-slate-600',
                        bgColor: 'bg-slate-600/20',
                        borderColor: 'border-slate-600/50'
                      },
                      { 
                        title: 'Emisión del voto', 
                        description: 'Elige tu opción dentro del sistema seguro.', 
                        icon: Vote, 
                        color: 'bg-slate-700',
                        bgColor: 'bg-slate-700/20',
                        borderColor: 'border-slate-700/50'
                      },
                      { 
                        title: 'Confirmación del voto', 
                        description: 'Revisa y valida tu elección.', 
                        icon: ClipboardCheck, 
                        color: 'bg-green-500',
                        bgColor: 'bg-green-500/20',
                        borderColor: 'border-green-500/50'
                      },
                      { 
                        title: 'Cierre y conteo', 
                        description: 'El sistema contabiliza automáticamente los votos.', 
                        icon: BarChart, 
                        color: 'bg-indigo-600',
                        bgColor: 'bg-indigo-600/20',
                        borderColor: 'border-indigo-600/50'
                      },
                      { 
                        title: 'Resultados finales', 
                        description: 'Se publican de manera transparente y verificable.', 
                        icon: Settings, 
                        color: 'bg-primary',
                        bgColor: 'bg-primary/20',
                        borderColor: 'border-primary/50'
                      }
                    ].map((stage, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className={`${stage.bgColor} rounded-xl p-6 border-2 ${stage.borderColor} shadow-xl hover:shadow-2xl transition-all duration-300`}
                      >
                        <div className={`${stage.color} rounded-lg p-3 w-fit mb-4`}>
                          <stage.icon className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="text-white font-bold text-lg mb-2">{stage.title}</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">{stage.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Tipos de Votación */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-card/80 rounded-2xl p-8 md:p-12 border-2 border-primary/30 shadow-2xl"
                >
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Tipos de Votación</h3>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      { 
                        title: 'Participación digital', 
                        description: 'Votación en línea desde dispositivos seguros.', 
                        icon: Hand, 
                        color: 'bg-indigo-600'
                      },
                      { 
                        title: 'Consulta ciudadana', 
                        description: 'Opinión pública sobre políticas o proyectos.', 
                        icon: BarChart, 
                        color: 'bg-slate-600'
                      },
                      { 
                        title: 'Elección local o interna', 
                        description: 'Procesos institucionales o comunales.', 
                        icon: Gavel, 
                        color: 'bg-indigo-600'
                      }
                    ].map((type, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center text-center"
                      >
                        <div className={`${type.color} rounded-full p-6 mb-4 shadow-lg`}>
                          <type.icon className="h-8 w-8 text-white" />
                        </div>
                        <h4 className="text-white font-bold text-lg mb-2">{type.title}</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">{type.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Reglas y Requisitos Básicos */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-card/80 rounded-2xl p-8 md:p-12 border-2 border-primary/30 shadow-2xl"
                >
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Reglas y Requisitos Básicos</h3>
                  <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                    {[
                      'Tener DNI vigente.',
                      'Ser mayor de 18 años.',
                      'Un solo voto por persona.',
                      'Respetar los términos y condiciones del proceso.'
                    ].map((requirement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-3 bg-card/50 rounded-lg p-4 border border-primary/20"
                      >
                        <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                        <p className="text-white text-sm md:text-base">{requirement}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </Section>

            <Section id="transparencia" title="Transparencia y Seguridad">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-6 text-gray-300"
                >
                  <p className="text-lg leading-relaxed">
                    La confianza es la base de la democracia. Este sistema utiliza tecnología de punta para garantizar 
                    la seguridad y transparencia de tu voto en las elecciones del Perú.
                  </p>
                  <ul className="space-y-5">
                    <li className="flex items-start p-4 bg-card/50 rounded-lg border border-primary/20">
                      <div className="bg-primary/20 p-2 rounded-lg mr-4 flex-shrink-0">
                        <Lock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <strong className="text-white text-lg block mb-1">Voto Encriptado</strong>
                        <span>Cada voto es cifrado de extremo a extremo, asegurando que solo pueda ser contado, no rastreado.</span>
                      </div>
                    </li>
                    <li className="flex items-start p-4 bg-card/50 rounded-lg border border-primary/20">
                      <div className="bg-primary/20 p-2 rounded-lg mr-4 flex-shrink-0">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <strong className="text-white text-lg block mb-1">Auditoría Pública</strong>
                        <span>El código y los procesos están abiertos a la supervisión de entidades civiles y académicas para garantizar la equidad.</span>
                      </div>
                    </li>
                    <li className="flex items-start p-4 bg-card/50 rounded-lg border border-primary/20">
                      <div className="bg-primary/20 p-2 rounded-lg mr-4 flex-shrink-0">
                        <BarChart className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <strong className="text-white text-lg block mb-1">Resultados Verificables</strong>
                        <span>Se publicarán registros anónimos que permiten a cualquiera verificar el conteo final sin comprometer la privacidad.</span>
                      </div>
                    </li>
                  </ul>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-primary/30">
                    <img 
                      className="w-full h-auto" 
                      alt="Diagrama de seguridad del voto electrónico" 
                      src="https://horizons-cdn.hostinger.com/faebab8c-5e00-4302-9124-6ab376c2b556/unnamed-HL4LM.png" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none"></div>
                  </div>
                </motion.div>
              </div>
            </Section>

            <Section id="noticias" title="Últimas Noticias" className="bg-card/30">
              <div className="grid md:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="bg-card/90 border-primary/30 hover:border-primary/50 transition-all duration-300 shadow-xl hover:shadow-2xl h-full">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <CardTitle className="text-white text-lg font-bold">Jornada Electoral Exitosa</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed">
                        La ONPE reporta una participación histórica en el primer día de votación electrónica en todo el territorio peruano.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="bg-card/90 border-primary/30 hover:border-primary/50 transition-all duration-300 shadow-xl hover:shadow-2xl h-full">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <CardTitle className="text-white text-lg font-bold">Medidas de Seguridad</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed">
                        Expertos internacionales validan la robustez del sistema de votación implementado para garantizar la transparencia electoral.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="bg-card/90 border-primary/30 hover:border-primary/50 transition-all duration-300 shadow-xl hover:shadow-2xl h-full">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <CardTitle className="text-white text-lg font-bold">Cierre de Votaciones</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed">
                        Recuerde que el proceso finaliza el 6 de noviembre a las 17:00. ¡Ejercite su derecho al voto y participe en la democracia peruana!
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </Section>
          </main>

          <Footer />

          <ScrollLink to="inicio" smooth={true} duration={500}>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/50 hover:shadow-primary/70 transition-all duration-300 z-40">
                <ArrowUp className="h-6 w-6" />
              </Button>
            </motion.div>
          </ScrollLink>
        </>
        // --- FIN: VISTA "LANDING" ---

      ) : view === 'user-verification' ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <VoterVerification 
            mode="user" 
            onVerificationSuccess={handleVerificationSuccess}
            onClose={() => setView('landing')}
          />
        </div>
      ) : view === 'admin-verification' ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <VoterVerification 
            mode="admin" 
            onVerificationSuccess={handleAdminVerificationSuccess}
            onClose={() => setView('landing')}
          />
        </div>
      ) : view === 'selection' ? (
        <ElectionSelection onGoBack={handleGoBack} />
      ) : view === 'admin' && isAdmin ? (
        <AdminLayout onLogout={() => { localStorage.removeItem('isAdmin'); setIsAdmin(false); setView('landing'); }} />
      ) : null}
    </div>;
}
export default App;
