
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, CreditCard, BriefcaseBusiness, HandCoins, LandPlot, BuildingIcon } from "lucide-react";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FinancingMarketplace = () => {
  const [userInput, setUserInput] = useState("");
  const [agentResponse, setAgentResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const mockFinancingOptions = [
    {
      type: "Bancos Tradicionales",
      icon: <BuildingIcon className="h-10 w-10 text-blue-600" />,
      color: "blue",
      entities: [
        { name: "Banco Nacional", rate: "12-15%", amount: "Hasta $2,000,000", term: "1-5 años" },
        { name: "Banco Continental", rate: "11-14%", amount: "Hasta $1,500,000", term: "1-7 años" },
        { name: "Banco Empresarial", rate: "13-16%", amount: "Hasta $3,000,000", term: "1-10 años" },
      ]
    },
    {
      type: "Plataformas Fintech",
      icon: <CreditCard className="h-10 w-10 text-purple-600" />,
      color: "purple",
      entities: [
        { name: "FinCapital", rate: "14-17%", amount: "Hasta $800,000", term: "6 meses-3 años" },
        { name: "CreditTech", rate: "15-18%", amount: "Hasta $500,000", term: "3 meses-2 años" },
        { name: "DigiLoan", rate: "13-16%", amount: "Hasta $1,200,000", term: "1-4 años" },
      ]
    },
    {
      type: "Inversionistas Privados",
      icon: <Users className="h-10 w-10 text-green-600" />,
      color: "green",
      entities: [
        { name: "Growth Capital", rate: "Participación", amount: "Hasta $5,000,000", term: "Variable" },
        { name: "Angel Investors", rate: "Participación", amount: "Hasta $1,000,000", term: "Variable" },
        { name: "Business Partners", rate: "Participación", amount: "Hasta $3,000,000", term: "Variable" },
      ]
    },
    {
      type: "Programas Gubernamentales",
      icon: <Building className="h-10 w-10 text-amber-600" />,
      color: "amber",
      entities: [
        { name: "Fondo PyME", rate: "5-8%", amount: "Hasta $1,000,000", term: "1-7 años" },
        { name: "Impulso Económico", rate: "3-6%", amount: "Hasta $800,000", term: "1-5 años" },
        { name: "Crédito Empresarial", rate: "4-7%", amount: "Hasta $1,500,000", term: "1-8 años" },
      ]
    },
  ];

  const handleAskAgent = async () => {
    if (!userInput.trim()) {
      toast({
        title: "Campo vacío",
        description: "Por favor ingresa tu consulta sobre financiamiento",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAgentResponse("");

    try {
      // Simulating API call to OpenAI
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response based on input (in a real scenario, this would be an actual API call)
      const mockResponse = `Basado en tus KPIs actuales y la consulta "${userInput}", te recomendaría:

1. **Prioridad Alta**: Explorar opciones con Banco Nacional en la categoría de Bancos Tradicionales. Tu perfil crediticio califica para tasas preferenciales del 12.5%.

2. **Alternativa**: El programa gubernamental "Fondo PyME" ofrece tasas más bajas (5.5%) aunque con montos menores, sería ideal para necesidades específicas de corto plazo.

3. **Para crecimiento**: Si buscas capital para expansión, considera "Growth Capital" que ofrece financiamiento con participación minoritaria, ideal para tu etapa de crecimiento.

✅ Tu AI Credit Score de 82/100 te posiciona favorablemente para negociar mejores términos.`;

      setAgentResponse(mockResponse);
    } catch (error) {
      console.error("Error al procesar la consulta:", error);
      toast({
        title: "Error",
        description: "No se pudo procesar tu consulta. Intenta de nuevo más tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Marketplace de Financiamiento</h1>
            <p className="text-lg text-pyme-gray-dark max-w-3xl">
              Conectamos tu perfil empresarial con las mejores opciones de financiamiento disponibles en el mercado,
              adaptadas a tus necesidades específicas y métricas financieras reales.
            </p>
          </div>
          
          <Tabs defaultValue="marketplace" className="mb-12">
            <TabsList className="mb-8">
              <TabsTrigger value="marketplace">Opciones de Financiamiento</TabsTrigger>
              <TabsTrigger value="agent">Asesor IA Personalizado</TabsTrigger>
            </TabsList>
            
            <TabsContent value="marketplace">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {mockFinancingOptions.map((option, index) => (
                  <Card key={index} className={`border-l-4 border-l-${option.color}-500`}>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg bg-${option.color}-100`}>
                          {option.icon}
                        </div>
                        <div>
                          <CardTitle>{option.type}</CardTitle>
                          <CardDescription>
                            {option.type === "Bancos Tradicionales" && "Préstamos y líneas de crédito tradicionales"}
                            {option.type === "Plataformas Fintech" && "Soluciones digitales de financiamiento rápido"}
                            {option.type === "Inversionistas Privados" && "Capital a cambio de participación"}
                            {option.type === "Programas Gubernamentales" && "Apoyo estatal con tasas preferenciales"}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {option.entities.map((entity, entityIndex) => (
                          <div key={entityIndex} className="p-4 bg-gray-50 rounded-lg">
                            <div className="font-medium mb-2">{entity.name}</div>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <div>
                                <span className="text-gray-500 block">Tasa</span>
                                <span>{entity.rate}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block">Monto</span>
                                <span>{entity.amount}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block">Plazo</span>
                                <span>{entity.term}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <ButtonCustom 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                      >
                        Explorar opciones
                      </ButtonCustom>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <BriefcaseBusiness className="mr-2 text-pyme-blue" /> Financiamiento Especial
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex bg-blue-50 p-4 rounded-lg">
                    <div className="mr-4">
                      <HandCoins className="h-10 w-10 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Factoraje Financiero</h4>
                      <p className="text-sm text-gray-600 mb-2">Convierte tus facturas por cobrar en efectivo inmediato</p>
                      <div className="text-xs text-blue-800 font-medium">Desde 1.5% mensual</div>
                    </div>
                  </div>
                  
                  <div className="flex bg-green-50 p-4 rounded-lg">
                    <div className="mr-4">
                      <LandPlot className="h-10 w-10 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Leasing de Equipos</h4>
                      <p className="text-sm text-gray-600 mb-2">Adquiere equipamiento sin comprometer capital</p>
                      <div className="text-xs text-green-800 font-medium">Plazos flexibles de 12-60 meses</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="agent">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card-strong p-6">
                  <h3 className="text-xl font-semibold mb-4">Consulta a nuestro agente IA</h3>
                  <p className="text-pyme-gray-dark mb-6">
                    Nuestro asistente de IA analizará tus KPIs y métricas financieras actuales para 
                    recomendarte las mejores opciones de financiamiento personalizadas para tu empresa.
                  </p>
                  
                  <div className="mb-4">
                    <Textarea
                      placeholder="Describe tu situación y necesidades de financiamiento. Ej: Necesito financiar la compra de maquinaria valorada en $250,000 con un plazo de 3 años."
                      className="min-h-[120px]"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex justify-end mb-6">
                    <ButtonCustom
                      onClick={handleAskAgent}
                      isLoading={isLoading}
                    >
                      Consultar al agente
                    </ButtonCustom>
                  </div>
                  
                  {agentResponse && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium mb-4">Recomendación personalizada:</h4>
                      <div className="whitespace-pre-line text-pyme-gray-dark">
                        {agentResponse}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tu perfil financiero</CardTitle>
                      <CardDescription>Métricas clave para financiamiento</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">AI Credit Score</span>
                          <span className="text-sm font-bold text-purple-600">82/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: "82%" }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Capacidad de pago</span>
                          <span className="text-sm font-bold text-green-600">Buena</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Historial crediticio</span>
                          <span className="text-sm font-bold text-blue-600">Excelente</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: "90%" }}></div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h4 className="text-sm font-medium mb-2">KPIs Empresariales</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span className="text-gray-600">Ingresos mensuales:</span>
                            <span className="font-medium">$120,000</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-600">Margen operativo:</span>
                            <span className="font-medium">18%</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-600">Ratio de deuda:</span>
                            <span className="font-medium">0.4</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-600">Antigüedad:</span>
                            <span className="font-medium">3.5 años</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FinancingMarketplace;
