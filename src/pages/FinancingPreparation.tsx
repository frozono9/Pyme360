
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import ChatDocumentoAssistant from "@/components/ChatDocumentoAssistant";

const FinancingPreparation = () => {
  const { toast } = useToast();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Preparación para Financiamiento</h1>
            <p className="text-lg text-pyme-gray-dark max-w-3xl">
              Asistencia inteligente para preparar toda la documentación necesaria para tu solicitud de financiamiento, 
              aumentando significativamente tus probabilidades de aprobación.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <Card className="h-[700px]">
                <CardHeader>
                  <CardTitle>Asistente de Documentación</CardTitle>
                  <CardDescription>
                    Nuestro experto virtual te ayuda a preparar documentos específicos para tu financiamiento
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[620px]">
                  <ChatDocumentoAssistant />
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>¿Cómo puedo ayudarte?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Puedo generar todo tipo de documentos basados en tus necesidades de financiamiento, como:
                  </p>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Plan de negocio completo</p>
                        <p className="text-xs text-gray-500">Documentos estratégicos con todos los elementos necesarios</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Proyecciones financieras</p>
                        <p className="text-xs text-gray-500">A 3 y 5 años con diferentes escenarios</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Análisis de viabilidad</p>
                        <p className="text-xs text-gray-500">Para nuevos proyectos o expansiones</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Cartas de presentación</p>
                        <p className="text-xs text-gray-500">Personalizadas para diferentes entidades financieras</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
                    <p className="text-sm font-medium text-amber-800 mb-2">Ejemplo de solicitudes:</p>
                    <ul className="text-xs text-amber-700 space-y-2">
                      <li>• "Necesito un plan de negocio para solicitar un préstamo de $50,000 para expandir mi tienda"</li>
                      <li>• "Genera proyecciones financieras a 3 años para mi restaurante"</li>
                      <li>• "Prepara un análisis de mercado para mi negocio de comercio electrónico"</li>
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

export default FinancingPreparation;
