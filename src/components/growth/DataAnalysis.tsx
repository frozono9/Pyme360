
import { useState, useRef } from "react";
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
import { Upload, FileUp, FilePlus2, AlertCircle, BarChart, PieChart, FileBarChart } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DataAnalysis = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [previewRows, setPreviewRows] = useState<number>(5);
  const [error, setError] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [analyzedData, setAnalyzedData] = useState<any>(null);
  const [importanciaData, setImportanciaData] = useState<any>(null);
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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!file || !selectedColumn) {
      setError("Debes seleccionar un archivo y una columna para analizar");
      return;
    }

    setIsAnalyzing(true);
    setLoadingProgress(10);
    
    try {
      // Simular progreso mientras se procesa
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 500);
      
      // Crear un FormData para enviar el archivo
      const formData = new FormData();
      formData.append('file', file);
      formData.append('target_column', selectedColumn);
      
      // Llamar a la API del backend para analizar_importancias.py
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }
      
      const data = await response.json();
      setAnalyzedData(data);
      setLoadingProgress(98);
      
      // Llamar al segundo endpoint que utiliza importancias.py
      const importanciasResponse = await fetch('/api/importancias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analyzed_data: data,
          target_column: selectedColumn
        }),
      });
      
      if (!importanciasResponse.ok) {
        throw new Error(`Error en la petición de importancias: ${importanciasResponse.status}`);
      }
      
      const importanciaResult = await importanciasResponse.json();
      setImportanciaData(importanciaResult);
      
      // Completar la barra de progreso
      clearInterval(progressInterval);
      setLoadingProgress(100);
      
      toast({
        title: "Análisis completado",
        description: "El análisis de datos ha sido completado exitosamente",
      });
    } catch (error) {
      console.error("Error al analizar datos:", error);
      setError(`Error al analizar datos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      toast({
        variant: "destructive",
        title: "Error de análisis",
        description: "No se pudo completar el análisis de datos",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderBarChart = (data: any, title: string) => {
    if (!data || !data.labels || !data.values) return null;
    
    const maxValue = Math.max(...data.values);
    
    return (
      <div className="space-y-2">
        <h3 className="font-semibold text-base">{title}</h3>
        <div className="space-y-2">
          {data.labels.map((label: string, idx: number) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{label}</span>
                <span>{data.values[idx]}</span>
              </div>
              <Progress value={(data.values[idx] / maxValue) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDistribution = (data: any) => {
    if (!data || !data.labels || !data.values) return null;
    
    return (
      <div className="space-y-3">
        <h3 className="font-semibold text-base">Distribución de la Variable Objetivo</h3>
        <div className="grid grid-cols-2 gap-2">
          {data.labels.map((label: string, idx: number) => (
            <div key={idx} className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold">{data.values[idx]}</div>
              <div className="text-sm text-gray-600">{label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRecommendations = (recommendations: string[]) => {
    if (!recommendations || !recommendations.length) return null;
    
    return (
      <div className="space-y-3">
        <h3 className="font-semibold text-base">Recomendaciones para Mejorar tu PyME</h3>
        <ul className="space-y-2 list-disc pl-5">
          {recommendations.map((rec, idx) => (
            <li key={idx} className="text-sm">{rec}</li>
          ))}
        </ul>
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

            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Analizando datos...</span>
                  <span>{loadingProgress}%</span>
                </div>
                <Progress value={loadingProgress} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
        {csvData.length > 0 && !isAnalyzing && !importanciaData && (
          <CardFooter className="flex justify-end">
            <Button 
              onClick={handleAnalyze}
              disabled={!selectedColumn || isAnalyzing}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <FilePlus2 className="mr-2 h-5 w-5" />
              Analizar datos
            </Button>
          </CardFooter>
        )}
      </Card>

      {importanciaData && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Resultados del Análisis</CardTitle>
            <CardDescription>
              Análisis detallado basado en tus datos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="visualizaciones" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="visualizaciones">
                  <BarChart className="h-4 w-4 mr-2" />
                  Visualizaciones
                </TabsTrigger>
                <TabsTrigger value="recomendaciones">
                  <FileBarChart className="h-4 w-4 mr-2" />
                  Recomendaciones
                </TabsTrigger>
                <TabsTrigger value="datos">
                  <PieChart className="h-4 w-4 mr-2" />
                  Datos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="visualizaciones" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {importanciaData.importancia_features && 
                    renderBarChart(importanciaData.importancia_features, "Importancia de las Características")}
                  
                  {importanciaData.distribucion_target && 
                    renderDistribution(importanciaData.distribucion_target)}
                  
                  {importanciaData.valores_faltantes && 
                    renderBarChart(importanciaData.valores_faltantes, "Valores Faltantes")}
                </div>
              </TabsContent>

              <TabsContent value="recomendaciones" className="space-y-6">
                {importanciaData.recomendaciones && 
                  renderRecommendations(importanciaData.recomendaciones)}
              </TabsContent>

              <TabsContent value="datos" className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-96">
                    {JSON.stringify(importanciaData, null, 2)}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setImportanciaData(null);
                setAnalyzedData(null);
              }}
            >
              Volver al análisis
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default DataAnalysis;

