
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

interface CreditScoreCalculatorProps {
  creditData: any; // Data from API
}

export const CreditScoreCalculator: React.FC<CreditScoreCalculatorProps> = ({ creditData }) => {
  // Use only the data from the API
  const finalScore = creditData?.score || 0;
  const scoreLevel = creditData?.nivel || { nivel: "Sin datos", color: "bg-gray-500", description: "No hay suficiente información" };
  const scoreHistory = creditData?.history || [];

  // Access components directly from API data
  const paymentHistory = creditData?.components?.payment_history || {};
  const creditUtilization = creditData?.components?.credit_utilization || {};
  const historyLength = creditData?.components?.history_length || {};
  const creditMix = creditData?.components?.credit_mix || {};
  const newApplications = creditData?.components?.new_applications || {};

  // Log for debugging
  console.log("Credit data in calculator:", creditData);

  // Helper function to ensure values are available or return defaults
  const safeValue = (value: any, defaultValue: any = 0) => {
    return value !== undefined && value !== null ? value : defaultValue;
  };

  // Helper function to format percentages safely
  const formatPercentage = (value: any) => {
    return safeValue(value, 0).toFixed(1);
  };

  // Helper function to format currency safely
  const formatCurrency = (value: any) => {
    return safeValue(value, 0).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Puntuación Crediticia</CardTitle>
          <CardDescription>
            Basada en tu historial financiero, calculamos tu puntuación crediticia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className={`text-4xl font-bold rounded-full w-32 h-32 flex items-center justify-center ${scoreLevel.color} text-white`}>
              {finalScore}
            </div>
            <Badge className="text-lg px-4 py-2" variant="secondary">{scoreLevel.nivel}</Badge>
            <p className="text-center text-muted-foreground">{scoreLevel.description}</p>
            
            {/* Add score history chart */}
            {scoreHistory && scoreHistory.length > 0 && (
              <div className="w-full h-48 mt-6">
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
        <Card>
          <CardHeader>
            <CardTitle>Historial de Pagos</CardTitle>
            <CardDescription>
              35% de tu puntaje - {safeValue(paymentHistory.score)} puntos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Porcentaje de pagos a tiempo:</span>
                <span className="font-medium">{formatPercentage(paymentHistory.percentage)}%</span>
              </div>
              <Progress value={safeValue(paymentHistory.percentage)} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 border border-green-100 rounded-md p-3">
                <div className="text-sm text-muted-foreground">Pagos a tiempo</div>
                <div className="text-xl font-semibold text-green-600">{safeValue(paymentHistory.on_time_payments)}</div>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-md p-3">
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

        <Card>
          <CardHeader>
            <CardTitle>Utilización de Crédito</CardTitle>
            <CardDescription>
              30% de tu puntaje - {safeValue(creditUtilization.score)} puntos
            </CardDescription>
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
              <div className="bg-blue-50 border border-blue-100 rounded-md p-3">
                <div className="text-sm text-muted-foreground">Deuda Total</div>
                <div className="text-xl font-semibold text-blue-600">${formatCurrency(creditUtilization.total_debt)}</div>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 rounded-md p-3">
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

        <Card>
          <CardHeader>
            <CardTitle>Antigüedad Crediticia</CardTitle>
            <CardDescription>
              15% de tu puntaje - {safeValue(historyLength.score)} puntos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Antigüedad promedio:</span>
                <span className="font-medium">{formatPercentage(historyLength.average_age)} años</span>
              </div>
              <Progress value={Math.min(safeValue(historyLength.average_age) * 10, 100)} className="h-2" />
            </div>
            
            <div className="bg-purple-50 border border-purple-100 rounded-md p-3 mb-4">
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

        <Card>
          <CardHeader>
            <CardTitle>Mezcla de Créditos</CardTitle>
            <CardDescription>
              10% de tu puntaje - {safeValue(creditMix.score)} puntos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Tipos de crédito:</span>
                <span className="font-medium">{safeValue(creditMix.num_types)}</span>
              </div>
              <Progress value={safeValue(creditMix.num_types) * 25} className="h-2" />
            </div>
            
            <div className="bg-indigo-50 border border-indigo-100 rounded-md p-3 mb-4">
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

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Solicitudes Recientes</CardTitle>
            <CardDescription>
              10% de tu puntaje - {safeValue(newApplications.score)} puntos
            </CardDescription>
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
              <div className="bg-red-50 border border-red-100 rounded-md p-3">
                <div className="text-sm text-muted-foreground">Solicitudes en los últimos 12 meses</div>
                <div className="text-xl font-semibold text-red-600">{safeValue(newApplications.recent_applications)}</div>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-md p-3">
                <div className="text-sm text-muted-foreground">Impacto en puntuación</div>
                <div className="text-xl font-semibold text-amber-600">
                  {safeValue(newApplications.recent_applications) > 2 ? 'Alto' : 
                   safeValue(newApplications.recent_applications) > 0 ? 'Medio' : 'Ninguno'}
                </div>
              </div>
            </div>
            
            {/* Add info about recent applications impact */}
            <div className="p-4 border rounded-md bg-blue-50 border-blue-100">
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
