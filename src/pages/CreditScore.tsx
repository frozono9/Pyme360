
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  CreditCard, 
  LineChart, 
  PieChart, 
  Calendar, 
  MixerHorizontal, 
  AlertTriangle 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChartContainer } from "@/components/ui/chart";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Area,
  AreaChart,
  BarChart,
  Bar,
  Cell,
  Legend,
  Pie,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import api from "@/api";
import { toast } from "@/components/ui/use-toast";

const CreditScore = () => {
  const [creditData, setCreditData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreditData = async () => {
      try {
        setIsLoading(true);
        const user = await api.getCurrentUser();
        
        if (!user) {
          toast({
            title: "Acceso denegado",
            description: "Debes iniciar sesión para acceder a esta página",
            variant: "destructive"
          });
          navigate("/acceso");
          return;
        }
        
        console.log("User data fetched:", user);
        
        // Obtener puntuación crediticia
        const score = await api.getCreditScore();
        
        if (!score) {
          setError("No fue posible calcular tu puntuación crediticia");
          setIsLoading(false);
          return;
        }
        
        console.log("Credit data fetched:", score);
        setCreditData(score);
      } catch (err) {
        console.error("Error fetching credit score:", err);
        setError("Error al cargar la puntuación crediticia");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreditData();
  }, [navigate]);

  // Helper function to get badge color based on score
  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 50) return "bg-amber-500";
    if (score >= 30) return "bg-orange-500";
    return "bg-red-500";
  };

  // Helper function to get a color for a specific score
  const getScoreColor = (score: number) => {
    if (score >= 90) return "#10b981"; // green-500
    if (score >= 70) return "#3b82f6"; // blue-500
    if (score >= 50) return "#f59e0b"; // amber-500
    if (score >= 30) return "#f97316"; // orange-500
    return "#ef4444"; // red-500
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-4 w-full max-w-2xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-[300px] w-full rounded-md" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-[250px] w-full rounded-md" />
                <Skeleton className="h-[250px] w-full rounded-md" />
                <Skeleton className="h-[250px] w-full rounded-md" />
                <Skeleton className="h-[250px] w-full rounded-md" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-500">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{error}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => window.location.reload()}>
                  Reintentar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!creditData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Información no disponible</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No hay suficiente información para calcular tu puntuación crediticia.
                  Completa tu perfil financiero para obtener un análisis detallado.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Accessing nested properties safely with optional chaining
  const paymentHistory = creditData?.components?.payment_history || { score: 0, data: { percentage: 0 } };
  const creditUtilization = creditData?.components?.credit_utilization || { score: 0, data: { utilization: 0 } };
  const historyLength = creditData?.components?.history_length || { score: 0, data: { averageAge: 0 } };
  const creditMix = creditData?.components?.credit_mix || { score: 0, data: { numTypes: 0 } };
  const newApplications = creditData?.components?.new_applications || { score: 0, data: { numIncidents: 0 } };
  const scoreHistory = creditData?.history || [];

  // Create data for score breakdown pie chart
  const scoreBreakdownData = [
    { name: 'Historial de Pagos', value: 35, score: paymentHistory.score || 0 },
    { name: 'Utilización de Crédito', value: 30, score: creditUtilization.score || 0 },
    { name: 'Antigüedad Crediticia', value: 15, score: historyLength.score || 0 },
    { name: 'Mezcla de Créditos', value: 10, score: creditMix.score || 0 },
    { name: 'Solicitudes Recientes', value: 10, score: newApplications.score || 0 },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Puntuación Crediticia</h1>
            <p className="text-muted-foreground">
              Tu puntuación crediticia es calculada en base a tu historial financiero y crediticio. Esta puntuación es utilizada por instituciones financieras para evaluar tu elegibilidad para créditos y préstamos.
            </p>
          </div>
          
          {/* Main score card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Tu Puntaje Actual</CardTitle>
              <CardDescription>
                Basado en tu historial crediticio actual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex flex-col items-center mb-6 md:mb-0">
                  <div className={`w-36 h-36 rounded-full flex items-center justify-center text-4xl font-bold text-white ${creditData.nivel?.color || 'bg-gray-500'}`}>
                    {creditData.score || 'N/A'}
                  </div>
                  <Badge className="mt-3 text-lg px-4 py-1" variant="secondary">
                    {creditData.nivel?.nivel || 'Sin calificar'}
                  </Badge>
                  <p className="text-center mt-2 text-muted-foreground max-w-xs">
                    {creditData.nivel?.description || 'No hay suficiente información para evaluar tu puntuación crediticia.'}
                  </p>
                </div>
                
                <div className="flex-1 ml-0 md:ml-10 w-full md:max-w-md">
                  <h3 className="font-medium mb-2">Evolución de tu puntaje</h3>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={scoreHistory}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[300, 850]} />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#8884d8" 
                          fill="#8884d8" 
                          fillOpacity={0.3} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Score breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle>Desglose del Puntaje</CardTitle>
                  <CardDescription>
                    Componentes de tu puntuación crediticia
                  </CardDescription>
                </div>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={scoreBreakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {scoreBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle>Componentes del Puntaje</CardTitle>
                  <CardDescription>
                    Puntuación por categoría
                  </CardDescription>
                </div>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={scoreBreakdownData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" width={120} />
                      <Tooltip 
                        formatter={(value) => [`${value} puntos`, 'Puntuación']}
                      />
                      <Bar 
                        dataKey="score" 
                        fill="#8884d8" 
                        radius={[0, 4, 4, 0]}
                        label={{ position: 'right', formatter: (value) => value }}
                      >
                        {scoreBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Detailed components */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Payment History */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle>Historial de Pagos</CardTitle>
                  <CardDescription>
                    35% de tu puntaje
                  </CardDescription>
                </div>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Puntuación</span>
                  <Badge className={getScoreBadgeColor(paymentHistory.score || 0)}>
                    {paymentHistory.score || 0}/100
                  </Badge>
                </div>
                <Progress value={paymentHistory.score || 0} className="h-2 mb-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pagos a tiempo</span>
                    <span className="text-sm font-medium">{paymentHistory.data?.percentage?.toFixed(1) || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total de pagos</span>
                    <span className="text-sm font-medium">{paymentHistory.data?.totalPayments || 0}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground border-t pt-4">
                Los pagos a tiempo mejoran significativamente tu puntaje de crédito
              </CardFooter>
            </Card>
            
            {/* Credit Utilization */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle>Utilización de Crédito</CardTitle>
                  <CardDescription>
                    30% de tu puntaje
                  </CardDescription>
                </div>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Puntuación</span>
                  <Badge className={getScoreBadgeColor(creditUtilization.score || 0)}>
                    {creditUtilization.score || 0}/100
                  </Badge>
                </div>
                <Progress value={creditUtilization.score || 0} className="h-2 mb-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Utilización actual</span>
                    <span className="text-sm font-medium">{creditUtilization.data?.utilization?.toFixed(1) || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Deuda total</span>
                    <span className="text-sm font-medium">${creditUtilization.data?.totalDebt?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Crédito disponible</span>
                    <span className="text-sm font-medium">${creditUtilization.data?.totalAvailable?.toLocaleString() || 0}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground border-t pt-4">
                Mantén la utilización por debajo del 30% para un mejor puntaje
              </CardFooter>
            </Card>
            
            {/* Credit History Length */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle>Antigüedad Crediticia</CardTitle>
                  <CardDescription>
                    15% de tu puntaje
                  </CardDescription>
                </div>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Puntuación</span>
                  <Badge className={getScoreBadgeColor(historyLength.score || 0)}>
                    {historyLength.score || 0}/100
                  </Badge>
                </div>
                <Progress value={historyLength.score || 0} className="h-2 mb-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Antigüedad promedio</span>
                    <span className="text-sm font-medium">{historyLength.data?.averageAge?.toFixed(1) || 0} años</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Número de cuentas</span>
                    <span className="text-sm font-medium">{historyLength.data?.numAccounts || 0}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground border-t pt-4">
                Un historial más largo demuestra estabilidad financiera
              </CardFooter>
            </Card>
            
            {/* Credit Mix */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle>Mezcla de Créditos</CardTitle>
                  <CardDescription>
                    10% de tu puntaje
                  </CardDescription>
                </div>
                <MixerHorizontal className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Puntuación</span>
                  <Badge className={getScoreBadgeColor(creditMix.score || 0)}>
                    {creditMix.score || 0}/100
                  </Badge>
                </div>
                <Progress value={creditMix.score || 0} className="h-2 mb-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tipos de crédito</span>
                    <span className="text-sm font-medium">{creditMix.data?.numTypes || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Diversidad</span>
                    <div className="flex flex-wrap justify-end gap-1 max-w-[70%]">
                      {creditMix.data?.types && creditMix.data.types.length > 0 ? (
                        creditMix.data.types.map((type: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">{type}</Badge>
                        ))
                      ) : (
                        <span className="text-sm font-medium">Ninguna</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground border-t pt-4">
                Una variedad de tipos de crédito mejora tu puntuación
              </CardFooter>
            </Card>
            
            {/* New Applications */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle>Solicitudes Recientes</CardTitle>
                  <CardDescription>
                    10% de tu puntaje
                  </CardDescription>
                </div>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Puntuación</span>
                  <Badge className={getScoreBadgeColor(newApplications.score || 0)}>
                    {newApplications.score || 0}/100
                  </Badge>
                </div>
                <Progress value={newApplications.score || 0} className="h-2 mb-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Solicitudes recientes</span>
                    <span className="text-sm font-medium">{newApplications.data?.numIncidents || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Impacto</span>
                    <Badge variant="outline" className={`text-xs ${newApplications.data?.numIncidents > 2 ? 'text-red-500 border-red-200' : 'text-green-500 border-green-200'}`}>
                      {newApplications.data?.numIncidents > 2 ? 'Negativo' : 
                       newApplications.data?.numIncidents > 0 ? 'Moderado' : 'Ninguno'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground border-t pt-4">
                Muchas solicitudes en poco tiempo pueden afectar negativamente tu puntaje
              </CardFooter>
            </Card>
            
            {/* Credit Score Scale */}
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Escala de Puntuación Crediticia</CardTitle>
                <CardDescription>
                  Cómo se compara tu puntuación con el rango estándar (300-850)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-10 w-full bg-gray-200 rounded-full mb-4">
                  <div className="absolute inset-0 flex">
                    <div className="w-[30%] bg-red-500 rounded-l-full"></div>
                    <div className="w-[10%] bg-orange-500"></div>
                    <div className="w-[10%] bg-yellow-500"></div>
                    <div className="w-[20%] bg-blue-500"></div>
                    <div className="w-[30%] bg-green-500 rounded-r-full"></div>
                  </div>
                  
                  {/* Position marker based on score */}
                  {creditData.score && (
                    <div 
                      className="absolute top-full mt-1 transform -translate-x-1/2"
                      style={{ left: `${((creditData.score - 300) / 550) * 100}%` }}
                    >
                      <div className="w-3 h-3 bg-black rounded-full mx-auto mb-1"></div>
                      <span className="text-xs font-bold">{creditData.score}</span>
                    </div>
                  )}
                  
                  {/* Scale labels */}
                  <div className="absolute top-0 left-0 transform -translate-y-full text-xs text-muted-foreground">
                    300
                  </div>
                  <div className="absolute top-0 left-[30%] transform -translate-x-1/2 -translate-y-full text-xs text-muted-foreground">
                    500
                  </div>
                  <div className="absolute top-0 left-[40%] transform -translate-x-1/2 -translate-y-full text-xs text-muted-foreground">
                    580
                  </div>
                  <div className="absolute top-0 left-[50%] transform -translate-x-1/2 -translate-y-full text-xs text-muted-foreground">
                    670
                  </div>
                  <div className="absolute top-0 left-[70%] transform -translate-x-1/2 -translate-y-full text-xs text-muted-foreground">
                    750
                  </div>
                  <div className="absolute top-0 right-0 transform -translate-y-full text-xs text-muted-foreground">
                    850
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-2 mt-8">
                  <div className="flex flex-col items-center">
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 mb-1">Pobre</Badge>
                    <span className="text-xs text-muted-foreground">300-499</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200 mb-1">Bajo</Badge>
                    <span className="text-xs text-muted-foreground">500-579</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 mb-1">Regular</Badge>
                    <span className="text-xs text-muted-foreground">580-669</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 mb-1">Bueno</Badge>
                    <span className="text-xs text-muted-foreground">670-749</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 mb-1">Excelente</Badge>
                    <span className="text-xs text-muted-foreground">750-850</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones para Mejorar</CardTitle>
              <CardDescription>
                Acciones específicas para aumentar tu puntuación crediticia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentHistory.score < 70 && (
                  <div className="p-4 border rounded-lg bg-red-50 border-red-200">
                    <h3 className="font-medium text-red-800">Mejora tu historial de pagos</h3>
                    <p className="text-sm text-red-600">
                      Asegúrate de realizar todos tus pagos a tiempo. Considera configurar recordatorios o pagos automáticos para evitar retrasos.
                    </p>
                  </div>
                )}
                
                {creditUtilization.data?.utilization > 50 && (
                  <div className="p-4 border rounded-lg bg-orange-50 border-orange-200">
                    <h3 className="font-medium text-orange-800">Reduce tu utilización de crédito</h3>
                    <p className="text-sm text-orange-600">
                      Intenta mantener tu utilización de crédito por debajo del 30%. Considera realizar pagos parciales durante el mes para mantener los saldos bajos.
                    </p>
                  </div>
                )}
                
                {historyLength.data?.averageAge < 2 && (
                  <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                    <h3 className="font-medium text-blue-800">Mantén tus cuentas antiguas</h3>
                    <p className="text-sm text-blue-600">
                      No cierres tus cuentas más antiguas, ya que contribuyen positivamente a la longitud de tu historial crediticio.
                    </p>
                  </div>
                )}
                
                {creditMix.data?.numTypes < 3 && (
                  <div className="p-4 border rounded-lg bg-purple-50 border-purple-200">
                    <h3 className="font-medium text-purple-800">Diversifica tus tipos de crédito</h3>
                    <p className="text-sm text-purple-600">
                      Considera obtener diferentes tipos de crédito, como préstamos a plazos, líneas de crédito y créditos comerciales.
                    </p>
                  </div>
                )}
                
                {newApplications.data?.numIncidents > 2 && (
                  <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                    <h3 className="font-medium text-yellow-800">Limita las nuevas solicitudes de crédito</h3>
                    <p className="text-sm text-yellow-600">
                      Evita solicitar múltiples créditos en un corto período de tiempo, ya que cada solicitud puede reducir temporalmente tu puntuación.
                    </p>
                  </div>
                )}
                
                {/* Default recommendation if none of the above apply */}
                {paymentHistory.score >= 70 && creditUtilization.data?.utilization <= 50 && 
                  historyLength.data?.averageAge >= 2 && creditMix.data?.numTypes >= 3 && 
                  newApplications.data?.numIncidents <= 2 && (
                  <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                    <h3 className="font-medium text-green-800">¡Excelente trabajo!</h3>
                    <p className="text-sm text-green-600">
                      Estás manejando bien tu crédito. Continúa con tus buenos hábitos financieros y monitorea regularmente tu informe crediticio.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreditScore;
