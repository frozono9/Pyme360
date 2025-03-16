import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CreditCard, BarChart2, ShieldCheck, TrendingUp, Search, FileText, Building, Users } from 'lucide-react';
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
      route: '/registro',
      description: 'Evaluación crediticia alternativa y conexión automatizada con fuentes de financiamiento adaptadas al perfil real de tu empresa.',
      features: [
        'AI Credit Score con evaluación integral',
        'Marketplace de financiamiento con diversas opciones',
        'Preparación para financiamiento con documentación asistida'
      ],
      image: './assets/financing-module.png',
      submodules: [
        { 
          name: "Credit Score", 
          description: "Evaluación crediticia basada en desempeño real de tu negocio", 
          route: "/registro" 
        },
        { 
          name: "Marketplace de Financiamiento", 
          description: "Conexión con múltiples fuentes de capital", 
          route: "/registro" 
        },
        { 
          name: "Preparación para Financiamiento", 
          description: "Generación de documentación necesaria", 
          route: "/registro" 
        }
      ]
    },
    {
      id: 'gestion',
      title: 'Gestión Empresarial y Financiera',
      icon: <BarChart2 className="h-5 w-5" />,
      route: '/registro',
      description: 'Plataforma integrada para administrar todos los aspectos de tu negocio con asistencia de IA que te ayuda a tomar mejores decisiones.',
      features: [
        'ERP simplificado con IA para control operativo',
        'Dashboard de inteligencia empresarial con alertas',
        'Herramientas para búsqueda y gestión de empleados'
      ],
      image: './assets/management-module.png',
      submodules: [
        { 
          name: "ERP Simplificado con IA", 
          description: "Gestión integral de recursos empresariales", 
          route: "/registro" 
        },
        { 
          name: "Dashboard Inteligente", 
          description: "Visualización de KPIs y análisis de tendencias", 
          route: "/registro" 
        },
        { 
          name: "Búsqueda de Empleados", 
          description: "Herramientas para reclutar y gestionar talento", 
          route: "/registro" 
        }
      ]
    },
    {
      id: 'cumplimiento',
      title: 'Cumplimiento Regulatorio',
      icon: <ShieldCheck className="h-5 w-5" />,
      route: '/registro',
      description: 'Automatización del seguimiento y cumplimiento de obligaciones fiscales, laborales y administrativas según la normativa de tu país.',
      features: [
        'Automatización de conformidad regulatoria',
        'Centro de recursos legales personalizados',
        'Gestión digital de trámites gubernamentales'
      ],
      image: './assets/compliance-module.png',
      submodules: [
        { 
          name: "Automatización de Conformidad", 
          description: "Calendario de obligaciones y generación de documentos legales", 
          route: "/registro" 
        },
        { 
          name: "Centro de Recursos Legales", 
          description: "Base de conocimiento de regulaciones por país", 
          route: "/registro" 
        },
        { 
          name: "Gestión de Trámites", 
          description: "Seguimiento y digitalización de procesos gubernamentales", 
          route: "/registro" 
        }
      ]
    },
    {
      id: 'crecimiento',
      title: 'Crecimiento y Escalabilidad',
      icon: <TrendingUp className="h-5 w-5" />,
      route: '/registro',
      description: 'Herramientas de análisis de mercado y oportunidades de expansión, con capacitación personalizada para potenciar tu crecimiento.',
      features: [
        'Análisis de mercado impulsado por IA',
        'Estrategias para expansión y nuevos mercados',
        'Optimización de operaciones y recursos'
      ],
      image: './assets/growth-module.png',
      submodules: [
        { 
          name: "Análisis de Mercado con IA", 
          description: "Identificación de tendencias y oportunidades", 
          route: "/registro" 
        },
        { 
          name: "Estrategias de Expansión", 
          description: "Análisis de nuevos mercados y viabilidad", 
          route: "/registro" 
        },
        { 
          name: "Optimización de Operaciones", 
          description: "Automatización de procesos y gestión eficiente", 
          route: "/registro" 
        }
      ]
    },
    {
      id: 'empleados',
      title: 'Búsqueda de Empleados',
      icon: <Users className="h-5 w-5" />,
      route: '/registro',
      description: 'Encuentra y contrata al talento perfecto para tu empresa con nuestra plataforma especializada de reclutamiento y selección.',
      features: [
        'Búsqueda inteligente de candidatos',
        'Gestión de procesos de contratación',
        'Verificación de referencias automatizada'
      ],
      image: './assets/employees-module.png',
      submodules: [
        { 
          name: "Búsqueda de Talento", 
          description: "Encontrar candidatos que se ajusten a tus necesidades", 
          route: "/registro" 
        },
        { 
          name: "Gestión de Entrevistas", 
          description: "Organización y seguimiento del proceso de selección", 
          route: "/registro" 
        },
        { 
          name: "Verificación de Candidatos", 
          description: "Validación de credenciales y referencias", 
          route: "/registro" 
        }
      ]
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
            Explora los cuatro módulos especializados de PyME360, diseñados para abordar los desafíos 
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
                to="/registro"
                className="inline-flex items-center px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-pyme-blue to-pyme-blue-light shadow-md hover:shadow-lg hover:from-pyme-blue-dark hover:to-pyme-blue transform hover:-translate-y-0.5 transition-all"
              >
                Explorar {modules[activeTab].title} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-pyme-blue/10 to-pyme-blue-light/5 rounded-b-xl lg:rounded-r-xl lg:rounded-bl-none p-8 lg:p-12">
              <div className="space-y-6">
                {modules[activeTab].submodules.map((submodule, index) => (
                  <Link 
                    key={index}
                    to="/registro"
                    className="glass-card p-5 block hover:shadow-elevation transition-all duration-300"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-pyme-blue/10 text-pyme-blue flex items-center justify-center mr-4">
                        {index === 0 ? <CreditCard className="h-5 w-5" /> : 
                         index === 1 ? <Building className="h-5 w-5" /> : 
                         <FileText className="h-5 w-5" />}
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">{submodule.name}</h4>
                        <p className="text-sm text-pyme-gray-dark">{submodule.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 ml-auto text-pyme-blue" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulesSection;
