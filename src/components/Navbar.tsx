
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, DollarSign, FileText, TrendingUp, Award, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = () => {
      const userJson = localStorage.getItem("pyme360-user");
      setIsAuthenticated(!!userJson);
    };
    
    checkAuth();
    
    window.addEventListener('storage', checkAuth);

    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkAuth);
    };
  }, [scrolled]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const handleLogout = () => {
    localStorage.removeItem("pyme360-user");
    setIsAuthenticated(false);
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
    navigate("/");
  };

  const NavLink = ({ to, children }: { to: string, children: React.ReactNode }) => {
    const isActive = location.pathname === to;
    
    return (
      <Link 
        to={to} 
        className={cn(
          "relative px-3 py-2 text-sm font-medium transition-colors duration-200",
          isActive 
            ? "text-pyme-blue" 
            : "text-pyme-gray-dark hover:text-pyme-blue/80"
        )}
      >
        {children}
        {isActive && (
          <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-pyme-blue rounded-full" />
        )}
      </Link>
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-md",
        scrolled 
          ? "bg-white/90 shadow-subtle border-b border-gray-100" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* Updated logo link to change based on authentication status */}
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center group">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pyme-blue to-pyme-blue-light group-hover:from-pyme-blue-dark group-hover:to-pyme-blue transition-all duration-300">
                PyME360
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {!isAuthenticated ? (
              <>
                <NavLink to="/">Inicio</NavLink>
                <NavLink to="/nosotros">Nosotros</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/dashboard">
                  <div className="flex items-center">
                    <LayoutDashboard className="h-4 w-4 mr-1.5" />
                    Dashboard
                  </div>
                </NavLink>
                <NavLink to="/financiamiento">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1.5" />
                    Financiamiento
                  </div>
                </NavLink>
                <NavLink to="/gestion">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1.5" />
                    Gestión
                  </div>
                </NavLink>
                <NavLink to="/crecimiento">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1.5" />
                    Crecimiento
                  </div>
                </NavLink>
                <NavLink to="/busqueda-empleados">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1.5" />
                    Empleados
                  </div>
                </NavLink>
                <NavLink to="/certificacion">
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1.5" />
                    Certificación
                  </div>
                </NavLink>
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="text-sm font-medium px-4 py-2 rounded-md border border-pyme-blue/30 hover:border-pyme-blue/70 hover:bg-pyme-blue/5 text-pyme-blue transition-all flex items-center"
              >
                <LogOut size={16} className="mr-2" />
                Cerrar Sesión
              </button>
            ) : (
              <>
                <Link 
                  to="/acceso" 
                  className="text-sm font-medium px-4 py-2 rounded-md border border-pyme-blue/20 hover:border-pyme-blue/50 hover:bg-pyme-blue/5 text-pyme-blue transition-all"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/registro" 
                  className="text-sm font-medium px-4 py-2 rounded-md bg-gradient-to-r from-pyme-blue to-pyme-blue-light text-white shadow-sm hover:shadow-md hover:from-pyme-blue-dark hover:to-pyme-blue transition-all"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-pyme-gray-dark hover:text-pyme-blue hover:bg-pyme-blue/5 focus:outline-none transition-colors"
              aria-expanded={isOpen}
            >
              <span className="sr-only">{isOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <div className={cn(
        "md:hidden transition-all duration-300 overflow-hidden ease-in-out bg-white/95 backdrop-blur-md border-b",
        isOpen ? "max-h-screen border-pyme-gray-light" : "max-h-0 border-transparent"
      )}>
        <div className="px-4 pt-2 pb-5 space-y-2">
          {!isAuthenticated ? (
            <>
              <Link 
                to="/" 
                className="block px-3 py-2.5 text-base font-medium text-pyme-gray-dark hover:text-pyme-blue hover:bg-pyme-blue/5 rounded-md transition-colors"
              >
                Inicio
              </Link>
              <Link 
                to="/nosotros" 
                className="block px-3 py-2.5 text-base font-medium text-pyme-gray-dark hover:text-pyme-blue hover:bg-pyme-blue/5 rounded-md transition-colors"
              >
                Nosotros
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/dashboard" 
                className="flex items-center px-3 py-2.5 text-base font-medium text-pyme-gray-dark hover:text-pyme-blue hover:bg-pyme-blue/5 rounded-md transition-colors"
              >
                <LayoutDashboard className="h-5 w-5 mr-2.5" />
                Dashboard
              </Link>
              <Link 
                to="/financiamiento" 
                className="flex items-center px-3 py-2.5 text-base font-medium text-pyme-gray-dark hover:text-pyme-blue hover:bg-pyme-blue/5 rounded-md transition-colors"
              >
                <DollarSign className="h-5 w-5 mr-2.5" />
                Financiamiento Inteligente
              </Link>
              <Link 
                to="/gestion" 
                className="flex items-center px-3 py-2.5 text-base font-medium text-pyme-gray-dark hover:text-pyme-blue hover:bg-pyme-blue/5 rounded-md transition-colors"
              >
                <FileText className="h-5 w-5 mr-2.5" />
                Gestión Empresarial
              </Link>
              <Link 
                to="/crecimiento" 
                className="flex items-center px-3 py-2.5 text-base font-medium text-pyme-gray-dark hover:text-pyme-blue hover:bg-pyme-blue/5 rounded-md transition-colors"
              >
                <TrendingUp className="h-5 w-5 mr-2.5" />
                Crecimiento
              </Link>
              <Link 
                to="/busqueda-empleados" 
                className="flex items-center px-3 py-2.5 text-base font-medium text-pyme-gray-dark hover:text-pyme-blue hover:bg-pyme-blue/5 rounded-md transition-colors"
              >
                <Users className="h-5 w-5 mr-2.5" />
                Búsqueda de Empleados
              </Link>
              <Link 
                to="/certificacion" 
                className="flex items-center px-3 py-2.5 text-base font-medium text-pyme-gray-dark hover:text-pyme-blue hover:bg-pyme-blue/5 rounded-md transition-colors"
              >
                <Award className="h-5 w-5 mr-2.5" />
                Certificación
              </Link>
            </>
          )}
          
          <div className="pt-4 flex flex-col space-y-3">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-center text-sm font-medium px-4 py-2.5 rounded-md border border-pyme-blue/20 hover:border-pyme-blue/50 hover:bg-pyme-blue/5 text-pyme-blue transition-all flex items-center justify-center"
              >
                <LogOut size={16} className="mr-2" />
                Cerrar Sesión
              </button>
            ) : (
              <>
                <Link 
                  to="/acceso" 
                  className="text-center text-sm font-medium px-4 py-2.5 rounded-md border border-pyme-blue/20 hover:border-pyme-blue/50 hover:bg-pyme-blue/5 text-pyme-blue transition-all"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/registro" 
                  className="text-center text-sm font-medium px-4 py-2.5 rounded-md bg-gradient-to-r from-pyme-blue to-pyme-blue-light hover:from-pyme-blue-dark hover:to-pyme-blue text-white shadow-sm hover:shadow-md transition-all"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
