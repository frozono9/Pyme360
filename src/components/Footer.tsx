
import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram, Linkedin, ArrowRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-pyme-navy text-white">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pyme-blue-light to-white">
              PyME360
            </div>
            <p className="text-pyme-gray mb-6">
              Una plataforma integral con IA que transforma la manera en que las PyMEs operan, 
              financian y expanden sus negocios en América Latina.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-pyme-blue-light transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-pyme-blue-light transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-pyme-blue-light transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-pyme-blue-light transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Módulos</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/financiamiento" className="text-pyme-gray hover:text-white transition-colors">
                  Financiamiento Inteligente
                </Link>
              </li>
              <li>
                <Link to="/gestion" className="text-pyme-gray hover:text-white transition-colors">
                  Gestión Empresarial
                </Link>
              </li>
              <li>
                <Link to="/cumplimiento" className="text-pyme-gray hover:text-white transition-colors">
                  Cumplimiento Regulatorio
                </Link>
              </li>
              <li>
                <Link to="/crecimiento" className="text-pyme-gray hover:text-white transition-colors">
                  Crecimiento y Escalabilidad
                </Link>
              </li>
              <li>
                <Link to="/financiera" className="text-pyme-gray hover:text-white transition-colors">
                  Gestión Financiera
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Empresa</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/nosotros" className="text-pyme-gray hover:text-white transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to="/certificacion" className="text-pyme-gray hover:text-white transition-colors">
                  Certificación PyME360
                </Link>
              </li>
              <li>
                <Link to="/alianzas" className="text-pyme-gray hover:text-white transition-colors">
                  Alianzas Estratégicas
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-pyme-gray hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-pyme-gray hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Suscríbete</h3>
            <p className="text-pyme-gray mb-4">
              Recibe las últimas actualizaciones y noticias sobre el ecosistema PyME.
            </p>
            <div className="flex mb-6">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                className="bg-white/10 border border-white/20 rounded-l-lg px-4 py-2 w-full focus:outline-none focus:border-pyme-blue-light text-white"
              />
              <button className="bg-pyme-blue hover:bg-pyme-blue-dark rounded-r-lg px-4 transition-colors flex items-center justify-center">
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-pyme-gray">
              Al suscribirte, aceptas nuestra Política de Privacidad y recibirás comunicaciones por correo electrónico.
            </p>
          </div>
        </div>
        
        <div className="py-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-pyme-gray mb-4 md:mb-0">
            &copy; {currentYear} PyME360. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacidad" className="text-sm text-pyme-gray hover:text-white transition-colors">
              Política de Privacidad
            </Link>
            <Link to="/terminos" className="text-sm text-pyme-gray hover:text-white transition-colors">
              Términos de Servicio
            </Link>
            <Link to="/legal" className="text-sm text-pyme-gray hover:text-white transition-colors">
              Aviso Legal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
