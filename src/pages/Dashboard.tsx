
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, BarChart2, Users, FileText, CreditCard, TrendingUp } from "lucide-react";

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
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-pyme-gray-dark">
              Bienvenido, {username}
            </h1>
            <p className="text-pyme-gray-dark">
              Panel de control de PyME360
            </p>
          </div>
          
          <ButtonCustom 
            variant="outline" 
            onClick={handleLogout}
            leftIcon={<LogOut size={18} />}
          >
            Cerrar sesión
          </ButtonCustom>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <CreditCard className="mr-2 text-pyme-blue" size={20} />
                Financiamiento
              </CardTitle>
              <CardDescription>Acceso a capital y crédito</CardDescription>
            </CardHeader>
            <CardContent>
              <p>AI Credit Score: 82/100</p>
              <p className="text-sm text-pyme-gray-dark mt-2">
                Calificación buena - Elegible para mejores tasas
              </p>
            </CardContent>
            <CardFooter>
              <ButtonCustom variant="outline" size="sm" className="w-full">
                Ver opciones de financiamiento
              </ButtonCustom>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <BarChart2 className="mr-2 text-pyme-blue" size={20} />
                Gestión Empresarial
              </CardTitle>
              <CardDescription>Métricas clave de negocio</CardDescription>
            </CardHeader>
            <CardContent>
              <p>3 tareas pendientes</p>
              <p className="text-sm text-pyme-gray-dark mt-2">
                Actualización de inventario requerida
              </p>
            </CardContent>
            <CardFooter>
              <ButtonCustom variant="outline" size="sm" className="w-full">
                Ver dashboard completo
              </ButtonCustom>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <FileText className="mr-2 text-pyme-blue" size={20} />
                Cumplimiento
              </CardTitle>
              <CardDescription>Obligaciones regulatorias</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Próximo vencimiento: 15 días</p>
              <p className="text-sm text-pyme-gray-dark mt-2">
                Declaración de impuestos mensuales
              </p>
            </CardContent>
            <CardFooter>
              <ButtonCustom variant="outline" size="sm" className="w-full">
                Ver calendario completo
              </ButtonCustom>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <TrendingUp className="mr-2 text-pyme-blue" size={20} />
                Crecimiento
              </CardTitle>
              <CardDescription>Oportunidades de expansión</CardDescription>
            </CardHeader>
            <CardContent>
              <p>2 nuevas oportunidades</p>
              <p className="text-sm text-pyme-gray-dark mt-2">
                Mercados potenciales identificados
              </p>
            </CardContent>
            <CardFooter>
              <ButtonCustom variant="outline" size="sm" className="w-full">
                Explorar oportunidades
              </ButtonCustom>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Users className="mr-2 text-pyme-blue" size={20} />
                Certificación
              </CardTitle>
              <CardDescription>PyME360 Trust Score</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Nivel: Plata</p>
              <p className="text-sm text-pyme-gray-dark mt-2">
                Progreso hacia Oro: 68%
              </p>
            </CardContent>
            <CardFooter>
              <ButtonCustom variant="outline" size="sm" className="w-full">
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
