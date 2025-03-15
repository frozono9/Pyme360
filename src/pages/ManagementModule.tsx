
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
  Package,
  FileText,
  LineChart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
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
import { Alert } from "@/components/management/Alert";
import { EfficiencyCard } from "@/components/management/EfficiencyCard";

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
                Plataforma integrada para administrar todos los aspectos de tu negocio con 
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
          
          {/* Inventory Management */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-4">Gestión de Inventario</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
              <KpiCard 
                title="Total de Inventario" 
                value="470 unidades" 
                trend="+15 unidades"
                trendDirection="up"
                icon={<Package />}
                color="blue"
              />
              
              <KpiCard 
                title="Rotación de Inventario" 
                value="12.3 días" 
                trend="-2.1 días"
                trendDirection="up"
                icon={<TrendingUp />}
                color="green"
              />
              
              <KpiCard 
                title="Productos de Baja Rotación" 
                value="12 productos" 
                trend="-3 productos"
                trendDirection="up"
                icon={<TrendingDown />}
                color="amber"
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Inventory Levels */}
              <Card className="overflow-hidden border-none shadow-elevation">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Niveles de Inventario</CardTitle>
                    <ButtonCustom variant="ghost" size="icon" className="h-8 w-8">
                      <Maximize2 className="h-4 w-4" />
                    </ButtonCustom>
                  </div>
                  <CardDescription>Por categoría</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={inventoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} unidades`, '']} />
                        <Legend />
                        <Bar dataKey="value" name="Unidades" fill="#2563eb" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Inventory Alerts */}
              <Card className="border-l-4 border-l-amber-500 bg-amber-50">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <CardTitle className="text-lg text-amber-800">Alertas de Inventario</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Alert 
                      title="Inventario bajo" 
                      description="3 productos por debajo del nivel mínimo establecido"
                      severity="high"
                    />
                    <Alert 
                      title="Exceso de inventario" 
                      description="5 productos con más de 60 días sin movimiento"
                      severity="medium"
                    />
                    <Alert 
                      title="Próximo a vencer" 
                      description="2 productos con fecha de caducidad en los próximos 15 días"
                      severity="low"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Accounting and Finance */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-4">Contabilidad y Finanzas</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
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
          </div>
          
          {/* ERP Quick Access Modules */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Acceso Rápido a Módulos</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <ErpModuleCard 
                title="Ventas" 
                description="Gestión de facturación, pedidos y seguimiento de clientes"
                icon={<Receipt className="h-5 w-5" />}
                color="blue"
              />
              
              <ErpModuleCard 
                title="Inventario" 
                description="Control de stock, alertas y gestión de proveedores"
                icon={<Package className="h-5 w-5" />}
                color="indigo"
              />
              
              <ErpModuleCard 
                title="Contabilidad" 
                description="Registros contables, impuestos y balances"
                icon={<FileText className="h-5 w-5" />}
                color="violet"
              />
              
              <ErpModuleCard 
                title="Presupuestos" 
                description="Planificación financiera y seguimiento de gastos"
                icon={<DollarSign className="h-5 w-5" />}
                color="amber"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <ErpModuleCard 
                title="Informes" 
                description="Informes personalizados y analítica avanzada"
                icon={<BarChart3 className="h-5 w-5" />}
                color="blue"
              />
              
              <ErpModuleCard 
                title="Impuestos" 
                description="Gestión de impuestos y declaraciones fiscales"
                icon={<Calculator className="h-5 w-5" />}
                color="indigo"
              />
              
              <ErpModuleCard 
                title="Proyecciones" 
                description="Proyecciones financieras y análisis de escenarios"
                icon={<LineChart className="h-5 w-5" />}
                color="violet"
              />
              
              <ErpModuleCard 
                title="Usuarios" 
                description="Gestión de permisos y accesos al sistema"
                icon={<Users className="h-5 w-5" />}
                color="amber"
              />
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

// Datos para la sección de inventario
const inventoryData = [
  { name: 'Electrónica', value: 120 },
  { name: 'Muebles', value: 85 },
  { name: 'Ropa', value: 150 },
  { name: 'Artículos de oficina', value: 75 },
  { name: 'Otros', value: 40 },
];

export default ManagementModule;
