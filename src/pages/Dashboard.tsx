import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Users, FileText, CreditCard, TrendingUp, Activity, Bell, Award, AlertCircle, Flag, MapPin, Check, Milestone, CheckCircle2, AlertTriangle, Calendar, BadgeCheck, GraduationCap, Zap, Rocket, ArrowRight } from "lucide-react";
import api from "@/api";
import { Progress } from "@/components/ui/progress";

interface CreditScoreData {
  score: number;
  maxScore: number;
  level: string;
  percentage: number;
  nivel?: {
    nivel: string;
    color: string;
    description: string;
  };
}

interface TrustScoreData {
  score: number;
  level: string;
  nextLevel: string;
  percentage: number;
  calificacion_global?: number;
}

interface ActiveDebtsData {
  total: number;
  growthRate: number;
}

interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  priority: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
  linkTo: string;
  percentComplete?: number;
}

const Dashboard = () => {
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [creditScore, setCreditScore] = useState<CreditScoreData>({
    score: 0,
    maxScore: 850,
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
  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([]);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const creditScoreData = await api.getCreditScore();
      if (creditScoreData) {
        const scoreValue = creditScoreData.score || 0;
        setCreditScore({
          score: scoreValue,
          maxScore: 850,
          level: creditScoreData.nivel?.nivel || "N/A",
          percentage: creditScoreData.components?.payment_history?.percentage || 0,
          nivel: creditScoreData.nivel
        });
        console.log("Credit Score set to:", scoreValue);
      }
      
      const trustScoreData = await api.getTrustScore();
      if (trustScoreData) {
        const currentScore = trustScoreData.calificacion_global || 0;
        let nextLevel = "Platino";
        
        let level = "Bronce";
        let percentage = 0;
        
        if (currentScore >= 90) {
          level = "Platino";
          nextLevel = "Máximo";
          percentage = 100;
        } else if (currentScore >= 80) {
          level = "Oro";
          nextLevel = "Platino";
          percentage = (currentScore - 80) * 10;
        } else if (currentScore >= 70) {
          level = "Plata";
          nextLevel = "Oro";
          percentage = (currentScore - 70) * 10;
        } else if (currentScore >= 60) {
          level = "Bronce";
          nextLevel = "Plata";
          percentage = (currentScore - 60) * 10;
        } else {
          percentage = currentScore * 1.66;
        }
        
        setTrustScore({
          score: currentScore,
          level: level,
          nextLevel: nextLevel,
          percentage: percentage,
          calificacion_global: currentScore
        });
      }
      
      const debtsData = await api.getActiveDebts();
      if (debtsData) {
        setActiveDebts({
          total: debtsData.total || 0,
          growthRate: debtsData.growthRate || 0,
        });
      }
      
      generateRoadmapSteps(creditScoreData?.score, trustScoreData?.calificacion_global);
      
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

  const generateRoadmapSteps = (creditScore = 0, trustScore = 0) => {
    const steps: RoadmapStep[] = [];
    
    steps.push({
      id: 1,
      title: "Completar Perfil Empresarial",
      description: "Añade toda la información básica de tu empresa para desbloquear análisis personalizados.",
      status: trustScore > 30 ? 'completed' : 'in-progress',
      priority: 'high',
      icon: <BadgeCheck className="text-blue-500" />,
      linkTo: '/certificacion',
      percentComplete: Math.min(100, Math.round(trustScore * 1.5))
    });
    
    steps.push({
      id: 2,
      title: "Evaluación Crediticia Completa",
      description: "Sube tus estados financieros para obtener tu AI Credit Score y acceder a mejores oportunidades de financiamiento.",
      status: creditScore > 600 ? 'completed' : creditScore > 400 ? 'in-progress' : 'pending',
      priority: creditScore < 600 ? 'high' : 'medium',
      icon: <CreditCard className="text-purple-500" />,
      linkTo: '/financiamiento/credito',
      percentComplete: Math.min(100, Math.round((creditScore / 850) * 100))
    });
    
    const financeCompletionPercent = creditScore > 700 ? 85 : creditScore > 600 ? 60 : creditScore > 500 ? 40 : 20;
    steps.push({
      id: 3,
      title: "Implementar Gestión Financiera",
      description: "Configura tu sistema de control de flujo de caja y automatiza la gestión financiera.",
      status: financeCompletionPercent > 80 ? 'completed' : financeCompletionPercent > 30 ? 'in-progress' : 'pending',
      priority: financeCompletionPercent < 50 ? 'high' : 'medium',
      icon: <BarChart2 className="text-blue-500" />,
      linkTo: '/gestion',
      percentComplete: financeCompletionPercent
    });
    
    const compliancePercent = trustScore > 80 ? 90 : trustScore > 70 ? 75 : trustScore > 60 ? 50 : trustScore > 50 ? 30 : 10;
    steps.push({
      id: 4,
      title: "Cumplimiento Regulatorio y Fiscal",
      description: "Asegúrate de cumplir con todas las obligaciones legales y fiscales para evitar multas y problemas legales.",
      status: compliancePercent > 80 ? 'completed' : compliancePercent > 30 ? 'in-progress' : 'pending',
      priority: compliancePercent < 50 ? 'high' : 'medium',
      icon: <FileText className="text-amber-500" />,
      linkTo: '/certificacion',
      percentComplete: compliancePercent
    });
    
    const operationsPercent = (creditScore + (trustScore * 5)) / 12;
    steps.push({
      id: 5,
      title: "Optimización Operativa",
      description: "Implementa procesos eficientes y automatizados para reducir costos y aumentar la productividad.",
      status: operationsPercent > 80 ? 'completed' : operationsPercent > 40 ? 'in-progress' : 'pending',
      priority: 'medium',
      icon: <Zap className="text-green-500" />,
      linkTo: '/gestion',
      percentComplete: Math.min(100, Math.round(operationsPercent))
    });
    
    steps.push({
      id: 6,
      title: "Estrategia de Crecimiento",
      description: "Analiza oportunidades de mercado, planifica la expansión y optimiza tu estrategia de crecimiento.",
      status: trustScore > 75 ? 'in-progress' : 'pending',
      priority: 'medium',
      icon: <TrendingUp className="text-green-500" />,
      linkTo: '/crecimiento',
      percentComplete: Math.min(100, Math.round(trustScore - 10))
    });
    
    steps.push({
      id: 7,
      title: "Innovación y Digitalización",
      description: "Implementa nuevas tecnologías y digitaliza procesos para mantener la competitividad en el mercado.",
      status: trustScore > 85 ? 'in-progress' : 'pending',
      priority: 'medium',
      icon: <Rocket className="text-indigo-500" />,
      linkTo: '/crecimiento/predictor',
      percentComplete: Math.max(0, Math.min(100, Math.round(trustScore - 30)))
    });
    
    steps.push({
      id: 8,
      title: "Certificación PyME360 Platino",
      description: "Alcanza el máximo nivel de certificación empresarial para acceder a beneficios exclusivos y posicionamiento premium.",
      status: trustScore >= 90 ? 'completed' : trustScore > 75 ? 'in-progress' : 'pending',
      priority: trustScore > 70 ? 'medium' : 'low',
      icon: <Award className="text-yellow-500" />,
      linkTo: '/certificacion',
      percentComplete: Math.min(100, Math.round(trustScore))
    });
    
    setRoadmapSteps(steps);
  };

  useEffect(() => {
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
      fetchDashboardData();
    } catch (error) {
      localStorage.removeItem("pyme360-user");
      navigate("/acceso");
    }
  }, [navigate, toast]);

  const getScoreBgColor = (score: number) => {
    if (score >= 750) return "from-green-100 to-green-200";
    if (score >= 670) return "from-blue-100 to-blue-200";
    if (score >= 580) return "from-yellow-100 to-yellow-200";
    if (score >= 500) return "from-orange-100 to-orange-200";
    return "from-red-100 to-red-200";
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 750) return "text-green-600";
    if (score >= 670) return "text-blue-600";
    if (score >= 580) return "text-yellow-600";
    if (score >= 500) return "text-orange-600";
    return "text-red-600";
  };
  
  const getCertificationLevel = (score: number) => {
    if (score >= 90) return { name: "Platino", color: "text-slate-600" };
    if (score >= 80) return { name: "Oro", color: "text-yellow-600" };
    if (score >= 70) return { name: "Plata", color: "text-gray-500" };
    if (score >= 60) return { name: "Bronce", color: "text-amber-700" };
    return { name: "No certificado", color: "text-red-500" };
  };
  
  const getTrustLevelColor = (level: string) => {
    switch (level) {
      case "Platino": return "bg-slate-200 text-slate-600";
      case "Oro": return "bg-yellow-200 text-yellow-600";
      case "Plata": return "bg-gray-200 text-gray-600";
      case "Bronce": return "bg-amber-200 text-amber-700";
      default: return "bg-red-200 text-red-600";
    }
  };

  const getStatusColor = (status: RoadmapStep["status"]) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-300";
      case "in-progress": return "bg-blue-100 text-blue-800 border-blue-300";
      case "pending": return "bg-gray-100 text-gray-800 border-gray-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };
  
  const getPriorityColor = (priority: RoadmapStep["priority"]) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-300";
      case "medium": return "bg-amber-100 text-amber-800 border-amber-300";
      case "low": return "bg-green-100 text-green-800 border-green-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };
  
  const getPriorityIcon = (priority: RoadmapStep["priority"]) => {
    switch (priority) {
      case "high": return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "medium": return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case "low": return <Check className="w-4 h-4 text-green-600" />;
      default: return null;
    }
  };

  const renderDashboard = () => {
    if (!creditScore || !trustScore || !activeDebts) {
      return <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pyme-blue mb-4"></div>
          <p className="text-pyme-gray-dark">Cargando datos...</p>
        </div>
      </div>;
    }

    const creditScoreValue = creditScore.score || 0;
    const maxCreditScore = 850;
    const trustScoreValue = trustScore.calificacion_global || 0;
    const certificationLevel = getCertificationLevel(trustScoreValue);

    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard Empresarial
          </h1>
          <p className="text-gray-600">
            Supervisa el progreso y la salud de tu empresa
          </p>
        </div>
          
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-blue-800">
                <Activity className="mr-2 text-blue-600" size={18} />
                Estado General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-800">
                {creditScoreValue >= 700 ? "Bueno" : creditScoreValue >= 580 ? "Regular" : "Atención"}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                {Math.round((creditScoreValue - 300) / 550 * 100)}% de indicadores positivos
              </p>
            </CardContent>
          </Card>
          
          <Card className={`bg-gradient-to-br ${getScoreBgColor(creditScoreValue)}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-purple-800">
                <CreditCard className="mr-2 text-purple-600" size={18} />
                AI Credit Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${getScoreColor(creditScoreValue)}`}>
                {creditScoreValue}/{maxCreditScore}
              </p>
              <p className="text-sm text-purple-700 mt-1">
                Perfil crediticio
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-100 to-emerald-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-emerald-800">
                <Award className="mr-2 text-emerald-600" size={18} />
                Certificación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${certificationLevel.color}`}>
                {certificationLevel.name}
              </p>
              <p className="text-sm text-emerald-700 mt-1">
                {trustScoreValue}/100 puntos
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-amber-800">
                <AlertCircle className="mr-2 text-amber-600" size={18} />
                Alertas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-800">
                {creditScoreValue < 600 ? 3 : creditScoreValue < 700 ? 2 : creditScoreValue < 800 ? 1 : 0}
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Requieren atención
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Roadmap Empresarial</h2>
            <div className="flex items-center space-x-2">
              <span className="flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full border border-blue-300">
                <Check className="w-3 h-3 mr-1" /> 
                En progreso
              </span>
              <span className="flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full border border-green-300">
                <CheckCircle2 className="w-3 h-3 mr-1" /> 
                Completado
              </span>
              <span className="flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full border border-gray-300">
                <Calendar className="w-3 h-3 mr-1" /> 
                Pendiente
              </span>
            </div>
          </div>
          
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="relative">
                <div className="absolute left-4 top-4 bottom-6 w-0.5 bg-gray-200 z-0"></div>
                
                <div className="space-y-8">
                  {roadmapSteps.map((step, index) => (
                    <div key={step.id} className="relative z-10">
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                          step.status === 'completed' ? 'bg-green-500' :
                          step.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                        } text-white z-10`}>
                          {step.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                        </div>
                        
                        <div className="ml-4 flex-grow">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                            <div className="flex items-center gap-2">
                              <div className="p-2 rounded-full bg-gray-100">
                                {step.icon}
                              </div>
                              <h3 className="text-lg font-semibold">{step.title}</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(step.status)}`}>
                                {step.status === 'completed' ? 'Completado' : 
                                 step.status === 'in-progress' ? 'En progreso' : 'Pendiente'}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full border flex items-center ${getPriorityColor(step.priority)}`}>
                                {getPriorityIcon(step.priority)}
                                <span className="ml-1">
                                  {step.priority === 'high' ? 'Alta prioridad' : 
                                   step.priority === 'medium' ? 'Prioridad media' : 'Prioridad baja'}
                                </span>
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{step.description}</p>
                          
                          {step.percentComplete !== undefined && (
                            <div className="mb-3">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progreso</span>
                                <span>{step.percentComplete}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    step.status === 'completed' ? 'bg-green-500' :
                                    step.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
                                  }`} 
                                  style={{ width: `${step.percentComplete}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                          
                          <ButtonCustom
                            variant={step.status === 'pending' ? "outline" : "default"}
                            size="sm"
                            onClick={() => navigate(step.linkTo)}
                            rightIcon={<ArrowRight className="h-4 w-4" />}
                            className={`mt-2 ${
                              step.status === 'completed' ? 'bg-green-500 hover:bg-green-600' :
                              step.status === 'in-progress' ? 'bg-blue-500 hover:bg-blue-600' : ''
                            }`}
                          >
                            {step.status === 'completed' ? 'Ver detalles' :
                             step.status === 'in-progress' ? 'Continuar' : 'Comenzar'}
                          </ButtonCustom>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="h-16"></div>
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {renderDashboard()}
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
