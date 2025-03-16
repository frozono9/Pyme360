import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ButtonCustom } from "@/components/ui/button-custom";
import { 
  ArrowRight, 
  BarChart2, 
  Users, 
  FileSpreadsheet,
  FileText,
  LineChart,
  TrendingUp,
  TrendingDown,
  PieChart,
  Maximize2,
  CalendarDays,
  DollarSign,
  Receipt,
  Wallet,
  CircleDollarSign,
  Calculator,
  BarChart3,
  CreditCard,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/api";
import { 
  AreaChart as RechartsAreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

import { KpiCard } from "@/components/management/KpiCard";
import { ErpModuleCard } from "@/components/management/ErpModuleCard";
import { EfficiencyCard } from "@/components/management/EfficiencyCard";
import { FeatureCard } from "@/components/management/FeatureCard";

const ManagementModule = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const user = await api.getCurrentUser();
        if (!user) {
          setError("No se pudo obtener información del usuario");
          return;
        }
        setUserData(user);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Error al cargar los datos del usuario");
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos. Por favor, intenta nuevamente.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  const calculateFinancialMetrics = () => {
    if (!userData) return null;
    
    const salesMetrics = calculateSalesMetrics(userData);
    
    const profitMetrics = calculateProfitMetrics(userData);
    
    const expenseMetrics = calculateExpenseMetrics(userData);
    
    const cashFlowMetrics = calculateCashFlowMetrics(userData);
    
    const revenueDistribution = calculateRevenueDistribution(userData);
    
    return {
      salesMetrics,
      profitMetrics,
      expenseMetrics,
      cashFlowMetrics,
      revenueDistribution
    };
  };
  
  const metrics = calculateFinancialMetrics();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      maximumFractionDigits: 0 
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-pyme-gray-light">
        <section className="pt-24 pb-12 relative bg-gradient-to-b from-white to-pyme-gray-light overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-bl from-pyme-blue/10 to-transparent blur-3xl"></div>
            <div className="absolute bottom-[10%] left-[5%] w-[30%] h-[30%] rounded-full bg-gradient-to-tr from-pyme-success/5 to-transparent blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto container-padding relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-8 animate-fade-up">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-pyme-blue bg-pyme-blue/10 border border-pyme-blue/20 mb-4">
                Módulo de PyME360
              </div>
              
              <h1 className="mb-4 text-balance">
                Gestión <span className="text-pyme-blue">Empresarial</span>
              </h1>
              
              <p className="text-pyme-gray-dark text-lg">
                Plataforma integrada para administrar todos los aspectos financieros de tu negocio con 
                herramientas avanzadas que te ayudan a tomar mejores decisiones.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">ERP Simplificado</h2>
          
          {isLoading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-8">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="border-none shadow-elevation">
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-8 w-32 mb-2" />
                      <Skeleton className="h-4 w-16" />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card className="border-none shadow-elevation">
                  <CardHeader>
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                  </CardContent>
                </Card>
                <Card className="border-none shadow-elevation">
                  <CardHeader>
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p className="font-medium">Error al cargar datos</p>
              <p>{error}</p>
              <p className="mt-2">Por favor, verifica tu conexión e intenta nuevamente.</p>
            </div>
          ) : metrics ? (
            <>
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4">Resumen Financiero</h3>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-8">
                  <KpiCard 
                    title="Ventas Mensuales" 
                    value={metrics.salesMetrics.hasSalesData ? 
                      formatCurrency(metrics.salesMetrics.totalSales) : "No disponible"} 
                    trend={metrics.salesMetrics.hasSalesData ? 
                      `${metrics.salesMetrics.salesChange > 0 ? '+' : ''}${metrics.salesMetrics.salesChange.toFixed(1)}%` : "--"}
                    trendDirection={metrics.salesMetrics.hasSalesData && metrics.salesMetrics.salesChange > 0 ? "up" : "down"}
                    icon={<BarChart2 />}
                    color="blue"
                  />
                  
                  <KpiCard 
                    title="Margen de Beneficio" 
                    value={metrics.profitMetrics.hasData ? 
                      `${metrics.profitMetrics.grossMargin.toFixed(1)}%` : "No disponible"} 
                    trend={metrics.profitMetrics.hasData ? 
                      `${metrics.profitMetrics.grossMarginChange > 0 ? '+' : ''}${metrics.profitMetrics.grossMarginChange.toFixed(1)}%` : "--"}
                    trendDirection={metrics.profitMetrics.hasData && metrics.profitMetrics.grossMarginChange > 0 ? "up" : "down"}
                    icon={<PieChart />}
                    color={metrics.profitMetrics.hasData && metrics.profitMetrics.grossMarginChange > 0 ? "green" : "amber"}
                  />
                  
                  <KpiCard 
                    title="Gastos" 
                    value={metrics.expenseMetrics.hasData ? 
                      formatCurrency(metrics.expenseMetrics.totalExpenses) : "No disponible"} 
                    trend={metrics.expenseMetrics.hasData ? 
                      `${metrics.expenseMetrics.expenseChange > 0 ? '+' : ''}${metrics.expenseMetrics.expenseChange.toFixed(1)}%` : "--"}
                    trendDirection={metrics.expenseMetrics.hasData && metrics.expenseChange < 0 ? "down" : "up"}
                    icon={<TrendingDown />}
                    color={metrics.expenseMetrics.hasData && metrics.expenseMetrics.expenseChange < 0 ? "green" : "amber"}
                  />
                  
                  <KpiCard 
                    title="Flujo de Caja" 
                    value={metrics.cashFlowMetrics.hasData ? 
                      formatCurrency(metrics.cashFlowMetrics.endingCash) : "No disponible"} 
                    trend={metrics.cashFlowMetrics.hasData ? 
                      `${metrics.cashFlowMetrics.cashFlowChangePct > 0 ? '+' : ''}${metrics.cashFlowMetrics.cashFlowChangePct.toFixed(1)}%` : "--"}
                    trendDirection={metrics.cashFlowMetrics.hasData && metrics.cashFlowMetrics.cashFlowChangePct > 0 ? "up" : "down"}
                    icon={<Wallet />}
                    color={metrics.cashFlowMetrics.hasData && metrics.cashFlowMetrics.cashFlowChangePct > 0 ? "blue" : "amber"}
                  />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card className="overflow-hidden border-none shadow-elevation">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Ventas Trimestrales</CardTitle>
                        <ButtonCustom variant="ghost" size="icon" className="h-8 w-8">
                          <Maximize2 className="h-4 w-4" />
                        </ButtonCustom>
                      </div>
                      <CardDescription>Últimos 4 trimestres</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="h-[300px]">
                        <ChartContainer 
                          config={{
                            sales: { label: "Ventas" },
                            target: { label: "Objetivo" }
                          }}
                        >
                          <RechartsAreaChart data={transformSalesData(userData)}>
                            <defs>
                              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.6}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="name" className="text-xs" />
                            <YAxis className="text-xs" />
                            <ChartTooltip
                              content={({ active, payload, label }) => (
                                <ChartTooltipContent
                                  active={active}
                                  payload={payload}
                                  label={label}
                                  nameKey="dataKey"
                                />
                              )}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="sales" 
                              stroke="#2563eb" 
                              strokeWidth={2}
                              fillOpacity={1} 
                              fill="url(#colorSales)" 
                            />
                            <Line 
                              type="monotone" 
                              dataKey="target" 
                              stroke="#f59e0b" 
                              strokeWidth={2}
                              strokeDasharray="5 5" 
                            />
                          </RechartsAreaChart>
                        </ChartContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden border-none shadow-elevation">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Distribución de Ingresos</CardTitle>
                        <ButtonCustom variant="ghost" size="icon" className="h-8 w-8">
                          <Maximize2 className="h-4 w-4" />
                        </ButtonCustom>
                      </div>
                      <CardDescription>Por línea de productos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={transformProductData(userData)}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {transformProductData(userData).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PRODUCT_COLORS[index % PRODUCT_COLORS.length]} />
                              ))}
                            </Pie>
                            <Legend />
                            <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name]} />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4">Gestión de Ventas</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
                  <KpiCard 
                    title="Ventas Diarias" 
                    value={metrics.salesMetrics.hasSalesData ? 
                      formatCurrency(metrics.salesMetrics.totalSales / 30) : "No disponible"} 
                    trend={metrics.salesMetrics.hasSalesData ? 
                      `${metrics.salesMetrics.salesChange > 0 ? '+' : ''}${(metrics.salesMetrics.salesChange / 4).toFixed(1)}%` : "--"}
                    trendDirection={metrics.salesMetrics.hasSalesData && metrics.salesMetrics.salesChange > 0 ? "up" : "down"}
                    icon={<Receipt />}
                    color="blue"
                  />
                  
                  <KpiCard 
                    title="Ventas Mensuales" 
                    value={metrics.salesMetrics.hasSalesData ? 
                      formatCurrency(metrics.salesMetrics.totalSales) : "No disponible"} 
                    trend={metrics.salesMetrics.hasSalesData ? 
                      `${metrics.salesMetrics.salesChange > 0 ? '+' : ''}${metrics.salesMetrics.salesChange.toFixed(1)}%` : "--"}
                    trendDirection={metrics.salesMetrics.hasSalesData && metrics.salesMetrics.salesChange > 0 ? "up" : "down"}
                    icon={<BarChart2 />}
                    color="blue"
                  />
                  
                  <KpiCard 
                    title="Clientes Nuevos" 
                    value={getUserNewClients(userData)} 
                    trend={getUserNewClientsChange(userData)}
                    trendDirection="up"
                    icon={<Users />}
                    color="green"
                  />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card className="overflow-hidden border-none shadow-elevation">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Rendimiento de Ventas</CardTitle>
                        <ButtonCustom variant="ghost" size="icon" className="h-8 w-8">
                          <Maximize2 className="h-4 w-4" />
                        </ButtonCustom>
                      </div>
                      <CardDescription>Últimos 6 meses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsLineChart data={transformSalesPerformanceData(userData)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                            <Legend />
                            <Line type="monotone" dataKey="actual" name="Ventas Reales" stroke="#2563eb" strokeWidth={2} />
                            <Line type="monotone" dataKey="target" name="Objetivo" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
                          </RechartsLineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden border-none shadow-elevation">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Productos Más Vendidos</CardTitle>
                        <ButtonCustom variant="ghost" size="icon" className="h-8 w-8">
                          <Maximize2 className="h-4 w-4" />
                        </ButtonCustom>
                      </div>
                      <CardDescription>Este mes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart layout="vertical" data={transformTopProductsData(userData)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={150} />
                            <Tooltip formatter={(value) => [`${value} unidades`, '']} />
                            <Bar dataKey="value" name="Unidades Vendidas" fill="#2563eb" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Contabilidad y Finanzas</h3>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-8">
                  <KpiCard 
                    title="Cuentas por Cobrar" 
                    value={getAccountsReceivable(userData)} 
                    trend={getAccountsReceivableChange(userData)}
                    trendDirection="up"
                    icon={<CreditCard />}
                    color="blue"
                  />
                  
                  <KpiCard 
                    title="Cuentas por Pagar" 
                    value={getAccountsPayable(userData)} 
                    trend={getAccountsPayableChange(userData)}
                    trendDirection="down"
                    icon={<Receipt />}
                    color="amber"
                  />
                  
                  <KpiCard 
                    title="Balance General" 
                    value={getGeneralBalance(userData)} 
                    trend={getGeneralBalanceChange(userData)}
                    trendDirection="up"
                    icon={<CircleDollarSign />}
                    color="green"
                  />

                  <KpiCard 
                    title="Impuestos Pendientes" 
                    value={getPendingTaxes(userData)} 
                    trend={getPendingTaxesChange(userData)}
                    trendDirection="down"
                    icon={<Calculator />}
                    color="amber"
                  />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card className="overflow-hidden border-none shadow-elevation">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Ingresos vs Gastos</CardTitle>
                        <ButtonCustom variant="ghost" size="icon" className="h-8 w-8">
                          <Maximize2 className="h-4 w-4" />
                        </ButtonCustom>
                      </div>
                      <CardDescription>Últimos 6 meses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={transformTrendData(userData)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                            <Legend />
                            <Bar dataKey="ventas" name="Ingresos" fill="#2563eb" />
                            <Bar dataKey="costos" name="Gastos" fill="#f59e0b" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden border-none shadow-elevation">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Indicadores Financieros</CardTitle>
                      <CardDescription>Métricas de eficiencia</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <EfficiencyCard 
                          title="ROI (Retorno de Inversión)" 
                          value={getRoi(userData)}
                          trend={getRoiChange(userData)}
                          status={isPositiveRoiChange(userData) ? "positive" : "negative"}
                        />
                        
                        <EfficiencyCard 
                          title="Ciclo de Conversión de Efectivo" 
                          value={getCashConversionCycle(userData)}
                          trend={getCashConversionCycleChange(userData)}
                          status={isPositiveCashCycleChange(userData) ? "negative" : "positive"}
                        />
                        
                        <EfficiencyCard 
                          title="Margen de Beneficio Neto" 
                          value={metrics.profitMetrics.hasData ? `${metrics.profitMetrics.netMargin.toFixed(1)}%` : "No disponible"}
                          trend={metrics.profitMetrics.hasData ? 
                            `${metrics.profitMetrics.netMarginChange > 0 ? '+' : ''}${metrics.profitMetrics.netMarginChange.toFixed(1)}% desde último mes` : "No disponible"}
                          status={metrics.profitMetrics.hasData && metrics.profitMetrics.netMarginChange > 0 ? "positive" : "negative"}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card className="overflow-hidden border-none shadow-elevation">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Análisis de Gastos</CardTitle>
                        <ButtonCustom variant="ghost" size="icon" className="h-8 w-8">
                          <Maximize2 className="h-4 w-4" />
                        </ButtonCustom>
                      </div>
                      <CardDescription>Distribución por categoría</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={transformExpenseData(userData)}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {transformExpenseData(userData).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                              ))}
                            </Pie>
                            <Legend />
                            <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name]} />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden border-none shadow-elevation">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Tendencia de Gastos</CardTitle>
                        <ButtonCustom variant="ghost" size="icon" className="h-8 w-8">
                          <Maximize2 className="h-4 w-4" />
                        </ButtonCustom>
                      </div>
                      <CardDescription>Últimos 12 meses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsLineChart data={transformExpenseTrendData(userData)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                            <Legend />
                            <Line type="monotone" dataKey="operativos" name="Gastos Operativos" stroke="#f59e0b" strokeWidth={2} />
                            <Line type="monotone" dataKey="administrativos" name="Gastos Administrativos" stroke="#2563eb" strokeWidth={2} />
                            <Line type="monotone" dataKey="marketing" name="Marketing" stroke="#059669" strokeWidth={2} />
                          </RechartsLineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 mb-8">
                  <Card className="overflow-hidden border-none shadow-elevation">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Calendario Tributario</CardTitle>
                        <ButtonCustom variant="ghost" size="icon" className="h-8 w-8">
                          <Maximize2 className="h-4 w-4" />
                        </ButtonCustom>
                      </div>
                      <CardDescription>Próximos vencimientos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {getTaxCalendar(userData).map((tax, index) => (
                          <Card key={index} className={`border-l-4 border-l-${tax.color}-500`}>
                            <CardHeader className="pb-2">
                              <div className="flex items-center gap-2">
                                <CalendarDays className={`h-5 w-5 text-${tax.color}-500`} />
                                <CardTitle className="text-base">{tax.name}</CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600">Vencimiento: {tax.dueDate}</p>
                              <p className="text-sm font-medium mt-1">Monto estimado: {tax.amount}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-lg text-gray-500">No hay datos disponibles</p>
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

const PRODUCT_COLORS = ['#2563eb', '#0891b2', '#059669', '#65a30d', '#d97706'];
const EXPENSE_COLORS = ['#f59e0b', '#2563eb', '#059669', '#dc2626', '#7c3aed'];

function calculateSalesMetrics(userData) {
  const defaultResult = {
    hasSalesData: false,
    totalSales: 0,
    onlineSales: 0,
    inStoreSales: 0,
    salesChange: 0,
    onlinePct: 0,
    inStorePct: 0
  };
  
  if (!userData) return defaultResult;
  
  const ventasMensuales = userData.ventas_mensuales || {};
  const datosMensuales = ventasMensuales.datos_mensuales || [];
  
  if (datosMensuales.length === 0) {
    return defaultResult;
  }
  
  const lastMonth = datosMensuales[0];
  
  const prevMonth = datosMensuales.length > 1 ? datosMensuales[1] : null;
  
  const totalSales = lastMonth.total || 0;
  const onlineSales = lastMonth.online || 0;
  const inStoreSales = lastMonth.tienda || 0;
  
  const onlinePct = totalSales > 0 ? (onlineSales / totalSales) * 100 : 0;
  const inStorePct = totalSales > 0 ? (inStoreSales / totalSales) * 100 : 0;
  
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

function calculateProfitMetrics(userData) {
  const defaultResult = {
    hasData: false,
    revenue: 0,
    grossMargin: 0,
    netMargin: 0,
    grossMarginChange: 0,
    netMarginChange: 0
  };
  
  if (!userData) return defaultResult;
  
  const margenBeneficio = userData.margen_beneficio || {};
  const datosMensuales = margenBeneficio.datos_mensuales || [];
  
  if (datosMensuales.length === 0) {
    return defaultResult;
  }
  
  const lastMonth = datosMensuales[0];
  
  const prevMonth = datosMensuales.length > 1 ? datosMensuales[1] : null;
  
  const revenue = lastMonth.ingresos || 0;
  const cogs = lastMonth.costo_ventas || 0;
  const opExpenses = lastMonth.gastos_operativos || 0;
  
  let grossMargin = lastMonth.margen_bruto !== undefined ? 
    (typeof lastMonth.margen_bruto === 'number' ? lastMonth.margen_bruto * 100 : parseFloat(lastMonth.margen_bruto) * 100) :
    (revenue > 0 ? ((revenue - cogs) / revenue) * 100 : 0);
  
  let netMargin = lastMonth.margen_neto !== undefined ? 
    (typeof lastMonth.margen_neto === 'number' ? lastMonth.margen_neto * 100 : parseFloat(lastMonth.margen_neto) * 100) :
    (revenue > 0 ? ((revenue - cogs - opExpenses) / revenue) * 100 : 0);
  
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
