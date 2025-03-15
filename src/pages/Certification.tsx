
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Shield, Medal, Award, CrownIcon, Info, TrendingUp, Clock, FileCheck, Building, Users, Briefcase, CreditCard, BadgeCheck, Check, AlertTriangle } from "lucide-react";

const Certification = () => {
  const navigate = useNavigate();
  const [currentScore, setCurrentScore] = useState(68);
  
  // Example certification data
  const certificationData = [
    { name: 'Cumplimiento Fiscal', score: 75, fullMark: 100 },
    { name: 'Prácticas Laborales', score: 82, fullMark: 100 },
    { name: 'Estabilidad Financiera', score: 60, fullMark: 100 },
    { name: 'Puntualidad de Pagos', score: 90, fullMark: 100 },
    { name: 'Innovación', score: 45, fullMark: 100 },
    { name: 'Sostenibilidad', score: 55, fullMark: 100 },
  ];
  
  const historicalScores = [
    { month: 'Ene', score: 52 },
    { month: 'Feb', score: 55 },
    { month: 'Mar', score: 58 },
    { month: 'Abr', score: 62 },
    { month: 'May', score: 65 },
    { month: 'Jun', score: 68 },
  ];
  
  const recommendations = [
    { 
      id: 1, 
      title: 'Mejora tus plazos de pago a proveedores', 
      description: 'Reducir el plazo medio de pago en 5 días aumentaría tu score en 3 puntos.',
      impact: 'alto',
      difficulty: 'media',
      icon: <Clock className="h-5 w-5" />
    },
    { 
      id: 2, 
      title: 'Actualiza tus certificaciones fiscales', 
      description: 'Cargar tus certificados de estar al corriente aumentaría tu score en 4 puntos.',
      impact: 'alto',
      difficulty: 'baja',
      icon: <FileCheck className="h-5 w-5" />
    },
    { 
      id: 3, 
      title: 'Completa tu perfil empresarial', 
      description: 'Añadir información sobre prácticas de sostenibilidad mejoraría tu visibilidad.',
      impact: 'medio',
      difficulty: 'baja',
      icon: <Building className="h-5 w-5" />
    },
  ];
  
  // Custom chart config
  const chartConfig = {
    score: {
      label: "Score",
      theme: {
        light: "#7E69AB",
      },
    },
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Spacer div to prevent content from being hidden under the fixed navbar */}
      <div className="h-16"></div>
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">PyME360 Trust Score</h1>
          <p className="text-pyme-gray-dark">
            Tu certificación actual y recomendaciones para mejorar tu posición en el ecosistema empresarial.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-1 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Tu Score Actual</CardTitle>
              <CardDescription>Categoría: Plata</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center mb-4">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
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
                      stroke="url(#gradient)" 
                      strokeWidth="10" 
                      strokeDasharray={`${currentScore * 2.83} 283`}
                      strokeDashoffset="0" 
                      strokeLinecap="round" 
                      transform="rotate(-90 50 50)" 
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#9b87f5" />
                        <stop offset="100%" stopColor="#7E69AB" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">{currentScore}</span>
                    <span className="text-sm text-pyme-gray-dark">/ 100</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Bronce</span>
                  <span className="text-sm font-medium">Plata</span>
                  <span className="text-sm font-medium">Oro</span>
                  <span className="text-sm font-medium">Platino</span>
                </div>
                <Progress value={currentScore} className="h-2" />
                <div className="flex items-center justify-between text-xs text-pyme-gray-dark">
                  <span>50</span>
                  <span>65</span>
                  <span>80</span>
                  <span>95</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1 lg:col-span-2 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Distribución por Categorías</CardTitle>
              <CardDescription>Tus puntuaciones en cada área clave</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <RadarChart 
                outerRadius={90} 
                width={500} 
                height={300} 
                data={certificationData}
                className="mx-auto"
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar 
                  name="Score" 
                  dataKey="score" 
                  stroke="#7E69AB" 
                  fill="#7E69AB" 
                  fillOpacity={0.5} 
                />
                <Tooltip />
              </RadarChart>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-1 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">
                Niveles de Certificación
              </CardTitle>
              <CardDescription>Requisitos para cada nivel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-gradient-to-r from-violet-400 to-purple-500 text-white p-2 rounded-full">
                    <CrownIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">Platino</h3>
                    <p className="text-xs text-pyme-gray-dark">95+ puntos</p>
                    <p className="text-xs">Liderazgo empresarial y excelencia operativa</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white p-2 rounded-full">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">Oro</h3>
                    <p className="text-xs text-pyme-gray-dark">80+ puntos</p>
                    <p className="text-xs">Prácticas destacadas y crecimiento sostenible</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-gradient-to-r from-gray-300 to-gray-400 text-white p-2 rounded-full">
                    <Medal className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">Plata</h3>
                    <p className="text-xs text-pyme-gray-dark">65+ puntos</p>
                    <p className="text-xs">Buenas prácticas consistentes</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-gradient-to-r from-amber-700 to-amber-800 text-white p-2 rounded-full">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">Bronce</h3>
                    <p className="text-xs text-pyme-gray-dark">50+ puntos</p>
                    <p className="text-xs">Cumplimiento básico de requisitos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">
                Evolución Histórica
              </CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent className="h-[230px]">
              <ChartContainer 
                config={chartConfig}
                className="h-[230px]"
              >
                <BarChart data={historicalScores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[40, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" name="score" fill="#7E69AB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <Card className="col-span-1 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Simulador</CardTitle>
                <Badge variant="outline" className="bg-pyme-blue/10 text-pyme-blue">
                  Beta
                </Badge>
              </div>
              <CardDescription>Estima tu puntuación futura</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Pagos a tiempo</label>
                    <span className="text-sm">85%</span>
                  </div>
                  <Slider defaultValue={[85]} max={100} step={1} />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Cumplimiento fiscal</label>
                    <span className="text-sm">70%</span>
                  </div>
                  <Slider defaultValue={[70]} max={100} step={1} />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Crecimiento sostenible</label>
                    <span className="text-sm">60%</span>
                  </div>
                  <Slider defaultValue={[60]} max={100} step={1} />
                </div>
                
                <div className="bg-pyme-blue/5 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Score estimado:</span>
                    <span className="text-lg font-bold text-pyme-blue">74</span>
                  </div>
                  <div className="text-xs text-pyme-gray-dark flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1 text-pyme-success" />
                    <span>+6 puntos respecto a tu score actual</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Recomendaciones para Mejorar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <Card key={rec.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="bg-pyme-blue/10 text-pyme-blue p-2 rounded-lg mr-3">
                        {rec.icon}
                      </div>
                      <CardTitle className="text-lg">{rec.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-pyme-gray-dark mb-3">{rec.description}</p>
                  <div className="flex justify-between">
                    <Badge variant="outline" className={
                      rec.impact === 'alto' 
                        ? 'bg-pyme-success/10 text-pyme-success' 
                        : 'bg-pyme-warning/10 text-pyme-warning'
                    }>
                      Impacto {rec.impact}
                    </Badge>
                    <Badge variant="outline" className={
                      rec.difficulty === 'baja' 
                        ? 'bg-pyme-success/10 text-pyme-success' 
                        : rec.difficulty === 'media'
                          ? 'bg-pyme-warning/10 text-pyme-warning'
                          : 'bg-red-100 text-red-600'
                    }>
                      Dificultad {rec.difficulty}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <Card className="mb-8 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Beneficios de Tu Nivel Actual</CardTitle>
            <CardDescription>Nivel Plata (68 puntos)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-pyme-success flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Tasas preferenciales</h3>
                  <p className="text-sm text-pyme-gray-dark">Acceso a financiamiento con un 0.5% de descuento en tasas de interés</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-pyme-success flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Sello de certificación</h3>
                  <p className="text-sm text-pyme-gray-dark">Insignia digital verificable para tu sitio web y comunicaciones</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-pyme-success flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Visibilidad en marketplace</h3>
                  <p className="text-sm text-pyme-gray-dark">Prioridad media en listados de búsqueda y posicionamiento</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-pyme-success flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Redes de negocio</h3>
                  <p className="text-sm text-pyme-gray-dark">Acceso a eventos de networking exclusivos trimestral</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-pyme-warning flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Próximo nivel: Oro (80+ puntos)</h3>
                  <p className="text-sm text-pyme-gray-dark">Te faltan 12 puntos para desbloquear beneficios adicionales</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-pyme-blue/5 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="bg-pyme-blue rounded-full p-2 text-white">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">¿Cómo se calcula el Trust Score?</h3>
              <p className="text-pyme-gray-dark mb-4">
                El PyME360 Trust Score se basa en la evaluación de múltiples factores empresariales verificables, 
                incluyendo historial de pagos, situación fiscal, estabilidad financiera, prácticas laborales y medidas 
                de sostenibilidad. El sistema asigna pesos diferentes a cada factor según su relevancia para la salud 
                general del negocio.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <BadgeCheck className="h-4 w-4 text-pyme-blue" />
                  <span className="text-sm">Datos verificados por terceros</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BadgeCheck className="h-4 w-4 text-pyme-blue" />
                  <span className="text-sm">Actualización mensual</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BadgeCheck className="h-4 w-4 text-pyme-blue" />
                  <span className="text-sm">Algoritmo transparente</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BadgeCheck className="h-4 w-4 text-pyme-blue" />
                  <span className="text-sm">Derecho a solicitar revisión</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Certification;
