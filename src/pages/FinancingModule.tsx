
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ButtonCustom } from "@/components/ui/button-custom";
import { ArrowRight, CreditCard, Building, FileText, PieChart, BarChart, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const FinancingModule = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="pt-24 pb-16 relative bg-gradient-to-b from-white to-pyme-gray-light overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-bl from-pyme-blue/10 to-transparent blur-3xl"></div>
            <div className="absolute bottom-[10%] left-[5%] w-[30%] h-[30%] rounded-full bg-gradient-to-tr from-pyme-success/5 to-transparent blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto container-padding relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-up">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-pyme-blue bg-pyme-blue/10 border border-pyme-blue/20 mb-4">
                Módulo de PyME360
              </div>
              
              <h1 className="mb-4 text-balance">
                Financiamiento <span className="text-pyme-blue">Inteligente</span>
              </h1>
              
              <p className="text-pyme-gray-dark text-lg">
                Evaluación crediticia alternativa y conexión automatizada con fuentes de 
                financiamiento adaptadas al perfil real de tu empresa.
              </p>
            </div>
            
            {/* Mini Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10 mb-10 max-w-5xl mx-auto">
              <DashboardCard 
                icon={<Award className="h-10 w-10 text-pyme-blue" />}
                title="AI Credit Score"
                description="Evaluación crediticia basada en datos reales de tu empresa"
                linkTo="/credit-score"
                metrics={[
                  { label: "Puntuación Media", value: "720" },
                  { label: "Mejora Potencial", value: "+85 pts" }
                ]}
              />
              
              <DashboardCard 
                icon={<Building className="h-10 w-10 text-pyme-success" />}
                title="Marketplace Financiero"
                description="Opciones de financiamiento personalizadas"
                linkTo="/marketplace-financiamiento"
                metrics={[
                  { label: "Opciones Disponibles", value: "12+" },
                  { label: "Tasa Promedio", value: "9.4%" }
                ]}
              />
              
              <DashboardCard 
                icon={<FileText className="h-10 w-10 text-pyme-warning" />}
                title="Preparación de Documentos"
                description="Documentación asistida para solicitudes"
                linkTo="/preparacion-financiamiento"
                metrics={[
                  { label: "Tiempo de Preparación", value: "-60%" },
                  { label: "Tasa de Aprobación", value: "+35%" }
                ]}
              />
            </div>
          </div>
        </section>
        
        {/* How it works section */}
        <section className="py-16 bg-white">
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

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkTo: string;
  metrics: { label: string; value: string }[];
}

const DashboardCard = ({ icon, title, description, linkTo, metrics }: DashboardCardProps) => {
  return (
    <Card className="overflow-hidden border-none shadow-elevation hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-white to-pyme-gray-light pb-0">
        <div className="flex items-center gap-4 mb-3">
          <div className="rounded-full p-2 bg-white shadow-subtle">
            {icon}
          </div>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
        </div>
        <CardDescription className="text-pyme-gray-dark mb-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-between mb-4">
          {metrics.map((metric, idx) => (
            <div key={idx} className="text-center">
              <div className="text-lg font-bold text-pyme-blue">{metric.value}</div>
              <div className="text-xs text-pyme-gray">{metric.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-pyme-gray-light pt-3">
        <Link to={linkTo} className="w-full">
          <ButtonCustom 
            variant="default" 
            size="default"
            className="w-full"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Ver detalles
          </ButtonCustom>
        </Link>
      </CardFooter>
    </Card>
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
