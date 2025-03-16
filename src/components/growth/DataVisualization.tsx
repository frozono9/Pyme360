
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface DataVisualizationProps {
  data: any;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ data }) => {
  // Extract feature importance data if available
  const featureImportanceData = React.useMemo(() => {
    if (data?.importancia_features?.labels && data?.importancia_features?.values) {
      return data.importancia_features.labels.map((label: string, index: number) => ({
        name: label,
        value: data.importancia_features.values[index]
      })).sort((a: any, b: any) => b.value - a.value).slice(0, 5); // Top 5 features
    }
    return [];
  }, [data]);

  // Extract target distribution data if available
  const targetDistributionData = React.useMemo(() => {
    if (data?.distribucion_target?.labels && data?.distribucion_target?.values) {
      return data.distribucion_target.labels.map((label: string | number, index: number) => ({
        name: typeof label === 'number' ? (label === 1 ? 'Positivo' : 'Negativo') : label,
        value: data.distribucion_target.values[index]
      }));
    }
    return [];
  }, [data]);

  // Extract missing values data if available
  const missingValuesData = React.useMemo(() => {
    if (data?.valores_faltantes?.labels && data?.valores_faltantes?.values) {
      return data.valores_faltantes.labels.map((label: string, index: number) => ({
        name: label,
        value: data.valores_faltantes.values[index]
      })).sort((a: any, b: any) => b.value - a.value).slice(0, 10); // Top 10 missing values
    }
    return [];
  }, [data]);

  if (!data) {
    return <div className="p-4 text-center">No hay datos disponibles para visualizar</div>;
  }

  // Log the data to see what's available
  console.log("Visualization data:", { 
    featureImportance: featureImportanceData, 
    targetDistribution: targetDistributionData, 
    missingValues: missingValuesData 
  });

  return (
    <div className="space-y-8">
      {/* Feature Importance Chart */}
      {featureImportanceData.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Importancia de Variables</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={featureImportanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={70} 
                  interval={0}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => {
                    // Safely handle different value types
                    return typeof value === 'number' 
                      ? [value.toFixed(3), 'Importancia'] 
                      : [value, 'Importancia'];
                  }} 
                />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Importancia" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Target Distribution Pie Chart */}
      {targetDistributionData.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Distribución de la Variable Objetivo</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={targetDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {targetDistributionData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [typeof value === 'number' ? `${value}` : value, 'Cantidad']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Missing Values Chart */}
      {missingValuesData.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Valores Faltantes</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={missingValuesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={70} 
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#FF8042" name="Cantidad" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* If no charts are displayed, show a message */}
      {featureImportanceData.length === 0 && 
       targetDistributionData.length === 0 && 
       missingValuesData.length === 0 && (
        <div className="text-center p-8 border rounded-lg bg-gray-50">
          <p className="text-gray-500">
            No hay datos suficientes para mostrar visualizaciones. Por favor, asegúrate de que el análisis ha generado datos de visualización.
          </p>
        </div>
      )}
    </div>
  );
};

export default DataVisualization;
