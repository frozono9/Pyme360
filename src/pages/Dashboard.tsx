
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, BarChart2, Users, FileText, CreditCard, TrendingUp, Activity, Bell } from "lucide-react";

const Dashboard = () => {
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in (for demo purposes)
    const userJson = localStorage.getItem("pyme360-user");
    if (!userJson) {
      toast({
        variant: "destructive",
        title: "Acceso denegado",
        description: "Debe iniciar sesión para acceder al dashboard",
      });
      navigate("/acceso");
      return;
    }

    try {
      const user = JSON.parse(userJson);
      setUsername(user.username);
    } catch (error) {
      localStorage.removeItem("pyme360-user");
      navigate("/acceso");
    }
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem("pyme360-user");
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
    navigate("/");
  };

  if (!username) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Añadimos un div espaciador para evitar que el navbar fijo se superponga al contenido */}
      <div className="h-16"></div>
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Bienvenido, {username}
            </h1>
            <p className="text-gray-600">
              Resumen de actividades de su negocio
            </p>
          </div>
          
          <ButtonCustom 
            variant="outline" 
            onClick={handleLogout}
            leftIcon={<LogOut size={18} />}
            className="self-start md:self-auto"
          >
            Cerrar sesión
          </ButtonCustom>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-blue-800">
                <Activity className="mr-2 text-blue-600" size={18} />
                Estado General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-800">Bueno</p>
              <p className="text-sm text-blue-700 mt-1">
                7 indicadores positivos
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-purple-800">
                <CreditCard className="mr-2 text-purple-600" size={18} />
                Financiamiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-800">82/100</p>
              <p className="text-sm text-purple-700 mt-1">
                AI Credit Score
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-green-800">
                <TrendingUp className="mr-2 text-green-600" size={18} />
                Crecimiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-800">+12%</p>
              <p className="text-sm text-green-700 mt-1">
                Respecto al mes anterior
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-amber-800">
                <Bell className="mr-2 text-amber-600" size={18} />
                Alertas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-800">3</p>
              <p className="text-sm text-amber-700 mt-1">
                Requieren atención
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Tarjetas de módulos principales */}
        <h2 className="text-xl font-semibold text-gray-800 mb-5">Módulos Principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-purple-500 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <CreditCard className="mr-2 text-purple-500" size={20} />
                Financiamiento
              </CardTitle>
              <CardDescription>Acceso a capital y crédito</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">AI Credit Score:</span>
                  <span className="text-sm font-bold text-purple-600">82/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: "82%" }}></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Calificación buena - Elegible para mejores tasas
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <ButtonCustom variant="outline" size="sm" className="w-full hover:bg-purple-50 hover:text-purple-600 transition-colors">
                Ver opciones de financiamiento
              </ButtonCustom>
            </CardFooter>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <BarChart2 className="mr-2 text-blue-500" size={20} />
                Gestión Empresarial
              </CardTitle>
              <CardDescription>Métricas clave de negocio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Tareas completadas:</span>
                  <span className="text-sm font-bold text-blue-600">7/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "70%" }}></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  3 tareas pendientes - Actualización de inventario requerida
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <ButtonCustom variant="outline" size="sm" className="w-full hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Ver dashboard completo
              </ButtonCustom>
            </CardFooter>
          </Card>
          
          <Card className="border-l-4 border-l-amber-500 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <FileText className="mr-2 text-amber-500" size={20} />
                Cumplimiento
              </CardTitle>
              <CardDescription>Obligaciones regulatorias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Próximo vencimiento:</span>
                  <span className="text-sm font-bold text-amber-600">15 días</span>
                </div>
                <div className="flex items-center mt-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span className="text-sm">Declaración de impuestos mensuales</span>
                </div>
                <div className="flex items-center mt-1">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Reporte de nómina completado</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <ButtonCustom variant="outline" size="sm" className="w-full hover:bg-amber-50 hover:text-amber-600 transition-colors">
                Ver calendario completo
              </ButtonCustom>
            </CardFooter>
          </Card>
          
          <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <TrendingUp className="mr-2 text-green-500" size={20} />
                Crecimiento
              </CardTitle>
              <CardDescription>Oportunidades de expansión</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Oportunidades:</span>
                  <span className="text-sm font-bold text-green-600">2 nuevas</span>
                </div>
                <div className="flex items-center mt-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Expansión a mercado internacional</span>
                </div>
                <div className="flex items-center mt-1">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Alianza estratégica disponible</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <ButtonCustom variant="outline" size="sm" className="w-full hover:bg-green-50 hover:text-green-600 transition-colors">
                Explorar oportunidades
              </ButtonCustom>
            </CardFooter>
          </Card>
          
          <Card className="border-l-4 border-l-indigo-500 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Users className="mr-2 text-indigo-500" size={20} />
                Certificación
              </CardTitle>
              <CardDescription>PyME360 Trust Score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">Nivel actual:</span>
                  <span className="px-2 py-1 bg-gray-200 rounded text-xs font-semibold">Plata</span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progreso hacia Oro:</span>
                    <span>68%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: "68%" }}></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  2 criterios pendientes para alcanzar nivel Oro
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <ButtonCustom variant="outline" size="sm" className="w-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                Mejorar certificación
              </ButtonCustom>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
