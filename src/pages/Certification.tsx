import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import api from "@/api";

const Certification = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [currentScore, setCurrentScore] = useState(0);
  const [trustLevel, setTrustLevel] = useState("");
  const [nextLevel, setNextLevel] = useState("");
  const [certificationData, setCertificationData] = useState([]);
  const [sliderValues, setSliderValues] = useState({
    pagos: 85,
    fiscal: 70,
    crecimiento: 60
  });
  const [estimatedScore, setEstimatedScore] = useState(0);
  const [scoreDifference, setScoreDifference] = useState(0);
  
  useEffect(() => {
    const fetchTrustScoreData = async () => {
      setLoading(true);
      try {
        const trustScoreData = await api.getTrustScore();
        if (trustScoreData) {
          const score = trustScoreData.calificacion_global || 0;
          setCurrentScore(score);
          
          // Determine trust level based on score
          let level = "Bronce";
          let next = "Plata";
          
          if (score >= 90) {
            level = "Platino";
            next = "Máximo";
          } else if (score >= 80) {
            level = "Oro";
            next = "Platino";
          } else if (score >= 70) {
            level = "Plata";
            next = "Oro";
          } else if (score >= 60) {
            level = "Bronce";
            next = "Plata";
          }
          
          setTrustLevel(level);
          setNextLevel(next);
          
          // Get component data for the radar chart
          const components = trustScoreData.componentes || {};
          const radarData = [
            { name: 'Cumplimiento Fiscal', score: components.cumplimiento_fiscal?.puntuacion || 0, fullMark: 100 },
            { name: 'Prácticas Laborales', score: components.practicas_laborales?.puntuacion || 0, fullMark: 100 },
            { name: 'Estabilidad Financiera', score: components.estabilidad_financiera?.puntuacion || 0, fullMark: 100 },
            { name: 'Puntualidad de Pagos', score: components.puntualidad_pagos?.puntuacion || 0, fullMark: 100 },
            { name: 'Innovación', score: components.innovacion?.puntuacion || 0, fullMark: 100 },
            { name: 'Sostenibilidad', score: components.sostenibilidad?.puntuacion || 0, fullMark: 100 },
          ];
          setCertificationData(radarData);
          
          // Set initial slider values based on components
          setSliderValues({
            pagos: components.puntualidad_pagos?.puntuacion || 85,
            fiscal: components.cumplimiento_fiscal?.puntuacion || 70,
            crecimiento: components.estabilidad_financiera?.puntuacion || 60
          });
          
          // Calculate initial estimated score
          const initialEstimate = Math.round((
            (components.puntualidad_pagos?.puntuacion || 85) + 
            (components.cumplimiento_fiscal?.puntuacion || 70) + 
            (components.estabilidad_financiera?.puntuacion || 60)
          ) / 3);
          setEstimatedScore(initialEstimate);
          setScoreDifference(initialEstimate - score);
        }
      } catch (error) {
        console.error("Error fetching trust score data:", error);
        toast({
          variant: "destructive",
          title: "Error de datos",
          description: "No se pudieron cargar los datos de certificación",
        });
        
        // Set default values if API fails
        setCurrentScore(68);
        setTrustLevel("Plata");
        setNextLevel("Oro");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrustScoreData();
  }, [toast]);
  
  // Handle slider changes and recalculate estimated score
  const handleSliderChange = (type, value) => {
    const newValues = { ...sliderValues, [type]: value[0] };
    setSliderValues(newValues);
    
    // Calculate new estimated score based on slider values
    const newEstimate = Math.round((newValues.pagos + newValues.fiscal + newValues.crecimiento) / 3);
    setEstimatedScore(newEstimate);
    setScoreDifference(newEstimate - currentScore);
  };
  
  // Generate recommendations based on certification data
  const getRecommendations = () => {
    const recommendations = [];
    
    if (certificationData.length > 0) {
      // Find weakest areas
      const sortedAreas = [...certificationData].sort((a, b) => a.score - b.score);
      const weakestArea = sortedAreas[0];
      const secondWeakestArea = sortedAreas[1];
      
      if (weakestArea.name === 'Puntualidad de Pagos') {
        recommendations.push({ 
          id: 1, 
          title: 'Mejora tus plazos de pago a proveedores', 
          description: 'Reducir el plazo medio de pago en 5 días aumentaría tu score en 3 puntos.',
          impact: 'alto',
          difficulty: 'media',
          icon: <Clock className="h-5 w-5" />
        });
      } else if (weakestArea.name === 'Cumplimiento Fiscal') {
        recommendations.push({ 
          id: 1, 
          title: 'Actualiza tus certificaciones fiscales', 
          description: 'Cargar tus certificados de estar al corriente aumentaría tu score en 4 puntos.',
          impact: 'alto',
          difficulty: 'baja',
          icon: <FileCheck className="h-5 w-5" />
        });
      } else if (weakestArea.name === 'Sostenibilidad') {
        recommendations.push({ 
          id: 1, 
          title: 'Implementa prácticas sostenibles', 
          description: 'Crear un plan de sostenibilidad ambiental mejoraría tu score en 5 puntos.',
          impact: 'alto',
          difficulty: 'media',
          icon: <Building className="h-5 w-5" />
        });
      }
      
      if (secondWeakestArea.name === 'Prácticas Laborales') {
        recommendations.push({ 
          id: 2, 
          title: 'Mejora las condiciones laborales', 
          description: 'Implementar un programa de bienestar para empleados aumentaría tu score en 3 puntos.',
          impact: 'medio',
          difficulty: 'media',
          icon: <Users className="h-5 w-5" />
        });
      } else if (secondWeakestArea.name === 'Estabilidad Financiera') {
        recommendations.push({ 
          id: 2, 
          title: 'Optimiza tu estructura financiera', 
          description: 'Mejorar tu ratio de deuda/capital aumentaría tu score en 4 puntos.',
          impact: 'alto',
          difficulty: 'media',
          icon: <CreditCard className="h-5 w-5" />
        });
      }
      
      // Always recommend profile completion
      recommendations.push({ 
        id: 3, 
        title: 'Completa tu perfil empresarial', 
        description: 'Añadir información sobre prácticas de sostenibilidad mejoraría tu visibilidad.',
        impact: 'medio',
        difficulty: 'baja',
        icon: <Building className="h-5 w-5" />
      });
    } else {
      // Default recommendations if no data
      recommendations.push({ 
        id: 1, 
        title: 'Mejora tus plazos de pago a proveedores', 
        description: 'Reducir el plazo medio de pago en 5 días aumentaría tu score en 3 puntos.',
        impact: 'alto',
        difficulty: 'media',
        icon: <Clock className="h-5 w-5" />
      });
      
      recommendations.push({ 
        id: 2, 
        title: 'Actualiza tus certificaciones fiscales', 
        description: 'Cargar tus certificados de estar al corriente aumentaría tu score en 4 puntos.',
        impact: 'alto',
        difficulty: 'baja',
        icon: <FileCheck className="h-5 w-5" />
      });
      
      recommendations.push({ 
        id: 3, 
        title: 'Completa tu perfil empresarial', 
        description: 'Añadir información sobre prácticas de sostenibilidad mejoraría tu visibilidad.',
        impact: 'medio',
        difficulty: 'baja',
        icon: <Building className="h-5 w-5" />
      });
    }
    
    return recommendations;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="h-16"></div>
        <div className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-pyme-blue border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-pyme-gray-dark">Cargando datos de certificación...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Get recommendations based on current data
  const recommendations = getRecommendations();
  
  // Calculate level thresholds for the progress bar
  const getThresholdForLevel = (level) => {
    switch (level) {
      case "Bronce": return 50;
      case "Plata": return 65;
      case "Oro": return 80;
      case "Platino": return 95;
      default: return 0;
    }
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
              <CardDescription>Categoría: {trustLevel}</CardDescription>
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
              {certificationData.length > 0 ? (
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
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-pyme-gray-dark">No hay datos disponibles</p>
                </div>  
              )}
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
          
          <Card className="col-span-1 lg:col-span-2 shadow-md hover:shadow-lg transition-shadow">
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
                    <span className="text-sm">{sliderValues.pagos}%</span>
                  </div>
                  <Slider 
                    defaultValue={[sliderValues.pagos]} 
                    value={[sliderValues.pagos]} 
                    max={100} 
                    step={1} 
                    onValueChange={(value) => handleSliderChange('pagos', value)}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Cumplimiento fiscal</label>
                    <span className="text-sm">{sliderValues.fiscal}%</span>
                  </div>
                  <Slider 
                    defaultValue={[sliderValues.fiscal]} 
                    value={[sliderValues.fiscal]} 
                    max={100} 
                    step={1}
                    onValueChange={(value) => handleSliderChange('fiscal', value)}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Crecimiento sostenible</label>
                    <span className="text-sm">{sliderValues.crecimiento}%</span>
                  </div>
                  <Slider 
                    defaultValue={[sliderValues.crecimiento]} 
                    value={[sliderValues.crecimiento]} 
                    max={100} 
                    step={1}
                    onValueChange={(value) => handleSliderChange('crecimiento', value)}
                  />
                </div>
                
                <div className="bg-pyme-blue/5 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Score estimado:</span>
                    <span className="text-lg font-bold text-pyme-blue">{estimatedScore}</span>
                  </div>
                  <div className="text-xs text-pyme-gray-dark flex items-center mt-1">
                    {scoreDifference > 0 ? (
                      <>
                        <TrendingUp className="h-3 w-3 mr-1 text-pyme-success" />
                        <span>+{scoreDifference} puntos respecto a tu score actual</span>
                      </>
                    ) : scoreDifference < 0 ? (
                      <>
                        <TrendingUp className="h-3 w-3 mr-1 text-red-500 transform rotate-180" />
                        <span>{scoreDifference} puntos respecto a tu score actual</span>
                      </>
                    ) : (
                      <span>Sin cambios respecto a tu score actual</span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <h4 className="text-sm font-medium mb-1">Impacto en calificación</h4>
                    <p className="text-xs text-gray-600">Mejorar tus pagos a tiempo en 10% podría incrementar tu score total en hasta 5 puntos.</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <h4 className="text-sm font-medium mb-1">Próximo nivel</h4>
                    <p className="text-xs text-gray-600">Te faltan {getThresholdForLevel(nextLevel) - estimatedScore} puntos para alcanzar nivel {nextLevel}.</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    Plan de Acción Sugerido
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Mejora tu puntualidad de pagos a proveedores</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Actualiza tu documentación fiscal</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Implementa prácticas de sostenibilidad</span>
                    </li>
                  </ul>
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
            <CardDescription>Nivel {trustLevel} ({currentScore} puntos)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-pyme-success flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Tasas preferenciales</h3>
                  <p className="text-sm text-pyme-gray-dark">
                    {trustLevel === "Platino" ? "Acceso a financiamiento con un 1.5% de descuento en tasas de interés" :
                     trustLevel === "Oro" ? "Acceso a financiamiento con un 1% de descuento en tasas de interés" :
                     trustLevel === "Plata" ? "Acceso a financiamiento con un 0.5% de descuento en tasas de interés" :
                     "Acceso a financiamiento con un 0.2% de descuento en tasas de interés"}
                  </p>
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
                  <p className="text-sm text-pyme-gray-dark">
                    {trustLevel === "Platino" ? "Prioridad máxima en listados de búsqueda y posicionamiento" :
                     trustLevel === "Oro" ? "Prioridad alta en listados de búsqueda y posicionamiento" :
                     trustLevel === "Plata" ? "Prioridad media en listados de búsqueda y posicionamiento" :
                     "Prioridad básica en listados de búsqueda y posicionamiento"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-pyme-success flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Redes de negocio</h3>
                  <p className="text-sm text-pyme-gray-dark">
                    {trustLevel === "Platino" ? "Acceso a eventos de networking exclusivos mensual" :
                     trustLevel === "Oro" ? "Acceso a eventos de networking exclusivos bimestral" :
                     trustLevel === "Plata" ? "Acceso a eventos de networking exclusivos trimestral" :
                     "Acceso a eventos de networking exclusivos semestral"}
                  </p>
                </div>
              </div>
              
              {nextLevel !== "Máximo" && (
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-pyme-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Próximo nivel: {nextLevel} ({getThresholdForLevel(nextLevel)}+ puntos)</h3>
                    <p className="text-sm text-pyme-gray-dark">
                      Te faltan {getThresholdForLevel(nextLevel) - currentScore} puntos para desbloquear beneficios adicionales
                    </p>
                  </div>
                </div>
              )}
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

