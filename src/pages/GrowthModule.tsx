
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Search, Globe, Settings, ArrowUpRight } from "lucide-react";

const GrowthModule = () => {
  const [activeTab, setActiveTab] = useState<string>("market-analysis");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Espaciador para evitar que el navbar fijo se superponga al contenido */}
      <div className="h-16"></div>
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Crecimiento y Escalabilidad
          </h1>
          <p className="text-gray-600">
            Herramientas avanzadas para expandir tu negocio de manera estratégica
          </p>
        </div>

        {/* Tabs de navegación */}
        <div className="flex overflow-x-auto space-x-2 mb-8 pb-2">
          <TabButton 
            active={activeTab === "market-analysis"} 
            onClick={() => setActiveTab("market-analysis")}
            icon={<Search size={16} />}
            label="Análisis de Mercado IA"
          />
          <TabButton 
            active={activeTab === "expansion-strategies"} 
            onClick={() => setActiveTab("expansion-strategies")}
            icon={<Globe size={16} />}
            label="Estrategias de Expansión"
          />
          <TabButton 
            active={activeTab === "operations"} 
            onClick={() => setActiveTab("operations")}
            icon={<Settings size={16} />}
            label="Optimización de Operaciones"
          />
        </div>

        {/* Contenido según la tab seleccionada */}
        {activeTab === "market-analysis" && <MarketAnalysisContent />}
        {activeTab === "expansion-strategies" && <ExpansionStrategiesContent />}
        {activeTab === "operations" && <OperationsOptimizationContent />}
      </main>
      
      <Footer />
    </div>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton = ({ active, onClick, icon, label }: TabButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
        active 
          ? "bg-pyme-blue text-white font-medium shadow-sm" 
          : "bg-white text-gray-600 hover:bg-gray-100"
      }`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
};

const MarketAnalysisContent = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-t-4 border-t-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 text-blue-500" size={20} />
              Tendencias de Mercado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Gráfico de tendencias del sector</p>
            </div>
            <div className="mt-4 space-y-3">
              <MarketTrend 
                trend="Creciente adopción de IA en PyMEs" 
                percentage={42} 
                increasing={true}
              />
              <MarketTrend 
                trend="Demanda de servicios de automatización" 
                percentage={38} 
                increasing={true}
              />
              <MarketTrend 
                trend="Uso de software de gestión tradicional" 
                percentage={12} 
                increasing={false}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Oportunidades Detectadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <OpportunityItem 
                title="Expansión a mercado internacional"
                description="Alto potencial en países del Cono Sur"
                matchPercentage={92}
              />
              <OpportunityItem 
                title="Diversificación de servicios"
                description="Añadir consultoría especializada"
                matchPercentage={87}
              />
              <OpportunityItem 
                title="Alianza estratégica"
                description="Colaboración con proveedor tecnológico"
                matchPercentage={78}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Análisis Competitivo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competidor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fortalezas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debilidades</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuota Mercado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Empresa A</td>
                  <td className="px-6 py-4">Infraestructura sólida, gran capital</td>
                  <td className="px-6 py-4">Poca innovación, procesos lentos</td>
                  <td className="px-6 py-4">34%</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Startup B</td>
                  <td className="px-6 py-4">Muy innovadora, crecimiento rápido</td>
                  <td className="px-6 py-4">Poca experiencia, recursos limitados</td>
                  <td className="px-6 py-4">12%</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Corporación C</td>
                  <td className="px-6 py-4">Reconocimiento de marca, alcance global</td>
                  <td className="px-6 py-4">Altos costos, no especializada</td>
                  <td className="px-6 py-4">28%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface MarketTrendProps {
  trend: string;
  percentage: number;
  increasing: boolean;
}

const MarketTrend = ({ trend, percentage, increasing }: MarketTrendProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">{trend}</span>
        <div className="flex items-center">
          <span className={`text-sm font-bold ${increasing ? 'text-green-600' : 'text-red-600'}`}>
            {percentage}%
          </span>
          <ArrowUpRight 
            className={`ml-1 h-4 w-4 ${increasing ? 'text-green-600' : 'text-red-600 transform rotate-180'}`} 
          />
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${increasing ? 'bg-green-500' : 'bg-red-500'}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

interface OpportunityItemProps {
  title: string;
  description: string;
  matchPercentage: number;
}

const OpportunityItem = ({ title, description, matchPercentage }: OpportunityItemProps) => {
  return (
    <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-800">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <div className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">
          {matchPercentage}% match
        </div>
      </div>
    </div>
  );
};

const ExpansionStrategiesContent = () => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Estrategias de Expansión Recomendadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StrategyCard 
              title="Expansión Geográfica"
              description="Ingresar a nuevos mercados regionales con bajo costo de entrada y alta demanda"
              difficulty="Medio"
              timeframe="6-12 meses"
              roi="25-35%"
            />
            <StrategyCard 
              title="Diversificación de Productos"
              description="Ampliar la oferta actual con servicios complementarios de alta demanda"
              difficulty="Bajo"
              timeframe="3-6 meses"
              roi="15-22%"
            />
            <StrategyCard 
              title="Adquisición Estratégica"
              description="Compra o fusión con competidor más pequeño para ganar cuota de mercado"
              difficulty="Alto"
              timeframe="12-18 meses"
              roi="30-45%"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Análisis de Nuevos Mercados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <MarketAnalysisItem 
                country="Colombia"
                marketSize="USD 2.3B"
                growth={18}
                competition="Media"
                entryBarrier="Baja"
                score={87}
              />
              <MarketAnalysisItem 
                country="Chile"
                marketSize="USD 1.8B"
                growth={14}
                competition="Alta"
                entryBarrier="Media"
                score={72}
              />
              <MarketAnalysisItem 
                country="Perú"
                marketSize="USD 1.2B"
                growth={22}
                competition="Baja"
                entryBarrier="Media"
                score={83}
              />
              <MarketAnalysisItem 
                country="Ecuador"
                marketSize="USD 0.8B"
                growth={16}
                competition="Baja"
                entryBarrier="Alta"
                score={68}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Modelos de Expansión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ExpansionModelItem 
                model="Franquicia" 
                pros={["Bajo costo inicial", "Expansión rápida", "Riesgo compartido"]} 
                cons={["Control limitado", "Compartir know-how", "Menor margen"]}
              />
              <ExpansionModelItem 
                model="Sucursales propias" 
                pros={["Control total", "Mayor margen", "Marca consistente"]} 
                cons={["Alto costo inicial", "Expansión más lenta", "Mayor riesgo"]}
              />
              <ExpansionModelItem 
                model="Joint Venture" 
                pros={["Conocimiento local", "Inversión compartida", "Acceso a red local"]} 
                cons={["Toma de decisiones compleja", "Potenciales conflictos", "Dilución de marca"]}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface StrategyCardProps {
  title: string;
  description: string;
  difficulty: string;
  timeframe: string;
  roi: string;
}

const StrategyCard = ({ title, description, difficulty, timeframe, roi }: StrategyCardProps) => {
  return (
    <div className="glass-card p-5 hover:shadow-elevation transition-all duration-300">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <span className="block text-gray-500">Dificultad</span>
          <span className="font-medium">{difficulty}</span>
        </div>
        <div>
          <span className="block text-gray-500">Tiempo</span>
          <span className="font-medium">{timeframe}</span>
        </div>
        <div>
          <span className="block text-gray-500">ROI Est.</span>
          <span className="font-medium text-green-600">{roi}</span>
        </div>
      </div>
    </div>
  );
};

interface MarketAnalysisItemProps {
  country: string;
  marketSize: string;
  growth: number;
  competition: string;
  entryBarrier: string;
  score: number;
}

const MarketAnalysisItem = ({ country, marketSize, growth, competition, entryBarrier, score }: MarketAnalysisItemProps) => {
  return (
    <div className="flex items-center border-b border-gray-200 pb-3">
      <div className="flex-grow">
        <div className="flex items-center">
          <h4 className="font-medium">{country}</h4>
          <div className="ml-2 px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800">
            {growth}% crecimiento
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-1 text-sm">
          <div>
            <span className="text-gray-500">Mercado:</span> {marketSize}
          </div>
          <div>
            <span className="text-gray-500">Competencia:</span> {competition}
          </div>
          <div>
            <span className="text-gray-500">Barreras:</span> {entryBarrier}
          </div>
        </div>
      </div>
      <div className="ml-4 w-12 h-12 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-lg font-bold">
        {score}
      </div>
    </div>
  );
};

interface ExpansionModelItemProps {
  model: string;
  pros: string[];
  cons: string[];
}

const ExpansionModelItem = ({ model, pros, cons }: ExpansionModelItemProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h4 className="font-medium text-lg mb-2">{model}</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h5 className="text-sm font-medium text-green-600 mb-1">Ventajas</h5>
          <ul className="text-sm space-y-1">
            {pros.map((pro, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-1">✓</span>
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="text-sm font-medium text-red-600 mb-1">Desventajas</h5>
          <ul className="text-sm space-y-1">
            {cons.map((con, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-500 mr-1">✗</span>
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const OperationsOptimizationContent = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Oportunidades de Automatización</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AutomationOpportunity
                process="Gestión de facturación"
                currentTime="4.5 horas/semana"
                potentialSaving="85%"
                implementation="Fácil"
                impact="Alto"
              />
              <AutomationOpportunity
                process="Seguimiento de inventario"
                currentTime="8 horas/semana"
                potentialSaving="70%"
                implementation="Medio"
                impact="Alto"
              />
              <AutomationOpportunity
                process="Proceso de reclutamiento"
                currentTime="12 horas/semana"
                potentialSaving="50%"
                implementation="Complejo"
                impact="Medio"
              />
              <AutomationOpportunity
                process="Atención al cliente (1er nivel)"
                currentTime="20 horas/semana"
                potentialSaving="65%"
                implementation="Medio"
                impact="Alto"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ahorro Proyectado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full border-8 border-green-100 flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">68%</div>
                  <div className="text-sm text-gray-500">Eficiencia</div>
                </div>
              </div>
              
              <div className="space-y-2 w-full">
                <SavingItem label="Tiempo mensual" value="86 horas" />
                <SavingItem label="Costo operativo" value="$4,250" />
                <SavingItem label="ROI esperado" value="280%" />
                <SavingItem label="Payback period" value="5 meses" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan de Optimización de Recursos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <OptimizationPhaseCard
              phase="Fase 1"
              title="Evaluación y Planificación"
              duration="1-2 meses"
              tasks={[
                "Auditoría de procesos actuales",
                "Identificación de cuellos de botella",
                "Definición de KPIs",
                "Selección de soluciones tecnológicas"
              ]}
              status="Completado"
            />
            <OptimizationPhaseCard
              phase="Fase 2"
              title="Implementación"
              duration="3-4 meses"
              tasks={[
                "Integración de herramientas",
                "Automatización de procesos clave",
                "Capacitación del personal",
                "Pruebas piloto"
              ]}
              status="En progreso"
            />
            <OptimizationPhaseCard
              phase="Fase 3"
              title="Evaluación y Ajuste"
              duration="2-3 meses"
              tasks={[
                "Monitoreo de resultados",
                "Ajustes a los procesos",
                "Expansión a otras áreas",
                "Mejora continua"
              ]}
              status="Pendiente"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface AutomationOpportunityProps {
  process: string;
  currentTime: string;
  potentialSaving: string;
  implementation: string;
  impact: string;
}

const AutomationOpportunity = ({ process, currentTime, potentialSaving, implementation, impact }: AutomationOpportunityProps) => {
  const getImplementationColor = (level: string) => {
    switch (level) {
      case "Fácil": return "text-green-600";
      case "Medio": return "text-yellow-600";
      case "Complejo": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getImpactColor = (level: string) => {
    switch (level) {
      case "Alto": return "text-green-600";
      case "Medio": return "text-yellow-600";
      case "Bajo": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="flex items-center border-b border-gray-200 pb-3">
      <div className="flex-grow">
        <h4 className="font-medium">{process}</h4>
        <div className="grid grid-cols-3 gap-2 mt-1 text-sm">
          <div>
            <span className="text-gray-500">Tiempo actual:</span> {currentTime}
          </div>
          <div className={getImplementationColor(implementation)}>
            <span className="text-gray-500">Implementación:</span> {implementation}
          </div>
          <div className={getImpactColor(impact)}>
            <span className="text-gray-500">Impacto:</span> {impact}
          </div>
        </div>
      </div>
      <div className="ml-4 px-3 py-1 bg-green-100 text-green-800 rounded text-lg font-bold">
        {potentialSaving}
      </div>
    </div>
  );
};

interface SavingItemProps {
  label: string;
  value: string;
}

const SavingItem = ({ label, value }: SavingItemProps) => {
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-100">
      <span className="text-gray-600 text-sm">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
};

interface OptimizationPhaseCardProps {
  phase: string;
  title: string;
  duration: string;
  tasks: string[];
  status: "Completado" | "En progreso" | "Pendiente";
}

const OptimizationPhaseCard = ({ phase, title, duration, tasks, status }: OptimizationPhaseCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "Completado": return "bg-green-100 text-green-800";
      case "En progreso": return "bg-blue-100 text-blue-800";
      case "Pendiente": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-sm font-medium text-blue-600">{phase}</div>
          <h3 className="font-semibold">{title}</h3>
        </div>
        <div className={`px-2 py-1 rounded text-xs ${getStatusColor()}`}>
          {status}
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-3">Duración: {duration}</p>
      <ul className="space-y-1">
        {tasks.map((task, index) => (
          <li key={index} className="text-sm flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
            {task}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GrowthModule;
