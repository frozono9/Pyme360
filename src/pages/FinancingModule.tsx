import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ButtonCustom } from "@/components/ui/button-custom";
import { ArrowRight, CreditCard, Building, FileText, PieChart } from "lucide-react";

const FinancingModule = () => {
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
                Financiamiento <span className="text-pyme-blue">Inteligente</span>
              </h1>
              
              <p className="text-pyme-gray-dark text-lg">
                Evaluación crediticia alternativa y conexión automatizada con fuentes de 
                financiamiento adaptadas al perfil real de tu empresa.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link to="/credit-score" className="block">
                <FeatureCard 
                  icon={<CreditCard />}
                  title="AI Credit Score"
                  description="Evaluación crediticia basada en historial de pagos, cumplimiento fiscal y transacciones reales."
                />
              </Link>
              
              <Link to="/marketplace-financiamiento" className="block">
                <FeatureCard 
                  icon={<Building />}
                  title="Marketplace Financiero"
                  description="Conexión con bancos, plataformas de crowdfunding, inversionistas y programas gubernamentales."
                />
              </Link>
              
              <Link to="/preparacion-financiamiento" className="block">
                <FeatureCard 
                  icon={<FileText />}
                  title="Documentación Asistida"
                  description="Generación automatizada de planes de negocio y documentación financiera necesaria."
                />
              </Link>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-pyme-gray-light">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="mb-6">¿Cómo funciona?</h2>
              <p className="text-pyme-gray-dark text-lg">
                Nuestro sistema evalúa el desempeño real de tu empresa y te conecta con las 
                mejores opciones de financiamiento disponibles en el mercado.
              </p>
            </div>
            
            <div className="glass-card-strong max-w-4xl mx-auto p-8">
              <div className="space-y-8">
                <Step 
                  number={1}
                  title="Conecta tus fuentes de datos"
                  description="Integra tus cuentas bancarias, sistemas contables y de facturación para una evaluación completa."
                />
                
                <Step 
                  number={2}
                  title="Obtén tu AI Credit Score"
                  description="Nuestro algoritmo analiza tu historial de pagos, estabilidad financiera y cumplimiento regulatorio."
                />
                
                <Step 
                  number={3}
                  title="Explora opciones de financiamiento"
                  description="Recibe recomendaciones personalizadas según tu perfil y necesidades específicas."
                />
                
                <Step 
                  number={4}
                  title="Prepara tu solicitud"
                  description="Utiliza nuestras herramientas para generar la documentación necesaria y aumentar tus probabilidades de aprobación."
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <Link to="/credit-score">
                    <ButtonCustom 
                      variant="default" 
                      size="lg"
                      className="w-full"
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      AI Credit Score
                    </ButtonCustom>
                  </Link>
                  
                  <Link to="/marketplace-financiamiento">
                    <ButtonCustom 
                      variant="outline" 
                      size="lg"
                      className="w-full"
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      Marketplace Financiero
                    </ButtonCustom>
                  </Link>
                  
                  <Link to="/preparacion-financiamiento">
                    <ButtonCustom 
                      variant="outline" 
                      size="lg"
                      className="w-full"
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      Preparación Documentos
                    </ButtonCustom>
                  </Link>
                </div>
              </div>
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

interface StepProps {
  number: number;
  title: string;
  description: string;
}

const Step = ({ number, title, description }: StepProps) => {
  return (
    <div className="flex">
      <div className="relative mr-6">
        <div className="w-12 h-12 rounded-full bg-pyme-blue text-white flex items-center justify-center text-lg font-bold">
          {number}
        </div>
        {number < 4 && (
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-14 bg-pyme-blue/20"></div>
        )}
      </div>
      <div className="flex-1 pt-2">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-pyme-gray-dark">{description}</p>
      </div>
    </div>
  );
};

export default FinancingModule;
