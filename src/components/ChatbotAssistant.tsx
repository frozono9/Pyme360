
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, User, Bot, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import api from '@/api';
import { useToast } from '@/hooks/use-toast';

type Message = {
  content: string;
  isUser: boolean;
  timestamp: Date;
};

const ChatbotAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "¡Hola! Soy el asistente virtual de PyME360. ¿En qué puedo ayudarte hoy?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus on textarea when chat is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Handle sending message
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = {
      content: input,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const result = await api.queryGeneralAssistant(input);
      
      if (result && result.response) {
        setMessages((prev) => [
          ...prev,
          {
            content: result.response,
            isUser: false,
            timestamp: new Date(),
          },
        ]);
      } else {
        throw new Error('Respuesta vacía del asistente');
      }
    } catch (error) {
      console.error('Error al consultar al asistente:', error);
      toast({
        title: "Error",
        description: "No pudimos procesar tu consulta. Por favor, intenta de nuevo más tarde.",
        variant: "destructive",
      });
      
      setMessages((prev) => [
        ...prev,
        {
          content: "Lo siento, estoy experimentando problemas técnicos. Por favor, intenta de nuevo más tarde.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle keypresses (Enter to send, Shift+Enter for new line)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-pyme-blue to-pyme-blue-light hover:shadow-xl transition-all duration-300"
            aria-label="Abrir asistente virtual"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <MessageCircle className="h-6 w-6 text-white" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[350px] sm:w-[400px] p-0 rounded-xl border border-gray-200 shadow-xl"
          align="end"
          sideOffset={16}
        >
          <div className="flex flex-col h-[500px]">
            {/* Header */}
            <div className="px-4 py-3 border-b bg-gradient-to-r from-pyme-blue to-pyme-blue-light rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bot className="h-5 w-5 text-white mr-2" />
                  <h3 className="text-sm font-medium text-white">Asistente PyME360</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Messages */}
            <ScrollArea className="flex-grow p-4 bg-gray-50">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start",
                      message.isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    {!message.isUser && (
                      <Avatar className="h-8 w-8 mr-2 bg-pyme-blue">
                        <Bot className="h-4 w-4 text-white" />
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2 max-w-[80%]",
                        message.isUser
                          ? "bg-pyme-blue text-white"
                          : "bg-white border border-gray-200 text-gray-800"
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {message.isUser && (
                      <Avatar className="h-8 w-8 ml-2 bg-gray-500">
                        <User className="h-4 w-4 text-white" />
                      </Avatar>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Input */}
            <div className="p-3 border-t flex items-end">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Escribe tu pregunta..."
                className="min-h-[60px] resize-none flex-grow mr-2 focus-visible:ring-pyme-blue"
                //maxRows={4}
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage} 
                size="icon" 
                className="h-10 w-10 bg-pyme-blue hover:bg-pyme-blue-dark"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Help text */}
            <div className="px-3 py-2 bg-gray-50 text-xs text-gray-500 rounded-b-xl flex items-center">
              <HelpCircle className="h-3 w-3 mr-1" />
              <span>Pregúntame sobre la plataforma, servicios o financiamiento</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ChatbotAssistant;
