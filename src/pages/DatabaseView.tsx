
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/api";
import { Database, LayoutDashboard, Calculator } from "lucide-react";

const DatabaseView = () => {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const user = await api.getCurrentUser();
        if (!user) {
          navigate("/acceso");
          return;
        }
        setUserData(user);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Error al cargar los datos del usuario");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Function to render json data recursively in a readable format
  const renderJsonData = (data: any, level = 0) => {
    if (data === null || data === undefined) return <span className="text-gray-400">null</span>;
    
    if (typeof data !== 'object') {
      // Render primitive values
      if (typeof data === 'string') return <span className="text-green-600">"{data}"</span>;
      if (typeof data === 'number') return <span className="text-blue-600">{data}</span>;
      if (typeof data === 'boolean') return <span className="text-purple-600">{data.toString()}</span>;
      return <span>{String(data)}</span>;
    }
    
    const isArray = Array.isArray(data);
    const padding = level * 20; // Indent based on nesting level
    
    if (Object.keys(data).length === 0) {
      return <span className="text-gray-500">{isArray ? '[]' : '{}'}</span>;
    }

    return (
      <div style={{ paddingLeft: `${padding}px` }}>
        <span className="text-gray-500">{isArray ? '[' : '{'}</span>
        <div className="pl-4">
          {Object.entries(data).map(([key, value], index) => (
            <div key={key} className="flex flex-wrap">
              <span className="text-red-500 font-semibold">{isArray ? index : `"${key}"`}</span>
              <span className="text-gray-500 mx-1">{isArray ? ':' : ' : '}</span>
              {renderJsonData(value, level + 1)}
              {index < Object.keys(data).length - 1 && <span className="text-gray-500">,</span>}
            </div>
          ))}
        </div>
        <span className="text-gray-500">{isArray ? ']' : '}'}</span>
      </div>
    );
  };

  // Function to calculate and render credit score components
  const renderCreditScoreCalculations = () => {
    if (!userData || !userData.historial_crediticio) {
      return <p className="text-gray-500">No hay suficientes datos para realizar cálculos de crédito.</p>;
    }

    const historialCrediticio = userData.historial_crediticio;
    
    // Payment History Calculation
    const paymentHistory = calculatePaymentHistory(historialCrediticio);
    
    // Credit Utilization Calculation
    const creditUtilization = calculateCreditUtilization(historialCrediticio);
    
    // Credit History Length Calculation
    const historyLength = calculateCreditHistoryLength(historialCrediticio);
    
    // Credit Mix Calculation
    const creditMix = calculateCreditMix(historialCrediticio);
    
    // New Credit Applications Calculation
    const newCreditApps = calculateNewCreditApplications(historialCrediticio);
    
    // Final Score Calculation (simple weighted average)
    const finalScore = calculateFinalCreditScore(
      paymentHistory, 
      creditUtilization, 
      historyLength, 
      creditMix, 
      newCreditApps
    );

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Cálculo de Puntaje Crediticio</h3>
        
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="text-center mb-4">
            <span className="text-4xl font-bold text-blue-600">{finalScore}</span>
            <p className="text-gray-500">Puntaje Final (escala 300-850)</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ScoreComponent 
              title="Historial de Pagos" 
              score={paymentHistory.score} 
              details={`${paymentHistory.onTimePct.toFixed(1)}% pagos a tiempo`}
              weight="35%"
            />
            
            <ScoreComponent 
              title="Utilización de Crédito" 
              score={creditUtilization.score} 
              details={`${creditUtilization.utilizationPct.toFixed(1)}% utilizado`}
              weight="30%"
            />
            
            <ScoreComponent 
              title="Antigüedad Crediticia" 
              score={historyLength.score} 
              details={`${historyLength.avgYears.toFixed(1)} años en promedio`}
              weight="15%"
            />
            
            <ScoreComponent 
              title="Mezcla de Créditos" 
              score={creditMix.score} 
              details={`${creditMix.numTypes} tipos de crédito`}
              weight="10%"
            />
            
            <ScoreComponent 
              title="Nuevas Solicitudes" 
              score={newCreditApps.score} 
              details={`${newCreditApps.recentApps} solicitudes recientes`}
              weight="10%"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Fórmulas Aplicadas</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <FormulaCard 
              title="Historial de Pagos (35%)" 
              formula="(Pagos a tiempo / Total de pagos) × 100"
              calculation={`(${paymentHistory.onTimePayments} / ${paymentHistory.totalPayments}) × 100 = ${paymentHistory.onTimePct.toFixed(1)}%`}
              score={paymentHistory.score}
            />
            
            <FormulaCard 
              title="Utilización de Crédito (30%)" 
              formula="(Deuda total / Crédito disponible) × 100"
              calculation={`(${creditUtilization.totalDebt.toLocaleString()} / ${creditUtilization.totalAvailable.toLocaleString()}) × 100 = ${creditUtilization.utilizationPct.toFixed(1)}%`}
              score={creditUtilization.score}
            />
            
            <FormulaCard 
              title="Antigüedad Crediticia (15%)" 
              formula="Promedio de años de todas las cuentas"
              calculation={historyLength.accounts.length > 0 
                ? `(${historyLength.accounts.map(a => a.toFixed(1)).join(' + ')}) / ${historyLength.accounts.length} = ${historyLength.avgYears.toFixed(1)} años` 
                : "Sin datos suficientes"}
              score={historyLength.score}
            />
            
            <FormulaCard 
              title="Mezcla de Créditos (10%)" 
              formula="Número de tipos diferentes de crédito"
              calculation={creditMix.types.length > 0 
                ? `Tipos: ${creditMix.types.join(', ')} = ${creditMix.numTypes} tipos` 
                : "Sin datos suficientes"}
              score={creditMix.score}
            />
            
            <FormulaCard 
              title="Nuevas Solicitudes (10%)" 
              formula="Solicitudes de crédito en los últimos 12 meses"
              calculation={`${newCreditApps.recentApps} solicitudes en el último año`}
              score={newCreditApps.score}
            />
            
            <FormulaCard 
              title="Puntaje Final" 
              formula="Promedio ponderado escalado a 300-850"
              calculation={`300 + (${paymentHistory.score}×0.35 + ${creditUtilization.score}×0.3 + ${historyLength.score}×0.15 + ${creditMix.score}×0.1 + ${newCreditApps.score}×0.1) × 5.5 = ${finalScore}`}
              score={finalScore}
              isTotal={true}
            />
          </div>
        </div>
      </div>
    );
  };
  
  // Function to calculate and render business finance metrics
  const renderBusinessFinanceCalculations = () => {
    if (!userData) {
      return <p className="text-gray-500">No hay datos disponibles para realizar cálculos financieros.</p>;
    }
    
    // Gather all the business metrics
    const salesMetrics = calculateSalesMetrics(userData);
    const profitMetrics = calculateProfitMetrics(userData);
    const expenseMetrics = calculateExpenseMetrics(userData);
    const cashFlowMetrics = calculateCashFlowMetrics(userData);
    const revenueDistribution = calculateRevenueDistribution(userData);
    
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Métricas Financieras del Negocio</h3>
        
        {/* Monthly Sales */}
        <div className="bg-white shadow rounded-lg p-4">
          <h4 className="font-semibold text-lg mb-2">Ventas Mensuales</h4>
          {salesMetrics.hasSalesData ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Fórmula: Suma de todas las transacciones de venta por mes</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard 
                  title="Total" 
                  value={`${salesMetrics.totalSales.toLocaleString()} COP`} 
                  change={salesMetrics.salesChange}
                />
                <MetricCard 
                  title="Online" 
                  value={`${salesMetrics.onlineSales.toLocaleString()} COP`} 
                  percentage={salesMetrics.onlinePct}
                />
                <MetricCard 
                  title="En Tienda" 
                  value={`${salesMetrics.inStoreSales.toLocaleString()} COP`} 
                  percentage={salesMetrics.inStorePct}
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No hay datos suficientes sobre ventas.</p>
          )}
        </div>
        
        {/* Profit Margin */}
        <div className="bg-white shadow rounded-lg p-4">
          <h4 className="font-semibold text-lg mb-2">Margen de Beneficio</h4>
          {profitMetrics.hasData ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Fórmulas:</p>
              <ul className="text-sm text-gray-600 list-disc pl-5 mb-3">
                <li>Margen Bruto = (Ingresos - Costo de Ventas) / Ingresos × 100</li>
                <li>Margen Neto = (Ingresos - Costo de Ventas - Gastos Operativos) / Ingresos × 100</li>
              </ul>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard 
                  title="Ingresos" 
                  value={`${profitMetrics.revenue.toLocaleString()} COP`} 
                />
                <MetricCard 
                  title="Margen Bruto" 
                  value={`${profitMetrics.grossMargin.toFixed(1)}%`} 
                  change={profitMetrics.grossMarginChange}
                />
                <MetricCard 
                  title="Margen Neto" 
                  value={`${profitMetrics.netMargin.toFixed(1)}%`} 
                  change={profitMetrics.netMarginChange}
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No hay datos suficientes sobre márgenes de beneficio.</p>
          )}
        </div>
        
        {/* Continue rendering other business metrics similarly */}
        {/* Expenses */}
        <div className="bg-white shadow rounded-lg p-4">
          <h4 className="font-semibold text-lg mb-2">Gastos</h4>
          {expenseMetrics.hasData ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Fórmula: Suma de todas las categorías de gastos para cada período</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard 
                  title="Total" 
                  value={`${expenseMetrics.totalExpenses.toLocaleString()} COP`} 
                  change={expenseMetrics.expenseChange}
                />
                <MetricCard 
                  title="Fijos" 
                  value={`${expenseMetrics.fixedExpenses.toLocaleString()} COP`} 
                  percentage={expenseMetrics.fixedPct}
                />
                <MetricCard 
                  title="Variables" 
                  value={`${expenseMetrics.variableExpenses.toLocaleString()} COP`} 
                  percentage={expenseMetrics.variablePct}
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No hay datos suficientes sobre gastos.</p>
          )}
        </div>
        
        {/* Cash Flow */}
        <div className="bg-white shadow rounded-lg p-4">
          <h4 className="font-semibold text-lg mb-2">Flujo de Caja</h4>
          {cashFlowMetrics.hasData ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Fórmula: Saldo Inicial + Ingresos - Egresos = Saldo Final</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded p-3">
                  <div className="flex justify-between mb-2">
                    <span>Saldo Inicial</span>
                    <span className="font-medium">{cashFlowMetrics.beginningCash.toLocaleString()} COP</span>
                  </div>
                  <div className="flex justify-between mb-2 text-green-600">
                    <span>+ Ingresos</span>
                    <span className="font-medium">+{cashFlowMetrics.cashReceipts.toLocaleString()} COP</span>
                  </div>
                  <div className="flex justify-between mb-2 text-red-600">
                    <span>- Egresos</span>
                    <span className="font-medium">-{cashFlowMetrics.cashDisbursements.toLocaleString()} COP</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-bold">
                    <span>= Saldo Final</span>
                    <span>{cashFlowMetrics.endingCash.toLocaleString()} COP</span>
                  </div>
                </div>
                <MetricCard 
                  title="Cambio en Flujo de Caja" 
                  value={`${cashFlowMetrics.cashFlowChange.toLocaleString()} COP`} 
                  change={cashFlowMetrics.cashFlowChangePct}
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No hay datos suficientes sobre flujo de caja.</p>
          )}
        </div>
        
        {/* Revenue Distribution */}
        <div className="bg-white shadow rounded-lg p-4">
          <h4 className="font-semibold text-lg mb-2">Distribución de Ingresos</h4>
          {revenueDistribution.hasData ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Fórmula: (Ingresos por categoría / Ingresos totales) × 100</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {revenueDistribution.categories.map((category, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="truncate flex-1">{category.name}</span>
                    <div className="w-48 bg-gray-200 rounded-full h-2.5 ml-2">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${category.percentage}%` }}></div>
                    </div>
                    <span className="ml-2 text-sm font-medium">{category.percentage.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No hay datos suficientes sobre distribución de ingresos.</p>
          )}
        </div>
      </div>
    );
  };

  // Function to render the PyME360 Trust Score calculations
  const renderTrustScoreCalculations = () => {
    if (!userData || !userData.pyme360_trust_score) {
      return <p className="text-gray-500">No hay datos disponibles para cálculos del PyME360 Trust Score.</p>;
    }
    
    const trustScore = userData.pyme360_trust_score;
    const components = trustScore.componentes || {};
    
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Cálculo de PyME360 Trust Score</h3>
        
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="text-center mb-4">
            <span className="text-4xl font-bold text-blue-600">{trustScore.calificacion_global || 'N/A'}</span>
            <p className="text-gray-500">Puntuación Global (escala 0-100)</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(components).map(([key, value]) => {
              const component = value as any;
              return (
                <div key={key} className="bg-white p-3 rounded shadow">
                  <h4 className="font-medium capitalize">{key.replace(/_/g, ' ')}</h4>
                  <div className="flex items-center mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${component.puntuacion}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium">{component.puntuacion}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Fórmula Aplicada</h3>
          
          <div className="bg-white shadow rounded-lg p-4">
            <h4 className="font-medium mb-2">Cálculo del Puntaje Total</h4>
            <p className="text-sm text-gray-600 mb-3">Promedio ponderado de todos los componentes:</p>
            
            <div className="space-y-2">
              {Object.entries(components).map(([key, value]) => {
                const component = value as any;
                const weight = getTrustScoreWeight(key);
                return (
                  <div key={key} className="flex justify-between items-center">
                    <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="text-gray-500">
                      {component.puntuacion} × {(weight * 100).toFixed(0)}%
                    </span>
                    <span className="font-medium">{(component.puntuacion * weight).toFixed(1)}</span>
                  </div>
                );
              })}
              
              <div className="flex justify-between items-center pt-2 border-t font-bold">
                <span>Puntuación Total</span>
                <span>{trustScore.calificacion_global || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Helper component for rendering score components
  const ScoreComponent = ({ title, score, details, weight }: { title: string, score: number, details: string, weight: string }) => (
    <div className="bg-white p-3 rounded shadow">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">{title}</h4>
        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{weight}</span>
      </div>
      <div className="mt-2 flex items-center">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <span className="ml-2 text-sm font-medium">{score}</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">{details}</p>
    </div>
  );

  // Helper component for formula cards
  const FormulaCard = ({ title, formula, calculation, score, isTotal = false }: { 
    title: string, 
    formula: string, 
    calculation: string, 
    score: number,
    isTotal?: boolean
  }) => (
    <div className={`p-3 rounded shadow ${isTotal ? 'bg-blue-50 border border-blue-100' : 'bg-white'}`}>
      <h4 className="font-medium">{title}</h4>
      <p className="text-xs text-gray-600 mt-1">{formula}</p>
      <p className="text-xs font-mono bg-gray-50 p-1 rounded mt-1">{calculation}</p>
      <div className="mt-2 flex justify-end">
        <span className={`font-bold ${isTotal ? 'text-blue-600' : ''}`}>
          {isTotal ? score : `${score}/100`}
        </span>
      </div>
    </div>
  );

  // Helper component for metric cards
  const MetricCard = ({ title, value, change, percentage }: { 
    title: string, 
    value: string, 
    change?: number,
    percentage?: number
  }) => (
    <div className="bg-white border rounded p-3">
      <h5 className="text-sm text-gray-500">{title}</h5>
      <p className="text-lg font-semibold">{value}</p>
      {change !== undefined && (
        <div className={`text-xs font-medium flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
        </div>
      )}
      {percentage !== undefined && (
        <div className="text-xs font-medium text-gray-500">
          {percentage.toFixed(1)}% del total
        </div>
      )}
    </div>
  );

  // Helper function - Calculate Credit Score components
  function calculatePaymentHistory(historialCrediticio: any) {
    // Default values
    const defaultResult = { 
      score: 65, 
      totalPayments: 0, 
      onTimePayments: 0, 
      latePayments: 0,
      onTimePct: 100
    };
    
    let totalPayments = 0;
    let latePayments = 0;
    
    // Count payments from credit accounts
    const cuentasCredito = historialCrediticio.cuentas_credito || [];
    for (const cuenta of cuentasCredito) {
      const historialPagos = cuenta.historial_pagos || [];
      totalPayments += historialPagos.length;
      
      // Count late payments
      for (const pago of historialPagos) {
        if (pago.estado && pago.estado.toLowerCase().includes('atrasado')) {
          latePayments++;
        }
      }
    }
    
    // Count payments from supplier accounts
    const creditoProveedores = historialCrediticio.credito_proveedores || [];
    for (const proveedor of creditoProveedores) {
      const historialPagos = proveedor.historial_pagos || [];
      totalPayments += historialPagos.length;
      
      // Count late payments
      for (const pago of historialPagos) {
        if (pago.estado && pago.estado.toLowerCase().includes('atrasado')) {
          latePayments++;
        }
      }
    }
    
    // If no payment data, return default
    if (totalPayments === 0) return defaultResult;
    
    const onTimePayments = totalPayments - latePayments;
    const onTimePct = (onTimePayments / totalPayments) * 100;
    
    // Calculate score based on percentage
    let score = 0;
    if (onTimePct >= 98) score = 100;
    else if (onTimePct >= 95) score = 90;
    else if (onTimePct >= 90) score = 80;
    else if (onTimePct >= 85) score = 70;
    else if (onTimePct >= 75) score = 60;
    else score = Math.floor(onTimePct / 2);
    
    return {
      score,
      totalPayments,
      onTimePayments,
      latePayments,
      onTimePct
    };
  }

  function calculateCreditUtilization(historialCrediticio: any) {
    // Default values
    const defaultResult = { 
      score: 50, 
      totalDebt: 0, 
      totalAvailable: 0, 
      utilizationPct: 0
    };
    
    let totalDebt = 0;
    let totalAvailable = 0;
    
    // Sum debts and credit limits
    const cuentasCredito = historialCrediticio.cuentas_credito || [];
    for (const cuenta of cuentasCredito) {
      totalDebt += cuenta.saldo_actual || 0;
      totalAvailable += cuenta.limite_credito || 0;
    }
    
    // Add supplier credits
    const creditoProveedores = historialCrediticio.credito_proveedores || [];
    for (const proveedor of creditoProveedores) {
      totalDebt += proveedor.saldo_actual || 0;
      totalAvailable += proveedor.limite_credito || 0;
    }
    
    // If no credit available, return default
    if (totalAvailable === 0) return defaultResult;
    
    const utilizationPct = (totalDebt / totalAvailable) * 100;
    
    // Calculate score based on utilization
    let score = 0;
    if (utilizationPct <= 10) score = 100;
    else if (utilizationPct <= 30) score = 90;
    else if (utilizationPct <= 50) score = 75;
    else if (utilizationPct <= 70) score = 60;
    else if (utilizationPct <= 90) score = 40;
    else score = 20;
    
    return {
      score,
      totalDebt,
      totalAvailable,
      utilizationPct
    };
  }

  function calculateCreditHistoryLength(historialCrediticio: any) {
    // Default values
    const defaultResult = { 
      score: 50, 
      avgYears: 0,
      accounts: []
    };
    
    const currentDate = new Date();
    const accountAges: number[] = [];
    
    // Calculate age of each account
    const cuentasCredito = historialCrediticio.cuentas_credito || [];
    for (const cuenta of cuentasCredito) {
      if (cuenta.fecha_apertura) {
        try {
          const fechaApertura = new Date(cuenta.fecha_apertura);
          const years = (currentDate.getTime() - fechaApertura.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
          accountAges.push(years);
        } catch (error) {
          // Ignore invalid dates
        }
      }
    }
    
    // If no valid accounts, return default
    if (accountAges.length === 0) return defaultResult;
    
    const avgYears = accountAges.reduce((sum, age) => sum + age, 0) / accountAges.length;
    
    // Calculate score based on average age
    let score = 0;
    if (avgYears >= 7) score = 100;
    else if (avgYears >= 5) score = 90;
    else if (avgYears >= 3) score = 80;
    else if (avgYears >= 2) score = 70;
    else if (avgYears >= 1) score = 60;
    else score = 50;
    
    return {
      score,
      avgYears,
      accounts: accountAges
    };
  }

  function calculateCreditMix(historialCrediticio: any) {
    // Default values
    const defaultResult = { 
      score: 50, 
      numTypes: 0,
      types: []
    };
    
    const creditTypes = new Set<string>();
    
    // Identify unique credit types
    const cuentasCredito = historialCrediticio.cuentas_credito || [];
    for (const cuenta of cuentasCredito) {
      if (cuenta.tipo) {
        creditTypes.add(cuenta.tipo);
      }
    }
    
    // Add supplier credits as a distinct type
    if ((historialCrediticio.credito_proveedores || []).length > 0) {
      creditTypes.add("Crédito Comercial");
    }
    
    const numTypes = creditTypes.size;
    
    // Calculate score based on number of types
    let score = 0;
    if (numTypes >= 4) score = 100;
    else if (numTypes === 3) score = 90;
    else if (numTypes === 2) score = 75;
    else if (numTypes === 1) score = 60;
    else score = 50;
    
    return {
      score,
      numTypes,
      types: Array.from(creditTypes)
    };
  }

  function calculateNewCreditApplications(historialCrediticio: any) {
    // Default values
    const defaultResult = { 
      score: 100, 
      recentApps: 0
    };
    
    const currentDate = new Date();
    let recentApps = 0;
    
    // Count recent applications (last 12 months)
    const solicitudes = historialCrediticio.solicitudes_credito_recientes || [];
    for (const solicitud of solicitudes) {
      if (solicitud.fecha) {
        try {
          const fechaSolicitud = new Date(solicitud.fecha);
          const monthsDiff = 
            (currentDate.getFullYear() - fechaSolicitud.getFullYear()) * 12 + 
            currentDate.getMonth() - fechaSolicitud.getMonth();
          
          if (monthsDiff <= 12) {
            recentApps++;
          }
        } catch (error) {
          // Ignore invalid dates
        }
      }
    }
    
    // Calculate score based on number of recent applications
    let score = 0;
    if (recentApps === 0) score = 100;
    else if (recentApps === 1) score = 90;
    else if (recentApps === 2) score = 75;
    else if (recentApps === 3) score = 60;
    else score = 40;
    
    return {
      score,
      recentApps
    };
  }

  function calculateFinalCreditScore(
    paymentHistory: any, 
    creditUtilization: any, 
    historyLength: any, 
    creditMix: any, 
    newCreditApps: any
  ) {
    // Weighted average
    const weightedScore = 
      paymentHistory.score * 0.35 +
      creditUtilization.score * 0.30 +
      historyLength.score * 0.15 +
      creditMix.score * 0.10 +
      newCreditApps.score * 0.10;
    
    // Scale to 300-850 range (standard credit score range)
    return Math.round(300 + (weightedScore / 100) * 550);
  }

  // Helper functions for business metrics calculations
  function calculateSalesMetrics(userData: any) {
    // Default result with no data
    const defaultResult = {
      hasSalesData: false,
      totalSales: 0,
      onlineSales: 0,
      inStoreSales: 0,
      salesChange: 0,
      onlinePct: 0,
      inStorePct: 0
    };
    
    // Check if sales data exists
    const ventasMensuales = userData.ventas_mensuales || {};
    const datosMensuales = ventasMensuales.datos_mensuales || [];
    
    if (datosMensuales.length === 0) {
      return defaultResult;
    }
    
    // Get the most recent month
    const lastMonth = datosMensuales[0];
    
    // Get previous month if available
    const prevMonth = datosMensuales.length > 1 ? datosMensuales[1] : null;
    
    const totalSales = lastMonth.total || 0;
    const onlineSales = lastMonth.online || 0;
    const inStoreSales = lastMonth.tienda || 0;
    
    // Calculate percentages
    const onlinePct = totalSales > 0 ? (onlineSales / totalSales) * 100 : 0;
    const inStorePct = totalSales > 0 ? (inStoreSales / totalSales) * 100 : 0;
    
    // Calculate month-over-month change
    let salesChange = 0;
    if (prevMonth && prevMonth.total > 0) {
      salesChange = ((totalSales - prevMonth.total) / prevMonth.total) * 100;
    }
    
    return {
      hasSalesData: true,
      totalSales,
      onlineSales,
      inStoreSales,
      salesChange,
      onlinePct,
      inStorePct
    };
  }

  function calculateProfitMetrics(userData: any) {
    // Default result with no data
    const defaultResult = {
      hasData: false,
      revenue: 0,
      grossMargin: 0,
      netMargin: 0,
      grossMarginChange: 0,
      netMarginChange: 0
    };
    
    // Check if margin data exists
    const margenBeneficio = userData.margen_beneficio || {};
    const datosMensuales = margenBeneficio.datos_mensuales || [];
    
    if (datosMensuales.length === 0) {
      return defaultResult;
    }
    
    // Get the most recent month
    const lastMonth = datosMensuales[0];
    
    // Get previous month if available
    const prevMonth = datosMensuales.length > 1 ? datosMensuales[1] : null;
    
    const revenue = lastMonth.ingresos || 0;
    const cogs = lastMonth.costo_ventas || 0;
    const opExpenses = lastMonth.gastos_operativos || 0;
    
    // Calculate margins (either use the existing values or calculate them)
    let grossMargin = lastMonth.margen_bruto !== undefined ? 
      (typeof lastMonth.margen_bruto === 'number' ? lastMonth.margen_bruto * 100 : parseFloat(lastMonth.margen_bruto) * 100) :
      (revenue > 0 ? ((revenue - cogs) / revenue) * 100 : 0);
    
    let netMargin = lastMonth.margen_neto !== undefined ? 
      (typeof lastMonth.margen_neto === 'number' ? lastMonth.margen_neto * 100 : parseFloat(lastMonth.margen_neto) * 100) :
      (revenue > 0 ? ((revenue - cogs - opExpenses) / revenue) * 100 : 0);
    
    // Calculate month-over-month changes
    let grossMarginChange = 0;
    let netMarginChange = 0;
    
    if (prevMonth) {
      const prevGrossMargin = prevMonth.margen_bruto !== undefined ? 
        (typeof prevMonth.margen_bruto === 'number' ? prevMonth.margen_bruto * 100 : parseFloat(prevMonth.margen_bruto) * 100) :
        (prevMonth.ingresos > 0 ? ((prevMonth.ingresos - prevMonth.costo_ventas) / prevMonth.ingresos) * 100 : 0);
      
      const prevNetMargin = prevMonth.margen_neto !== undefined ? 
        (typeof prevMonth.margen_neto === 'number' ? prevMonth.margen_neto * 100 : parseFloat(prevMonth.margen_neto) * 100) :
        (prevMonth.ingresos > 0 ? ((prevMonth.ingresos - prevMonth.costo_ventas - prevMonth.gastos_operativos) / prevMonth.ingresos) * 100 : 0);
      
      grossMarginChange = grossMargin - prevGrossMargin;
      netMarginChange = netMargin - prevNetMargin;
    }
    
    return {
      hasData: true,
      revenue,
      grossMargin,
      netMargin,
      grossMarginChange,
      netMarginChange
    };
  }

  function calculateExpenseMetrics(userData: any) {
    // Default result with no data
    const defaultResult = {
      hasData: false,
      totalExpenses: 0,
      fixedExpenses: 0,
      variableExpenses: 0,
      expenseChange: 0,
      fixedPct: 0,
      variablePct: 0
    };
    
    // Check if expense data exists
    const gastos = userData.gastos || {};
    const datosMensuales = gastos.datos_mensuales || [];
    
    if (datosMensuales.length === 0) {
      return defaultResult;
    }
    
    // Get the most recent month
    const lastMonth = datosMensuales[0];
    
    // Get previous month if available
    const prevMonth = datosMensuales.length > 1 ? datosMensuales[1] : null;
    
    const totalExpenses = lastMonth.total || 0;
    const fixedExpenses = lastMonth.fijos || 0;
    const variableExpenses = lastMonth.variables || 0;
    
    // Calculate percentages
    const fixedPct = totalExpenses > 0 ? (fixedExpenses / totalExpenses) * 100 : 0;
    const variablePct = totalExpenses > 0 ? (variableExpenses / totalExpenses) * 100 : 0;
    
    // Calculate month-over-month change
    let expenseChange = 0;
    if (prevMonth && prevMonth.total > 0) {
      expenseChange = ((totalExpenses - prevMonth.total) / prevMonth.total) * 100;
    }
    
    return {
      hasData: true,
      totalExpenses,
      fixedExpenses,
      variableExpenses,
      expenseChange,
      fixedPct,
      variablePct
    };
  }

  function calculateCashFlowMetrics(userData: any) {
    // Default result with no data
    const defaultResult = {
      hasData: false,
      beginningCash: 0,
      cashReceipts: 0,
      cashDisbursements: 0,
      endingCash: 0,
      cashFlowChange: 0,
      cashFlowChangePct: 0
    };
    
    // Check if cash flow data exists
    const flujoCaja = userData.flujo_caja || {};
    const datosMensuales = flujoCaja.datos_mensuales || [];
    
    if (datosMensuales.length === 0) {
      return defaultResult;
    }
    
    // Get the most recent month
    const lastMonth = datosMensuales[0];
    
    const beginningCash = lastMonth.saldo_inicial || 0;
    const cashReceipts = lastMonth.ingresos || 0;
    const cashDisbursements = lastMonth.egresos || 0;
    const endingCash = lastMonth.saldo_final || beginningCash + cashReceipts - cashDisbursements;
    
    // Calculate cash flow change
    const cashFlowChange = endingCash - beginningCash;
    const cashFlowChangePct = beginningCash > 0 ? (cashFlowChange / beginningCash) * 100 : 0;
    
    return {
      hasData: true,
      beginningCash,
      cashReceipts,
      cashDisbursements,
      endingCash,
      cashFlowChange,
      cashFlowChangePct
    };
  }

  function calculateRevenueDistribution(userData: any) {
    // Default result with no data
    const defaultResult = {
      hasData: false,
      categories: []
    };
    
    // Check if revenue distribution data exists
    const distribucionIngresos = userData.distribucion_ingresos || {};
    const porProducto = distribucionIngresos.por_producto || [];
    
    if (porProducto.length === 0) {
      return defaultResult;
    }
    
    // Map the product data to the categories
    const categories = porProducto.map((item: any) => {
      return {
        name: item.producto || 'Sin nombre',
        revenue: item.ingresos_anuales || 0,
        percentage: item.porcentaje || 0
      };
    });
    
    // Sort by percentage (descending)
    categories.sort((a: any, b: any) => b.percentage - a.percentage);
    
    return {
      hasData: true,
      categories
    };
  }

  // Helper function to get weights for trust score components
  function getTrustScoreWeight(componentName: string): number {
    const weights: {[key: string]: number} = {
      sostenibilidad: 0.15,
      cumplimiento_fiscal: 0.20,
      practicas_laborales: 0.15,
      estabilidad_financiera: 0.25,
      puntualidad_pagos: 0.15,
      innovacion: 0.10
    };
    
    return weights[componentName] || 0.15; // Default weight
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-pyme-blue mb-8">Base de Datos MongoDB</h1>
          
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full max-w-md" />
              <Skeleton className="h-96 w-full" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <Tabs defaultValue="raw" className="w-full">
                <TabsList className="w-full border-b bg-muted/20">
                  <TabsTrigger value="raw" className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <span>Datos Completos</span>
                  </TabsTrigger>
                  <TabsTrigger value="structure" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Estructura de Datos</span>
                  </TabsTrigger>
                  <TabsTrigger value="calculations" className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    <span>Cálculos</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="raw" className="p-6 overflow-x-auto">
                  <div className="text-sm font-mono bg-gray-50 p-4 rounded border">
                    {renderJsonData(userData)}
                  </div>
                </TabsContent>
                
                <TabsContent value="structure" className="p-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {userData && Object.keys(userData).map((key) => {
                      if (key === "_id" || key === "password") return null;
                      
                      return (
                        <div key={key} className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-4 py-2 border-b">
                            <h3 className="font-medium">{key}</h3>
                          </div>
                          <div className="p-4 text-sm max-h-60 overflow-y-auto">
                            {typeof userData[key] === 'object' && userData[key] !== null ? (
                              <div className="font-mono text-xs">
                                {renderJsonData(userData[key])}
                              </div>
                            ) : (
                              <p>{String(userData[key])}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
                
                <TabsContent value="calculations" className="p-6 overflow-x-auto">
                  <Tabs defaultValue="credit-score">
                    <TabsList className="mb-4">
                      <TabsTrigger value="credit-score">Puntaje Crediticio</TabsTrigger>
                      <TabsTrigger value="business-metrics">Métricas de Negocios</TabsTrigger>
                      <TabsTrigger value="trust-score">PyME360 Trust Score</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="credit-score">
                      {renderCreditScoreCalculations()}
                    </TabsContent>
                    
                    <TabsContent value="business-metrics">
                      {renderBusinessFinanceCalculations()}
                    </TabsContent>
                    
                    <TabsContent value="trust-score">
                      {renderTrustScoreCalculations()}
                    </TabsContent>
                  </Tabs>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DatabaseView;
