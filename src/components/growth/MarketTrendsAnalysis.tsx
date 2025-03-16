
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
import api from "@/api";

const mockTrendsData = {
  sector: "Tecnología",
  text: "El sector de tecnología muestra un crecimiento sostenido con oportunidades en innovación digital y servicios cloud.",
  trends_data: {
    sector: "Tecnología",
    pais: "México",
    historic: {
      dates: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      sector_trend: [65, 67, 70, 73, 72, 74, 78, 82, 85, 87, 90, 93],
      subsectors: [
        {
          name: "Software",
          data: [68, 70, 72, 75, 74, 76, 80, 85, 87, 90, 92, 95]
        },
        {
          name: "Hardware",
          data: [62, 63, 65, 66, 67, 69, 71, 74, 76, 78, 80, 82]
        }
      ]
    },
    impact_factors: [
      { factor: "Transformación Digital", impact: 9.2 },
      { factor: "Automatización", impact: 8.7 },
      { factor: "Seguridad Informática", impact: 8.5 },
      { factor: "Cloud Computing", impact: 8.3 },
      { factor: "Competencia Global", impact: 7.8 }
    ],
    opportunity_areas: [
      { area: "Inteligencia Artificial", value: 95 },
      { area: "Análisis de Datos", value: 88 },
      { area: "SaaS", value: 85 },
      { area: "Ciberseguridad", value: 82 },
      { area: "IoT", value: 78 }
    ],
    projection: {
      dates: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
      baseline: [93, 95, 97, 99, 101, 103],
      optimistic: [93, 96, 99, 103, 107, 112],
      pessimistic: [93, 92, 91, 92, 93, 94]
    }
  }
};

const MarketTrendsAnalysis = () => {
  const [question, setQuestion] = useState("");
  const [activeTab, setActiveTab] = useState("historic");
  const { toast } = useToast();
  
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["marketTrends"],
    queryFn: () => api.queryMarketTrends(""),
    staleTime: 1000 * 60 * 5,
    meta: {
      onError: () => {
        toast({
          title: "Error al cargar tendencias",
          description: "No se pudieron obtener los datos de tendencias de mercado",
          variant: "destructive",
        });
      }
    },
    retry: 1
  });

  const trendsData = data || mockTrendsData;

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

  if (isError && !trendsData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Error al cargar tendencias</h3>
        <p className="text-gray-600 mb-4">No se pudieron obtener los datos de tendencias de mercado.</p>
        <Button onClick={() => refetch()}>Intentar nuevamente</Button>
      </div>
    );
  }

  const { trends_data } = trendsData || {};
  const { sector, pais, historic, impact_factors, opportunity_areas, projection } = trends_data || {};

  const historicDates = historic?.dates || [];
  const historicData = historicDates.map((date, index) => ({
    date,
    sector: historic?.sector_trend?.[index] || 0,
    ...(historic?.subsectors?.[0] ? { [historic.subsectors[0].name]: historic.subsectors[0].data[index] } : {}),
    ...(historic?.subsectors?.[1] ? { [historic.subsectors[1].name]: historic.subsectors[1].data[index] } : {}),
    ...(historic?.subsectors?.[2] ? { [historic.subsectors[2].name]: historic.subsectors[2].data[index] } : {})
  }));

  const projectionDates = projection?.dates || [];
  const projectionData = projectionDates.map((date, index) => ({
    date,
    baseline: projection?.baseline?.[index] || 0,
    optimistic: projection?.optimistic?.[index] || 0,
    pessimistic: projection?.pessimistic?.[index] || 0
  }));

  return (
    <div className="space-y-6 mb-24">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <TrendingUp className="mr-2 text-pyme-blue" />
          Análisis de Tendencias: {sector || "Tu Sector"}{pais ? ` - ${pais}` : ''}
        </h2>
        
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="mb-6 w-full justify-start">
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TabsContent value="historic" className="col-span-full m-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Evolución del Sector</CardTitle>
                  <CardDescription>Tendencias de los últimos 12 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ChartContainer
                      config={{
                        sector: { color: "#2563eb" },
                        subsector1: { color: "#059669" },
                        subsector2: { color: "#d97706" },
                        subsector3: { color: "#7c3aed" }
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historicData}>
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
                          {historic?.subsectors?.map((subsector, idx) => (
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
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="impact" className="m-0">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle>Factores de Impacto</CardTitle>
                  <CardDescription>Nivel de influencia en el mercado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ChartContainer
                      config={{
                        impact: { color: "#2563eb" }
                      }}
                    >
                      {impact_factors && impact_factors.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            data={impact_factors}
                            layout="vertical"
                            margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" domain={[0, 10]} />
                            <YAxis type="category" dataKey="factor" width={100} />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="impact" fill="#2563eb" name="Nivel de Impacto" />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-500">
                          No hay datos disponibles
                        </div>
                      )}
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="opportunity" className="m-0">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle>Áreas de Oportunidad</CardTitle>
                  <CardDescription>Potencial por área estratégica</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ChartContainer
                      config={{
                        value: { color: "#2563eb" }
                      }}
                    >
                      {opportunity_areas && opportunity_areas.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart outerRadius={130} data={opportunity_areas}>
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
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-500">
                          No hay datos disponibles
                        </div>
                      )}
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="projection" className="m-0">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle>Proyección a 6 Meses</CardTitle>
                  <CardDescription>Escenarios de evolución del mercado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ChartContainer
                      config={{
                        baseline: { color: "#2563eb" },
                        optimistic: { color: "#059669" },
                        pessimistic: { color: "#dc2626" }
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={projectionData}>
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
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketTrendsAnalysis;
