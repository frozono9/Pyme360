
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart2, ArrowUpRight, Users } from "lucide-react";
import { KpiPredictionEntry } from "@/components/growth/KpiPredictionEntry";
import { KpiPredictor } from "@/components/growth/KpiPredictor";
import MarketTrendsAnalysis from "@/components/growth/MarketTrendsAnalysis";

const GrowthModule = () => {
  return (
    <Routes>
      <Route path="/" element={<GrowthModuleMain />} />
      <Route path="/predictor" element={<KpiPredictorPage />} />
      <Route path="/market-trends" element={<MarketTrendsPage />} />
    </Routes>
  );
};

const GrowthModuleMain = () => {
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

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-t-4 border-t-blue-500 md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="mr-2 text-blue-500" size={20} />
                  Predicción de KPIs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-gray-600">
                  Visualiza el comportamiento futuro de tus indicadores clave basado en tendencias y proyecciones. Esta herramienta te permite anticiparte a cambios en tu negocio.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium text-blue-700 mb-2">Beneficios:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Toma decisiones basadas en proyecciones informadas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Anticipa cambios en el comportamiento de tus KPIs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Establece metas realistas para tu negocio</span>
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => navigate("/crecimiento/predictor")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <BarChart2 className="mr-2 h-5 w-5" />
                  Predecir tendencias de KPIs
                </button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none shadow-md">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-blue-700 mb-3">Tendencias de Mercado</h3>
                <p className="text-blue-900 mb-5">
                  Analiza las tendencias actuales de tu sector y aprovecha las oportunidades del mercado con datos en tiempo real.
                </p>
                <button 
                  onClick={() => navigate("/crecimiento/market-trends")}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Ver tendencias de mercado
                </button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-none shadow-md">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-green-700 mb-3">Búsqueda de Empleados</h3>
                <p className="text-green-900 mb-5">
                  Encuentra el talento ideal para hacer crecer tu negocio con nuestra plataforma especializada de reclutamiento.
                </p>
                <button 
                  onClick={() => navigate("/busqueda-empleados")}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Buscar empleados
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
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
      
      {/* Increased padding bottom to ensure no footer overlap */}
      <main className="flex-1 py-8 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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

export default GrowthModule;
