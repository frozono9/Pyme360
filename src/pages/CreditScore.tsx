import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import api from "@/api";

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
              navigate("/acceso");
              return;
          }
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

  const renderCreditScore = () => {
    if (isLoading) {
      return <Skeleton className="h-5 w-20 rounded-full" />;
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    if (!creditData) {
      return <div>No hay datos disponibles.</div>;
    }

    return (
      <div className="flex items-center space-x-4">
        <div className="text-4xl font-bold">{creditData.score}</div>
        <Badge variant="secondary">{creditData.rating}</Badge>
      </div>
    );
  };

  const renderScoreFactors = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    if (!creditData || !creditData.factors) {
      return <div>No hay factores de puntuación disponibles.</div>;
    }

    return (
      <ul className="list-disc pl-5 space-y-1">
        {creditData.factors.map((factor, index) => (
          <li key={index}>{factor}</li>
        ))}
      </ul>
    );
  };

  const renderCreditMix = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    if (!creditData || !creditData.creditMix) {
      return <div>No hay información sobre la combinación de crédito disponible.</div>;
    }

    return (
      <ul className="list-disc pl-5 space-y-1">
        {creditData.creditMix.map((mix, index) => (
          <li key={index}>{mix}</li>
        ))}
      </ul>
    );
  };

  const renderPaymentHistory = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    if (!creditData || !creditData.paymentHistory) {
      return <div>No hay historial de pagos disponible.</div>;
    }

    return (
      <ul className="list-disc pl-5 space-y-1">
        {creditData.paymentHistory.map((history, index) => (
          <li key={index}>{history}</li>
        ))}
      </ul>
    );
  };

  const renderCreditUtilization = () => {
    if (isLoading) {
      return <Skeleton className="h-4 w-40 rounded-full" />;
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    if (!creditData || creditData.creditUtilization === undefined) {
      return <div>No hay datos de utilización de crédito disponibles.</div>;
    }

      const utilization = Number(creditData.creditUtilization);
    return (
      <div className="space-y-2">
        <Progress value={utilization} />
        <div>Utilización: {utilization}%</div>
      </div>
    );
  };

  const renderDerogatoryMarks = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    if (!creditData || !creditData.derogatoryMarks) {
      return <div>No hay marcas derogatorias.</div>;
    }

    return (
      <ul className="list-disc pl-5 space-y-1">
        {creditData.derogatoryMarks.map((mark, index) => (
          <li key={index}>{mark}</li>
        ))}
      </ul>
    );
  };

  const renderCreditAge = () => {
    if (isLoading) {
      return <Skeleton className="h-4 w-40 rounded-full" />;
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    if (!creditData || !creditData.creditAge) {
      return <div>No hay información sobre la antigüedad del crédito disponible.</div>;
    }

    return <div>Antigüedad del crédito: {creditData.creditAge}</div>;
  };

  const renderRecentCreditBehavior = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    if (!creditData || !creditData.recentCreditBehavior) {
      return <div>No hay información sobre el comportamiento crediticio reciente.</div>;
    }

    return (
      <ul className="list-disc pl-5 space-y-1">
        {creditData.recentCreditBehavior.map((behavior, index) => (
          <li key={index}>{behavior}</li>
        ))}
      </ul>
    );
  };

  const renderCreditAccounts = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    if (!creditData || !creditData.creditAccounts) {
      return <div>No hay cuentas de crédito disponibles.</div>;
    }

    return (
      <Table>
        <TableCaption>Cuentas de crédito del usuario.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Entidad</TableHead>
            <TableHead>Tipo de Crédito</TableHead>
            <TableHead>Límite de Crédito</TableHead>
            <TableHead>Saldo Actual</TableHead>
            <TableHead>Tasa de Interés</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {creditData.creditAccounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell className="font-medium">{account.entity}</TableCell>
              <TableCell>{account.type}</TableCell>
              <TableCell>{account.creditLimit}</TableCell>
              <TableCell>{account.currentBalance}</TableCell>
              <TableCell>{account.interestRate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderPaymentCalendar = () => {
    const [date, setDate] = React.useState<DateRange | undefined>(undefined)

    if (isLoading) {
      return <Skeleton className="h-[300px] w-full rounded-md" />;
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    if (!creditData || !creditData.paymentCalendar) {
      return <div>No hay calendario de pagos disponible.</div>;
    }

    return (
      <div className="w-full">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="range"
              defaultMonth={new Date()}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  const renderDebtDetails = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    if (!creditData || !creditData.debtDetails) {
      return <div>No hay detalles de deuda disponibles.</div>;
    }

    return (
      <Accordion type="single" collapsible>
        {creditData.debtDetails.map((debt, index) => (
          <AccordionItem value={`debt-${index}`} key={index}>
            <AccordionTrigger>{debt.name}</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 space-y-1">
                <li>Monto: {debt.amount}</li>
                <li>Tasa de Interés: {debt.interestRate}</li>
                <li>Fecha de Vencimiento: {debt.dueDate}</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Puntuación Crediticia</CardTitle>
              <CardDescription>
                Tu puntuación crediticia actual es:
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderCreditScore()}
            </CardContent>
          </Card>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Factores de Puntuación</CardTitle>
                <CardDescription>
                  Factores que influyen en tu puntuación crediticia:
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderScoreFactors()}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Combinación de Crédito</CardTitle>
                <CardDescription>
                  Tipos de crédito que utilizas:
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderCreditMix()}
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Pagos</CardTitle>
                <CardDescription>
                  Tu historial de pagos:
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderPaymentHistory()}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Utilización del Crédito</CardTitle>
                <CardDescription>
                  Cuánto crédito estás utilizando:
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderCreditUtilization()}
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Marcas Derogatorias</CardTitle>
                <CardDescription>
                  Cuentas con marcas negativas:
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderDerogatoryMarks()}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Antigüedad del Crédito</CardTitle>
                <CardDescription>
                  Cuánto tiempo llevas usando crédito:
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderCreditAge()}
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Comportamiento Crediticio Reciente</CardTitle>
                <CardDescription>
                  Cómo has estado usando el crédito recientemente:
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderRecentCreditBehavior()}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cuentas de Crédito</CardTitle>
                <CardDescription>
                  Todas tus cuentas de crédito:
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderCreditAccounts()}
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendario de Pagos</CardTitle>
                <CardDescription>
                  Próximos pagos:
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderPaymentCalendar()}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalles de Deuda</CardTitle>
                <CardDescription>
                  Información detallada sobre tus deudas:
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderDebtDetails()}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreditScore;
