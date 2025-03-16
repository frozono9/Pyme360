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
import { Upload, FileUp, FilePlus2, AlertCircle, BarChart, PieChart, FileBarChart, Info, MessageSquare } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RechartsPieChart, Pie, Cell } from "recharts";

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

    if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
      setError("Por favor, sube un archivo CSV válido");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = text.split('\n').map(row => 
          row.split(',').map(cell => cell.trim())
        );

        const nonEmptyRows = rows.filter(row => row.some(cell => cell !== ''));
        
        if (nonEmptyRows.length > 0) {
          const csvHeaders = nonEmptyRows[0];
          setCsvData(nonEmptyRows.slice(1));
          setHeaders(csvHeaders);
          setSelectedColumn(csvHeaders[0] || "");
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
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 500);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('target_column', selectedColumn);
      
      const baseUrl = window.location.origin.includes('localhost') ? 'http://localhost:8000' : '';
      
      const response = await fetch(`${baseUrl}/api/analyze`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }
      
      const data = await response.json();
      setAnalyzedData(data);
      setLoadingProgress(98);
      
      const importanciasResponse = await fetch(`${baseUrl}/api/importancias`, {
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const renderBarChart = (data: any, title: string) => {
    if (!data || !data.labels || !data.values) return null;
    
    const chartData = data.labels.map((label: string, index: number) => ({
      name: label,
      value: data.values[index]
    }));
    
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-base">{title}</h3>
        <div className="h-64 w-full">
          <ChartContainer
            config={{
              item1: { theme: { light: "#0088FE", dark: "#0088FE" }, label: "Valor" },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#0088FE" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">{`Valor: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const renderPieChart = (data: any, title: string) => {
    if (!data || !data.labels || !data.values) return null;
    
    const chartData = data.labels.map((label: string, index: number) => ({
      name: label,
      value: data.values[index]
    }));
    
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-base">{title}</h3>
        <div className="h-64 w-full">
          <ChartContainer
            config={{
              item1: { theme: { light: "#0088FE", dark: "#0088FE" }, label: "Valor" },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    );
  };

  const renderDistribution = (data: any) => {
    if (!data || !data.labels || !data.values) return null;
    
    const total = data.values.reduce((acc: number, val: number) => acc + val, 0);
    const chartData = data.labels.map((label: string, index: number) => ({
      name: label,
      value: data.values[index],
      percentage: ((data.values[index] / total) * 100).toFixed(1)
    }));
    
    return (
      <div className="space-y-3">
        <h3 className="font-semibold text-base">Distribución de la Variable Objetivo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Distribución de Valores</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {chartData.map((item: any, idx: number) => (
                <div key={idx} className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold">{item.value}</div>
                  <div className="text-xs text-gray-600">{item.name}</div>
                  <div className="text-sm text-blue-600">{item.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Gráfico de Distribución</h4>
            <div className="h-full">
              <ChartContainer
                config={{
                  item1: { theme: { light: "#0088FE", dark: "#0088FE" }, label: "Valor" },
                }}
              >
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsPieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                    >
                      {chartData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRecommendations = (recommendations: string[]) => {
    if (!recommendations || !recommendations.length) return null;
    
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="h-5 w-5 text-amber-500" />
          <h3 className="font-semibold text-base">Recomendaciones para tu Negocio</h3>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
          <ul className="space-y-3">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex gap-2">
                <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderAnalysisSummary = (text: string | undefined) => {
    if (!text) return null;
    
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <FileBarChart className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold text-base">Resumen del Análisis</h3>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <p className="text-sm whitespace-pre-line">{text}</p>
        </div>
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
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Recomendaciones
                </TabsTrigger>
                <TabsTrigger value="datos">
                  <PieChart className="h-4 w-4 mr-2" />
                  Datos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="visualizaciones" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {importanciaData.importancia_features && 
                    renderBarChart(importanciaData.importancia_features, "Importancia de las Características")}
                  
                  {importanciaData.distribucion_target && 
                    renderDistribution(importanciaData.distribucion_target)}
                  
                  {importanciaData.valores_faltantes && 
                    renderBarChart(importanciaData.valores_faltantes, "Valores Faltantes")}
                </div>
              </TabsContent>

              <TabsContent value="recomendaciones" className="space-y-6">
                {importanciaData.response_text && 
                  renderAnalysisSummary(importanciaData.response_text)}
                
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
