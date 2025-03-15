
import { useState } from "react";
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
  CreditCard
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
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

// Importaciones de componentes
import { KpiCard } from "@/components/management/KpiCard";
import { ErpModuleCard } from "@/components/management/ErpModuleCard";
import { EfficiencyCard } from "@/components/management/EfficiencyCard";
import { FeatureCard } from "@/components/management/FeatureCard";

const ManagementModule = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-pyme-gray-light">
        {/* Hero Section */}
        <section className="pt-24 pb-12 relative bg-gradient-to-b from-white to-pyme-gray-light overflow-hidden">
          {/* Background decorative elements */}
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
        
        {/* ERP Comprehensive Dashboard */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">ERP Simplificado</h2>
          
          {/* Financial Overview */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-4">Resumen Financiero</h3>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-8">
              <KpiCard 
                title="Ventas Mensuales" 
                value="$128,450" 
                trend="+12%"
                trendDirection="up"
                icon={<BarChart2 />}
                color="blue"
              />
              
              <KpiCard 
                title="Margen de Beneficio" 
                value="23.5%" 
                trend="+2.1%"
                trendDirection="up"
                icon={<PieChart />}
                color="green"
              />
              
              <KpiCard 
                title="Gastos" 
                value="$75,320" 
                trend="-3.5%"
                trendDirection="down"
                icon={<TrendingDown />}
                color="green"
              />
              
              <KpiCard 
                title="Flujo de Caja" 
                value="$53,130" 
                trend="+15.2%"
                trendDirection="up"
                icon={<Wallet />}
                color="blue"
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Sales Chart */}
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
                      <RechartsAreaChart data={salesData}>
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
              
              {/* Revenue Distribution */}
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
                          data={productData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {productData.map((entry, index) => (
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

          {/* Expanded Sales Section */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-4">Gestión de Ventas</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
              <KpiCard 
                title="Ventas Diarias" 
                value="$4,280" 
                trend="+5.2%"
                trendDirection="up"
                icon={<Receipt />}
                color="blue"
              />
              
              <KpiCard 
                title="Ventas Mensuales" 
                value="$128,450" 
                trend="+12%"
                trendDirection="up"
                icon={<BarChart2 />}
                color="blue"
              />
              
              <KpiCard 
                title="Clientes Nuevos" 
                value="24" 
                trend="+5"
                trendDirection="up"
                icon={<Users />}
                color="green"
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Sales Performance */}
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
                      <RechartsLineChart data={salesPerformanceData}>
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
              
              {/* Top Products */}
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
                      <BarChart layout="vertical" data={topProductsData}>
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
          
          {/* Accounting and Finance - Expanded */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contabilidad y Finanzas</h3>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-8">
              <KpiCard 
                title="Cuentas por Cobrar" 
                value="$45,780" 
                trend="+8.2%"
                trendDirection="up"
                icon={<CreditCard />}
                color="blue"
              />
              
              <KpiCard 
                title="Cuentas por Pagar" 
                value="$32,450" 
                trend="-5.1%"
                trendDirection="down"
                icon={<Receipt />}
                color="amber"
              />
              
              <KpiCard 
                title="Balance General" 
                value="$215,340" 
                trend="+12.7%"
                trendDirection="up"
                icon={<CircleDollarSign />}
                color="green"
              />

              <KpiCard 
                title="Impuestos Pendientes" 
                value="$12,450" 
                trend="-3.5%"
                trendDirection="down"
                icon={<Calculator />}
                color="amber"
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Income vs Expenses */}
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
                      <BarChart data={trendData}>
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
              
              {/* Financial Efficiency */}
              <Card className="overflow-hidden border-none shadow-elevation">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Indicadores Financieros</CardTitle>
                  <CardDescription>Métricas de eficiencia</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <EfficiencyCard 
                      title="ROI (Retorno de Inversión)" 
                      value="18.5%"
                      trend="+2.3% desde último trimestre"
                      status="positive"
                    />
                    
                    <EfficiencyCard 
                      title="Ciclo de Conversión de Efectivo" 
                      value="45 días"
                      trend="+3 días desde último mes"
                      status="negative"
                    />
                    
                    <EfficiencyCard 
                      title="Margen de Beneficio Neto" 
                      value="14.2%"
                      trend="+1.1% desde último año"
                      status="positive"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Expense Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Expense Categories */}
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
                          data={expenseData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {expenseData.map((entry, index) => (
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
              
              {/* Expense Trend */}
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
                      <RechartsLineChart data={expenseTrendData}>
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

            {/* Tax Management */}
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
                    <Card className="border-l-4 border-l-amber-500">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-5 w-5 text-amber-500" />
                          <CardTitle className="text-base">Declaración IVA</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Vencimiento: 15 de abril, 2024</p>
                        <p className="text-sm font-medium mt-1">Monto estimado: $8,450</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-5 w-5 text-blue-500" />
                          <CardTitle className="text-base">Retenciones</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Vencimiento: 23 de abril, 2024</p>
                        <p className="text-sm font-medium mt-1">Monto estimado: $2,120</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-green-500">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-5 w-5 text-green-500" />
                          <CardTitle className="text-base">Impuesto a las Ganancias</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Vencimiento: 5 de mayo, 2024</p>
                        <p className="text-sm font-medium mt-1">Monto estimado: $1,880</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

// Sample Data for Charts and Visualizations
const salesData = [
  { name: 'Q1', sales: 240000, target: 220000 },
  { name: 'Q2', sales: 300000, target: 280000 },
  { name: 'Q3', sales: 280000, target: 300000 },
  { name: 'Q4', sales: 320000, target: 310000 },
];

const PRODUCT_COLORS = ['#2563eb', '#0891b2', '#059669', '#65a30d', '#d97706'];

const productData = [
  { name: 'Producto A', value: 120000 },
  { name: 'Producto B', value: 80000 },
  { name: 'Producto C', value: 60000 },
  { name: 'Producto D', value: 30000 },
  { name: 'Otros', value: 20000 },
];

const trendData = [
  { name: 'Ene', ventas: 65000, costos: 45000 },
  { name: 'Feb', ventas: 59000, costos: 40000 },
  { name: 'Mar', ventas: 80000, costos: 55000 },
  { name: 'Abr', ventas: 81000, costos: 56000 },
  { name: 'May', ventas: 56000, costos: 40000 },
  { name: 'Jun', ventas: 75000, costos: 48000 },
];

// Datos para la sección de gastos
const EXPENSE_COLORS = ['#f59e0b', '#2563eb', '#059669', '#dc2626', '#7c3aed'];

const expenseData = [
  { name: 'Operativos', value: 35000 },
  { name: 'Administrativos', value: 22000 },
  { name: 'Marketing', value: 15000 },
  { name: 'Impuestos', value: 8000 },
  { name: 'Otros', value: 5000 },
];

const expenseTrendData = [
  { name: 'Ene', operativos: 28000, administrativos: 18000, marketing: 12000 },
  { name: 'Feb', operativos: 30000, administrativos: 20000, marketing: 13000 },
  { name: 'Mar', operativos: 32000, administrativos: 19000, marketing: 15000 },
  { name: 'Abr', operativos: 35000, administrativos: 22000, marketing: 14000 },
  { name: 'May', operativos: 33000, administrativos: 21000, marketing: 16000 },
  { name: 'Jun', operativos: 36000, administrativos: 23000, marketing: 15000 },
  { name: 'Jul', operativos: 34000, administrativos: 21000, marketing: 14000 },
  { name: 'Ago', operativos: 32000, administrativos: 20000, marketing: 13000 },
  { name: 'Sep', operativos: 35000, administrativos: 22000, marketing: 15000 },
  { name: 'Oct', operativos: 37000, administrativos: 23000, marketing: 16000 },
  { name: 'Nov', operativos: 38000, administrativos: 24000, marketing: 17000 },
  { name: 'Dic', operativos: 40000, administrativos: 25000, marketing: 18000 },
];

// Datos para la sección de ventas
const salesPerformanceData = [
  { name: 'Ene', actual: 65000, target: 60000 },
  { name: 'Feb', actual: 70000, target: 65000 },
  { name: 'Mar', actual: 80000, target: 75000 },
  { name: 'Abr', actual: 85000, target: 80000 },
  { name: 'May', actual: 90000, target: 85000 },
  { name: 'Jun', actual: 95000, target: 90000 },
];

const topProductsData = [
  { name: 'Producto Alpha Plus', value: 340 },
  { name: 'Solución Enterprise', value: 270 },
  { name: 'Kit Avanzado Pro', value: 220 },
  { name: 'Servicio Premium', value: 180 },
  { name: 'Paquete Básico', value: 150 },
];

export default ManagementModule;

