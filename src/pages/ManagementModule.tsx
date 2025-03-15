
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ButtonCustom } from "@/components/ui/button-custom";
import { ArrowRight, BarChart2, Users, Bot, AreaChart } from "lucide-react";

const ManagementModule = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="pt-32 pb-20 relative bg-gradient-to-b from-white to-pyme-gray-light overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-bl from-pyme-blue/10 to-transparent blur-3xl"></div>
            <div className="absolute bottom-[10%] left-[5%] w-[30%] h-[30%] rounded-full bg-gradient-to-tr from-pyme-success/5 to-transparent blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto container-padding relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-pyme-blue bg-pyme-blue/10 border border-pyme-blue/20 mb-4">
                Módulo de PyME360
              </div>
              
              <h1 className="mb-6 text-balance">
                Gestión <span className="text-pyme-blue">Empresarial</span>
              </h1>
              
              <p className="text-pyme-gray-dark text-lg">
                Plataforma integrada para administrar todos los aspectos de tu negocio con 
                asistencia de IA que te ayuda a tomar mejores decisiones.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={<BarChart2 />}
                title="ERP Simplificado"
                description="Gestión de ventas, inventario, contabilidad y presupuestos en una sola plataforma intuitiva."
              />
              
              <FeatureCard 
                icon={<Users />}
                title="Recursos Humanos"
                description="Administración de personal, nómina, asistencia y desempeño con procesos automatizados."
              />
              
              <FeatureCard 
                icon={<Bot />}
                title="Asistente Virtual"
                description="Chatbot especializado en gestión empresarial para resolver dudas y recibir recomendaciones."
              />
              
              <FeatureCard 
                icon={<AreaChart />}
                title="Dashboard Inteligente"
                description="Visualización de KPIs críticos y análisis predictivo para identificar tendencias y oportunidades."
              />
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-pyme-gray-light">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="mb-6">Beneficios Clave</h2>
              <p className="text-pyme-gray-dark text-lg">
                Nuestro sistema de gestión empresarial está diseñado para simplificar la operación 
                diaria de tu PyME y potenciar su crecimiento.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <BenefitCard 
                title="Toma de Decisiones Basada en Datos"
                description="Accede a informes y análisis en tiempo real para fundamentar tus decisiones estratégicas."
              />
              
              <BenefitCard 
                title="Reducción de Tareas Administrativas"
                description="Automatiza procesos rutinarios para que puedas enfocarte en lo que realmente importa."
              />
              
              <BenefitCard 
                title="Visión Integral del Negocio"
                description="Obtén una perspectiva completa de tu empresa con información centralizada y actualizada."
              />
              
              <BenefitCard 
                title="Mejora Continua"
                description="Recibe recomendaciones personalizadas para optimizar cada área de tu negocio."
              />
            </div>
            
            <div className="text-center mt-12">
              <ButtonCustom 
                variant="default" 
                size="lg"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Solicitar Demo
              </ButtonCustom>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="glass-card p-6 hover:shadow-elevation transition-all duration-300">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pyme-blue/10 text-pyme-blue mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-pyme-gray-dark">{description}</p>
    </div>
  );
};

interface BenefitCardProps {
  title: string;
  description: string;
}

const BenefitCard = ({ title, description }: BenefitCardProps) => {
  return (
    <div className="glass-card p-6 hover:shadow-elevation transition-all duration-300">
      <div className="w-10 h-10 rounded-full bg-pyme-success/10 text-pyme-success flex items-center justify-center mb-4">
        <div className="w-3 h-3 rounded-full bg-pyme-success"></div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-pyme-gray-dark">{description}</p>
    </div>
  );
};

export default ManagementModule;
