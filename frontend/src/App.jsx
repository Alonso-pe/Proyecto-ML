import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { ArrowUp, CheckSquare, Lock, BarChart, FileText, Users, Calendar, Vote, ShieldCheck, TrendingUp, Search, ClipboardCheck, Settings, Hand, Gavel, CheckCircle2, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Section from '@/components/Section';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card.jsx';
import { Button } from '@/ui/button.jsx';

const VoterVerification = lazy(() => import('@/components/VoterVerification'));
const ElectionSelection = lazy(() => import('@/components/ElectionSelection'));
const AdminLayout = lazy(() => import('@/admin/AdminLayout'));

const LoadingScreen = () => (
  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
    <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
    <p className="text-lg font-medium text-muted-foreground animate-pulse">Cargando sistema...</p>
  </div>
);

// Tarjeta optimizada para ambos temas
const StepCard = ({ icon: Icon, title, description }) => (
  <div className="h-full">
    <Card className="bg-card/80 border-primary/20 text-center h-full hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 group">
      <CardHeader>
        <div className="mx-auto bg-primary/10 text-primary rounded-full h-20 w-20 flex items-center justify-center mb-4 border border-primary/30 shadow-inner group-hover:scale-110 transition-transform">
          <Icon className="h-10 w-10" />
        </div>
        {/* Título adaptable (Blanco suave en Dark, Oscuro en Light) */}
        <CardTitle className="text-xl md:text-2xl font-bold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  </div>
);

function App() {
  const [view, setView] = useState('landing');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleVerificationSuccess = () => setView('selection');
  const handleAdminVerificationSuccess = () => { setIsAdmin(true); setView('admin'); };
  const handleGoBack = () => setView('landing');

  useEffect(() => {
    const stored = localStorage.getItem('isAdmin');
    if (stored === 'true') setIsAdmin(true);
  }, []);

  if (view === 'selection') return <Suspense fallback={<LoadingScreen />}><ElectionSelection onGoBack={handleGoBack} /></Suspense>;
  if (view === 'admin' && isAdmin) return <Suspense fallback={<LoadingScreen />}><AdminLayout onLogout={() => { localStorage.removeItem('isAdmin'); setIsAdmin(false); setView('landing'); }} /></Suspense>;

  return (
    <div className='min-h-screen flex flex-col bg-background overflow-x-hidden selection:bg-primary/30 text-foreground'>
      
      {(view === 'user-verification' || view === 'admin-verification') && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md my-auto relative">
            <Suspense fallback={<LoadingScreen />}>
              <VoterVerification 
                mode={view === 'admin-verification' ? 'admin' : 'user'}
                onVerificationSuccess={view === 'admin-verification' ? handleAdminVerificationSuccess : handleVerificationSuccess}
                onClose={() => setView('landing')}
              />
            </Suspense>
          </div>
        </div>
      )}

      <Helmet>
        <title>Sistema de Votación Ciudadana del Perú</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </Helmet>
      
      <Header onAdminOpen={() => setView('admin-verification')} />
      
      <main className='flex-grow'>
        <section id="inicio" className="relative flex items-center justify-center min-h-[92vh] py-12 px-4 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div 
              className="absolute inset-0 z-0 opacity-25 dark:opacity-30 bg-cover bg-center"
              style={{
                backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Peru.svg)',
                transform: 'scale(1.05)'
              }}
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/90 via-background/70 to-background"></div>
          </div>
          
          <div className="relative z-20 w-full max-w-5xl mx-auto mt-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
                Votación
                <span className="block text-primary mt-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-amber-500 animate-soft-glow">
                  Ciudadana Perú
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground/90 max-w-3xl mx-auto leading-relaxed font-light">
                Plataforma oficial, segura y transparente para el ejercicio democrático.
              </p>
              
              <div className="pt-4">
                {/* Botón Principal adaptado */}
                <Button
                  onClick={() => setView('user-verification')}
                  className="h-16 px-12 text-xl font-bold rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105 active:scale-95 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Iniciar Votación
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <Section id="como-votar" title="¿Cómo Votar?">
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard icon={Users} title="1. Identifícate" description="Ingresa tu DNI para validar tus datos y confirmar que estás habilitado en el padrón electoral." />
            <StepCard icon={CheckSquare} title="2. Elige" description="Selecciona a tus candidatos preferidos en las cédulas virtuales interactivas." />
            <StepCard icon={Lock} title="3. Confirma" description="Tu voto es encriptado y enviado de forma anónima, segura e inmutable." />
          </div>
        </Section>

        <Section id="informacion" title="Cronograma Oficial" className="bg-secondary/20">
          <div className="max-w-6xl mx-auto space-y-16">
            
            <div className="bg-card/80 rounded-2xl p-8 md:p-12 border border-primary/20 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { date: '15 May', title: 'Inicio Registro', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  { date: '22 May', title: 'Día de Votación', icon: Vote, color: 'text-primary', bg: 'bg-primary/10' },
                  { date: '30 May', title: 'Cierre Proceso', icon: Lock, color: 'text-red-500', bg: 'bg-red-500/10' },
                  { date: '02 Jun', title: 'Resultados', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center group">
                    <div className={`${item.bg} ${item.color} rounded-full p-5 mb-4 shadow-md transition-transform group-hover:scale-110 border border-white/5`}>
                      <item.icon className="h-8 w-8" />
                    </div>
                    <div className="bg-background/50 rounded-xl p-4 w-full border border-border/50">
                      <p className={`font-bold text-lg mb-1 ${item.color}`}>{item.date}</p>
                      <p className="text-muted-foreground text-sm font-medium">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-center mb-10 text-foreground">Etapas del Proceso</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Verificación', desc: 'Validación biométrica y DNI.', icon: Search, color: 'text-blue-500' },
                  { title: 'Emisión', desc: 'Voto secreto y encriptado.', icon: Vote, color: 'text-primary' },
                  { title: 'Confirmación', desc: 'Validación de constancia.', icon: ClipboardCheck, color: 'text-green-500' },
                  { title: 'Conteo', desc: 'Escrutinio automatizado.', icon: BarChart, color: 'text-purple-500' },
                  { title: 'Resultados', desc: 'Publicación transparente.', icon: Settings, color: 'text-orange-500' }
                ].map((stage, i) => (
                  <div key={i} className="bg-card/60 rounded-xl p-6 border border-border hover:border-primary/30 transition-all hover:shadow-lg group">
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`p-2 rounded-lg bg-background border border-border group-hover:border-primary/30 ${stage.color}`}>
                        <stage.icon className="h-6 w-6" />
                      </div>
                      <h4 className="font-bold text-lg text-foreground">{stage.title}</h4>
                    </div>
                    <p className="text-muted-foreground text-sm pl-14">{stage.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto bg-card/40 p-8 rounded-2xl border border-dashed border-border">
              <h3 className="text-xl font-bold md:col-span-2 text-center mb-2 text-foreground">Requisitos Obligatorios</h3>
              {['DNI vigente (azul o electrónico).', 'Ser mayor de 18 años.', 'Figurar en el padrón electoral.', 'No tener multas electorales pendientes.'].map((req, i) => (
                <div key={i} className="flex items-center space-x-3 bg-background/50 p-3 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">{req}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="transparencia" title="Seguridad y Transparencia">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Utilizamos <strong>Blockchain</strong> y encriptación homomórfica para garantizar que tu voto sea matemáticamente imposible de alterar o rastrear hacia tu identidad.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Voto Secreto', desc: 'Desvinculación total entre identidad y elección.', icon: Lock },
                  { title: 'Código Abierto', desc: 'Software auditable por cualquier ciudadano.', icon: FileText },
                  { title: 'Inmutabilidad', desc: 'Registro distribuido imposible de modificar.', icon: ShieldCheck }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-card/50 border border-border hover:border-primary/40 transition-colors">
                    <div className="bg-primary/10 p-3 rounded-full h-fit text-primary">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-foreground">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-primary/20 group">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
              <img 
                src="https://horizons-cdn.hostinger.com/faebab8c-5e00-4302-9124-6ab376c2b556/unnamed-HL4LM.png" 
                alt="Esquema de Seguridad" 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
        </Section>

        <Section id="noticias" title="Actualidad Electoral" className="bg-card/20">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Jornada Histórica', desc: 'Récord de participación digital en las primeras 4 horas.' },
              { title: 'Auditoría Internacional', desc: 'Observadores de la OEA validan la integridad del sistema.' },
              { title: 'Cierre de Mesas', desc: 'El sistema cerrará puntualmente a las 17:00 hrs.' }
            ].map((news, i) => (
              <Card key={i} className="bg-card/80 border-primary/10 hover:border-primary/40 transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>
                    <p className="text-xs font-bold text-primary uppercase tracking-wider">En vivo</p>
                  </div>
                  <CardTitle className="text-lg font-bold text-foreground">{news.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{news.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      </main>

      <Footer />

      <ScrollLink to="inicio" smooth={true} duration={800} className="hidden md:block">
        <div className="fixed bottom-8 right-8 z-40">
          <Button className="h-14 w-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transition-all hover:scale-110">
            <ArrowUp className="h-6 w-6" />
          </Button>
        </div>
      </ScrollLink>
    </div>
  );
}

export default App;