
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  
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
            <NavLink to="/">Inicio</NavLink>
            <NavLink to="/nosotros">Nosotros</NavLink>
            
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center px-3 py-2 text-sm font-medium text-pyme-gray-dark hover:text-pyme-blue transition-colors"
                >
                  Módulos <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {dropdownOpen && (
                  <div 
                    className="absolute top-full right-0 mt-1 w-56 glass-card-strong py-2 animate-fade-down origin-top-right z-10"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <Link to="/financiamiento" className="block px-4 py-2 text-sm hover:bg-pyme-blue/5 hover:text-pyme-blue transition-colors">
                      Financiamiento Inteligente
                    </Link>
                    <Link to="/gestion" className="block px-4 py-2 text-sm hover:bg-pyme-blue/5 hover:text-pyme-blue transition-colors">
                      Gestión Empresarial
                    </Link>
                    <Link to="/cumplimiento" className="block px-4 py-2 text-sm hover:bg-pyme-blue/5 hover:text-pyme-blue transition-colors">
                      Cumplimiento Regulatorio
                    </Link>
                    <Link to="/crecimiento" className="block px-4 py-2 text-sm hover:bg-pyme-blue/5 hover:text-pyme-blue transition-colors">
                      Crecimiento y Escalabilidad
                    </Link>
                    <Link to="/financiera" className="block px-4 py-2 text-sm hover:bg-pyme-blue/5 hover:text-pyme-blue transition-colors">
                      Gestión Financiera
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {isAuthenticated && <NavLink to="/certificacion">Certificación</NavLink>}
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
          
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center justify-between w-full px-3 py-2 text-base font-medium text-pyme-gray-dark hover:text-pyme-blue transition-colors"
              >
                Módulos <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen && (
                <div className="pl-6 space-y-1 animate-fade-down">
                  <Link to="/financiamiento" className="block px-3 py-2 text-sm hover:text-pyme-blue transition-colors">
                    Financiamiento Inteligente
                  </Link>
                  <Link to="/gestion" className="block px-3 py-2 text-sm hover:text-pyme-blue transition-colors">
                    Gestión Empresarial
                  </Link>
                  <Link to="/cumplimiento" className="block px-3 py-2 text-sm hover:text-pyme-blue transition-colors">
                    Cumplimiento Regulatorio
                  </Link>
                  <Link to="/crecimiento" className="block px-3 py-2 text-sm hover:text-pyme-blue transition-colors">
                    Crecimiento y Escalabilidad
                  </Link>
                  <Link to="/financiera" className="block px-3 py-2 text-sm hover:text-pyme-blue transition-colors">
                    Gestión Financiera
                  </Link>
                </div>
              )}
            </div>
          )}
          
          {isAuthenticated && (
            <Link 
              to="/certificacion" 
              className="block px-3 py-2 text-base font-medium text-pyme-gray-dark hover:text-pyme-blue transition-colors"
            >
              Certificación
            </Link>
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
