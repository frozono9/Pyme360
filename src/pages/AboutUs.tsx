
import React from 'react';
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Spacer div to prevent content from being hidden under the fixed navbar */}
      <div className="h-16"></div>
      
      <main className="flex-1 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pyme-blue to-pyme-blue-light mb-4">
              Nosotros
            </h1>
            <p className="text-xl text-pyme-gray-dark max-w-3xl mx-auto">
              Conoce al equipo detrás de PyME360: Porks in París
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {/* Team Member 1 */}
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-pyme-blue/20 to-pyme-blue-light/20 flex items-center justify-center mb-4">
                <span className="text-5xl">🐷</span>
              </div>
              <h3 className="text-xl font-bold text-pyme-navy">Napoleón</h3>
              <p className="text-pyme-gray text-center mt-2">CEO & Fundador</p>
              <p className="text-pyme-gray-dark text-center mt-4 text-sm">
                Experto en estrategia empresarial y visión de futuro para PyMEs.
              </p>
            </div>
            
            {/* Team Member 2 */}
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-pyme-blue/20 to-pyme-blue-light/20 flex items-center justify-center mb-4">
                <span className="text-5xl">🐷</span>
              </div>
              <h3 className="text-xl font-bold text-pyme-navy">Porcinette</h3>
              <p className="text-pyme-gray text-center mt-2">CFO</p>
              <p className="text-pyme-gray-dark text-center mt-4 text-sm">
                Especialista en finanzas y optimización fiscal para pequeños negocios.
              </p>
            </div>
            
            {/* Team Member 3 */}
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-pyme-blue/20 to-pyme-blue-light/20 flex items-center justify-center mb-4">
                <span className="text-5xl">🐷</span>
              </div>
              <h3 className="text-xl font-bold text-pyme-navy">Jamón</h3>
              <p className="text-pyme-gray text-center mt-2">CTO</p>
              <p className="text-pyme-gray-dark text-center mt-4 text-sm">
                Genio tecnológico responsable de nuestra plataforma innovadora.
              </p>
            </div>
            
            {/* Team Member 4 */}
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-pyme-blue/20 to-pyme-blue-light/20 flex items-center justify-center mb-4">
                <span className="text-5xl">🐷</span>
              </div>
              <h3 className="text-xl font-bold text-pyme-navy">Tocino</h3>
              <p className="text-pyme-gray text-center mt-2">COO</p>
              <p className="text-pyme-gray-dark text-center mt-4 text-sm">
                Experto en operaciones y procesos eficientes para empresas en crecimiento.
              </p>
            </div>
          </div>
          
          <div className="mt-20">
            <div className={cn(
              "p-8 rounded-2xl",
              "bg-gradient-to-br from-white to-pyme-gray-light",
              "border border-pyme-gray-light shadow-subtle"
            )}>
              <h2 className="text-2xl font-bold text-pyme-navy mb-4">Nuestra Historia</h2>
              <p className="text-pyme-gray-dark mb-4">
                Porks in París nació en 2020 cuando cuatro amigos cerditos con experiencia en diferentes áreas de negocio decidieron unir fuerzas para crear una solución integral que ayudara a las pequeñas y medianas empresas a prosperar en un mercado cada vez más competitivo.
              </p>
              <p className="text-pyme-gray-dark mb-4">
                Tras experimentar de primera mano los desafíos que enfrentan las PyMEs, desarrollamos PyME360: una plataforma todo en uno que simplifica la gestión empresarial, el cumplimiento regulatorio y el acceso a financiamiento.
              </p>
              <p className="text-pyme-gray-dark">
                Hoy, nuestro equipo sigue creciendo, pero mantenemos la misma misión: empoderar a las pequeñas empresas con herramientas accesibles y efectivas para que puedan concentrarse en lo que mejor saben hacer: ¡crear valor y crecer!
              </p>
            </div>
            
            <div className="mt-12 text-center">
              <h2 className="text-2xl font-bold text-pyme-navy mb-4">Nuestra Misión</h2>
              <p className="text-pyme-gray-dark max-w-3xl mx-auto">
                Transformar la manera en que las PyMEs gestionan sus negocios, proporcionando soluciones integrales que simplifiquen procesos, optimicen recursos y maximicen oportunidades de crecimiento.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
