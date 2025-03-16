
import { useState, useEffect } from 'react';
import { ArrowRight, BarChart2, Shield, LineChart, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-pyme-gray-light">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] w-[50%] h-[60%] rounded-full bg-gradient-to-br from-pyme-blue/10 to-transparent blur-3xl"></div>
        <div className="absolute top-[10%] right-[5%] w-[30%] h-[30%] rounded-full bg-gradient-to-bl from-pyme-blue-light/10 to-transparent blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-pyme-success/5 to-transparent blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 z-10">
            <div 
              className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm text-pyme-blue bg-pyme-blue/10 border border-pyme-blue/20 mb-6">
                <span className="font-medium">Impulsando PyMEs con IA</span>
              </div>
            </div>
            
            <h1 
              className={`font-bold text-balance mb-6 transition-all duration-700 delay-100 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              Empoderando a las <span className="text-pyme-blue">PyMEs</span> de América Latina
            </h1>
            
            <p 
              className={`text-lg md:text-xl text-pyme-gray-dark text-balance mb-8 transition-all duration-700 delay-200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              Una plataforma integral con IA que transforma la manera en que las PyMEs operan, 
              financian y expanden sus negocios, creando un ecosistema empresarial más 
              transparente, eficiente y sostenible.
            </p>
            
            <div 
              className={`flex flex-col sm:flex-row gap-4 mb-12 transition-all duration-700 delay-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <Link 
                to="/registro" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-pyme-blue to-pyme-blue-light shadow-md hover:shadow-lg hover:from-pyme-blue-dark hover:to-pyme-blue transform hover:-translate-y-0.5 transition-all"
              >
                Comenzar ahora <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link 
                to="/registro" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-pyme-gray-dark bg-white border border-pyme-gray-light hover:border-pyme-blue/20 hover:text-pyme-blue shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all"
              >
                Conocer más
              </Link>
            </div>
            
            <div 
              className={`flex flex-wrap gap-6 transition-all duration-700 delay-400 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-pyme-success/10 text-pyme-success">
                  <BarChart2 className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium">+90% <span className="font-normal text-pyme-gray">de PyMEs en LatAm</span></p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-pyme-blue/10 text-pyme-blue">
                  <Shield className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium">Certificación <span className="font-normal text-pyme-gray">PyME360 Trust</span></p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-pyme-warning/10 text-pyme-warning">
                  <LineChart className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium">IA <span className="font-normal text-pyme-gray">para tu crecimiento</span></p>
              </div>
            </div>
          </div>
          
          <div 
            className={`flex-1 z-10 transition-all duration-1000 delay-300 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}
          >
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pyme-blue to-pyme-blue-light rounded-2xl blur-sm opacity-30 animate-pulse-soft"></div>
              <div className="glass-card-strong p-5 relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">PyME360 Dashboard</h3>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 rounded-full bg-pyme-danger"></div>
                    <div className="w-3 h-3 rounded-full bg-pyme-warning"></div>
                    <div className="w-3 h-3 rounded-full bg-pyme-success"></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-pyme-gray-light/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">Trust Score</h4>
                      <span className="text-xs px-2 py-0.5 bg-pyme-success/20 text-pyme-success rounded-full">Oro</span>
                    </div>
                    <div className="w-full h-2 bg-pyme-gray-light rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-gradient-to-r from-pyme-blue to-pyme-success rounded-full"></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-pyme-gray">0</span>
                      <span className="text-xs text-pyme-gray">100</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <DashboardCard 
                      title="Financiación" 
                      value="$25,000" 
                      change="+15%" 
                      icon={BarChart2}
                      positive={true}
                    />
                    <DashboardCard 
                      title="Flujo de Caja" 
                      value="$8,540" 
                      change="+12%" 
                      icon={LineChart}
                      positive={true}
                    />
                  </div>
                  
                  <div className="bg-pyme-gray-light/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-3">Cumplimiento Regulatorio</h4>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Documentos Fiscales</span>
                        <span className="text-xs text-pyme-success">100%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Declaraciones</span>
                        <span className="text-xs text-pyme-success">100%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Permisos Locales</span>
                        <span className="text-xs text-pyme-warning">90%</span>
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    to="/registro" 
                    className="w-full py-2 rounded-lg bg-pyme-blue hover:bg-pyme-blue-dark text-white text-sm font-medium transition-colors flex justify-center"
                  >
                    Ver Dashboard Completo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  positive: boolean;
}

const DashboardCard = ({ title, value, change, icon: Icon, positive }: DashboardCardProps) => {
  return (
    <div className="bg-white rounded-lg p-3 shadow-subtle">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-pyme-gray mb-1">{title}</p>
          <p className="text-base font-semibold">{value}</p>
        </div>
        <div className={`p-2 rounded-full ${positive ? 'bg-pyme-success/10' : 'bg-pyme-danger/10'}`}>
          <Icon className={`h-4 w-4 ${positive ? 'text-pyme-success' : 'text-pyme-danger'}`} />
        </div>
      </div>
      <div className={`text-xs ${positive ? 'text-pyme-success' : 'text-pyme-danger'} mt-2`}>
        {change} vs. mes anterior
      </div>
    </div>
  );
};

export default Hero;
