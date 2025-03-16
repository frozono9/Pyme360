
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Textarea } from "@/components/ui/textarea";
import api from "@/api";

const FinancingAiAdvisor = () => {
  const [userInput, setUserInput] = useState("");
  const [agentResponse, setAgentResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      // Llamada real a la API del asistente IA
      const response = await api.queryFinancingAssistant(userInput);
      
      let formattedResponse;
      
      // Procesar la respuesta según su estructura
      if (typeof response.response === 'string') {
        formattedResponse = response.response;
      } else if (typeof response.response === 'object') {
        formattedResponse = JSON.stringify(response.response, null, 2);
      } else {
        formattedResponse = "No se pudo obtener una respuesta clara del asistente.";
      }
      
      setAgentResponse(formattedResponse);
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
            <h1 className="text-4xl font-bold mb-4">Asesor IA Personalizado</h1>
            <p className="text-lg text-pyme-gray-dark max-w-3xl">
              Nuestro asistente virtual analiza tu perfil empresarial y responde a tus consultas
              sobre financiamiento con recomendaciones personalizadas.
            </p>
          </div>
          
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
              
              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-sm font-medium text-amber-800 mb-2">Ejemplo de consultas:</p>
                <ul className="text-xs text-amber-700 space-y-2">
                  <li>• "¿Qué opciones de financiamiento son adecuadas para una empresa como la mía?"</li>
                  <li>• "Necesito un préstamo de $50,000 para expandir mi negocio, ¿cuáles son mis opciones?"</li>
                  <li>• "¿Cómo puedo mejorar mi perfil crediticio para obtener mejores tasas?"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FinancingAiAdvisor;
