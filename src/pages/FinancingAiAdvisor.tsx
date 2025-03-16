
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
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
            
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                    <p className="text-sm font-medium text-amber-800 mb-2">Ejemplo de consultas:</p>
                    <ul className="text-xs text-amber-700 space-y-2">
                      <li>• "¿Qué opciones de financiamiento son adecuadas para una empresa como la mía?"</li>
                      <li>• "Necesito un préstamo de $50,000 para expandir mi negocio, ¿cuáles son mis opciones?"</li>
                      <li>• "¿Cómo puedo mejorar mi perfil crediticio para obtener mejores tasas?"</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FinancingAiAdvisor;
