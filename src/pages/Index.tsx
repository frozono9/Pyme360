import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ModulesSection from "@/components/ModulesSection";
import CertificationSystem from "@/components/CertificationSystem";
import Footer from "@/components/Footer";
import api from "@/api"; // Make sure to import your api module
import { toast } from "react-toastify";

const Index = () => {
  const [testInput, setTestInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const testMongoConnection = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!testInput.trim()) {
      toast.error("Por favor, introduce un valor para probar");
      return;
    }

    setIsLoading(true);
    try {   
      console.log("antes");
      const result = await api.testMongoConnection(testInput);
      console.log("despues");
      toast.success(`Conexión exitosa: ${result.message}`);
      setTestInput(""); // Limpiar el input después de una conexión exitosa
    } catch (error) {
      toast.error(`Error: ${error.message}`);
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
        <div className="p-4">
          <input
            type="text"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="Introduce un valor para probar"
            className="border p-2 mr-2"
          />
          <button
            onClick={testMongoConnection}
            className="bg-blue-500 text-white p-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Probando..." : "Probar Conexión"}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
