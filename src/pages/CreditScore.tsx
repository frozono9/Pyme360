
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { ArrowUpRight, ArrowDownRight, AlertCircle, CheckCircle, TrendingUp, Lock, Shield, CreditCard, DollarSign, Info, Clock, Calendar, BarChart2, PieChart as PieChartIcon, ChevronRight, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import api from "@/api";

const CreditScore = () => {
  const [creditScore, setCreditScore] = useState(625);
  const [selectedTab, setSelectedTab] = useState("resumen");
  const [isLoading, setIsLoading] = useState(true);
  const [creditScoreData, setCreditScoreData] = useState(null);
  const [activeDeudasData, setActiveDeudasData] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Factores predeterminados para el cálculo del score
  const defaultFactoresScore = [
    { name: 'Historial de Pagos', value: 35, color: '#7E69AB' },
    { name: 'Nivel de Endeudamiento', value: 30, color: '#9b87f5' },
    { name: 'Antigüedad Crediticia', value: 15, color: '#6E59A5' },
    { name: 'Nuevos Créditos', value: 10, color: '#D6BCFA' },
    { name: 'Tipos de Crédito', value: 10, color: '#E5DEFF' },
  ];
  
  // Recomendaciones predeterminadas
  const defaultRecomendaciones = [
    {
      id: 1,
      titulo: 'Reducir Saldo de Tarjetas',
      descripcion: 'Mantén el uso de tus tarjetas por debajo del 30% del límite de crédito.',
      impacto: 'alto',
      icon: <CreditCard size={20} />
    },
    {
      id: 2,
      titulo: 'Pagos Puntuales',
      descripcion: 'Establece recordatorios para evitar pagos tardíos en los próximos meses.',
      impacto: 'alto',
      icon: <Clock size={20} />
    },
    {
      id: 3,
      titulo: 'Evitar Solicitudes',
      descripcion: 'Limita las solicitudes de crédito nuevas durante los próximos 6 meses.',
      impacto: 'medio',
      icon: <AlertCircle size={20} />
    }
  ];
  
  // Chart config con tema claro y oscuro
  const chartConfig = {
    score: {
      label: "Score",
      theme: {
        light: "#7E69AB",
        dark: "#9b87f5"
      },
    },
  };

  // Función para cargar los datos de puntuación crediticia y deudas
  useEffect(() => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Acceso no autorizado",
        description: "Debes iniciar sesión para ver esta página",
        variant: "destructive",
      });
      navigate("/acceso");
      return;
    }

    // Función para cargar datos
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Obtener datos de puntuación crediticia
        const scoreData = await api.getCreditScore();
        setCreditScoreData(scoreData);
        setCreditScore(scoreData.score);
        
        // Obtener datos de deudas activas
        const debtData = await api.getActiveDebts();
        setActiveDeudasData(debtData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos. Por favor, intenta nuevamente.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate, toast]);
  
  // Determinar el nivel del score con los datos reales o los predeterminados
  const getNivelScore = (score) => {
    if (creditScoreData && creditScoreData.nivel) {
      return creditScoreData.nivel;
    }
    
    if (score >= 750) return { nivel: 'Excelente', color: 'bg-gradient-to-r from-emerald-400 to-green-500' };
    if (score >= 670) return { nivel: 'Bueno', color: 'bg-gradient-to-r from-sky-400 to-blue-500' };
    if (score >= 580) return { nivel: 'Regular', color: 'bg-gradient-to-r from-amber-400 to-yellow-500' };
    if (score >= 500) return { nivel: 'Bajo', color: 'bg-gradient-to-r from-orange-400 to-amber-500' };
    return { nivel: 'Pobre', color: 'bg-gradient-to-r from-red-400 to-rose-500' };
  };
  
  const scoreInfo = creditScoreData?.nivel || getNivelScore(creditScore);
  
  // Obtener historial crediticio del API o usar el predeterminado
  const creditScoreHistory = creditScoreData?.history || [
    { month: 'Ene', score: 580 },
    { month: 'Feb', score: 592 },
    { month: 'Mar', score: 603 },
    { month: 'Abr', score: 610 },
    { month: 'May', score: 618 },
    { month: 'Jun', score: 625 },
  ];
  
  // Obtener deudas activas del API o usar las predeterminadas
  const deudas = activeDeudasData?.deudas || [
    { tipo: 'Tarjeta de Crédito', entidad: 'Banco Nacional', monto: 4500, interes: '24.9%', fecha: '15/07/2024', estatus: 'Al día' },
    { tipo: 'Préstamo Personal', entidad: 'Financiera Central', monto: 12000, interes: '16.5%', fecha: '28/07/2024', estatus: 'Al día' },
    { tipo: 'Crédito Automotriz', entidad: 'Auto Finance', monto: 35000, interes: '11.2%', fecha: '10/07/2024', estatus: 'Con retraso' },
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Spacer para evitar que el navbar fijo oculte contenido */}
      <div className="h-16"></div>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Puntaje Crediticio</h1>
          <p className="text-pyme-gray-dark">
            Monitorea tu historial crediticio y recibe recomendaciones personalizadas para mejorar tu score.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-pyme-blue" />
            <span className="ml-3 text-lg">Cargando información crediticia...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Tarjeta principal con el score */}
              <Card className="col-span-1 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Tu Score Actual</CardTitle>
                  <CardDescription>Actualizado hoy</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center mb-6">
                    <div className="relative w-48 h-48 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="45" 
                          fill="none" 
                          stroke="#e5e7eb" 
                          strokeWidth="10" 
                        />
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="45" 
                          fill="none" 
                          stroke={`url(#creditScoreGradient)`} 
                          strokeWidth="10" 
                          strokeDasharray={`${Math.min((creditScore / 850) * 283, 283)} 283`}
                          strokeLinecap="round" 
                        />
                        <defs>
                          <linearGradient id="creditScoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={scoreInfo.nivel === 'Pobre' ? '#f87171' : '#9b87f5'} />
                            <stop offset="100%" stopColor={scoreInfo.nivel === 'Pobre' ? '#ef4444' : '#7E69AB'} />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold">{creditScore}</span>
                        <span className="text-sm text-pyme-gray-dark">/ 850</span>
                        <span className={`text-sm font-medium px-2 py-1 rounded-full mt-1 text-white ${scoreInfo.color}`}>
                          {scoreInfo.nivel}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Pobre</span>
                      <span className="text-sm">Regular</span>
                      <span className="text-sm">Bueno</span>
                      <span className="text-sm">Excelente</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                      <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"></div>
                    </div>
                    <div className="flex justify-between text-xs text-pyme-gray-dark">
                      <span>300</span>
                      <span>500</span>
                      <span>670</span>
                      <span>850</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Tarjeta con la distribución de factores */}
              <Card className="col-span-1 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Factores de tu Score</CardTitle>
                  <CardDescription>Distribución porcentual</CardDescription>
                </CardHeader>
                <CardContent className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={defaultFactoresScore}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {defaultFactoresScore.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Tarjeta con la evolución histórica */}
              <Card className="col-span-1 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Evolución Histórica</CardTitle>
                  <CardDescription>Últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent className="h-[260px]">
                  <ChartContainer config={chartConfig} className="h-[260px]">
                    <LineChart data={creditScoreHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[
                        Math.max(300, Math.floor((Math.min(...creditScoreHistory.map(item => item.score)) - 20) / 10) * 10),
                        Math.min(850, Math.ceil((Math.max(...creditScoreHistory.map(item => item.score)) + 20) / 10) * 10)
                      ]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#7E69AB" 
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
            
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="resumen">Resumen</TabsTrigger>
                <TabsTrigger value="recomendaciones">Recomendaciones</TabsTrigger>
                <TabsTrigger value="deudas">Deudas Activas</TabsTrigger>
              </TabsList>
              <TabsContent value="resumen">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="col-span-1 lg:col-span-2 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl flex items-center">
                        <BarChart2 className="w-5 h-5 mr-2" />
                        Comparativa Nacional
                      </CardTitle>
                      <CardDescription>Tu posición relativa al promedio nacional</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>Tu Score: <strong>{creditScore}</strong></span>
                            <span>Promedio Nacional: <strong>650</strong></span>
                          </div>
                          <div className="w-full h-6 bg-gray-100 rounded-full relative">
                            <div className="h-6 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"></div>
                            <div className="absolute top-0 h-6 w-0.5 bg-black" style={{ left: `${(650/850)*100}%` }}></div>
                            <div 
                              className="absolute top-0 h-6 w-1 bg-pyme-blue" 
                              style={{ left: `${(creditScore/850)*100}%` }}
                            >
                              <div className="w-3 h-3 rounded-full bg-pyme-blue absolute -top-3 -left-1"></div>
                              <span className="absolute -top-8 -left-4 text-xs bg-pyme-blue text-white px-2 py-1 rounded">{creditScore}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium mb-2 flex items-center">
                              <TrendingUp className="w-4 h-4 mr-1 text-pyme-success" />
                              Fortalezas
                            </h3>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start">
                                <CheckCircle className="w-4 h-4 mr-2 text-pyme-success flex-shrink-0 mt-0.5" />
                                <span>
                                  {creditScoreData?.components?.history_length?.average_age > 5 
                                    ? 'Antigüedad crediticia de más de 5 años' 
                                    : 'Historial de pagos consistente'}
                                </span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="w-4 h-4 mr-2 text-pyme-success flex-shrink-0 mt-0.5" />
                                <span>
                                  {creditScoreData?.components?.credit_mix?.num_types >= 2 
                                    ? 'Diversidad en tipos de crédito' 
                                    : 'Bajo número de solicitudes recientes'}
                                </span>
                              </li>
                            </ul>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium mb-2 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1 text-pyme-warning" />
                              Áreas de mejora
                            </h3>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start">
                                <ArrowDownRight className="w-4 h-4 mr-2 text-pyme-warning flex-shrink-0 mt-0.5" />
                                <span>
                                  {creditScoreData?.components?.credit_utilization?.utilization > 50
                                    ? 'Alto porcentaje de utilización de tarjetas'
                                    : 'Incrementar antigüedad crediticia promedio'}
                                </span>
                              </li>
                              <li className="flex items-start">
                                <ArrowDownRight className="w-4 h-4 mr-2 text-pyme-warning flex-shrink-0 mt-0.5" />
                                <span>
                                  {creditScoreData?.components?.payment_history?.late_payments > 0
                                    ? 'Retrasos en pagos recientes'
                                    : 'Diversificar tipos de crédito'}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="col-span-1 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl flex items-center">
                        <Info className="w-5 h-5 mr-2" />
                        ¿Qué significa?
                      </CardTitle>
                      <CardDescription>Tu nivel de score actual</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className={`p-4 rounded-lg mb-4 ${scoreInfo.color} text-white`}>
                        <h3 className="font-medium mb-1">{scoreInfo.nivel}</h3>
                        <p className="text-sm">
                          {scoreInfo.description || (
                            scoreInfo.nivel === 'Regular' 
                              ? 'Tu puntaje está cerca del promedio. Aún tienes oportunidades de mejora para acceder a mejores condiciones crediticias.'
                              : scoreInfo.nivel === 'Bueno'
                                ? 'Tu puntaje está por encima del promedio, lo que te permite acceder a condiciones crediticias favorables.'
                                : scoreInfo.nivel === 'Excelente'
                                  ? 'Tu puntaje te posiciona entre el 10% superior, calificando para las mejores tasas y condiciones crediticias.'
                                  : scoreInfo.nivel === 'Bajo'
                                    ? 'Tu puntaje está por debajo del promedio. Podrías enfrentar dificultades para obtener nuevos créditos sin garantías adicionales.'
                                    : 'Tu puntaje es considerablemente bajo. Te recomendamos enfocarte en mejorar tu historial de pagos y reducir tus deudas actuales.'
                          )}
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <DollarSign className="w-5 h-5 text-pyme-gray-dark mr-3 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium">Acceso a crédito</h4>
                            <p className="text-sm text-pyme-gray-dark">
                              {creditScore >= 700 
                                ? 'Calificarás para la mayoría de los créditos con tasas preferenciales.'
                                : creditScore >= 600
                                  ? 'Probablemente calificarás para la mayoría de los créditos, pero con tasas de interés promedio.'
                                  : 'Podrías enfrentar dificultades para obtener créditos con buenas tasas sin garantías adicionales.'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Calendar className="w-5 h-5 text-pyme-gray-dark mr-3 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium">Tiempo estimado de mejora</h4>
                            <p className="text-sm text-pyme-gray-dark">
                              {creditScore >= 700 
                                ? 'Mantén tus hábitos financieros actuales para conservar tu excelente puntuación.'
                                : creditScore >= 600
                                  ? 'Con hábitos financieros saludables, podrías mejorar tu score en 3-6 meses.'
                                  : 'Con un plan estructurado de pagos puntuales y reducción de deudas, podrías ver mejoras significativas en 6-12 meses.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="recomendaciones">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {defaultRecomendaciones.map((rec) => (
                    <Card key={rec.id} className="shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-pyme-blue/10 text-pyme-blue p-2 rounded-lg mr-3">
                              {rec.icon}
                            </div>
                            <CardTitle className="text-lg">{rec.titulo}</CardTitle>
                          </div>
                          <Badge variant="outline" className={
                            rec.impacto === 'alto' 
                              ? 'bg-pyme-success/10 text-pyme-success' 
                              : 'bg-pyme-warning/10 text-pyme-warning'
                          }>
                            Impacto {rec.impacto}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-pyme-gray-dark mb-4">{rec.descripcion}</p>
                        <Button variant="outline" className="w-full">
                          Ver detalles <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Card className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-pyme-blue/5 to-transparent">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <div className="bg-pyme-blue/10 text-pyme-blue p-2 rounded-lg mr-3">
                          <Lock size={20} />
                        </div>
                        <CardTitle className="text-lg">Asesoría Personalizada</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-pyme-gray-dark mb-4">
                        Obtén una evaluación detallada de tu situación crediticia y un plan de acción personalizado.
                      </p>
                      <Button className="w-full">
                        Desbloquear <Shield className="ml-1 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="deudas">
                <Card className="shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Tus Deudas Activas</CardTitle>
                    <CardDescription>Información actualizada de tus compromisos financieros</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Tipo</th>
                            <th className="text-left py-3 px-4">Entidad</th>
                            <th className="text-right py-3 px-4">Monto (MXN)</th>
                            <th className="text-center py-3 px-4">Tasa</th>
                            <th className="text-center py-3 px-4">Próximo Pago</th>
                            <th className="text-center py-3 px-4">Estatus</th>
                          </tr>
                        </thead>
                        <tbody>
                          {deudas.map((deuda, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4">{deuda.tipo}</td>
                              <td className="py-3 px-4">{deuda.entidad}</td>
                              <td className="py-3 px-4 text-right">
                                ${deuda.monto.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-center">{deuda.interes}</td>
                              <td className="py-3 px-4 text-center">{deuda.fecha}</td>
                              <td className="py-3 px-4 text-center">
                                <Badge variant="outline" className={
                                  deuda.estatus === 'Al día' 
                                    ? 'bg-pyme-success/10 text-pyme-success' 
                                    : 'bg-pyme-warning/10 text-pyme-warning'
                                }>
                                  {deuda.estatus}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-3">
                        <h3 className="font-medium">Resumen de Deudas</h3>
                        <span className="font-medium">
                          ${deudas.reduce((sum, deuda) => sum + deuda.monto, 0).toLocaleString()} MXN
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {/* Agrupar y calcular porcentajes por tipo de deuda */}
                        {Object.entries(
                          deudas.reduce((acc, deuda) => {
                            const tipo = deuda.tipo;
                            if (!acc[tipo]) acc[tipo] = 0;
                            acc[tipo] += deuda.monto;
                            return acc;
                          }, {})
                        ).map(([tipo, monto], index) => {
                          const totalDeudas = deudas.reduce((sum, d) => sum + d.monto, 0);
                          const porcentaje = totalDeudas > 0 ? (monto / totalDeudas) * 100 : 0;
                          
                          return (
                            <div key={index}>
                              <div className="flex justify-between text-sm mb-1">
                                <span>{tipo}</span>
                                <span>${monto.toLocaleString()} ({Math.round(porcentaje)}%)</span>
                              </div>
                              <Progress value={porcentaje} className="h-2" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <Card className="mb-8 bg-pyme-blue/5 border-pyme-blue/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  Acerca de tu Puntaje Crediticio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">¿Qué es?</h3>
                    <p className="text-sm text-pyme-gray-dark">
                      El puntaje crediticio es una calificación numérica que representa tu historial de crédito 
                      y la probabilidad de que pagues tus deudas a tiempo.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">¿Cómo se calcula?</h3>
                    <p className="text-sm text-pyme-gray-dark">
                      Se considera tu historial de pagos, nivel de endeudamiento, antigüedad crediticia, 
                      nuevos créditos y la mezcla de tipos de crédito.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">¿Por qué es importante?</h3>
                    <p className="text-sm text-pyme-gray-dark">
                      Un buen puntaje te permite acceder a mejores tasas de interés, mayores líneas de crédito 
                      y mejores condiciones financieras.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CreditScore;
