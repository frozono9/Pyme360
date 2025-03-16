
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, BarChart2, PieChart, ShieldCheck, TrendingUp, CreditCard } from 'lucide-react';

const Features = () => {
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
    <div ref={sectionRef} className="bg-white section-padding">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="reveal-on-scroll">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-pyme-blue bg-pyme-blue/10 border border-pyme-blue/20 mb-4">
              Solución Integral
            </div>
          </div>

          <h2 className="reveal-on-scroll mb-6 text-balance">
            Transformando la operación de las PyMEs en América Latina
          </h2>
          
          <p className="reveal-on-scroll text-pyme-gray-dark text-lg">
            Nuestra plataforma aborda cinco desafíos críticos que enfrentan las pequeñas y medianas empresas 
            en la región, mediante soluciones inteligentes impulsadas por IA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<CreditCard className="h-6 w-6 text-pyme-blue" />}
            title="Financiamiento Inteligente"
            description="Evaluación crediticia alternativa y conexión automatizada con fuentes de financiamiento adaptadas a tu perfil."
            features={[
              "AI Credit Score personalizado",
              "Marketplace de financiamiento",
              "Preparación asistida para financiación"
            ]}
          />
          
          <FeatureCard 
            icon={<BarChart2 className="h-6 w-6 text-pyme-blue" />}
            title="Gestión Empresarial"
            description="Simplifica la administración de tu empresa con nuestro ERP potenciado por inteligencia artificial."
            features={[
              "ERP simplificado con IA",
              "Asistente virtual empresarial",
              "Dashboard de inteligencia comercial"
            ]}
          />
          
          <FeatureCard 
            icon={<ShieldCheck className="h-6 w-6 text-pyme-blue" />}
            title="Cumplimiento Regulatorio"
            description="Mantén tu empresa al día con todas las obligaciones fiscales, laborales y administrativas sin complicaciones."
            features={[
              "Automatización de conformidad",
              "Centro de recursos legales",
              "Gestión digital de trámites"
            ]}
          />
          
          <FeatureCard 
            icon={<TrendingUp className="h-6 w-6 text-pyme-blue" />}
            title="Crecimiento y Escalabilidad"
            description="Identifica oportunidades de crecimiento y expande tu negocio con estrategias basadas en datos."
            features={[
              "Análisis de mercado con IA",
              "Capacitación digital personalizada",
              "Ecosistema empresarial integrado"
            ]}
          />
          
          <FeatureCard 
            icon={<PieChart className="h-6 w-6 text-pyme-blue" />}
            title="Gestión Financiera"
            description="Optimiza tus finanzas con herramientas que te permiten controlar el flujo de caja y tomar mejores decisiones."
            features={[
              "Control de flujo de caja en tiempo real",
              "Automatización contable",
              "Planificación financiera inteligente"
            ]}
          />
          
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-pyme-blue to-pyme-blue-light opacity-90"></div>
            <div className="relative h-full p-8 flex flex-col justify-between text-white">
              <div>
                <h3 className="text-xl font-semibold mb-4">¿Listo para transformar tu PyME?</h3>
                <p className="mb-8">
                  Únete a las empresas que están transformando su operación y alcanzando nuevos niveles de éxito con PyME360.
                </p>
              </div>
              <Link to="/registro" className="px-6 py-3 rounded-lg bg-white text-pyme-blue font-medium hover:bg-pyme-gray-light transition-colors">
                Comenzar Ahora
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

const FeatureCard = ({ icon, title, description, features }: FeatureCardProps) => {
  return (
    <div className="reveal-on-scroll glass-card p-8 hover:shadow-elevation transition-all duration-300">
      <div className="rounded-full w-12 h-12 flex items-center justify-center bg-pyme-blue/10 mb-6">
        {icon}
      </div>
      
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-pyme-gray-dark mb-6">{description}</p>
      
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle2 className="h-5 w-5 text-pyme-success mr-2 shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Features;
