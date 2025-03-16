
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
import { Upload, FileUp, FilePlus2, AlertCircle } from "lucide-react";

const DataAnalysis = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [previewRows, setPreviewRows] = useState<number>(5);
  const [error, setError] = useState<string>("");
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

  const handleAnalyze = () => {
    // This will be implemented in the next step
    console.log("Analyzing column:", selectedColumn);
    // We'll add the analysis functionality later
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
          </div>
        </CardContent>
        {csvData.length > 0 && (
          <CardFooter className="flex justify-end">
            <Button 
              onClick={handleAnalyze}
              disabled={!selectedColumn}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <FilePlus2 className="mr-2 h-5 w-5" />
              Analizar datos
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default DataAnalysis;
