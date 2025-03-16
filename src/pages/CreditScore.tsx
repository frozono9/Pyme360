
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
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const user = await api.getCurrentUser();
        if (!user) {
          navigate("/acceso");
          return;
        }
        setUserData(user);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Error al cargar los datos del usuario");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchCreditData = async () => {
      try {
      setIsLoading(true);
      const score = await api.getCreditScore(true);
      if (!score) {
        setError("No fue posible calcular tu puntuación crediticia");
        return;
      }

      if (!score.components || !score.components.payment_history || !score.components.credit_mix) {
        console.error("Faltan componentes esenciales en los datos de credit score", score);
        setError("Datos incompletos de puntuación crediticia");
        return;
      }

      const paymentHistory = calculatePaymentHistory(userData?.historial_crediticio);
      const creditUtilization = calculateCreditUtilization(userData?.historial_crediticio);
      const historyLength = calculateCreditHistoryLength(userData?.historial_crediticio);
      const creditMix = calculateCreditMix(userData?.historial_crediticio);
      const newCreditApps = calculateNewCreditApplications(userData?.historial_crediticio);
      const finalScore = calculateFinalCreditScore(
        paymentHistory,
        creditUtilization,
        historyLength,
        creditMix,
        newCreditApps
      );

      setCreditData({
        finalScore,
        components: {
        paymentHistory: {
          score: paymentHistory.score,
          percentage: paymentHistory.onTimePct,
          total_payments: paymentHistory.totalPayments,
          on_time_payments: paymentHistory.onTimePayments,
          late_payments: paymentHistory.latePayments,
          weight: 0.35,
          chart_data: [
          { month: "Ene", "A tiempo": 20, "Atrasados": 0 },
          { month: "Feb", "A tiempo": 19, "Atrasados": 1 },
          { month: "Mar", "A tiempo": 20, "Atrasados": 0 },
          { month: "Abr", "A tiempo": 20, "Atrasados": 0 },
          { month: "May", "A tiempo": 19, "Atrasados": 1 },
          { month: "Jun", "A tiempo": 19, "Atrasados": 1 }
          ]
        },
        creditUtilization: {
          score: creditUtilization.score,
          utilization: creditUtilization.utilizationPct,
          total_debt: creditUtilization.totalDebt,
          total_available: creditUtilization.totalAvailable,
          weight: 0.30,
          accounts: [
          { name: "Banco Comercial", value: 250000000, limit: 500000000, utilization: 50 },
          { name: "Financiera Industrial", value: 177000000, limit: 400000000, utilization: 44.25 },
          { name: "Crédito Empresarial", value: 110000000, limit: 225000000, utilization: 48.9 }
          ]
        },
        historyLength: {
          score: historyLength.score,
          average_age: historyLength.avgYears,
          num_accounts: historyLength.accounts.length,
          weight: 0.15,
          accounts: [
          { name: "Banco Comercial", years: 6.9 },
          { name: "Financiera Industrial", years: 4.6 },
          { name: "Crédito Empresarial", years: 4.0 }
          ]
        },
        creditMix: {
          score: creditMix.score,
          num_types: creditMix.numTypes,
          weight: 0.10,
          types: creditMix.types,
          type_counts: [
          { name: "Préstamo Bancario", value: 1 },
          { name: "Línea de Crédito", value: 1 },
          { name: "Crédito para Maquinaria", value: 1 },
          { name: "Crédito Comercial", value: 1 }
          ]
        },
        newCreditApps: {
          score: newCreditApps.score,
          weight: 0.10,
          recent_applications: newCreditApps.recentApps
        }
        },
        history: [
        { month: "Ene", score: 750 },
        { month: "Feb", score: 755 },
        { month: "Mar", score: 762 },
        { month: "Abr", score: 768 },
        { month: "May", score: 774 },
        { month: "Jun", score: 781 }
        ],
        nivel: {
        nivel: "Excelente",
        color: "bg-gradient-to-r from-emerald-400 to-green-500",
        description: "Tu puntaje te posiciona entre el 10% superior, calificando para las mejores tasas y condiciones crediticias."
        },
        calculation: {
        formula: `300 + (${paymentHistory.score}×0.35 + ${creditUtilization.score}×0.3 + ${historyLength.score}×0.15 + ${creditMix.score}×0.1 + ${newCreditApps.score}×0.1) × 5.5 = ${finalScore}`
        }
      });
      } catch (err) {
      console.error("Error fetching credit score:", err);
      setError("Error al cargar la puntuación crediticia");
      } finally {
      setIsLoading(false);
      }
    };

    if (userData) {
      fetchCreditData();
    }
    }, [userData]);

  console.log(userData);
  const historialCrediticio = userData?.historial_crediticio;

  const paymentHistory = calculatePaymentHistory(historialCrediticio);
  const creditUtilization = calculateCreditUtilization(historialCrediticio);
  const historyLength = calculateCreditHistoryLength(historialCrediticio);
  const creditMix = calculateCreditMix(historialCrediticio);
  const newCreditApps = calculateNewCreditApplications(historialCrediticio);
  const finalScore = calculateFinalCreditScore(
    paymentHistory,
    creditUtilization,
    historyLength,
    creditMix,
    newCreditApps
  );

  console.log(finalScore);

  function calculatePaymentHistory(historialCrediticio: any) {
    const defaultResult = {
      score: 65,
      totalPayments: 0,
      onTimePayments: 0,
      latePayments: 0,
      onTimePct: 100
    };

    let totalPayments = 0;
    let latePayments = 0;

    const cuentasCredito = historialCrediticio?.cuentas_credito || [];
    for (const cuenta of cuentasCredito) {
      const historialPagos = cuenta.historial_pagos || [];
      totalPayments += historialPagos.length;

      for (const pago of historialPagos) {
        if (pago.estado && pago.estado.toLowerCase().includes('atrasado')) {
          latePayments++;
        }
      }
    }

    const creditoProveedores = historialCrediticio?.credito_proveedores || [];
    for (const proveedor of creditoProveedores) {
      const historialPagos = proveedor.historial_pagos || [];
      totalPayments += historialPagos.length;

      for (const pago of historialPagos) {
        if (pago.estado && pago.estado.toLowerCase().includes('atrasado')) {
          latePayments++;
        }
      }
    }

    if (totalPayments === 0) return defaultResult;

    const onTimePayments = totalPayments - latePayments;
    const onTimePct = (onTimePayments / totalPayments) * 100;

    let score = 0;
    if (onTimePct >= 98) score = 100;
    else if (onTimePct >= 95) score = 90;
    else if (onTimePct >= 90) score = 80;
    else if (onTimePct >= 85) score = 70;
    else if (onTimePct >= 75) score = 60;
    else score = Math.floor(onTimePct / 2);

    return {
      score,
      totalPayments,
      onTimePayments,
      latePayments,
      onTimePct
    };
  }

  function calculateCreditUtilization(historialCrediticio: any) {
    const defaultResult = {
      score: 50,
      totalDebt: 0,
      totalAvailable: 0,
      utilizationPct: 0
    };

    let totalDebt = 0;
    let totalAvailable = 0;

    const cuentasCredito = historialCrediticio?.cuentas_credito || [];
    for (const cuenta of cuentasCredito) {
      totalDebt += cuenta.saldo_actual || 0;
      totalAvailable += cuenta.limite_credito || 0;
    }

    const creditoProveedores = historialCrediticio?.credito_proveedores || [];
    for (const proveedor of creditoProveedores) {
      totalDebt += proveedor.saldo_actual || 0;
      totalAvailable += proveedor.limite_credito || 0;
    }

    if (totalAvailable === 0) return defaultResult;

    const utilizationPct = (totalDebt / totalAvailable) * 100;

    let score = 0;
    if (utilizationPct <= 10) score = 100;
    else if (utilizationPct <= 30) score = 90;
    else if (utilizationPct <= 50) score = 75;
    else if (utilizationPct <= 70) score = 60;
    else if (utilizationPct <= 90) score = 40;
    else score = 20;

    return {
      score,
      totalDebt,
      totalAvailable,
      utilizationPct
    };
  }

  function calculateCreditHistoryLength(historialCrediticio: any) {
    const defaultResult = {
      score: 50,
      avgYears: 0,
      accounts: []
    };

    const currentDate = new Date();
    const accountAges: number[] = [];

    const cuentasCredito = historialCrediticio?.cuentas_credito || [];
    for (const cuenta of cuentasCredito) {
      if (cuenta.fecha_apertura) {
        try {
          const fechaApertura = new Date(cuenta.fecha_apertura);
          const years = (currentDate.getTime() - fechaApertura.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
          accountAges.push(years);
        } catch (error) {
        }
      }
    }

    if (accountAges.length === 0) return defaultResult;

    const avgYears = accountAges.reduce((sum, age) => sum + age, 0) / accountAges.length;

    let score = 0;
    if (avgYears >= 7) score = 100;
    else if (avgYears >= 5) score = 90;
    else if (avgYears >= 3) score = 80;
    else if (avgYears >= 2) score = 70;
    else if (avgYears >= 1) score = 60;
    else score = 50;

    return {
      score,
      avgYears,
      accounts: accountAges
    };
  }

  function calculateCreditMix(historialCrediticio: any) {
    const defaultResult = {
      score: 50,
      numTypes: 0,
      types: []
    };

    const creditTypes = new Set<string>();

    const cuentasCredito = historialCrediticio?.cuentas_credito || [];
    for (const cuenta of cuentasCredito) {
      if (cuenta.tipo) {
        creditTypes.add(cuenta.tipo);
      }
    }

    if ((historialCrediticio?.credito_proveedores || []).length > 0) {
      creditTypes.add("Crédito Comercial");
    }

    const numTypes = creditTypes.size;

    let score = 0;
    if (numTypes >= 4) score = 100;
    else if (numTypes === 3) score = 90;
    else if (numTypes === 2) score = 75;
    else if (numTypes === 1) score = 60;
    else score = 50;

    return {
      score,
      numTypes,
      types: Array.from(creditTypes)
    };
  }

  function calculateNewCreditApplications(historialCrediticio: any) {
    const defaultResult = {
      score: 100,
      recentApps: 0
    };

    const currentDate = new Date();
    let recentApps = 0;

    const solicitudes = historialCrediticio?.solicitudes_credito_recientes || [];
    for (const solicitud of solicitudes) {
      if (solicitud.fecha) {
        try {
          const fechaSolicitud = new Date(solicitud.fecha);
          const monthsDiff =
            (currentDate.getFullYear() - fechaSolicitud.getFullYear()) * 12 +
            currentDate.getMonth() - fechaSolicitud.getMonth();

          if (monthsDiff <= 12) {
            recentApps++;
          }
        } catch (error) {
        }
      }
    }

    let score = 0;
    if (recentApps === 0) score = 100;
    else if (recentApps === 1) score = 90;
    else if (recentApps === 2) score = 75;
    else if (recentApps === 3) score = 60;
    else score = 40;

    return {
      score,
      recentApps
    };
  }

  function calculateFinalCreditScore(
    paymentHistory: any,
    creditUtilization: any,
    historyLength: any,
    creditMix: any,
    newCreditApps: any
  ) {
    const weightedScore =
      paymentHistory.score * 0.35 +
      creditUtilization.score * 0.30 +
      historyLength.score * 0.15 +
      creditMix.score * 0.10 +
      newCreditApps.score * 0.10;

    return Math.round(300 + (weightedScore / 100) * 550);
  }

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

          {creditData && <CreditScoreCalculator creditData={creditData} />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreditScore;
