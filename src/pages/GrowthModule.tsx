import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart2, ArrowUpRight, Users, Database } from "lucide-react";
import { KpiPredictionEntry } from "@/components/growth/KpiPredictionEntry";
import { KpiPredictor } from "@/components/growth/KpiPredictor";
import MarketTrendsAnalysis from "@/components/growth/MarketTrendsAnalysis";
import DataAnalysis from "@/components/growth/DataAnalysis";

const GrowthModule = () => {
  return (
    <Routes>
      <Route path="/" element={<GrowthModuleMain />} />
      <Route path="/predictor" element={<KpiPredictorPage />} />
      <Route path="/market-trends" element={<MarketTrendsPage />} />
      <Route path="/data-analysis" element={<DataAnalysisPage />} />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Predicción de KPIs */}
          <Card className="border-t-4 border-t-blue-500 hover:shadow-md transition-shadow">
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
              <button 
                onClick={() => navigate("/crecimiento/predictor")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <BarChart2 className="mr-2 h-5 w-5" />
                Predecir tendencias de KPIs
              </button>
            </CardContent>
          </Card>

          {/* Tendencias de Mercado */}
          <Card className="border-t-4 border-t-green-500 hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 text-green-500" size={20} />
                Tendencias de Mercado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-gray-600">
                Analiza las tendencias actuales de tu sector y aprovecha las oportunidades del mercado con datos en tiempo real.
              </p>
              <button 
                onClick={() => navigate("/crecimiento/market-trends")}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                Ver tendencias de mercado
              </button>
            </CardContent>
          </Card>

          {/* Búsqueda de Empleados */}
          <Card className="border-t-4 border-t-purple-500 hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 text-purple-500" size={20} />
                Búsqueda de Empleados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-gray-600">
                Encuentra el talento ideal para hacer crecer tu negocio con nuestra plataforma especializada de reclutamiento.
              </p>
              <button 
                onClick={() => navigate("/busqueda-empleados")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Users className="mr-2 h-5 w-5" />
                Buscar empleados
              </button>
            </CardContent>
          </Card>

          {/* Análisis de Datos - Nuevo container */}
          <Card className="border-t-4 border-t-amber-500 hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 text-amber-500" size={20} />
                Análisis de Datos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-gray-600">
                Transforma los datos de tu negocio en insights accionables mediante herramientas de análisis avanzado para tomar mejores decisiones.
              </p>
              <button 
                onClick={() => navigate("/crecimiento/data-analysis")}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Database className="mr-2 h-5 w-5" />
                Explorar análisis de datos
              </button>
            </CardContent>
          </Card>
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

const DataAnalysisPage = () => {
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
              Análisis de Datos
            </h1>
            <p className="text-gray-600">
              Transforma tus datos en decisiones estratégicas
            </p>
          </div>
          <button 
            onClick={() => navigate("/crecimiento")}
            className="text-pyme-blue hover:underline flex items-center"
          >
            Volver a Crecimiento
          </button>
        </div>
        
        <DataAnalysis />
      </main>
      
      <Footer />
    </div>
  );
};

export default GrowthModule;
