
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
  Legend
} from 'recharts';

// Interfaces para los tipos de datos que vamos a utilizar
interface HistorialPago {
  fecha: string;
  monto: number;
  estado: string;
}

interface CuentaCredito {
  id: string;
  tipo: string;
  entidad: string;
  fecha_apertura: string;
  monto_original: number;
  saldo_actual: number;
  limite_credito: number;
  tasa_interes: number;
  plazo_meses: number;
  estado: string;
  historial_pagos: HistorialPago[];
}

interface CreditoProveedor {
  id: string;
  proveedor: string;
  terminos_pago: string;
  limite_credito: number;
  saldo_actual: number;
  historial_pagos: HistorialPago[];
}

interface IncidenteCrediticio {
  tipo: string;
  fecha: string;
  entidad: string;
  detalles: string;
  monto: number;
  estado: string;
}

interface HistorialCrediticio {
  cuentas_credito: CuentaCredito[];
  credito_proveedores: CreditoProveedor[];
  incidentes_crediticios: IncidenteCrediticio[];
}

interface CreditScoreCalculatorProps {
  historialCrediticio: HistorialCrediticio;
}

export const CreditScoreCalculator: React.FC<CreditScoreCalculatorProps> = ({ historialCrediticio }) => {
  // 1. Cálculo del historial de pagos (35% del puntaje)
  const calculatePaymentHistoryScore = (): { score: number; data: any } => {
    let totalPayments = 0;
    let latePayments = 0;
    let onTimePayments = 0;
    const paymentsByMonth: Record<string, { late: number; onTime: number }> = {};
    
    // Procesar cuentas de crédito
    historialCrediticio.cuentas_credito.forEach(cuenta => {
      cuenta.historial_pagos.forEach(pago => {
        totalPayments++;
        
        // Extraer mes y año del pago para la gráfica
        const date = new Date(pago.fecha);
        const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`;
        
        if (!paymentsByMonth[monthKey]) {
          paymentsByMonth[monthKey] = { late: 0, onTime: 0 };
        }
        
        if (pago.estado.toLowerCase() === 'a tiempo') {
          onTimePayments++;
          paymentsByMonth[monthKey].onTime++;
        } else {
          latePayments++;
          paymentsByMonth[monthKey].late++;
        }
      });
    });
    
    // Procesar créditos de proveedores
    historialCrediticio.credito_proveedores.forEach(proveedor => {
      proveedor.historial_pagos.forEach(pago => {
        totalPayments++;
        
        // Extraer mes y año del pago para la gráfica
        const date = new Date(pago.fecha);
        const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`;
        
        if (!paymentsByMonth[monthKey]) {
          paymentsByMonth[monthKey] = { late: 0, onTime: 0 };
        }
        
        if (pago.estado.toLowerCase() === 'a tiempo') {
          onTimePayments++;
          paymentsByMonth[monthKey].onTime++;
        } else {
          latePayments++;
          paymentsByMonth[monthKey].late++;
        }
      });
    });
    
    // Calcular el puntaje
    let scoreValue = 50; // Valor por defecto
    let percentage = 0;
    
    if (totalPayments > 0) {
      percentage = (onTimePayments / totalPayments) * 100;
      
      if (percentage >= 98) scoreValue = 100;
      else if (percentage >= 95) scoreValue = 90;
      else if (percentage >= 90) scoreValue = 80;
      else if (percentage >= 85) scoreValue = 70;
      else if (percentage >= 75) scoreValue = 60;
      else scoreValue = Math.floor(percentage / 2);
    }
    
    // Preparar datos para la gráfica
    const chartData = Object.entries(paymentsByMonth).map(([month, counts]) => ({
      month,
      'A tiempo': counts.onTime,
      'Atrasados': counts.late
    })).sort((a, b) => {
      const [aMonth, aYear] = a.month.split('/').map(Number);
      const [bMonth, bYear] = b.month.split('/').map(Number);
      return aYear === bYear ? aMonth - bMonth : aYear - bYear;
    }).slice(-6); // Mostrar solo los últimos 6 meses
    
    return {
      score: scoreValue,
      data: {
        percentage,
        totalPayments,
        onTimePayments,
        latePayments,
        chartData
      }
    };
  };

  // 2. Cálculo de utilización de crédito (30% del puntaje)
  const calculateCreditUtilizationScore = (): { score: number; data: any } => {
    let totalDebt = 0;
    let totalAvailable = 0;
    const utilizationByAccount: { name: string; value: number; limit: number; utilization: number }[] = [];
    
    // Sumar deudas y límites de crédito
    historialCrediticio.cuentas_credito.forEach(cuenta => {
      totalDebt += cuenta.saldo_actual;
      totalAvailable += cuenta.limite_credito;
      
      // Datos para gráfica por cuenta
      utilizationByAccount.push({
        name: cuenta.entidad,
        value: cuenta.saldo_actual,
        limit: cuenta.limite_credito,
        utilization: cuenta.limite_credito > 0 ? (cuenta.saldo_actual / cuenta.limite_credito) * 100 : 0
      });
    });
    
    // Calcular el puntaje
    let scoreValue = 50; // Valor por defecto
    let utilization = 0;
    
    if (totalAvailable > 0) {
      utilization = (totalDebt / totalAvailable) * 100;
      
      if (utilization <= 10) scoreValue = 100;
      else if (utilization <= 30) scoreValue = 90;
      else if (utilization <= 50) scoreValue = 75;
      else if (utilization <= 70) scoreValue = 60;
      else if (utilization <= 90) scoreValue = 40;
      else scoreValue = 20;
    }
    
    // Ordenar cuentas por utilización
    utilizationByAccount.sort((a, b) => b.utilization - a.utilization);
    
    // Colores para la gráfica de utilización
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];
    
    return {
      score: scoreValue,
      data: {
        utilization,
        totalDebt,
        totalAvailable,
        utilizationByAccount,
        colors: COLORS
      }
    };
  };

  // 3. Cálculo de antigüedad crediticia (15% del puntaje)
  const calculateCreditHistoryLengthScore = (): { score: number; data: any } => {
    const currentDate = new Date();
    const accountAges: { entidad: string; years: number }[] = [];
    
    // Calcular la antigüedad de cada cuenta
    historialCrediticio.cuentas_credito.forEach(cuenta => {
      if (cuenta.fecha_apertura) {
        try {
          const fechaApertura = new Date(cuenta.fecha_apertura);
          const years = (currentDate.getTime() - fechaApertura.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
          accountAges.push({ entidad: cuenta.entidad, years });
        } catch (error) {
          console.error("Error en fecha:", error);
        }
      }
    });
    
    // Calcular el puntaje
    let avgAge = 0;
    let scoreValue = 50; // Valor por defecto
    
    if (accountAges.length > 0) {
      avgAge = accountAges.reduce((sum, account) => sum + account.years, 0) / accountAges.length;
      
      if (avgAge >= 7) scoreValue = 100;
      else if (avgAge >= 5) scoreValue = 90;
      else if (avgAge >= 3) scoreValue = 80;
      else if (avgAge >= 2) scoreValue = 70;
      else if (avgAge >= 1) scoreValue = 60;
      else scoreValue = 50;
    }
    
    // Ordenar cuentas por antigüedad
    accountAges.sort((a, b) => b.years - a.years);
    
    // Datos para la gráfica
    const chartData = accountAges.map(account => ({
      name: account.entidad,
      años: parseFloat(account.years.toFixed(1))
    }));
    
    return {
      score: scoreValue,
      data: {
        averageAge: avgAge,
        numAccounts: accountAges.length,
        accountAges,
        chartData
      }
    };
  };

  // 4. Cálculo de mezcla de créditos (10% del puntaje)
  const calculateCreditMixScore = (): { score: number; data: any } => {
    const creditTypes = new Set<string>();
    const typeCounts: Record<string, number> = {};
    
    // Identificar tipos únicos de crédito
    historialCrediticio.cuentas_credito.forEach(cuenta => {
      if (cuenta.tipo) {
        creditTypes.add(cuenta.tipo);
        
        if (!typeCounts[cuenta.tipo]) {
          typeCounts[cuenta.tipo] = 0;
        }
        typeCounts[cuenta.tipo]++;
      }
    });
    
    // Añadir créditos de proveedores como un tipo distinto
    if (historialCrediticio.credito_proveedores && historialCrediticio.credito_proveedores.length > 0) {
      creditTypes.add("Crédito Comercial");
      typeCounts["Crédito Comercial"] = historialCrediticio.credito_proveedores.length;
    }
    
    // Calcular el puntaje
    const numTypes = creditTypes.size;
    let scoreValue = 50; // Valor por defecto
    
    if (numTypes >= 4) scoreValue = 100;
    else if (numTypes === 3) scoreValue = 90;
    else if (numTypes === 2) scoreValue = 75;
    else if (numTypes === 1) scoreValue = 60;
    
    // Datos para la gráfica
    const chartData = Object.entries(typeCounts).map(([type, count]) => ({
      name: type,
      value: count
    }));
    
    // Colores para la gráfica de tipos
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
    
    return {
      score: scoreValue,
      data: {
        numTypes,
        types: Array.from(creditTypes),
        typeCounts,
        chartData,
        colors: COLORS
      }
    };
  };

  // 5. Cálculo de incidentes crediticios (10% del puntaje)
  const calculateIncidentsScore = (): { score: number; data: any } => {
    const incidents = historialCrediticio.incidentes_crediticios || [];
    const numIncidents = incidents.length;
    
    // Calcular el monto total de incidentes
    const totalAmount = incidents.reduce((sum, incident) => sum + incident.monto, 0);
    
    // Calcular el puntaje
    let scoreValue = 100; // Valor por defecto (sin incidentes)
    
    if (numIncidents >= 5) scoreValue = 20;
    else if (numIncidents >= 3) scoreValue = 40;
    else if (numIncidents === 2) scoreValue = 60;
    else if (numIncidents === 1) scoreValue = 80;
    
    // Agrupar incidentes por tipo
    const incidentsByType: Record<string, number> = {};
    incidents.forEach(incident => {
      if (!incidentsByType[incident.tipo]) {
        incidentsByType[incident.tipo] = 0;
      }
      incidentsByType[incident.tipo]++;
    });
    
    // Datos para la gráfica
    const chartData = Object.entries(incidentsByType).map(([type, count]) => ({
      name: type,
      value: count
    }));
    
    // Colores para la gráfica de incidentes
    const COLORS = ['#FF5252', '#FF7F7F', '#FFACAC', '#FFC4C4'];
    
    return {
      score: scoreValue,
      data: {
        numIncidents,
        totalAmount,
        incidents,
        incidentsByType,
        chartData,
        colors: COLORS
      }
    };
  };

  // Calcular todos los componentes
  const paymentHistory = calculatePaymentHistoryScore();
  const creditUtilization = calculateCreditUtilizationScore();
  const historyLength = calculateCreditHistoryLengthScore();
  const creditMix = calculateCreditMixScore();
  const incidents = calculateIncidentsScore();
  
  // Calcular el puntaje final ponderado
  const weightedScore = (
    paymentHistory.score * 0.35 +
    creditUtilization.score * 0.30 +
    historyLength.score * 0.15 +
    creditMix.score * 0.10 +
    incidents.score * 0.10
  );
  
  // Escalar el puntaje al rango de 300-850
  const finalScore = Math.round(300 + (weightedScore / 100) * 550);
  
  // Determinar el nivel del puntaje
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
  
  const scoreLevel = getScoreLevel(finalScore);

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
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Componente Historial de Pagos */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Pagos</CardTitle>
            <CardDescription>
              35% de tu puntaje - {paymentHistory.score} puntos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Porcentaje de pagos a tiempo:</span>
                <span className="font-medium">{paymentHistory.data.percentage.toFixed(1)}%</span>
              </div>
              <Progress value={paymentHistory.data.percentage} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 border border-green-100 rounded-md p-3">
                <div className="text-sm text-muted-foreground">Pagos a tiempo</div>
                <div className="text-xl font-semibold text-green-600">{paymentHistory.data.onTimePayments}</div>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-md p-3">
                <div className="text-sm text-muted-foreground">Pagos atrasados</div>
                <div className="text-xl font-semibold text-red-600">{paymentHistory.data.latePayments}</div>
              </div>
            </div>
            
            {paymentHistory.data.chartData.length > 0 && (
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentHistory.data.chartData}>
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

        {/* Componente Utilización de Crédito */}
        <Card>
          <CardHeader>
            <CardTitle>Utilización de Crédito</CardTitle>
            <CardDescription>
              30% de tu puntaje - {creditUtilization.score} puntos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Utilización general:</span>
                <span className="font-medium">{creditUtilization.data.utilization.toFixed(1)}%</span>
              </div>
              <Progress 
                value={creditUtilization.data.utilization} 
                className="h-2" 
                indicatorColor={
                  creditUtilization.data.utilization <= 30 ? "bg-green-500" :
                  creditUtilization.data.utilization <= 50 ? "bg-yellow-500" :
                  creditUtilization.data.utilization <= 70 ? "bg-orange-500" : "bg-red-500"
                }
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 border border-blue-100 rounded-md p-3">
                <div className="text-sm text-muted-foreground">Deuda Total</div>
                <div className="text-xl font-semibold text-blue-600">${creditUtilization.data.totalDebt.toLocaleString()}</div>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 rounded-md p-3">
                <div className="text-sm text-muted-foreground">Crédito Disponible</div>
                <div className="text-xl font-semibold text-indigo-600">${creditUtilization.data.totalAvailable.toLocaleString()}</div>
              </div>
            </div>
            
            {creditUtilization.data.utilizationByAccount.length > 0 && (
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={creditUtilization.data.utilizationByAccount}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {creditUtilization.data.utilizationByAccount.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={creditUtilization.data.colors[index % creditUtilization.data.colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Componente Antigüedad Crediticia */}
        <Card>
          <CardHeader>
            <CardTitle>Antigüedad Crediticia</CardTitle>
            <CardDescription>
              15% de tu puntaje - {historyLength.score} puntos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Antigüedad promedio:</span>
                <span className="font-medium">{historyLength.data.averageAge.toFixed(1)} años</span>
              </div>
              <Progress value={Math.min(historyLength.data.averageAge * 10, 100)} className="h-2" />
            </div>
            
            <div className="bg-purple-50 border border-purple-100 rounded-md p-3 mb-4">
              <div className="text-sm text-muted-foreground">Número de cuentas</div>
              <div className="text-xl font-semibold text-purple-600">{historyLength.data.numAccounts}</div>
            </div>
            
            {historyLength.data.chartData.length > 0 && (
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historyLength.data.chartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 'dataMax + 1']} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => `${value} años`} />
                    <Bar dataKey="años" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Componente Mezcla de Créditos */}
        <Card>
          <CardHeader>
            <CardTitle>Mezcla de Créditos</CardTitle>
            <CardDescription>
              10% de tu puntaje - {creditMix.score} puntos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Tipos de crédito:</span>
                <span className="font-medium">{creditMix.data.numTypes}</span>
              </div>
              <Progress value={creditMix.data.numTypes * 25} className="h-2" />
            </div>
            
            <div className="bg-indigo-50 border border-indigo-100 rounded-md p-3 mb-4">
              <div className="text-sm text-muted-foreground">Diversidad crediticia</div>
              <div className="text-lg font-medium text-indigo-600">{creditMix.data.types.join(', ')}</div>
            </div>
            
            {creditMix.data.chartData.length > 0 && (
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={creditMix.data.chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {creditMix.data.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={creditMix.data.colors[index % creditMix.data.colors.length]} />
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

        {/* Componente Incidentes Crediticios */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Incidentes Crediticios</CardTitle>
            <CardDescription>
              10% de tu puntaje - {incidents.score} puntos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Historial limpio:</span>
                <span className="font-medium">{incidents.data.numIncidents === 0 ? 'Sí' : 'No'}</span>
              </div>
              <Progress 
                value={100 - (incidents.data.numIncidents * 20)} 
                className="h-2" 
                indicatorColor={
                  incidents.data.numIncidents === 0 ? "bg-green-500" :
                  incidents.data.numIncidents === 1 ? "bg-yellow-500" :
                  incidents.data.numIncidents === 2 ? "bg-orange-500" : "bg-red-500"
                }
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-red-50 border border-red-100 rounded-md p-3">
                <div className="text-sm text-muted-foreground">Número de incidentes</div>
                <div className="text-xl font-semibold text-red-600">{incidents.data.numIncidents}</div>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-md p-3">
                <div className="text-sm text-muted-foreground">Monto total</div>
                <div className="text-xl font-semibold text-red-600">${incidents.data.totalAmount.toLocaleString()}</div>
              </div>
            </div>
            
            {incidents.data.numIncidents > 0 && (
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entidad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {incidents.data.incidents.map((incident, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{incident.tipo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{incident.entidad}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(incident.fecha).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${incident.monto.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            incident.estado === 'Resuelto' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {incident.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreditScoreCalculator;
