
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import CreditScoreCalculator from '@/components/financiamiento/CreditScoreCalculator';
import api from "@/api";
import { toast } from "@/components/ui/use-toast";

const CreditScore = () => {
  const [creditData, setCreditData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreditData = async () => {
      try {
        setIsLoading(true);
        const user = await api.getCurrentUser();
        
        if (!user) {
          toast({
            title: "Acceso denegado",
            description: "Debes iniciar sesión para acceder a esta página",
            variant: "destructive"
          });
          navigate("/acceso");
          return;
        }
        
        // Asegurarnos de obtener los datos completos de la API
        console.log("Solicitando datos de Credit Score...");
        const score = await api.getCreditScore(true);
        console.log("DATOS DE CREDIT SCORE RECIBIDOS EN PAGINA:", score);
        
        if (!score) {
          setError("No fue posible calcular tu puntuación crediticia");
          return;
        }

        // Verificamos que todos los componentes estén presentes
        if (!score.components || !score.components.payment_history || !score.components.credit_mix) {
          console.error("Faltan componentes esenciales en los datos de credit score", score);
          setError("Datos incompletos de puntuación crediticia");
          return;
        }
        
        // Guardar los datos completos
        setCreditData(score);
      } catch (err) {
        console.error("Error fetching credit score:", err);
        setError("Error al cargar la puntuación crediticia");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreditData();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-4 w-full max-w-2xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-[300px] w-full rounded-md" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-[250px] w-full rounded-md" />
                <Skeleton className="h-[250px] w-full rounded-md" />
                <Skeleton className="h-[250px] w-full rounded-md" />
                <Skeleton className="h-[250px] w-full rounded-md" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-500">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{error}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => window.location.reload()}>
                  Reintentar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Puntuación Crediticia</h1>
            <p className="text-muted-foreground">
              Tu puntuación crediticia es calculada en base a tu historial financiero y crediticio. Esta puntuación es utilizada por instituciones financieras para evaluar tu elegibilidad para créditos y préstamos.
            </p>
          </div>
          
          {/* Mostrar el calculador de puntaje crediticio con los datos completos */}
          {creditData && <CreditScoreCalculator creditData={creditData} />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreditScore;
