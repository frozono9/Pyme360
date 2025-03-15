
import { useState } from "react";
import { AlertTriangle, BarChart2, LineChart, DollarSign, Users, ShoppingCart, Percent, Calendar, Globe, TrendingUp, Info, X, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { LineChart as KpiLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import api from "@/api";

// Tipo para los datos de predicción de KPI
interface KpiPredictionData {
  kpi_type: string;
  initial_value: number;
  final_value: number;
  monthly_values: number[];
  upper_limit: number[];
  lower_limit: number[];
  total_growth_percentage: number;
  monthly_growth_percentage: number;
  volatility: number;
  month_labels: string[];
  market_events: Array<{
    mes: string;
    año: number;
    descripcion: string;
  }>;
  best_month: {
    month: string;
    growth: number;
  };
  worst_month: {
    month: string;
    growth: number;
  };
  factors: {
    seasonality: boolean;
    market_factors: boolean;
    country: string;
    sector: string;
  };
  recommendation: string;
  confidence: string;
}

// Opciones de KPIs disponibles
const kpiOptions = [
  { value: "ingresos", label: "Ingresos", icon: <DollarSign className="h-4 w-4" /> },
  { value: "ventas", label: "Ventas", icon: <ShoppingCart className="h-4 w-4" /> },
  { value: "clientes", label: "Clientes", icon: <Users className="h-4 w-4" /> },
  { value: "margen", label: "Margen Operativo", icon: <Percent className="h-4 w-4" /> },
  { value: "rentabilidad", label: "Rentabilidad (ROI)", icon: <TrendingUp className="h-4 w-4" /> },
];

// Opciones de períodos
const periodOptions = [
  { value: "12m", label: "12 meses" },
  { value: "24m", label: "24 meses" },
  { value: "36m", label: "36 meses" },
];

// Componente de predictor de KPIs
export const KpiPredictor = () => {
  const { toast } = useToast();
  
  // Estados para el formulario
  const [selectedKpi, setSelectedKpi] = useState<string>("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("24m");
  const [includeSeasonality, setIncludeSeasonality] = useState<boolean>(true);
  const [includeMarketFactors, setIncludeMarketFactors] = useState<boolean>(true);
  const [showConfidenceInterval, setShowConfidenceInterval] = useState<boolean>(true);
  
  // Estado para los resultados de la predicción
  const [predictionResult, setPredictionResult] = useState<KpiPredictionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Estado para controlar si se muestra el formulario o los resultados
  const [showResults, setShowResults] = useState<boolean>(false);
  
  // Función para formatear números con comas y dos decimales
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };
  
  // Función para formatear montos grandes
  const formatCurrency = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    } else {
      return `$${num.toFixed(2)}`;
    }
  };
  
  // Función para generar la predicción
  const generatePrediction = async () => {
    if (!selectedKpi) {
      toast({
        title: "Selecciona un KPI",
        description: "Por favor selecciona un tipo de KPI para continuar",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Llamar a la API para generar la predicción
      const response = await api.predictKpi({
        kpi_type: selectedKpi,
        period: selectedPeriod,
        include_seasonality: includeSeasonality,
        include_market_factors: includeMarketFactors,
        show_confidence_interval: showConfidenceInterval
      });
      
      setPredictionResult(response);
      setShowResults(true);
    } catch (error) {
      toast({
        title: "Error al generar predicción",
        description: "No se pudo generar la predicción. Inténtalo de nuevo más tarde.",
        variant: "destructive",
      });
      console.error("Error al generar predicción:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Función para volver al formulario
  const backToForm = () => {
    setShowResults(false);
  };
  
  // Renderizado condicional: formulario o resultados
  if (!showResults) {
    return (
      <Card className="shadow-xl border-none">
        <CardHeader className="pb-4 flex flex-row items-center justify-between">
          <CardTitle className="text-xl md:text-2xl flex items-center">
            <BarChart2 className="mr-2 h-6 w-6 text-pyme-blue" />
            Predictor de KPIs
          </CardTitle>
          <X 
            className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-700 transition-colors" 
            onClick={() => window.history.back()}
          />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de KPI</label>
              <Select value={selectedKpi} onValueChange={setSelectedKpi}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar KPI" />
                </SelectTrigger>
                <SelectContent>
                  {kpiOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="flex items-center">
                      <div className="flex items-center">
                        {option.icon}
                        <span className="ml-2">{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Período de Predicción</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Incluir Estacionalidad</span>
              </div>
              <Switch 
                checked={includeSeasonality}
                onCheckedChange={setIncludeSeasonality}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <span>Incluir Factores de Mercado</span>
              </div>
              <Switch 
                checked={includeMarketFactors}
                onCheckedChange={setIncludeMarketFactors}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4 text-gray-500" />
                <span>Mostrar Intervalo de Confianza</span>
              </div>
              <Switch 
                checked={showConfidenceInterval}
                onCheckedChange={setShowConfidenceInterval}
              />
            </div>
          </div>
          
          <Button 
            onClick={generatePrediction}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando Predicción
              </span>
            ) : (
              <span className="flex items-center">
                <LineChart className="mr-2 h-4 w-4" />
                Generar Predicción
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Si tenemos resultados, mostrar la visualización
  if (predictionResult) {
    // Preparar datos para la gráfica
    const chartData = predictionResult.month_labels.map((month, index) => ({
      name: month,
      value: predictionResult.monthly_values[index],
      upper: predictionResult.upper_limit[index],
      lower: predictionResult.lower_limit[index],
    }));
    
    // Extraer eventos de mercado para marcar en la gráfica
    const marketEvents = predictionResult.market_events.map(event => {
      const eventMonth = `${event.mes} ${event.año}`;
      const monthIndex = predictionResult.month_labels.findIndex(m => m === eventMonth);
      return {
        month: eventMonth,
        index: monthIndex,
        description: event.descripcion,
      };
    });
    
    // Calcular el valor de KPI a mostrar en título
    const kpiTitle = kpiOptions.find(k => k.value === predictionResult.kpi_type)?.label || "KPI";
    
    // Personalizar tooltip para la gráfica
    const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
          <div className="bg-white p-3 border border-gray-200 rounded-md shadow-lg">
            <p className="font-medium">{label}</p>
            <p className="text-blue-600 font-bold">{formatCurrency(data.value)}</p>
            {showConfidenceInterval && (
              <>
                <p className="text-xs text-gray-500">Intervalo de confianza:</p>
                <p className="text-xs text-emerald-600">Superior: {formatCurrency(data.upper)}</p>
                <p className="text-xs text-amber-600">Inferior: {formatCurrency(data.lower)}</p>
              </>
            )}
          </div>
        );
      }
      return null;
    };
    
    return (
      <div className="space-y-6">
        <Card className="shadow-xl border-none">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <div className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-pyme-blue" />
                <CardTitle>Predicción de {kpiTitle}</CardTitle>
              </div>
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm text-blue-600 hover:text-blue-800" 
                onClick={backToForm}
              >
                Volver a editar datos
              </Button>
            </div>
            <X 
              className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-700 transition-colors" 
              onClick={() => window.history.back()}
            />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="border border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Proyección de {kpiTitle} ({selectedPeriod === '12m' ? '12' : selectedPeriod === '24m' ? '24' : '36'} meses)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <KpiLineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} tickMargin={10} />
                        <YAxis 
                          tickFormatter={(value) => formatCurrency(value)}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        
                        {/* Líneas de eventos de mercado */}
                        {marketEvents.map((event, i) => (
                          event.index > 0 && (
                            <ReferenceLine
                              key={i}
                              x={event.month}
                              stroke="#FF8B00"
                              strokeDasharray="3 3"
                              strokeWidth={2}
                            />
                          )
                        ))}
                        
                        {/* Intervalo de confianza */}
                        {showConfidenceInterval && (
                          <>
                            <Line
                              type="monotone"
                              dataKey="upper"
                              stroke="#D1FAE5"
                              strokeWidth={0}
                              dot={false}
                              activeDot={false}
                              fillOpacity={0.2}
                            />
                            <Line
                              type="monotone"
                              dataKey="lower"
                              stroke="#FEF3C7"
                              strokeWidth={0}
                              dot={false}
                              activeDot={false}
                              fillOpacity={0.2}
                            />
                          </>
                        )}
                        
                        {/* Línea principal */}
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#2563EB"
                          strokeWidth={3}
                          dot={{ r: 4, fill: "#2563EB", strokeWidth: 2, stroke: "#ffffff" }}
                          activeDot={{ r: 6, fill: "#1E40AF", strokeWidth: 2, stroke: "#ffffff" }}
                        />
                      </KpiLineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="border border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Resumen</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-800 font-medium">Crecimiento Total</p>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-green-700">
                          +{predictionResult.total_growth_percentage}%
                        </span>
                        <span className="ml-2 text-sm text-green-600">
                          En {selectedPeriod === '12m' ? '12' : selectedPeriod === '24m' ? '24' : '36'} meses
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Valor Inicial</p>
                        <p className="text-lg font-bold">${formatNumber(predictionResult.initial_value)}</p>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Valor Final</p>
                        <p className="text-lg font-bold">${formatNumber(predictionResult.final_value)}</p>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Crecimiento Mensual</p>
                        <p className="text-lg font-semibold">{predictionResult.monthly_growth_percentage}%</p>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Volatilidad</p>
                        <p className="text-lg font-semibold">{predictionResult.volatility}%</p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium">Nivel de Confianza</p>
                        <div className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          {predictionResult.confidence}
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full w-3/5"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Eventos de Mercado */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                Eventos de Mercado
              </h3>
              
              <div className="space-y-2">
                {marketEvents.map((event, i) => (
                  <div key={i} className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      <span className="ml-2 font-medium">{event.month}</span>
                    </div>
                    <p className="mt-1 text-amber-800">{event.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Análisis de Tendencias */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">Análisis de Tendencias</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-green-700 flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Mayor Crecimiento
                  </h4>
                  <p className="mt-2">Mejor período proyectado:</p>
                  <p className="font-semibold text-xl">{predictionResult.best_month.month}</p>
                  <p className="text-green-700 font-medium">+{predictionResult.best_month.growth}% vs mes anterior</p>
                </div>
                
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-amber-700 flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Menor Crecimiento
                  </h4>
                  <p className="mt-2">Período de menor rendimiento:</p>
                  <p className="font-semibold text-xl">{predictionResult.worst_month.month}</p>
                  <p className="text-amber-700 font-medium">{predictionResult.worst_month.growth}% vs mes anterior</p>
                </div>
                
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-blue-700 flex items-center">
                    <Globe className="mr-2 h-5 w-5" />
                    Factores de Influencia
                  </h4>
                  <ul className="mt-2 space-y-1">
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-2">•</span>
                      Estacionalidad {predictionResult.factors.seasonality ? 'incorporada' : 'no considerada'}
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-2">•</span>
                      Factores de mercado {predictionResult.factors.market_factors ? 'considerados' : 'no considerados'}
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-2">•</span>
                      Tendencia: {predictionResult.volatility > 10 ? 'Volátil' : 'Estable'}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Recomendación */}
            <div className="mt-6">
              <Card className="bg-blue-50 border border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center text-blue-700">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Recomendación basada en datos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-900">{predictionResult.recommendation}</p>
                  
                  <Button variant="outline" className="mt-4 bg-white border-blue-200 text-blue-700 hover:bg-blue-50">
                    <span className="flex items-center">
                      Ver plan de acción detallado
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return null;
};
