// App.jsx (Conectado)

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { ArrowUp, CheckSquare, Lock, BarChart, FileText, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VoterVerification from '@/components/VoterVerification';
import Section from '@/components/Section';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card.jsx';
import { Button } from '@/ui/button.jsx';
import ElectionSelection from '@/components/ElectionSelection'; 

const StepCard = ({
  icon: Icon,
  title,
  description
}) => <Card className="bg-card/70 border-white/20 text-center h-full">
    <CardHeader>
      <div className="mx-auto bg-primary/20 text-primary rounded-full h-16 w-16 flex items-center justify-center mb-4">
        <Icon className="h-8 w-8" />
      </div>
      <CardTitle className="text-xl text-white">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-300">{description}</p>
    </CardContent>
  </Card>;

function App() {
  
  const [view, setView] = useState('landing');

  // Función para ir a la selección (la llama VoterVerification)
  const handleVerificationSuccess = () => {
    setView('selection');
  };

  // --- 1. FUNCIÓN AGREGADA ---
  // Función para volver al inicio (la llama ElectionSelection)
  const handleGoBack = () => {
    setView('landing');
  };

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
          
          <Header />
          
          <main className='flex-grow'>
            <section id="inicio" className="relative flex items-center justify-center min-h-screen py-20 px-4">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-background opacity-80 z-10"></div>
                <img className="w-full h-full object-cover" alt="Bandera de Perú ondeando" src="https://images.unsplash.com/photo-1605652601823-3ac5bf692980" />
              </div>
              <div className="relative z-20 w-full">
                
                {/* Esta conexión ya estaba correcta */}
                <VoterVerification onVerificationSuccess={handleVerificationSuccess} />

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
              <div className="max-w-4xl mx-auto text-center text-gray-300 space-y-8">
                <p>Conoce cómo se desarrolla el proceso de votación ciudadana: desde el registro hasta la publicación de resultados. Aquí te mostramos cada etapa de forma clara y transparente.</p>
                <img className="w-full h-auto rounded-lg shadow-lg" alt="Cronograma electoral" src="https://horizons-cdn.hostinger.com/faebab8c-5e00-4302-9124-6ab376c2b556/unnamed-XbAHN.jpg" />
              </div>
            </Section>

            <Section id="transparencia" title="Transparencia y Seguridad">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6 text-gray-300">
                  <p>La confianza es la base de la democracia. Este sistema utiliza tecnología de punta para garantizar la seguridad y transparencia de tu voto.</p>
                  <ul className="space-y-4">
                    <li className="flex items-start"><Lock className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" /><span><strong>Voto Encriptado:</strong> Cada voto es cifrado de extremo a extremo, asegurando que solo pueda ser contado, no rastreado.</span></li>
                    <li className="flex items-start"><FileText className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" /><span><strong>Auditoría Pública:</strong> El código y los procesos están abiertos a la supervisión de entidades civiles y académicas para garantizar la equidad.</span></li>
                    <li className="flex items-start"><BarChart className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" /><span><strong>Resultados Verificables:</strong> Se publicarán registros anónimos que permiten a cualquiera verificar el conteo final sin comprometer la privacidad.</span></li>
                  </ul>
                </div>
                <div>
                  <img className="w-full h-auto rounded-lg shadow-lg" alt="Diagrama de seguridad del voto" src="https://horizons-cdn.hostinger.com/faebab8c-5e00-4302-9124-6ab376c2b556/unnamed-HL4LM.png" />
                </div>
              </div>
            </Section>

            <Section id="noticias" title="Últimas Noticias" className="bg-card/30">
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="bg-card border-white/20">
                  <CardHeader><CardTitle className="text-white">Jornada Electoral Exitosa</CardTitle></CardHeader>
                  <CardContent><p className="text-gray-300">La ONPE reporta una participación histórica en el primer día de votación electrónica.</p></CardContent>
                </Card>
                <Card className="bg-card border-white/20">
                  <CardHeader><CardTitle className="text-white">Medidas de Seguridad</CardTitle></CardHeader>
                  <CardContent><p className="text-gray-300">Expertos internacionales validan la robustez del sistema de votación implementado.</p></CardContent>
                </Card>
                <Card className="bg-card border-white/20">
                  <CardHeader><CardTitle className="text-white">Cierre de Votaciones</CardTitle></CardHeader>
                  <CardContent><p className="text-gray-300">Recuerde que el proceso finaliza el 6 de noviembre a las 17:00. ¡No espere al último momento!</p></CardContent>
                </Card>
              </div>
            </Section>
          </main>

          <Footer />

          <ScrollLink to="inicio" smooth={true} duration={500}>
            <Button className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg">
              <ArrowUp className="h-6 w-6" />
            </Button>
          </ScrollLink>
        </>
        // --- FIN: VISTA "LANDING" ---

      ) : (
        
        // --- 2. LÍNEA MODIFICADA ---
        // Ahora se le pasa la función 'onGoBack'
        <ElectionSelection onGoBack={handleGoBack} />

      )}
    </div>;
}
export default App;