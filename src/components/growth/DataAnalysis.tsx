
import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, UploadCloud, FileSpreadsheet, AlertCircle, BarChart2, PieChart, Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from "recharts";

// Function to determine if we are in development or production
const getApiBaseUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  } else {
    return '';
  }
};

const API_BASE_URL = getApiBaseUrl();

const DataAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const COLORS = ["#2563eb", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"];

  const fetchImportancias = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/importancias`);
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching importancias:", error);
      throw error;
    }
  };

  const { data: importanciasData, isLoading, isError, error } = useQuery({
    queryKey: ["importancias"],
    queryFn: fetchImportancias,
    meta: {
      onSettled: (data, error) => {
        if (error) {
          toast({
            title: "Error al cargar datos",
            description: `No se pudieron cargar los datos de importancias: ${error.message}`,
            variant: "destructive",
          });
        }
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyzeData = async () => {
    if (!selectedFile) {
      toast({
        title: "No hay archivo seleccionado",
        description: "Por favor, selecciona un archivo CSV para analizar.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }

      const result = await response.json();
      setAnalysisResult(result);
      toast({
        title: "Análisis completado",
        description: "El archivo ha sido analizado correctamente.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error al analizar datos:", error);
      toast({
        title: "Error al analizar datos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Custom function to extract recommendations from the response text
  const extractRecommendations = (text) => {
    if (!text) return "";
    
    // Try to find the "Recomendaciones" section
    const recommendationsMatch = text.match(/### Recomendaciones\s*([\s\S]*?)(?=###|$)/i);
    if (recommendationsMatch && recommendationsMatch[1]) {
      return recommendationsMatch[1].trim();
    }
    
    // If no specific "Recomendaciones" section, check if we have any recommendations in the text
    if (text.toLowerCase().includes("recomend")) {
      const sentences = text.split('. ');
      const recommendationSentences = sentences.filter(s => 
        s.toLowerCase().includes("recomend") || 
        s.toLowerCase().includes("suger") || 
        s.toLowerCase().includes("consider")
      );
      if (recommendationSentences.length > 0) {
        return recommendationSentences.join('. ') + '.';
      }
    }
    
    return "No se encontraron recomendaciones específicas en el análisis.";
  };

  // Prepare visualization data
  const prepareImportanciaData = () => {
    if (!importanciasData || !importanciasData.importancia_features?.importancias_completas) {
      return [];
    }
    
    // Get top 5 features by importance
    return importanciasData.importancia_features.importancias_completas
      .filter(item => item.importancia > 0) // Filter out negative importances
      .sort((a, b) => b.importancia - a.importancia) // Sort by importance (descending)
      .slice(0, 5) // Get top 5
      .map(item => ({
        name: item.caracteristica.replace('cat__', '').replace('num__', ''),
        value: parseFloat((item.importancia * 100).toFixed(2)) // Convert to percentage for better readability
      }));
  };

  const prepareDistributionData = () => {
    if (!importanciasData || !importanciasData.distribucion_target) {
      return [];
    }
    
    const labels = importanciasData.distribucion_target.labels || ["0", "1"];
    const values = importanciasData.distribucion_target.values || [0, 0];
    
    return [
      { name: labels[0] === 0 ? "No sobrevivió" : labels[0], value: values[0] },
      { name: labels[1] === 1 ? "Sobrevivió" : labels[1], value: values[1] }
    ];
  };

  const prepareMissingValuesData = () => {
    if (!importanciasData || !importanciasData.valores_faltantes) {
      return [];
    }
    
    // If we have specific missing values data
    if (importanciasData.valores_faltantes.labels && importanciasData.valores_faltantes.values) {
      return importanciasData.valores_faltantes.labels.map((label, index) => ({
        name: label,
        value: importanciasData.valores_faltantes.values[index]
      }));
    }
    
    // If we have the values in conteo format
    if (importanciasData.valores_faltantes.conteo) {
      return Object.entries(importanciasData.valores_faltantes.conteo).map(([key, value]) => ({
        name: key,
        value: Number(value)
      }));
    }
    
    return [];
  };

  const renderVisualizations = () => {
    const importanciaData = prepareImportanciaData();
    const distributionData = prepareDistributionData();
    const missingValuesData = prepareMissingValuesData();
    
    return (
      <div className="space-y-8">
        {/* Feature Importance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Importancia de las Características</CardTitle>
            <CardDescription>Las características más importantes según el modelo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={importanciaData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 'dataMax']} />
                  <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Importancia']} />
                  <Legend />
                  <Bar dataKey="value" name="Importancia (%)" fill="#2563eb">
                    {importanciaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Target Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribución de la Variable Objetivo</CardTitle>
            <CardDescription>Proporción de cada categoría en la variable objetivo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Cantidad']} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Missing Values Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Valores Faltantes</CardTitle>
            <CardDescription>Cantidad de valores faltantes por variable</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={missingValuesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, 'Valores faltantes']} />
                  <Legend />
                  <Bar dataKey="value" name="Valores faltantes" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm border">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center">
            <FileSpreadsheet className="mr-2 text-pyme-blue" />
            Análisis de Datos Empresariales
          </CardTitle>
          <CardDescription>
            Sube un archivo CSV y obtén insights valiosos sobre tus datos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">
              Esta herramienta analiza tus datos para identificar patrones, tendencias y oportunidades de mejora para tu negocio. Sube un archivo CSV con tus datos para comenzar.
            </p>
            <div className="flex flex-col space-y-4">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onClick={handleUploadClick}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileChange}
                />
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {fileName ? fileName : "Selecciona un archivo CSV"}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {fileName
                    ? "Haz clic para cambiar el archivo"
                    : "O arrastra y suelta aquí"}
                </p>
              </div>

              <Button 
                onClick={handleAnalyzeData} 
                disabled={!selectedFile || isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analizando...
                  </>
                ) : (
                  "Analizar Datos"
                )}
              </Button>
            </div>
          </div>

          {(isLoading || isError) && (
            <div className="py-4 text-center">
              {isLoading && (
                <div className="flex flex-col items-center space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin text-pyme-blue" />
                  <p className="text-sm text-gray-600">Cargando análisis previo...</p>
                </div>
              )}
              {isError && (
                <div className="flex flex-col items-center space-y-2">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                  <p className="text-sm text-red-600">
                    Error al cargar datos: {error.message}
                  </p>
                </div>
              )}
            </div>
          )}

          {importanciasData && !isLoading && !isError && (
            <Tabs defaultValue="summary" className="mt-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary" className="flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  Resumen
                </TabsTrigger>
                <TabsTrigger value="visualizations" className="flex items-center">
                  <BarChart2 className="w-4 h-4 mr-2" />
                  Visualizaciones
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="flex items-center">
                  <PieChart className="w-4 h-4 mr-2" />
                  Recomendaciones
                </TabsTrigger>
                <TabsTrigger value="raw" className="flex items-center">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Datos Crudos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Resumen del Análisis</CardTitle>
                    <CardDescription>Resultados principales y estadísticas clave</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {importanciasData.response_text ? (
                      <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-line">
                          {importanciasData.response_text}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-blue-50 p-4 rounded-md">
                        <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                          <Info className="w-4 h-4 mr-2" />
                          Análisis de Machine Learning
                        </h3>
                        <p className="text-blue-700 text-sm">
                          Este análisis utiliza modelos de aprendizaje automático para identificar patrones en tus datos. Las variables más importantes son las que tienen mayor influencia en la predicción del modelo.
                        </p>
                      </div>
                    )}
                    
                    {importanciasData.insights && importanciasData.insights.length > 0 && (
                      <div className="mt-4">
                        <h3 className="font-medium text-gray-900 mb-2">Principales Insights:</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {importanciasData.insights.map((insight, index) => (
                            <li key={index} className="text-gray-700">{insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="visualizations" className="mt-4">
                {renderVisualizations()}
              </TabsContent>

              <TabsContent value="recommendations" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recomendaciones para tu Negocio</CardTitle>
                    <CardDescription>Sugerencias basadas en el análisis de datos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {importanciasData.recomendaciones ? (
                      <div className="space-y-3">
                        <ul className="list-disc pl-5 space-y-2">
                          {importanciasData.recomendaciones.map((recomendacion, index) => (
                            <li key={index} className="text-gray-700">{recomendacion}</li>
                          ))}
                        </ul>
                      </div>
                    ) : importanciasData.response_text ? (
                      <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-line">
                          {extractRecommendations(importanciasData.response_text)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No hay recomendaciones disponibles para este análisis.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="raw" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Datos Crudos</CardTitle>
                    <CardDescription>Datos completos del análisis en formato JSON</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[500px]">
                      <pre className="text-xs text-gray-800">
                        {JSON.stringify(importanciasData, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataAnalysis;
