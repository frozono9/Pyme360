
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import CreditScoreCalculator from '@/components/financiamiento/CreditScoreCalculator';
import api from "@/api";

const CreditScore = () => {
  const [creditData, setCreditData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreditData = async () => {
      try {
        setIsLoading(true);
        const user = await api.getCurrentUser();
        if (!user) {
          navigate("/acceso");
          return;
        }
        
        // Guardamos todos los datos del usuario para el cálculo
        setUserData(user);
        
        // También mantenemos la compatibilidad con el getCreditScore para funcionalidad existente
        const data = await api.getCreditScore();
        setCreditData(data);
      } catch (err) {
        console.error("Error fetching credit score:", err);
        setError("Error al cargar la puntuación crediticia");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreditData();
  }, [navigate]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-[300px] w-full rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-[250px] w-full rounded-md" />
            <Skeleton className="h-[250px] w-full rounded-md" />
          </div>
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500 text-center p-8">{error}</div>;
    }

    if (!userData || !userData.historial_crediticio) {
      return (
        <div className="text-center p-8">
          <p className="text-lg text-gray-700 mb-4">No hay datos de historial crediticio disponibles.</p>
          <p className="text-muted-foreground">Completa tu información financiera para obtener tu puntuación crediticia.</p>
        </div>
      );
    }

    return <CreditScoreCalculator historialCrediticio={userData.historial_crediticio} />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Puntuación Crediticia</h1>
            <p className="text-muted-foreground">
              Tu puntuación crediticia es calculada con base en tu historial financiero y crediticio. Esta puntuación es utilizada por instituciones financieras para evaluar tu elegibilidad para créditos y préstamos. La escala va de 300 a 850, donde una mayor puntuación indica un mejor perfil crediticio.
            </p>
          </div>
          
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreditScore;
