
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ButtonCustom } from "@/components/ui/button-custom";
import { 
  ArrowRight, 
  BarChart2, 
  Users, 
  Bot, 
  FileSpreadsheet,
  Package,
  FileText,
  AreaChart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  PieChart,
  LineChart,
  Maximize2,
  CalendarDays,
  Briefcase,
  Receipt,
  ClipboardList,
  DollarSign
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { FeatureCard } from "@/components/management/FeatureCard";

const ManagementModule = () => {
  const [activeTab, setActiveTab] = useState("erp");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
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

            {/* Tabs for different modules */}
            <div className="max-w-6xl mx-auto">
              <Tabs 
                defaultValue="erp" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="erp" className="text-base py-3">ERP Simplificado</TabsTrigger>
                  <TabsTrigger value="rrhh" className="text-base py-3">Recursos Humanos</TabsTrigger>
                  <TabsTrigger value="dashboard" className="text-base py-3">Dashboard Inteligente</TabsTrigger>
                </TabsList>
                
                {/* ERP Simplificado */}
                <TabsContent value="erp" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* KPI Cards */}
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
                      title="Clientes Nuevos" 
                      value="45" 
                      trend="-5%"
                      trendDirection="down"
                      icon={<Users />}
                      color="amber"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    
                    {/* Inventario Chart */}
                    <Card className="overflow-hidden border-none shadow-elevation">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Inventario</CardTitle>
                          <ButtonCustom variant="ghost" size="icon" className="h-8 w-8">
                            <Maximize2 className="h-4 w-4" />
                          </ButtonCustom>
                        </div>
                        <CardDescription>Productos por categoría</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={inventoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {inventoryData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={INVENTORY_COLORS[index % INVENTORY_COLORS.length]} />
                                ))}
                              </Pie>
                              <Legend />
                              <Tooltip formatter={(value, name) => [`${value} unidades`, name]} />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* ERP modules grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                </TabsContent>
                
                {/* Recursos Humanos */}
                <TabsContent value="rrhh" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* RRHH KPI Cards */}
                    <KpiCard 
                      title="Total Empleados" 
                      value="86" 
                      trend="+4"
                      trendDirection="up"
                      icon={<Users />}
                      color="blue"
                    />
                    
                    <KpiCard 
                      title="Tasa de Retención" 
                      value="94.2%" 
                      trend="+1.7%"
                      trendDirection="up"
                      icon={<TrendingUp />}
                      color="green"
                    />
                    
                    <KpiCard 
                      title="Días de Ausencia" 
                      value="3.2" 
                      trend="-0.8"
                      trendDirection="down"
                      icon={<CalendarDays />}
                      color="amber"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Distribución Empleados Chart */}
                    <Card className="overflow-hidden border-none shadow-elevation">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Distribución de Empleados</CardTitle>
                          <ButtonCustom variant="ghost" size="icon" className="h-8 w-8">
                            <Maximize2 className="h-4 w-4" />
                          </ButtonCustom>
                        </div>
                        <CardDescription>Por departamento</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={employeeData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {employeeData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={EMPLOYEE_COLORS[index % EMPLOYEE_COLORS.length]} />
                                ))}
                              </Pie>
                              <Legend />
                              <Tooltip />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Próximas Contrataciones Table */}
                    <Card className="overflow-hidden border-none shadow-elevation">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Próximas Contrataciones</CardTitle>
                          <ButtonCustom variant="ghost" size="icon" className="h-8 w-8">
                            <Maximize2 className="h-4 w-4" />
                          </ButtonCustom>
                        </div>
                        <CardDescription>Posiciones pendientes de cubrir</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-hidden">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-3 font-medium text-gray-500">Posición</th>
                                <th className="text-left p-3 font-medium text-gray-500">Departamento</th>
                                <th className="text-left p-3 font-medium text-gray-500">Candidatos</th>
                                <th className="text-left p-3 font-medium text-gray-500">Estado</th>
                              </tr>
                            </thead>
                            <tbody>
                              {hiringData.map((position, index) => (
                                <tr key={index} className={index < hiringData.length - 1 ? "border-b" : ""}>
                                  <td className="p-3">{position.title}</td>
                                  <td className="p-3">{position.department}</td>
                                  <td className="p-3">{position.candidates}</td>
                                  <td className="p-3">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      position.status === "Entrevistando" 
                                        ? "bg-blue-100 text-blue-800" 
                                        : position.status === "Selección final" 
                                        ? "bg-amber-100 text-amber-800" 
                                        : "bg-green-100 text-green-800"
                                    }`}>
                                      {position.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* RRHH modules grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <ErpModuleCard 
                      title="Personal" 
                      description="Gestión de empleados y organización"
                      icon={<Users className="h-5 w-5" />}
                      color="blue"
                    />
                    
                    <ErpModuleCard 
                      title="Nómina" 
                      description="Administración de pagos y beneficios"
                      icon={<DollarSign className="h-5 w-5" />}
                      color="indigo"
                    />
                    
                    <ErpModuleCard 
                      title="Asistencia" 
                      description="Control de horarios y ausencias"
                      icon={<CalendarDays className="h-5 w-5" />}
                      color="violet"
                    />
                    
                    <ErpModuleCard 
                      title="Desempeño" 
                      description="Evaluaciones y seguimiento de objetivos"
                      icon={<ClipboardList className="h-5 w-5" />}
                      color="amber"
                    />
                  </div>
                </TabsContent>
                
                {/* Dashboard de Inteligencia Empresarial */}
                <TabsContent value="dashboard" className="space-y-6">
                  {/* Alert Section */}
                  <Card className="border-l-4 border-l-amber-500 bg-amber-50">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <CardTitle className="text-lg text-amber-800">Alertas y Desviaciones</CardTitle>
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
                          title="Margen en descenso" 
                          description="Margen de categoría 'Servicios' ha disminuido un 3.2% este mes"
                          severity="medium"
                        />
                        <Alert 
                          title="Meta de ventas" 
                          description="Proyección actual: 92% de la meta trimestral"
                          severity="low"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* KPI Visualization */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    
                    <Card className="overflow-hidden border-none shadow-elevation">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Análisis de Tendencias</CardTitle>
                          <ButtonCustom variant="ghost" size="icon" className="h-8 w-8">
                            <Maximize2 className="h-4 w-4" />
                          </ButtonCustom>
                        </div>
                        <CardDescription>Ventas vs. Costos (últimos 6 meses)</CardDescription>
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
                              <Bar dataKey="ventas" name="Ventas" fill="#2563eb" />
                              <Bar dataKey="costos" name="Costos" fill="#f59e0b" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Efficiency Indicators */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <EfficiencyCard 
                      title="Rotación de Inventario" 
                      value="12.3 días"
                      trend="-2.1 días"
                      status="positive"
                    />
                    
                    <EfficiencyCard 
                      title="Ciclo de Conversión de Efectivo" 
                      value="45 días"
                      trend="+3 días"
                      status="negative"
                    />
                    
                    <EfficiencyCard 
                      title="Eficiencia Operativa" 
                      value="78%"
                      trend="+5%"
                      status="positive"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
        
        {/* Feature Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto container-padding">
            <h2 className="text-2xl font-bold text-center mb-10">Funcionalidades Principales</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<FileSpreadsheet />}
                title="ERP Simplificado"
                description="Gestión de ventas, inventario, contabilidad y presupuestos en una sola plataforma intuitiva."
              />
              
              <FeatureCard 
                icon={<Users />}
                title="Recursos Humanos"
                description="Administración de personal, nómina, asistencia y desempeño con procesos automatizados."
              />
              
              <FeatureCard 
                icon={<AreaChart />}
                title="Dashboard Inteligente"
                description="Visualización de KPIs críticos y análisis predictivo para identificar tendencias y oportunidades."
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

// Nuevos datos para la sección de inventario
const INVENTORY_COLORS = ['#4f46e5', '#0284c7', '#0f766e', '#4d7c0f', '#b45309'];

const inventoryData = [
  { name: 'Electrónica', value: 120 },
  { name: 'Muebles', value: 85 },
  { name: 'Ropa', value: 150 },
  { name: 'Artículos de oficina', value: 75 },
  { name: 'Otros', value: 40 },
];

// Nuevos datos para Recursos Humanos
const EMPLOYEE_COLORS = ['#6366f1', '#0ea5e9', '#14b8a6', '#84cc16', '#f59e0b'];

const employeeData = [
  { name: 'Ventas', value: 18 },
  { name: 'Operaciones', value: 24 },
  { name: 'Tecnología', value: 15 },
  { name: 'Administración', value: 8 },
  { name: 'Marketing', value: 12 },
];

const hiringData = [
  { title: 'Desarrollador Frontend', department: 'Tecnología', candidates: 8, status: 'Entrevistando' },
  { title: 'Ejecutivo de Ventas', department: 'Ventas', candidates: 5, status: 'Selección final' },
  { title: 'Analista de Datos', department: 'Operaciones', candidates: 4, status: 'Entrevistando' },
  { title: 'Diseñador UX/UI', department: 'Marketing', candidates: 6, status: 'Oferta enviada' },
];

export default ManagementModule;
