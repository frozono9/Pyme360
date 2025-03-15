
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ModulesSection from "@/components/ModulesSection";
import CertificationSystem from "@/components/CertificationSystem";
import Footer from "@/components/Footer";
import api from "@/api";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [testInput, setTestInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const testMongoConnection = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!testInput.trim()) {
      toast({
        title: "Error",
        description: "Por favor, introduce un valor para probar",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {   
      console.log("Iniciando prueba de conexión");
      const result = await api.testMongoConnection(testInput);
      console.log("Resultado de la conexión:", result);
      
      toast({
        title: "Éxito",
        description: `Conexión exitosa: ${result.message}`,
      });
      
      setTestInput(""); // Limpiar el input después de una conexión exitosa
    } catch (error) {
      console.error("Error en la prueba de conexión:", error);
      toast({
        title: "Error",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <ModulesSection />
        <CertificationSystem />
        <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Probar Conexión a MongoDB</h3>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Introduce un valor para probar"
              className="border rounded-md p-2 w-full"
            />
            <button
              onClick={testMongoConnection}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Probando..." : "Probar Conexión"}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
