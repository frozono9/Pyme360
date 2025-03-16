
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Upload, 
  FileUp, 
  FilePlus2, 
  AlertCircle, 
  BarChart, 
  PieChart, 
  BarChart2, 
  FileJson, 
  Info 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const DataAnalysis = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [previewRows, setPreviewRows] = useState<number>(5);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [aiResult, setAiResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("preview");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check if the file is a CSV
    if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
      setError("Por favor, sube un archivo CSV válido");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setError("");

    // Parse the CSV file
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = text.split('\n').map(row => 
          row.split(',').map(cell => cell.trim())
        );

        // Filter out empty rows
        const nonEmptyRows = rows.filter(row => row.some(cell => cell !== ''));
        
        if (nonEmptyRows.length > 0) {
          const csvHeaders = nonEmptyRows[0];
          setCsvData(nonEmptyRows.slice(1));
          setHeaders(csvHeaders);
          setSelectedColumn(csvHeaders[0] || ""); // Select first column by default
        } else {
          setError("El archivo CSV está vacío o no contiene datos válidos");
        }
      } catch (err) {
        console.error("Error parsing CSV:", err);
        setError("Error al procesar el archivo CSV");
      }
    };

    reader.onerror = () => {
      setError("Error al leer el archivo");
    };

    reader.readAsText(selectedFile);
  };

  const handleColumnSelect = (value: string) => {
    setSelectedColumn(value);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!file || !selectedColumn) {
      setError("Por favor, selecciona un archivo y una columna para el análisis");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      // Call the first Python script (analizador_importancias.py)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('target_variable', selectedColumn);
      
      const firstResponse = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!firstResponse.ok) {
        throw new Error(`Error en el análisis: ${firstResponse.statusText}`);
      }
      
      const analysisData = await firstResponse.json();
      setAnalysisResult(analysisData);
      
      // Call the second Python script (importancias.py)
      const secondResponse = await fetch('/api/importancias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: JSON.stringify(analysisData),
          prompt: "Genera visualizaciones y recomendaciones basadas en el análisis",
        }),
      });
      
      if (!secondResponse.ok) {
        throw new Error(`Error en la interpretación AI: ${secondResponse.statusText}`);
      }
      
      const aiData = await secondResponse.json();
      setAiResult(aiData);
      
      setActiveTab("results");
      toast({
        title: "Análisis completado",
        description: "Se han generado los resultados del análisis",
      });
    } catch (err) {
      console.error("Error durante el análisis:", err);
      setError(`Error durante el análisis: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFeatureImportanceChart = () => {
    if (!aiResult?.importancia_features) return null;
    
    const { labels, values } = aiResult.importancia_features;
    
    return (
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Importancia de Características</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          {labels.map((label: string, index: number) => (
            <div key={index} className="mb-2 last:mb-0">
              <div className="flex justify-between text-sm mb-1">
                <span>{label}</span>
                <span className="font-medium">{values[index].toFixed(3)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-amber-500 h-2.5 rounded-full" 
                  style={{ width: `${Math.max(values[index] * 100 * 10, 5)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTargetDistributionChart = () => {
    if (!aiResult?.distribucion_target) return null;
    
    const { labels, values } = aiResult.distribucion_target;
    const total = values.reduce((acc: number, val: number) => acc + val, 0);
    
    return (
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Distribución de la Variable Objetivo</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex flex-col space-y-2">
            {labels.map((label: string, index: number) => {
              const percentage = ((values[index] / total) * 100).toFixed(1);
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{label}</span>
                    <span className="font-medium">{values[index]} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderMissingValuesChart = () => {
    if (!aiResult?.valores_faltantes) return null;
    
    const { labels, values } = aiResult.valores_faltantes;
    
    return (
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Valores Faltantes</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          {labels.map((label: string, index: number) => (
            <div key={index} className="mb-2 last:mb-0">
              <div className="flex justify-between text-sm mb-1">
                <span>{label}</span>
                <span className="font-medium">{values[index]} valores faltantes</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-red-500 h-2.5 rounded-full" 
                  style={{ width: `${Math.min(values[index] / 10, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRecommendations = () => {
    if (!aiResult?.recomendaciones) return null;
    
    return (
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Recomendaciones para tu Negocio</h3>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Insight de IA</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              {aiResult.recomendaciones.map((recomendacion: string, index: number) => (
                <li key={index}>{recomendacion}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Subir datos para análisis</CardTitle>
          <CardDescription>
            Sube un archivo CSV para comenzar tu análisis de datos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-6">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={triggerFileInput}
            >
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              
              <div className="flex flex-col items-center justify-center space-y-3">
                <FileUp className="h-12 w-12 text-gray-400" />
                <div className="flex flex-col items-center">
                  <span className="font-medium text-gray-700">
                    {fileName ? fileName : "Arrastra tu archivo CSV aquí o haz clic para seleccionar"}
                  </span>
                  {!fileName && (
                    <span className="text-sm text-gray-500 mt-1">
                      Soporta archivos CSV hasta 10MB
                    </span>
                  )}
                </div>
                {fileName && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerFileInput();
                    }}
                  >
                    Cambiar archivo
                  </Button>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            )}

            {headers.length > 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="column-select">Selecciona la columna a analizar (variable objetivo)</Label>
                  <Select value={selectedColumn} onValueChange={handleColumnSelect}>
                    <SelectTrigger id="column-select" className="w-full">
                      <SelectValue placeholder="Selecciona una columna" />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map((header, index) => (
                        <SelectItem key={index} value={header}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsListWrapper>
                    <TabsTrigger value="preview">
                      Vista previa
                    </TabsTrigger>
                    {analysisResult && (
                      <TabsTrigger value="results">
                        Resultados
                      </TabsTrigger>
                    )}
                    {aiResult && (
                      <TabsTrigger value="ai-insights">
                        Insights y Recomendaciones
                      </TabsTrigger>
                    )}
                  </TabsListWrapper>
                  
                  <TabsContent value="preview" className="pt-4">
                    <h3 className="font-medium mb-2">Vista previa de datos:</h3>
                    <div className="border rounded-md max-h-80 overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {headers.map((header, index) => (
                              <TableHead 
                                key={index}
                                className={header === selectedColumn ? "bg-blue-50 text-blue-800" : ""}
                              >
                                {header}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {csvData.slice(0, previewRows).map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                              {row.map((cell, cellIndex) => (
                                <TableCell
                                  key={cellIndex}
                                  className={headers[cellIndex] === selectedColumn ? "bg-blue-50" : ""}
                                >
                                  {cell}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {csvData.length > previewRows && (
                      <p className="text-sm text-gray-500 text-right mt-2">
                        Mostrando {previewRows} de {csvData.length} filas
                      </p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="results" className="pt-4">
                    {analysisResult && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Resumen de Datos</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>Filas:</div>
                                <div className="font-medium">{analysisResult.resumen_datos?.filas || 'N/A'}</div>
                                <div>Columnas:</div>
                                <div className="font-medium">{analysisResult.resumen_datos?.columnas || 'N/A'}</div>
                                <div>Memoria:</div>
                                <div className="font-medium">{analysisResult.resumen_datos?.memoria_usada || 'N/A'}</div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Métricas del Modelo</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>Accuracy:</div>
                                <div className="font-medium">{analysisResult.modelo?.accuracy?.toFixed(4) || 'N/A'}</div>
                                <div>Precision:</div>
                                <div className="font-medium">{analysisResult.modelo?.precision?.toFixed(4) || 'N/A'}</div>
                                <div>Recall:</div>
                                <div className="font-medium">{analysisResult.modelo?.recall?.toFixed(4) || 'N/A'}</div>
                                <div>F1 Score:</div>
                                <div className="font-medium">{analysisResult.modelo?.f1?.toFixed(4) || 'N/A'}</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setActiveTab("ai-insights");
                            }}
                            disabled={!aiResult}
                          >
                            Ver insights y recomendaciones <FileJson className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="ai-insights" className="pt-4">
                    {aiResult ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center">
                                <BarChart2 className="h-4 w-4 mr-2 text-amber-500" />
                                Importancia de Variables
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {renderFeatureImportanceChart()}
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center">
                                <PieChart className="h-4 w-4 mr-2 text-green-500" />
                                Distribución de Variable Objetivo
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {renderTargetDistributionChart()}
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center">
                                <BarChart className="h-4 w-4 mr-2 text-red-500" />
                                Valores Faltantes
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {renderMissingValuesChart()}
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center">
                                <Info className="h-4 w-4 mr-2 text-blue-500" />
                                Recomendaciones para tu Negocio
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {renderRecommendations()}
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-gray-500">No hay datos de IA disponibles</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </CardContent>
        {csvData.length > 0 && (
          <CardFooter className="flex justify-end">
            <Button 
              onClick={handleAnalyze}
              disabled={!selectedColumn || isLoading}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analizando...
                </>
              ) : (
                <>
                  <FilePlus2 className="mr-2 h-5 w-5" />
                  Analizar datos
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

// Custom component for better styled tabs
const TabsListWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="border-b mb-4">
    <TabsList className="w-full justify-start">
      {children}
    </TabsList>
  </div>
);

export default DataAnalysis;
