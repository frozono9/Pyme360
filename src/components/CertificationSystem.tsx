
import { useEffect, useRef } from 'react';
import { Shield, Medal, Award, CrownIcon } from 'lucide-react';

const CertificationSystem = () => {
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

  return (
    <div ref={sectionRef} className="relative bg-pyme-gray-light section-padding overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-[20%] left-[5%] w-[35%] h-[35%] rounded-full bg-gradient-to-br from-pyme-blue/5 to-transparent blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tl from-pyme-success/5 to-transparent blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto container-padding relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="reveal-on-scroll">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-pyme-blue bg-pyme-blue/10 border border-pyme-blue/20 mb-4">
                Factor Diferenciador
              </div>
            </div>
            
            <h2 className="reveal-on-scroll mb-6">
              Sistema de Certificación <span className="text-pyme-blue">PyME360 Trust Score</span>
            </h2>
            
            <p className="reveal-on-scroll text-pyme-gray-dark text-lg mb-8">
              Nuestro exclusivo sistema de certificación basado en buenas prácticas empresariales mejora 
              el acceso a financiamiento y oportunidades de negocio para tu PyME, mientras fomenta la 
              transparencia y sostenibilidad en todo el ecosistema empresarial.
            </p>
            
            <div className="reveal-on-scroll space-y-6 mb-8">
              <div className="flex items-start">
                <div className="rounded-full p-2 bg-pyme-success/10 text-pyme-success mr-4 mt-1">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Evaluación Transparente</h3>
                  <p className="text-pyme-gray-dark">
                    Basada en métricas objetivas como puntualidad en pagos, estabilidad financiera, 
                    cumplimiento regulatorio y prácticas laborales.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="rounded-full p-2 bg-pyme-blue/10 text-pyme-blue mr-4 mt-1">
                  <Medal className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Beneficios Tangibles</h3>
                  <p className="text-pyme-gray-dark">
                    Acceso a mejores tasas de interés, visibilidad preferente en el marketplace, 
                    y un sello de confianza verificable para clientes y socios.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="rounded-full p-2 bg-pyme-warning/10 text-pyme-warning mr-4 mt-1">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Mejora Continua</h3>
                  <p className="text-pyme-gray-dark">
                    Recomendaciones personalizadas para mejorar tu calificación y acceder a 
                    mayores beneficios a medida que implementas mejores prácticas.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Removed the "Conocer más sobre la certificación" link */}
          </div>
          
          <div className="reveal-on-scroll">
            <div className="relative">
              <div className="max-w-md mx-auto">
                <div className="space-y-6">
                  <CertificationLevel 
                    level="Platino"
                    description="Liderazgo en innovación y responsabilidad empresarial"
                    color="bg-gradient-to-r from-violet-400 to-purple-500"
                    icon={<CrownIcon className="h-6 w-6" />}
                    delay={3}
                    score={95}
                  />
                  
                  <CertificationLevel 
                    level="Oro"
                    description="Excelencia operativa y crecimiento sostenible"
                    color="bg-gradient-to-r from-yellow-400 to-amber-500"
                    icon={<Award className="h-6 w-6" />}
                    delay={2}
                    score={80}
                  />
                  
                  <CertificationLevel 
                    level="Plata"
                    description="Desempeño consistente y estable"
                    color="bg-gradient-to-r from-gray-300 to-gray-400"
                    icon={<Medal className="h-6 w-6" />}
                    delay={1}
                    score={65}
                  />
                  
                  <CertificationLevel 
                    level="Bronce"
                    description="Cumplimiento básico de buenas prácticas"
                    color="bg-gradient-to-r from-amber-700 to-amber-800"
                    icon={<Shield className="h-6 w-6" />}
                    delay={0}
                    score={50}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CertificationLevelProps {
  level: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  delay: number;
  score: number;
}

const CertificationLevel = ({ level, description, color, icon, delay, score }: CertificationLevelProps) => {
  return (
    <div 
      className={`glass-card p-6 transition-all duration-300 hover:shadow-elevation stagger-delay-${delay}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`rounded-full w-10 h-10 ${color} text-white flex items-center justify-center mr-3`}>
            {icon}
          </div>
          <h3 className="text-lg font-semibold">{level}</h3>
        </div>
        <span className="text-sm font-medium bg-pyme-blue/10 text-pyme-blue px-2 py-1 rounded-full">
          {score}+ puntos
        </span>
      </div>
      
      <p className="text-pyme-gray-dark text-sm mb-3">{description}</p>
      
      <div className="w-full h-2 bg-pyme-gray-light rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${color}`} 
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
};

export default CertificationSystem;
