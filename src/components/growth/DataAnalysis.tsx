
import { useState, useRef } from "react";
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
import { Upload, FileUp, FilePlus2, AlertCircle, BarChart3, PieChart, LineChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";

const DataAnalysis = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [analysisType, setAnalysisType] = useState<"clasificacion" | "regresion">("clasificacion");
  const [previewRows, setPreviewRows] = useState<number>(5);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [enhancedAnalysis, setEnhancedAnalysis] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAnalysisTypeSelect = (value: "clasificacion" | "regresion") => {
    setAnalysisType(value);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!file || !selectedColumn) {
      toast.error("Por favor, selecciona un archivo y una columna para analizar");
      return;
    }

    setLoading(true);
    setAnalysisResult(null);
    setEnhancedAnalysis(null);

    try {
      // Create FormData for sending the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('target_variable', selectedColumn);
      formData.append('tipo_problema', analysisType);

      // Send the data to the backend API
      const response = await fetch('/api/analyze-data', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error en el análisis: ${response.statusText}`);
      }

      // Get the analysis results
      const data = await response.json();
      setAnalysisResult(data);

      // Get the enhanced analysis from the AI agent
      const enhancedResponse = await fetch('/api/enhanced-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ analysis_data: data }),
      });

      if (!enhancedResponse.ok) {
        throw new Error(`Error en el análisis avanzado: ${enhancedResponse.statusText}`);
      }

      const enhancedData = await enhancedResponse.json();
      setEnhancedAnalysis(enhancedData);
      
      toast.success("Análisis completado con éxito");
    } catch (error) {
      console.error("Error analyzing data:", error);
      setError(error instanceof Error ? error.message : "Error desconocido al analizar los datos");
      toast.error("Error al analizar los datos");
    } finally {
      setLoading(false);
    }
  };

  const renderCharts = () => {
    if (!enhancedAnalysis) return null;

    return (
      <div className="space-y-6">
        <Tabs defaultValue="importancia" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="importancia">
              <BarChart3 className="h-4 w-4 mr-2" />
              Importancia
            </TabsTrigger>
            <TabsTrigger value="distribucion">
              <PieChart className="h-4 w-4 mr-2" />
              Distribución
            </TabsTrigger>
            <TabsTrigger value="faltantes">
              <LineChart className="h-4 w-4 mr-2" />
              Datos Faltantes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="importancia" className="border rounded-lg p-4">
            {enhancedAnalysis.importancia_features ? (
              <div>
                <h3 className="text-lg font-medium mb-2">Importancia de Características</h3>
                <div className="h-96 w-full">
                  {/* Chart placeholder - will be rendered with the actual chart library */}
                  <div className="bg-gray-100 h-full w-full flex items-center justify-center rounded-md">
                    <pre className="text-xs overflow-auto p-4 h-full w-full">
                      {JSON.stringify(enhancedAnalysis.importancia_features, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No hay datos de importancia disponibles</div>
            )}
          </TabsContent>
          
          <TabsContent value="distribucion" className="border rounded-lg p-4">
            {enhancedAnalysis.distribucion_target ? (
              <div>
                <h3 className="text-lg font-medium mb-2">Distribución de la Variable Objetivo</h3>
                <div className="h-96 w-full">
                  <div className="bg-gray-100 h-full w-full flex items-center justify-center rounded-md">
                    <pre className="text-xs overflow-auto p-4 h-full w-full">
                      {JSON.stringify(enhancedAnalysis.distribucion_target, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No hay datos de distribución disponibles</div>
            )}
          </TabsContent>
          
          <TabsContent value="faltantes" className="border rounded-lg p-4">
            {enhancedAnalysis.valores_faltantes ? (
              <div>
                <h3 className="text-lg font-medium mb-2">Valores Faltantes</h3>
                <div className="h-96 w-full">
                  <div className="bg-gray-100 h-full w-full flex items-center justify-center rounded-md">
                    <pre className="text-xs overflow-auto p-4 h-full w-full">
                      {JSON.stringify(enhancedAnalysis.valores_faltantes, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No hay datos de valores faltantes disponibles</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  const renderRecommendations = () => {
    if (!enhancedAnalysis || !enhancedAnalysis.recomendaciones) return null;

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recomendaciones para tu PyME</CardTitle>
          <CardDescription>Basadas en el análisis de tus datos</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {enhancedAnalysis.recomendaciones.map((recomendacion: string, index: number) => (
              <li key={index} className="bg-amber-50 p-3 rounded-md border border-amber-100">
                {recomendacion}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };

  const renderInsights = () => {
    if (!analysisResult || !analysisResult.insights) return null;

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Insights del Análisis</CardTitle>
          <CardDescription>Descubrimientos clave de tus datos</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysisResult.insights.map((insight: string, index: number) => (
              <li key={index} className="bg-blue-50 p-3 rounded-md border border-blue-100">
                {insight}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="column-select">Selecciona la columna a analizar</Label>
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="analysis-type">Tipo de análisis</Label>
                    <Select value={analysisType} onValueChange={handleAnalysisTypeSelect}>
                      <SelectTrigger id="analysis-type" className="w-full">
                        <SelectValue placeholder="Selecciona tipo de análisis" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clasificacion">Clasificación</SelectItem>
                        <SelectItem value="regresion">Regresión</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Vista previa de datos:</h3>
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
                    <p className="text-sm text-gray-500 text-right">
                      Mostrando {previewRows} de {csvData.length} filas
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        {csvData.length > 0 && (
          <CardFooter className="flex justify-end">
            <Button 
              onClick={handleAnalyze}
              disabled={!selectedColumn || loading}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {loading ? (
                <>
                  <Skeleton className="h-5 w-5 rounded-full mr-2 animate-spin" />
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

      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
              <Skeleton className="h-[300px] w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Display analysis results */}
      {enhancedAnalysis && !loading && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados del Análisis</CardTitle>
            <CardDescription>
              Aquí se muestran los resultados del análisis de tus datos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {renderCharts()}
              {renderRecommendations()}
              {renderInsights()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Display raw JSON for debugging/transparency */}
      {(analysisResult || enhancedAnalysis) && !loading && (
        <Card>
          <CardHeader>
            <CardTitle>Datos JSON Completos</CardTitle>
            <CardDescription>
              Visualización técnica de los resultados del análisis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="primary" className="w-full">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="primary">Análisis Primario</TabsTrigger>
                <TabsTrigger value="enhanced">Análisis Mejorado (IA)</TabsTrigger>
              </TabsList>
              <TabsContent value="primary" className="border rounded-md p-4 mt-4">
                <div className="max-h-96 overflow-y-auto">
                  <pre className="text-xs whitespace-pre-wrap">
                    {analysisResult ? JSON.stringify(analysisResult, null, 2) : "No hay datos disponibles"}
                  </pre>
                </div>
              </TabsContent>
              <TabsContent value="enhanced" className="border rounded-md p-4 mt-4">
                <div className="max-h-96 overflow-y-auto">
                  <pre className="text-xs whitespace-pre-wrap">
                    {enhancedAnalysis ? JSON.stringify(enhancedAnalysis, null, 2) : "No hay datos disponibles"}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataAnalysis;
