
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Database, LayoutDashboard, DollarSign, FileText, CheckCircle, TrendingUp, Award } from 'lucide-react';
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
    // Check if user is logged in
    const checkAuth = () => {
      const userJson = localStorage.getItem("pyme360-user");
      setIsAuthenticated(!!userJson);
    };
    
    // Initial check
    checkAuth();
    
    // Listen for storage changes (in case user logs in/out in another tab)
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

  // Close mobile menu when route changes
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
          "relative px-3 py-2 text-sm font-medium transition-colors hover:text-pyme-blue",
          isActive ? "text-pyme-blue" : "text-pyme-gray-dark"
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
        scrolled ? "bg-white/80 shadow-subtle" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pyme-blue to-pyme-blue-light">
                PyME360
              </span>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {!isAuthenticated ? (
              // Links for non-authenticated users
              <>
                <NavLink to="/">Inicio</NavLink>
                <NavLink to="/nosotros">Nosotros</NavLink>
              </>
            ) : (
              // Links for authenticated users
              <>
                <NavLink to="/dashboard">
                  <div className="flex items-center">
                    <LayoutDashboard className="h-4 w-4 mr-1" />
                    Dashboard
                  </div>
                </NavLink>
                <NavLink to="/financiamiento">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Financiamiento Inteligente
                  </div>
                </NavLink>
                <NavLink to="/gestion">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    Gestión Empresarial
                  </div>
                </NavLink>
                <NavLink to="/cumplimiento">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Cumplimiento Regulatorio
                  </div>
                </NavLink>
                <NavLink to="/crecimiento">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Crecimiento
                  </div>
                </NavLink>
                <NavLink to="/certificacion">
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    Certificación
                  </div>
                </NavLink>
                <NavLink to="/database">
                  <div className="flex items-center">
                    <Database className="h-4 w-4 mr-1" />
                    Database
                  </div>
                </NavLink>
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="text-sm font-medium px-4 py-2 rounded-md border border-pyme-blue/20 hover:border-pyme-blue/50 text-pyme-blue transition-all flex items-center"
              >
                <LogOut size={16} className="mr-2" />
                Cerrar Sesión
              </button>
            ) : (
              <>
                <Link 
                  to="/acceso" 
                  className="text-sm font-medium px-4 py-2 rounded-md border border-pyme-blue/20 hover:border-pyme-blue/50 text-pyme-blue transition-all"
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-pyme-gray-dark hover:text-pyme-blue focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        "md:hidden transition-all duration-300 overflow-hidden ease-in-out bg-white/90 backdrop-blur-md border-b",
        isOpen ? "max-h-[400px] border-pyme-gray-light" : "max-h-0 border-transparent"
      )}>
        <div className="px-4 pt-2 pb-4 space-y-1">
          {!isAuthenticated ? (
            // Mobile links for non-authenticated users
            <>
              <Link 
                to="/" 
                className="block px-3 py-2 text-base font-medium text-pyme-gray-dark hover:text-pyme-blue transition-colors"
              >
                Inicio
              </Link>
              <Link 
                to="/nosotros" 
                className="block px-3 py-2 text-base font-medium text-pyme-gray-dark hover:text-pyme-blue transition-colors"
              >
                Nosotros
              </Link>
            </>
          ) : (
            // Mobile links for authenticated users
            <>
              <Link 
                to="/dashboard" 
                className="flex items-center px-3 py-2 text-base font-medium text-pyme-gray-dark hover:text-pyme-blue transition-colors"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
              <Link 
                to="/financiamiento" 
                className="flex items-center px-3 py-2 text-base font-medium text-pyme-gray-dark hover:text-pyme-blue transition-colors"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Financiamiento Inteligente
              </Link>
              <Link 
                to="/gestion" 
                className="flex items-center px-3 py-2 text-base font-medium text-pyme-gray-dark hover:text-pyme-blue transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                Gestión Empresarial
              </Link>
              <Link 
                to="/cumplimiento" 
                className="flex items-center px-3 py-2 text-base font-medium text-pyme-gray-dark hover:text-pyme-blue transition-colors"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Cumplimiento Regulatorio
              </Link>
              <Link 
                to="/crecimiento" 
                className="flex items-center px-3 py-2 text-base font-medium text-pyme-gray-dark hover:text-pyme-blue transition-colors"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Crecimiento
              </Link>
              <Link 
                to="/certificacion" 
                className="flex items-center px-3 py-2 text-base font-medium text-pyme-gray-dark hover:text-pyme-blue transition-colors"
              >
                <Award className="h-4 w-4 mr-2" />
                Certificación
              </Link>
              <Link 
                to="/database" 
                className="flex items-center px-3 py-2 text-base font-medium text-pyme-gray-dark hover:text-pyme-blue transition-colors"
              >
                <Database className="h-4 w-4 mr-2" />
                Database
              </Link>
            </>
          )}
          
          <div className="pt-4 flex flex-col space-y-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-center text-sm font-medium px-4 py-2 rounded-md border border-pyme-blue/20 text-pyme-blue transition-all flex items-center justify-center"
              >
                <LogOut size={16} className="mr-2" />
                Cerrar Sesión
              </button>
            ) : (
              <>
                <Link 
                  to="/acceso" 
                  className="text-center text-sm font-medium px-4 py-2 rounded-md border border-pyme-blue/20 text-pyme-blue transition-all"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/registro" 
                  className="text-center text-sm font-medium px-4 py-2 rounded-md bg-gradient-to-r from-pyme-blue to-pyme-blue-light text-white shadow-sm hover:shadow-md transition-all"
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
