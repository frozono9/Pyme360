
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, Clock, FileSpreadsheet, FileBarChart, FileCode, Download, PlusCircle } from "lucide-react";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ChatDocumentoAssistant from "@/components/ChatDocumentoAssistant";

const FinancingPreparation = () => {
  const [activeTab, setActiveTab] = useState<"documents" | "assistant">("documents");
  const { toast } = useToast();

  const documents = [
    {
      title: "Plan de Negocio",
      icon: <FileText className="h-5 w-5" />,
      status: "completed",
      progress: 100,
      description: "Documento estratégico que detalla modelo de negocio, mercado objetivo y proyecciones",
      sections: [
        "Resumen Ejecutivo",
        "Descripción del Negocio",
        "Análisis de Mercado",
        "Estrategia de Marketing",
        "Estructura Organizacional",
        "Plan Financiero"
      ]
    },
    {
      title: "Estados Financieros",
      icon: <FileSpreadsheet className="h-5 w-5" />,
      status: "completed",
      progress: 100,
      description: "Balance general, estado de resultados y flujo de efectivo de los últimos 3 años",
      sections: [
        "Balance General",
        "Estado de Resultados",
        "Flujo de Efectivo",
        "Análisis de Ratios Financieros",
        "Notas a los Estados Financieros"
      ]
    },
    {
      title: "Proyecciones Financieras",
      icon: <FileBarChart className="h-5 w-5" />,
      status: "in_progress",
      progress: 65,
      description: "Pronósticos financieros para los próximos 3-5 años basados en datos históricos",
      sections: [
        "Supuestos de Proyección",
        "Proyección de Ventas",
        "Proyección de Gastos",
        "Proyección de Flujo de Caja",
        "Análisis de Escenarios",
        "Análisis de Sensibilidad"
      ]
    },
    {
      title: "Documentación Legal",
      icon: <FileCode className="h-5 w-5" />,
      status: "pending",
      progress: 30,
      description: "Documentos legales requeridos para solicitar financiamiento",
      sections: [
        "Constitución de la Empresa",
        "Documentos de Identificación",
        "Permisos y Licencias",
        "Contratos Importantes",
        "Historial de Cumplimiento Fiscal"
      ]
    },
  ];

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
          
          <div className="flex mb-8 space-x-2">
            <ButtonCustom
              variant={activeTab === "documents" ? "default" : "outline"}
              onClick={() => setActiveTab("documents")}
            >
              Documentos
            </ButtonCustom>
            <ButtonCustom
              variant={activeTab === "assistant" ? "default" : "outline"}
              onClick={() => setActiveTab("assistant")}
            >
              Asistente IA
            </ButtonCustom>
          </div>
          
          {activeTab === "documents" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Estado de documentación</CardTitle>
                    <CardDescription>
                      Progreso de preparación de documentos para solicitud de financiamiento
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {documents.map((doc, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-lg ${
                              doc.status === 'completed' ? 'bg-green-100 text-green-600' :
                              doc.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                              'bg-amber-100 text-amber-600'
                            }`}>
                              {doc.icon}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-medium">{doc.title}</h3>
                                <div className="flex items-center">
                                  {doc.status === 'completed' ? (
                                    <span className="text-xs font-medium flex items-center text-green-600">
                                      <CheckCircle className="h-3 w-3 mr-1" /> Completado
                                    </span>
                                  ) : doc.status === 'in_progress' ? (
                                    <span className="text-xs font-medium flex items-center text-blue-600">
                                      <Clock className="h-3 w-3 mr-1" /> En progreso
                                    </span>
                                  ) : (
                                    <span className="text-xs font-medium flex items-center text-amber-600">
                                      <Clock className="h-3 w-3 mr-1" /> Pendiente
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                              
                              <div className="mb-3">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>{doc.progress}% completado</span>
                                  {doc.status === 'completed' && (
                                    <ButtonCustom 
                                      variant="link" 
                                      size="sm" 
                                      className="h-auto p-0"
                                      leftIcon={<Download className="h-3 w-3" />}
                                    >
                                      Descargar
                                    </ButtonCustom>
                                  )}
                                </div>
                                <Progress value={doc.progress} className="h-1.5" />
                              </div>
                              
                              <Accordion type="single" collapsible>
                                <AccordionItem value="sections">
                                  <AccordionTrigger className="py-1 text-xs">
                                    <span className="text-pyme-blue font-medium">Ver secciones</span>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <ul className="mt-2 space-y-1 text-xs pl-2">
                                      {doc.sections.map((section, sIndex) => (
                                        <li key={sIndex} className="flex items-center">
                                          {doc.status === 'completed' || (doc.status === 'in_progress' && sIndex < doc.sections.length * (doc.progress/100)) ? (
                                            <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                                          ) : (
                                            <div className="h-3 w-3 mr-2 rounded-full border border-gray-300"></div>
                                          )}
                                          {section}
                                        </li>
                                      ))}
                                    </ul>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <ButtonCustom 
                      leftIcon={<PlusCircle className="h-4 w-4" />}
                      variant="outline"
                      className="w-full"
                    >
                      Agregar documento personalizado
                    </ButtonCustom>
                  </CardFooter>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Consejos para aprobación</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="text-sm py-2">
                          Documentación financiera clave
                        </AccordionTrigger>
                        <AccordionContent className="text-xs">
                          Asegúrate de incluir estados financieros de los últimos 3 años, proyecciones a 5 años y un análisis detallado de flujo de caja.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger className="text-sm py-2">
                          Plan de negocio efectivo
                        </AccordionTrigger>
                        <AccordionContent className="text-xs">
                          Enfócate en la viabilidad financiera, ventaja competitiva y estrategia de crecimiento. Sé realista con las proyecciones.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger className="text-sm py-2">
                          Análisis de mercado convincente
                        </AccordionTrigger>
                        <AccordionContent className="text-xs">
                          Incluye datos estadísticos, tendencias de la industria y un análisis detallado de la competencia con fuentes confiables.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-4">
                        <AccordionTrigger className="text-sm py-2">
                          Gestión de riesgos
                        </AccordionTrigger>
                        <AccordionContent className="text-xs">
                          Identifica posibles riesgos y presenta estrategias de mitigación claras. Los financiadores valoran la previsión de escenarios adversos.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
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
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FinancingPreparation;
