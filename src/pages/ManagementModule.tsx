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
  AreaChart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  PieChart,
  LineChart,
  Maximize2,
  Send
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

const ManagementModule = () => {
  const [activeTab, setActiveTab] = useState("erp");
  const [promptValue, setPromptValue] = useState("");

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
                asistencia de IA que te ayuda a tomar mejores decisiones.
              </p>
            </div>

            {/* Tabs for ERP and Business Intelligence */}
            <div className="max-w-6xl mx-auto">
              <Tabs 
                defaultValue="erp" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="erp" className="text-base py-3">ERP Simplificado con IA</TabsTrigger>
                  <TabsTrigger value="dashboard" className="text-base py-3">Dashboard de Inteligencia Empresarial</TabsTrigger>
                </TabsList>
                
                {/* ERP Simplificado con IA */}
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
                        <div className="h-[250px]">
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
                    
                    {/* AI Assistant */}
                    <Card className="overflow-hidden border-none shadow-elevation">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Asistente IA de Gestión</CardTitle>
                        <CardDescription>Análisis y recomendaciones en tiempo real</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[250px] overflow-y-auto bg-muted/30 rounded-md p-4 space-y-4">
                        <AiMessage 
                          content="Basado en tus últimos datos financieros, veo que el margen de beneficio ha mejorado un 2.1%. Las estrategias de reducción de costos están funcionando."
                          isAi={true}
                        />
                        <AiMessage 
                          content="¿Qué sugiere para mejorar la tendencia a la baja en clientes nuevos?"
                          isAi={false}
                        />
                        <AiMessage 
                          content="Observo que la inversión en marketing digital ha disminuido un 15% este trimestre. Recomendaría aumentar presupuesto en campañas de adquisición y revisar la estrategia de precios para nuevos clientes."
                          isAi={true}
                        />
                      </CardContent>
                      <CardFooter className="border-t p-3">
                        <div className="flex w-full items-center space-x-2">
                          <input
                            type="text"
                            placeholder="Pregunta algo sobre tu negocio..."
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={promptValue}
                            onChange={(e) => setPromptValue(e.target.value)}
                          />
                          <ButtonCustom size="icon" className="h-10 w-10">
                            <Send className="h-4 w-4" />
                          </ButtonCustom>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                  
                  {/* ERP modules grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ErpModuleCard 
                      title="Ventas e Ingresos" 
                      description="Gestión de facturación, pedidos y seguimiento de clientes"
                      icon={<BarChart2 className="h-5 w-5" />}
                      color="blue"
                    />
                    
                    <ErpModuleCard 
                      title="Inventario" 
                      description="Control de stock, alertas y gestión de proveedores"
                      icon={<AreaChart className="h-5 w-5" />}
                      color="indigo"
                    />
                    
                    <ErpModuleCard 
                      title="Contabilidad" 
                      description="Registros contables, impuestos y balances"
                      icon={<LineChart className="h-5 w-5" />}
                      color="violet"
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
        
        {/* Feature Section - Keeping this but simplifying it */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto container-padding">
            <h2 className="text-2xl font-bold text-center mb-10">Funcionalidades Principales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={<BarChart2 />}
                title="ERP Simplificado"
                description="Gestión de ventas, inventario, contabilidad y presupuestos en una sola plataforma intuitiva."
              />
              
              <FeatureCard 
                icon={<Users />}
                title="Recursos Humanos"
                description="Administración de personal, nómina, asistencia y desempeño con procesos automatizados."
              />
              
              <FeatureCard 
                icon={<Bot />}
                title="Asistente Virtual"
                description="Chatbot especializado en gestión empresarial para resolver dudas y recibir recomendaciones."
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

// KPI Card Component
interface KpiCardProps {
  title: string;
  value: string;
  trend: string;
  trendDirection: "up" | "down";
  icon: React.ReactNode;
  color: "blue" | "green" | "amber" | "red";
}

const KpiCard = ({ title, value, trend, trendDirection, icon, color }: KpiCardProps) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  };
  
  const trendIconClass = trendDirection === "up" ? "text-green-500" : "text-red-500";
  const TrendIcon = trendDirection === "up" ? TrendingUp : TrendingDown;
  
  return (
    <Card className="border-none shadow-elevation hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 mb-2">
          <div className="text-3xl font-bold">{value}</div>
          <div className="flex items-center mb-1">
            <TrendIcon className={`h-4 w-4 mr-1 ${trendIconClass}`} />
            <span className={trendIconClass}>{trend}</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${color === "blue" ? "bg-blue-500" : color === "green" ? "bg-green-500" : color === "amber" ? "bg-amber-500" : "bg-red-500"}`}
            style={{ width: "70%" }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};

// AI Message Component
interface AiMessageProps {
  content: string;
  isAi: boolean;
}

const AiMessage = ({ content, isAi }: AiMessageProps) => {
  return (
    <div className={`flex ${isAi ? "justify-start" : "justify-end"}`}>
      <div 
        className={`max-w-[75%] rounded-lg px-4 py-2 ${
          isAi 
            ? "bg-blue-100 text-blue-800 rounded-tl-none" 
            : "bg-gray-100 text-gray-800 rounded-tr-none"
        }`}
      >
        {content}
      </div>
    </div>
  );
};

// ERP Module Card Component
interface ErpModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: "blue" | "indigo" | "violet" | "amber";
}

const ErpModuleCard = ({ title, description, icon, color }: ErpModuleCardProps) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    indigo: "from-indigo-500 to-indigo-600",
    violet: "from-violet-500 to-violet-600",
    amber: "from-amber-500 to-amber-600",
  };
  
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className={`h-1.5 w-full bg-gradient-to-r ${colorClasses[color]}`}></div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center 
            ${color === "blue" ? "bg-blue-100 text-blue-600" : 
              color === "indigo" ? "bg-indigo-100 text-indigo-600" : 
              color === "violet" ? "bg-violet-100 text-violet-600" : 
              "bg-amber-100 text-amber-600"}`}>
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <ButtonCustom variant="ghost" className="p-0 h-auto hover:bg-transparent hover:underline" size="sm">
          <span className="text-sm">Ver más</span>
          <ArrowRight className="h-3 w-3 ml-1" />
        </ButtonCustom>
      </CardFooter>
    </Card>
  );
};

// Alert Component
interface AlertProps {
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
}

const Alert = ({ title, description, severity }: AlertProps) => {
  const severityClasses = {
    high: "border-red-500 bg-red-50",
    medium: "border-amber-500 bg-amber-50",
    low: "border-blue-500 bg-blue-50",
  };
  
  const textClasses = {
    high: "text-red-700",
    medium: "text-amber-700",
    low: "text-blue-700",
  };
  
  return (
    <div className={`border-l-4 px-4 py-2 rounded-r ${severityClasses[severity]}`}>
      <div className={`font-medium ${textClasses[severity]}`}>{title}</div>
      <div className="text-sm text-gray-600">{description}</div>
    </div>
  );
};

// Efficiency Card Component
interface EfficiencyCardProps {
  title: string;
  value: string;
  trend: string;
  status: "positive" | "negative" | "neutral";
}

const EfficiencyCard = ({ title, value, trend, status }: EfficiencyCardProps) => {
  const statusColor = status === "positive" 
    ? "text-green-600" 
    : status === "negative" 
      ? "text-red-600" 
      : "text-gray-600";
  
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className={`text-sm ${statusColor}`}>
          {trend}
        </div>
      </CardContent>
    </Card>
  );
};

// Feature Card Component (from original design)
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="glass-card p-6 hover:shadow-elevation transition-all duration-300">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pyme-blue/10 text-pyme-blue mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-pyme-gray-dark">{description}</p>
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

export default ManagementModule;
