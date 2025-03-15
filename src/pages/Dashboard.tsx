
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, BarChart2, Users, FileText, CreditCard, TrendingUp, Activity, Bell } from "lucide-react";
import api from "@/api";
import { Progress } from "@/components/ui/progress";

// Define interfaces for the data
interface CreditScoreData {
  score: number;
  maxScore: number;
  level: string;
  percentage: number;
}

interface TrustScoreData {
  score: number;
  level: string;
  nextLevel: string;
  percentage: number;
}

interface ActiveDebtsData {
  total: number;
  growthRate: number;
}

const Dashboard = () => {
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [creditScore, setCreditScore] = useState<CreditScoreData>({
    score: 0,
    maxScore: 100,
    level: "N/A",
    percentage: 0,
  });
  const [trustScore, setTrustScore] = useState<TrustScoreData>({
    score: 0,
    level: "N/A",
    nextLevel: "N/A",
    percentage: 0,
  });
  const [activeDebts, setActiveDebts] = useState<ActiveDebtsData>({
    total: 0,
    growthRate: 0,
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch all necessary data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch credit score data
      const creditScoreData = await api.getCreditScore();
      if (creditScoreData) {
        setCreditScore({
          score: creditScoreData.score || 0,
          maxScore: creditScoreData.maxScore || 100,
          level: creditScoreData.level || "N/A",
          percentage: creditScoreData.percentage || 0,
        });
      }
      
      // Fetch trust score data
      const trustScoreData = await api.getTrustScore();
      if (trustScoreData) {
        setTrustScore({
          score: trustScoreData.score || 0,
          level: trustScoreData.level || "N/A",
          nextLevel: trustScoreData.nextLevel || "N/A",
          percentage: trustScoreData.percentage || 0,
        });
      }
      
      // Fetch active debts data
      const debtsData = await api.getActiveDebts();
      if (debtsData) {
        setActiveDebts({
          total: debtsData.total || 0,
          growthRate: debtsData.growthRate || 0,
        });
      }
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        variant: "destructive",
        title: "Error de datos",
        description: "No se pudieron cargar todos los datos del dashboard",
      });
    } finally {
      setLoading(false);
    }
  };

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
      // Fetch data after authentication check
      fetchDashboardData();
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

  if (!username || loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pyme-blue mb-4"></div>
        <p className="text-pyme-gray-dark">Cargando datos...</p>
      </div>
    </div>;
  }

  // Helper function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-800";
    if (score >= 65) return "text-purple-800";
    if (score >= 50) return "text-amber-800";
    return "text-red-800";
  };

  // Helper function to get background color based on score
  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "from-green-50 to-green-100 border-green-200";
    if (score >= 65) return "from-purple-50 to-purple-100 border-purple-200";
    if (score >= 50) return "from-amber-50 to-amber-100 border-amber-200";
    return "from-red-50 to-red-100 border-red-200";
  };

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
              <p className="text-2xl font-bold text-blue-800">
                {creditScore.score >= 70 ? "Bueno" : creditScore.score >= 50 ? "Regular" : "Atención"}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                {Math.round(creditScore.percentage)}% de indicadores positivos
              </p>
            </CardContent>
          </Card>
          
          <Card className={`bg-gradient-to-br ${getScoreBgColor(creditScore.score)}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-purple-800">
                <CreditCard className="mr-2 text-purple-600" size={18} />
                Financiamiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${getScoreColor(creditScore.score)}`}>
                {creditScore.score}/{creditScore.maxScore}
              </p>
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
              <p className={`text-2xl font-bold ${activeDebts.growthRate >= 0 ? "text-green-800" : "text-red-800"}`}>
                {activeDebts.growthRate >= 0 ? "+" : ""}{activeDebts.growthRate}%
              </p>
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
              <p className="text-2xl font-bold text-amber-800">
                {creditScore.score < 60 ? 3 : creditScore.score < 70 ? 2 : creditScore.score < 80 ? 1 : 0}
              </p>
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
                  <span className="text-sm font-bold text-purple-600">{creditScore.score}/{creditScore.maxScore}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${(creditScore.score / creditScore.maxScore) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {creditScore.score >= 80 ? "Calificación excelente - Elegible para las mejores tasas" :
                   creditScore.score >= 65 ? "Calificación buena - Elegible para mejores tasas" :
                   creditScore.score >= 50 ? "Calificación regular - Opciones de financiamiento limitadas" :
                   "Calificación baja - Recomendamos mejorar antes de solicitar financiamiento"}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <ButtonCustom 
                variant="outline" 
                size="sm" 
                className="w-full hover:bg-purple-50 hover:text-purple-600 transition-colors"
                onClick={() => navigate('/financiamiento')}
              >
                Ver opciones de financiamiento
              </ButtonCustom>
            </CardFooter>
          </Card>
          
          {/* Mantener las siguientes tarjetas casi iguales, con pequeñas modificaciones dinámicas */}
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
                  <span className="text-sm font-bold text-blue-600">
                    {creditScore.score >= 80 ? "9" : creditScore.score >= 65 ? "7" : creditScore.score >= 50 ? "5" : "3"}/10
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${creditScore.score >= 80 ? 90 : creditScore.score >= 65 ? 70 : creditScore.score >= 50 ? 50 : 30}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {creditScore.score >= 80 ? "1 tarea pendiente - Sistema casi optimizado" :
                   creditScore.score >= 65 ? "3 tareas pendientes - Actualización de inventario requerida" :
                   creditScore.score >= 50 ? "5 tareas pendientes - Se requiere atención" :
                   "7 tareas pendientes - Se requiere atención urgente"}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <ButtonCustom 
                variant="outline" 
                size="sm" 
                className="w-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                onClick={() => navigate('/gestion')}
              >
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
                  <span className="text-sm font-bold text-amber-600">
                    {creditScore.score >= 70 ? "15" : creditScore.score >= 50 ? "7" : "3"} días
                  </span>
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
              <ButtonCustom 
                variant="outline" 
                size="sm" 
                className="w-full hover:bg-amber-50 hover:text-amber-600 transition-colors"
                onClick={() => navigate('/cumplimiento')}
              >
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
                  <span className="text-sm font-bold text-green-600">
                    {creditScore.score >= 80 ? "5" : creditScore.score >= 65 ? "3" : creditScore.score >= 50 ? "2" : "1"} nuevas
                  </span>
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
              <ButtonCustom 
                variant="outline" 
                size="sm" 
                className="w-full hover:bg-green-50 hover:text-green-600 transition-colors"
                onClick={() => navigate('/crecimiento')}
              >
                Explorar oportunidades
              </ButtonCustom>
            </CardFooter>
          </Card>
          
          <Card className="border-l-4 border-l-indigo-500 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Users className="mr-2 text-indigo-500" size={20} />
                Búsqueda de Empleados
              </CardTitle>
              <CardDescription>Encuentra el talento ideal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">Candidatos disponibles:</span>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-semibold">
                    {creditScore.score >= 80 ? "48" : creditScore.score >= 65 ? "24" : "12"} perfiles
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex items-center mt-1">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                    <span className="text-sm">Desarrollador Frontend (urgente)</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                    <span className="text-sm">Especialista en Marketing</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <ButtonCustom 
                variant="outline" 
                size="sm" 
                className="w-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                onClick={() => navigate('/busqueda-empleados')}
              >
                Buscar candidatos
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
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    trustScore.level === "Platino" ? "bg-purple-200 text-purple-800" :
                    trustScore.level === "Oro" ? "bg-amber-200 text-amber-800" :
                    trustScore.level === "Plata" ? "bg-gray-200 text-gray-800" :
                    "bg-amber-700 text-white"
                  }`}>
                    {trustScore.level}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progreso hacia {trustScore.nextLevel}:</span>
                    <span>{trustScore.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full" 
                      style={{ width: `${trustScore.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {Math.round((100 - trustScore.percentage) / 25)} criterios pendientes para alcanzar nivel {trustScore.nextLevel}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <ButtonCustom 
                variant="outline" 
                size="sm" 
                className="w-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                onClick={() => navigate('/certificacion')}
              >
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
