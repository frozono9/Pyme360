
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CreditCard, BarChart2, ShieldCheck, TrendingUp, PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const ModulesSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll('.reveal-on-scroll');
            elements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add('is-revealed');
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const modules = [
    {
      id: 'financiamiento',
      title: 'Financiamiento Inteligente',
      icon: <CreditCard className="h-5 w-5" />,
      route: '/financiamiento',
      description: 'Sistema de evaluación crediticia alternativa basado en el desempeño real de tu negocio. Conexión con fuentes de financiamiento adaptadas a tu perfil.',
      features: [
        'AI Credit Score que evalúa el desempeño integral',
        'Marketplace con distintas opciones de financiamiento',
        'Herramientas para preparar documentación financiera',
        'Simulación de escenarios de financiamiento'
      ],
      image: './assets/financing-module.png'
    },
    {
      id: 'gestion',
      title: 'Gestión Empresarial',
      icon: <BarChart2 className="h-5 w-5" />,
      route: '/gestion',
      description: 'Plataforma integrada para administrar todos los aspectos de tu negocio con asistencia de IA que te ayuda a tomar mejores decisiones.',
      features: [
        'ERP simplificado con gestión de ventas e inventario',
        'Administración de recursos humanos',
        'Asistente virtual para consultas empresariales',
        'Dashboard con KPIs críticos y análisis predictivo'
      ],
      image: './assets/management-module.png'
    },
    {
      id: 'cumplimiento',
      title: 'Cumplimiento Regulatorio',
      icon: <ShieldCheck className="h-5 w-5" />,
      route: '/cumplimiento',
      description: 'Automatización del seguimiento y cumplimiento de obligaciones fiscales, laborales y administrativas según la normativa de tu país.',
      features: [
        'Calendario de obligaciones fiscales y laborales',
        'Generación automática de documentos legales',
        'Base de conocimiento de regulaciones por país',
        'Digitalización de procesos gubernamentales'
      ],
      image: './assets/compliance-module.png'
    },
    {
      id: 'crecimiento',
      title: 'Crecimiento y Escalabilidad',
      icon: <TrendingUp className="h-5 w-5" />,
      route: '/crecimiento',
      description: 'Herramientas de análisis de mercado y oportunidades de expansión, con capacitación personalizada para potenciar tu crecimiento.',
      features: [
        'Identificación de oportunidades con IA',
        'Análisis de competencia y tendencias',
        'Cursos adaptados al perfil de tu empresa',
        'Networking con proveedores y clientes potenciales'
      ],
      image: './assets/growth-module.png'
    },
    {
      id: 'financiera',
      title: 'Gestión Financiera',
      icon: <PieChart className="h-5 w-5" />,
      route: '/financiera',
      description: 'Control en tiempo real de tus finanzas con proyecciones y alertas que te ayudan a mantener un flujo de caja saludable.',
      features: [
        'Seguimiento de ingresos y gastos en tiempo real',
        'Proyecciones de liquidez y alertas tempranas',
        'Categorización automática de transacciones',
        'Planificación financiera con escenarios de simulación'
      ],
      image: './assets/financial-module.png'
    }
  ];

  return (
    <div ref={sectionRef} className="bg-white section-padding">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="reveal-on-scroll">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-pyme-blue bg-pyme-blue/10 border border-pyme-blue/20 mb-4">
              Componentes Principales
            </div>
          </div>
          
          <h2 className="reveal-on-scroll mb-6 text-balance">
            Una solución integral para cada área de tu PyME
          </h2>
          
          <p className="reveal-on-scroll text-pyme-gray-dark text-lg">
            Explora los cinco módulos especializados de PyME360, diseñados para abordar los desafíos 
            específicos de las pequeñas y medianas empresas en América Latina.
          </p>
        </div>

        <div className="reveal-on-scroll">
          <div className="flex overflow-x-auto hide-scrollbar pb-4 mb-8">
            <div className="flex space-x-2">
              {modules.map((module, index) => (
                <button
                  key={module.id}
                  className={`flex items-center whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === index 
                      ? 'bg-pyme-blue text-white shadow-md' 
                      : 'bg-pyme-gray-light text-pyme-gray-dark hover:bg-pyme-blue/10 hover:text-pyme-blue'
                  }`}
                  onClick={() => setActiveTab(index)}
                >
                  <span className="mr-2">{module.icon}</span>
                  {module.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card-strong">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <h3 className="text-2xl font-semibold mb-4">{modules[activeTab].title}</h3>
              <p className="text-pyme-gray-dark mb-8">{modules[activeTab].description}</p>
              
              <div className="space-y-4 mb-8">
                {modules[activeTab].features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="rounded-full w-6 h-6 flex items-center justify-center bg-pyme-blue/10 text-pyme-blue mt-0.5 mr-3">
                      <div className="w-2 h-2 rounded-full bg-pyme-blue"></div>
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <Link 
                to={modules[activeTab].route}
                className="inline-flex items-center px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-pyme-blue to-pyme-blue-light shadow-md hover:shadow-lg hover:from-pyme-blue-dark hover:to-pyme-blue transform hover:-translate-y-0.5 transition-all"
              >
                Explorar {modules[activeTab].title} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-pyme-blue/10 to-pyme-blue-light/5 rounded-b-xl lg:rounded-r-xl lg:rounded-bl-none p-8 lg:p-12 flex items-center justify-center">
              <div className="glass-card p-6 max-w-md w-full">
                <div className="aspect-video bg-pyme-gray-light/50 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-pyme-gray">Vista previa del módulo</div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 bg-pyme-gray-light/50 rounded-full w-4/5"></div>
                  <div className="h-2 bg-pyme-gray-light/50 rounded-full"></div>
                  <div className="h-2 bg-pyme-gray-light/50 rounded-full w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulesSection;
