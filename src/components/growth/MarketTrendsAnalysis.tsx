
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Loader2, TrendingUp, BarChart2, PieChart, RadarIcon, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Función para consultar al API de tendencias
const fetchMarketTrends = async (question: string) => {
  const response = await fetch("/api/market-trends", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });
  
  if (!response.ok) {
    throw new Error("Error al obtener tendencias de mercado");
  }
  
  return response.json();
};

const MarketTrendsAnalysis = () => {
  const [question, setQuestion] = useState("");
  const [activeTab, setActiveTab] = useState("historic");
  const { toast } = useToast();
  
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["marketTrends"],
    queryFn: () => fetchMarketTrends(""),
    staleTime: 1000 * 60 * 5, // 5 minutos
    onError: (error) => {
      toast({
        title: "Error al cargar tendencias",
        description: "No se pudieron obtener los datos de tendencias de mercado",
        variant: "destructive",
      });
    }
  });

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await refetch();
      toast({
        title: "Análisis actualizado",
        description: "Se ha actualizado el análisis de tendencias",
      });
    } catch (error) {
      toast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el análisis de tendencias",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-pyme-blue mb-4" />
        <p className="text-gray-600">Cargando análisis de tendencias...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Error al cargar tendencias</h3>
        <p className="text-gray-600 mb-4">No se pudieron obtener los datos de tendencias de mercado.</p>
        <Button onClick={() => refetch()}>Intentar nuevamente</Button>
      </div>
    );
  }

  const { text, trends_data } = data;
  const { sector, historic, impact_factors, opportunity_areas, projection, recommendations } = trends_data || {};

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <TrendingUp className="mr-2 text-pyme-blue" />
          Análisis de Tendencias: {sector}
        </h2>
        <p className="text-gray-700 mb-6">{text}</p>
        
        <form onSubmit={handleQuestionSubmit} className="flex gap-2 mb-6">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Haz una pregunta específica sobre tendencias de tu sector..."
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Consultar
          </Button>
        </form>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="historic" className="flex items-center">
              <TrendingUp className="mr-1 h-4 w-4" />
              Tendencias Históricas
            </TabsTrigger>
            <TabsTrigger value="impact" className="flex items-center">
              <BarChart2 className="mr-1 h-4 w-4" />
              Factores de Impacto
            </TabsTrigger>
            <TabsTrigger value="opportunity" className="flex items-center">
              <RadarIcon className="mr-1 h-4 w-4" />
              Áreas de Oportunidad
            </TabsTrigger>
            <TabsTrigger value="projection" className="flex items-center">
              <PieChart className="mr-1 h-4 w-4" />
              Proyección
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="historic">
            <Card>
              <CardHeader>
                <CardTitle>Evolución del Sector</CardTitle>
                <CardDescription>Tendencias de los últimos 12 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={{
                      sector: { color: "#2563eb" },
                      subsector1: { color: "#059669" },
                      subsector2: { color: "#d97706" },
                      subsector3: { color: "#7c3aed" }
                    }}
                  >
                    <LineChart data={historic?.dates.map((date, index) => ({
                      date,
                      sector: historic.sector_trend[index],
                      ...(historic.subsectors[0] ? { [historic.subsectors[0].name]: historic.subsectors[0].data[index] } : {}),
                      ...(historic.subsectors[1] ? { [historic.subsectors[1].name]: historic.subsectors[1].data[index] } : {}),
                      ...(historic.subsectors[2] ? { [historic.subsectors[2].name]: historic.subsectors[2].data[index] } : {})
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="sector" 
                        name="Sector General" 
                        stroke="#2563eb" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                      />
                      {historic?.subsectors.map((subsector, idx) => (
                        <Line 
                          key={subsector.name}
                          type="monotone" 
                          dataKey={subsector.name} 
                          stroke={idx === 0 ? "#059669" : idx === 1 ? "#d97706" : "#7c3aed"}
                          strokeWidth={1.5}
                          dot={{ r: 3 }}
                        />
                      ))}
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="impact">
            <Card>
              <CardHeader>
                <CardTitle>Factores de Impacto</CardTitle>
                <CardDescription>Nivel de influencia en el mercado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={{
                      impact: { color: "#2563eb" }
                    }}
                  >
                    <BarChart data={impact_factors}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 10]} />
                      <YAxis type="category" dataKey="factor" width={100} />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="impact" fill="#2563eb" name="Nivel de Impacto" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="opportunity">
            <Card>
              <CardHeader>
                <CardTitle>Áreas de Oportunidad</CardTitle>
                <CardDescription>Potencial por área estratégica</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={{
                      value: { color: "#2563eb" }
                    }}
                  >
                    <RadarChart outerRadius={90} data={opportunity_areas}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="area" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar 
                        name="Potencial" 
                        dataKey="value" 
                        stroke="#2563eb" 
                        fill="#2563eb" 
                        fillOpacity={0.6} 
                      />
                      <Tooltip content={<ChartTooltipContent />} />
                    </RadarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="projection">
            <Card>
              <CardHeader>
                <CardTitle>Proyección a 6 Meses</CardTitle>
                <CardDescription>Escenarios de evolución del mercado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={{
                      baseline: { color: "#2563eb" },
                      optimistic: { color: "#059669" },
                      pessimistic: { color: "#dc2626" }
                    }}
                  >
                    <LineChart data={projection?.dates.map((date, index) => ({
                      date,
                      baseline: projection.baseline[index],
                      optimistic: projection.optimistic[index],
                      pessimistic: projection.pessimistic[index]
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="baseline" 
                        name="Escenario Base" 
                        stroke="#2563eb" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="optimistic" 
                        name="Escenario Optimista" 
                        stroke="#059669" 
                        strokeWidth={1.5}
                        strokeDasharray="5 5"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="pessimistic" 
                        name="Escenario Pesimista" 
                        stroke="#dc2626" 
                        strokeWidth={1.5}
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">Recomendaciones Estratégicas</h3>
          <ul className="space-y-2">
            {recommendations?.map((recommendation, index) => (
              <li key={index} className="flex">
                <span className="bg-pyme-blue text-white rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">
                  {index + 1}
                </span>
                <p className="text-gray-700">{recommendation}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MarketTrendsAnalysis;
