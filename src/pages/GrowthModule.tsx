
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Search, ArrowUpRight } from "lucide-react";
import { KpiPredictionEntry } from "@/components/growth/KpiPredictionEntry";
import { KpiPredictor } from "@/components/growth/KpiPredictor";
import MarketTrendsAnalysis from "@/components/growth/MarketTrendsAnalysis";

const GrowthModule = () => {
  const [activeTab, setActiveTab] = useState<string>("market-analysis");
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<GrowthModuleMain activeTab={activeTab} setActiveTab={setActiveTab} />} />
      <Route path="/predictor" element={<KpiPredictorPage />} />
      <Route path="/market-trends" element={<MarketTrendsPage />} />
    </Routes>
  );
};

interface GrowthModuleMainProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const GrowthModuleMain = ({ activeTab, setActiveTab }: GrowthModuleMainProps) => {
  const navigate = useNavigate();

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
            active={activeTab === "market-trends"} 
            onClick={() => navigate("/crecimiento/market-trends")}
            icon={<TrendingUp size={16} />}
            label="Tendencias de Mercado"
          />
        </div>

        {/* Contenido según la tab seleccionada */}
        {activeTab === "market-analysis" && <MarketAnalysisContent />}
      </main>
      
      <Footer />
    </div>
  );
};

const KpiPredictorPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Espaciador para evitar que el navbar fijo se superponga al contenido */}
      <div className="h-16"></div>
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <KpiPredictor />
      </main>
      
      <Footer />
    </div>
  );
};

const MarketTrendsPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Espaciador para evitar que el navbar fijo se superponga al contenido */}
      <div className="h-16"></div>
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Tendencias de Mercado
            </h1>
            <p className="text-gray-600">
              Análisis avanzado de tendencias en tu sector
            </p>
          </div>
          <button 
            onClick={() => navigate("/crecimiento")}
            className="text-pyme-blue hover:underline flex items-center"
          >
            Volver a Crecimiento
          </button>
        </div>
        
        <MarketTrendsAnalysis />
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

        <KpiPredictionEntry />
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

export default GrowthModule;
