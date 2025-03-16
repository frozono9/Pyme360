
import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, FileText, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ButtonCustom } from "@/components/ui/button-custom";
import api from "@/api";

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  isDocument?: boolean;
  documentName?: string;
}

const ChatDocumentoAssistant = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hola, soy tu asistente de documentación para financiamiento. Puedo ayudarte a generar documentos como planes de negocio, proyecciones financieras y más. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Añadir mensaje del usuario al historial
    const userMessage = {
      sender: "user" as const,
      text: message,
      timestamp: new Date(),
    };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      // Llamar a la API
      const data = await api.queryDocumentationAssistant(message);
      
      // Determinar si la respuesta contiene un documento generado
      const includesDocument = data.response.toLowerCase().includes("documento generado") || 
                              data.response.toLowerCase().includes("he preparado") ||
                              data.response.toLowerCase().includes("aquí está el");
      
      // Añadir respuesta del bot al historial
      const botMessage = {
        sender: "bot" as const,
        text: data.response,
        timestamp: new Date(),
        isDocument: includesDocument,
        documentName: includesDocument ? determineDocumentName(message) : undefined,
      };
      
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      toast({
        title: "Error",
        description: "No se pudo conectar con el asistente. Intenta de nuevo más tarde.",
        variant: "destructive",
      });
      
      // Añadir mensaje de error al chat
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor intenta nuevamente.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para determinar el nombre del documento basado en el mensaje
  const determineDocumentName = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    if (message.includes("plan") && message.includes("negocio")) {
      return "Plan de Negocio.pdf";
    } else if (message.includes("proyecc") && message.includes("financier")) {
      return "Proyecciones Financieras.xlsx";
    } else if (message.includes("análisis") && message.includes("mercado")) {
      return "Análisis de Mercado.pdf";
    } else {
      // Extraer el tipo de documento del mensaje
      const docTypes = ["préstamo", "crédito", "financiamiento", "inversión", "proyecto"];
      let docName = "Documento";
      
      for (const type of docTypes) {
        if (message.includes(type)) {
          docName = `Solicitud de ${type.charAt(0).toUpperCase() + type.slice(1)}`;
          break;
        }
      }
      
      return `${docName}.pdf`;
    }
  };

  // Simular descarga de documento
  const handleDownloadDocument = (documentName: string) => {
    toast({
      title: "Descarga iniciada",
      description: `Descargando ${documentName}`,
    });
    
    // Aquí se podría implementar la descarga real del documento
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow pr-4">
        <div className="space-y-4 pb-4">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[80%] ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex items-center justify-center rounded-full w-8 h-8 flex-shrink-0 ${
                    msg.sender === "user"
                      ? "bg-pyme-blue text-white ml-2"
                      : "bg-gray-100 text-pyme-blue mr-2"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <Bot className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <Card>
                    <CardContent className="p-3">
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      {msg.isDocument && msg.documentName && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-pyme-blue">
                              <FileText className="h-4 w-4 mr-2" />
                              <span className="text-sm font-medium">
                                {msg.documentName}
                              </span>
                            </div>
                            <ButtonCustom
                              size="sm"
                              variant="outline"
                              className="h-8"
                              leftIcon={<Download className="h-3.5 w-3.5" />}
                              onClick={() => handleDownloadDocument(msg.documentName!)}
                            >
                              Descargar
                            </ButtonCustom>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  <p className="text-xs text-gray-500 mt-1">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !message.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Enviar</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatDocumentoAssistant;
