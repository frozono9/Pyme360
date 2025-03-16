
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { Award, CreditCard, Calendar, SlidersHorizontal, AlertTriangle } from 'lucide-react';

interface CreditScoreCalculatorProps {
  creditData: any; // Data from API
}

export const CreditScoreCalculator: React.FC<CreditScoreCalculatorProps> = ({ creditData }) => {
  // Usamos directamente los datos que vienen de la API (desde /database)
  // en lugar de calcularlos con score_calculator.py
  const finalScore = creditData?.score || 0;
  
  // Determinar el nivel de crédito basado en el score
  const getScoreLevel = (score: number) => {
    if (score >= 750) {
      return {
        nivel: "Excelente",
        color: "bg-gradient-to-r from-emerald-400 to-green-500",
        description: "Tu puntaje te posiciona entre el 10% superior, calificando para las mejores tasas y condiciones crediticias."
      };
    } else if (score >= 670) {
      return {
        nivel: "Bueno",
        color: "bg-gradient-to-r from-sky-400 to-blue-500",
        description: "Tu puntaje está por encima del promedio, lo que te permite acceder a condiciones crediticias favorables."
      };
    } else if (score >= 580) {
      return {
        nivel: "Regular",
        color: "bg-gradient-to-r from-amber-400 to-yellow-500",
        description: "Tu puntaje está cerca del promedio. Aún tienes oportunidades de mejora para acceder a mejores condiciones crediticias."
      };
    } else if (score >= 500) {
      return {
        nivel: "Bajo",
        color: "bg-gradient-to-r from-orange-400 to-amber-500",
        description: "Tu puntaje está por debajo del promedio. Podrías enfrentar dificultades para obtener nuevos créditos sin garantías adicionales."
      };
    } else {
      return {
        nivel: "Pobre",
        color: "bg-gradient-to-r from-red-400 to-rose-500",
        description: "Tu puntaje es considerablemente bajo. Te recomendamos enfocarte en mejorar tu historial de pagos y reducir tus deudas actuales."
      };
    }
  };

  const scoreLevel = creditData?.nivel || getScoreLevel(finalScore);
  const scoreHistory = creditData?.history || [];

  // Componentes del credit score desde la API
  const components = creditData?.components || {};
  
  // Componentes individuales con valores por defecto para evitar errores
  const paymentHistory = components?.payment_history || {};
  const creditUtilization = components?.credit_utilization || {};
  const historyLength = components?.history_length || {};
  const creditMix = components?.credit_mix || {};
  const newApplications = components?.new_applications || {};

  // Log para debuggear
  console.log("Credit data en CreditScoreCalculator:", creditData);

  // Helper function para asegurar que hay valores disponibles o usar valores por defecto
  const safeValue = (value: any, defaultValue: any = 0) => {
    return value !== undefined && value !== null ? value : defaultValue;
  };

  // Helper function para formatear porcentajes de forma segura
  const formatPercentage = (value: any) => {
    return safeValue(value, 0).toFixed(1);
  };

  // Helper function para formatear moneda de forma segura
  const formatCurrency = (value: any) => {
    return safeValue(value, 0).toLocaleString();
  };

  // Function para obtener la clase de color basada en el valor del score
  const getScoreColorClass = (score: number) => {
    if (score >= 80) return "bg-green-500 text-white";
    if (score >= 60) return "bg-blue-500 text-white";
    if (score >= 40) return "bg-yellow-500 text-white";
    if (score >= 20) return "bg-orange-500 text-white";
    return "bg-red-500 text-white";
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-t-4 border-t-blue-500 shadow-md">
        <CardHeader className="bg-gradient-to-r from-white to-blue-50">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full p-2 bg-blue-100">
              <Award className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <CardTitle>Puntuación Crediticia</CardTitle>
              <CardDescription>
                Basada en tu historial financiero, calculamos tu puntuación crediticia
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className={`text-4xl font-bold rounded-full w-36 h-36 flex items-center justify-center ${scoreLevel.color} shadow-lg transition-all duration-300 hover:scale-105`}>
                {finalScore}
              </div>
              <Badge className="text-lg px-4 py-2" variant="secondary">{scoreLevel.nivel}</Badge>
              <p className="text-center text-muted-foreground max-w-xs">{scoreLevel.description}</p>
            </div>
            
            {/* Add score history chart */}
            {scoreHistory && scoreHistory.length > 0 && (
              <div className="w-full md:w-2/3 h-48 mt-6">
                <h3 className="text-sm font-medium mb-2 text-center">Historial de puntuación</h3>
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
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-white to-blue-50">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-blue-100">
                <CreditCard className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <CardTitle>Historial de Pagos</CardTitle>
                <CardDescription>
                  35% de tu puntaje - {safeValue(paymentHistory.score)} puntos
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Porcentaje de pagos a tiempo:</span>
                <span className="font-medium">{formatPercentage(paymentHistory.percentage)}%</span>
              </div>
              <div className="relative pt-1">
                <Progress 
                  value={safeValue(paymentHistory.percentage)} 
                  className={`h-2 ${safeValue(paymentHistory.percentage) >= 80 ? "bg-green-500" : 
                    safeValue(paymentHistory.percentage) >= 60 ? "bg-blue-500" : 
                    safeValue(paymentHistory.percentage) >= 40 ? "bg-yellow-500" : 
                    safeValue(paymentHistory.percentage) >= 20 ? "bg-orange-500" : "bg-red-500"}`} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 border border-green-100 rounded-md p-3 shadow-sm">
                <div className="text-sm text-muted-foreground">Pagos a tiempo</div>
                <div className="text-xl font-semibold text-green-600">{safeValue(paymentHistory.on_time_payments)}</div>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-md p-3 shadow-sm">
                <div className="text-sm text-muted-foreground">Pagos atrasados</div>
                <div className="text-xl font-semibold text-red-600">{safeValue(paymentHistory.late_payments)}</div>
              </div>
            </div>
            
            {/* Only show chart if we have data */}
            {paymentHistory.chart_data && paymentHistory.chart_data.length > 0 && (
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentHistory.chart_data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="A tiempo" fill="#4ade80" />
                    <Bar dataKey="Atrasados" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-white to-blue-50">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-blue-100">
                <SlidersHorizontal className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <CardTitle>Utilización de Crédito</CardTitle>
                <CardDescription>
                  30% de tu puntaje - {safeValue(creditUtilization.score)} puntos
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Utilización general:</span>
                <span className="font-medium">{formatPercentage(creditUtilization.utilization)}%</span>
              </div>
              <div className="relative pt-1">
                <Progress 
                  value={safeValue(creditUtilization.utilization)} 
                  className="h-2"
                />
                <div 
                  className={`absolute inset-0 h-2 rounded-full ${
                    safeValue(creditUtilization.utilization) <= 30 ? "bg-green-500" :
                    safeValue(creditUtilization.utilization) <= 50 ? "bg-yellow-500" :
                    safeValue(creditUtilization.utilization) <= 70 ? "bg-orange-500" : "bg-red-500"
                  }`}
                  style={{ 
                    width: `${Math.min(safeValue(creditUtilization.utilization), 100)}%`,
                    maxWidth: "100%" 
                  }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 border border-blue-100 rounded-md p-3 shadow-sm">
                <div className="text-sm text-muted-foreground">Deuda Total</div>
                <div className="text-xl font-semibold text-blue-600">${formatCurrency(creditUtilization.total_debt)}</div>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 rounded-md p-3 shadow-sm">
                <div className="text-sm text-muted-foreground">Crédito Disponible</div>
                <div className="text-xl font-semibold text-indigo-600">${formatCurrency(creditUtilization.total_available)}</div>
              </div>
            </div>
            
            {/* Only show chart if we have data */}
            {creditUtilization.accounts && creditUtilization.accounts.length > 0 && (
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={creditUtilization.accounts}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name || 'N/A'}: ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {creditUtilization.accounts.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'][index % 6]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${Number(value || 0).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-white to-blue-50">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-blue-100">
                <Calendar className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <CardTitle>Antigüedad Crediticia</CardTitle>
                <CardDescription>
                  15% de tu puntaje - {safeValue(historyLength.score)} puntos
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Antigüedad promedio:</span>
                <span className="font-medium">{formatPercentage(historyLength.average_age)} años</span>
              </div>
              <Progress value={Math.min(safeValue(historyLength.average_age) * 10, 100)} className="h-2" />
            </div>
            
            <div className="bg-purple-50 border border-purple-100 rounded-md p-3 mb-4 shadow-sm">
              <div className="text-sm text-muted-foreground">Número de cuentas</div>
              <div className="text-xl font-semibold text-purple-600">{safeValue(historyLength.num_accounts)}</div>
            </div>
            
            {/* Only show chart if we have data */}
            {historyLength.accounts && historyLength.accounts.length > 0 && (
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historyLength.accounts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 'dataMax + 1']} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => `${value} años`} />
                    <Bar dataKey="years" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-white to-blue-50">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-blue-100">
                <AlertTriangle className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <CardTitle>Mezcla de Créditos</CardTitle>
                <CardDescription>
                  10% de tu puntaje - {safeValue(creditMix.score)} puntos
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Tipos de crédito:</span>
                <span className="font-medium">{safeValue(creditMix.num_types)}</span>
              </div>
              <Progress value={safeValue(creditMix.num_types) * 25} className="h-2" />
            </div>
            
            <div className="bg-indigo-50 border border-indigo-100 rounded-md p-3 mb-4 shadow-sm">
              <div className="text-sm text-muted-foreground">Diversidad crediticia</div>
              <div className="text-lg font-medium text-indigo-600">
                {creditMix.types && Array.isArray(creditMix.types) ? creditMix.types.join(', ') : 'N/A'}
              </div>
            </div>
            
            {/* Only show chart if we have data */}
            {creditMix.type_counts && creditMix.type_counts.length > 0 && (
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={creditMix.type_counts}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name || 'N/A'}: ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {creditMix.type_counts.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-white to-blue-50">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-blue-100">
                <AlertTriangle className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <CardTitle>Solicitudes Recientes</CardTitle>
                <CardDescription>
                  10% de tu puntaje - {safeValue(newApplications.score)} puntos
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Historial limpio:</span>
                <span className="font-medium">
                  {safeValue(newApplications.recent_applications) === 0 ? 'Sí' : 'No'}
                </span>
              </div>
              <div className="relative pt-1">
                <Progress value={100 - (safeValue(newApplications.recent_applications) * 20)} className="h-2" />
                {safeValue(newApplications.recent_applications) > 0 && (
                  <div 
                    className={`absolute inset-0 h-2 rounded-full ${
                      safeValue(newApplications.recent_applications) === 1 ? "bg-yellow-500" :
                      safeValue(newApplications.recent_applications) === 2 ? "bg-orange-500" : "bg-red-500"
                    }`} 
                    style={{ 
                      width: `${100 - (safeValue(newApplications.recent_applications) * 20)}%`, 
                      maxWidth: "100%" 
                    }}
                  />
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-red-50 border border-red-100 rounded-md p-3 shadow-sm">
                <div className="text-sm text-muted-foreground">Solicitudes en los últimos 12 meses</div>
                <div className="text-xl font-semibold text-red-600">{safeValue(newApplications.recent_applications)}</div>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-md p-3 shadow-sm">
                <div className="text-sm text-muted-foreground">Impacto en puntuación</div>
                <div className="text-xl font-semibold text-amber-600">
                  {safeValue(newApplications.recent_applications) > 2 ? 'Alto' : 
                   safeValue(newApplications.recent_applications) > 0 ? 'Medio' : 'Ninguno'}
                </div>
              </div>
            </div>
            
            {/* Add info about recent applications impact */}
            <div className="p-4 border rounded-md bg-blue-50 border-blue-100 shadow-sm">
              <p className="text-sm text-blue-800">
                Cada nueva solicitud de crédito puede reducir temporalmente tu puntuación en aproximadamente 5-10 puntos.
                Estas solicitudes permanecen en tu historial durante 12 meses, pero solo afectan tu puntuación durante
                los primeros 6 meses en la mayoría de los casos.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreditScoreCalculator;
