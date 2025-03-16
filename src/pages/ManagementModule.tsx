import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ButtonCustom } from "@/components/ui/button-custom";
import { 
  ArrowRight, 
  BarChart2, 
  Users, 
  FileSpreadsheet,
  FileText,
  LineChart,
  TrendingUp,
  TrendingDown,
  PieChart,
  Maximize2,
  CalendarDays,
  DollarSign,
  Receipt,
  Wallet,
  CircleDollarSign,
  Calculator,
  BarChart3,
  CreditCard,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/api";
import { 
  AreaChart as RechartsAreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

import { KpiCard } from "@/components/management/KpiCard";
import { ErpModuleCard } from "@/components/management/ErpModuleCard";
import { EfficiencyCard } from "@/components/management/EfficiencyCard";
import { FeatureCard } from "@/components/management/FeatureCard";

function transformSalesData(userData: any) {
  if (!userData || !userData.ventas_trimestrales) {
    return [
      { name: 'Q1', sales: 0, target: 0 },
      { name: 'Q2', sales: 0, target: 0 },
      { name: 'Q3', sales: 0, target: 0 },
      { name: 'Q4', sales: 0, target: 0 }
    ];
  }
  
  if (!Array.isArray(userData.ventas_trimestrales)) {
    console.warn('ventas_trimestrales is not an array:', userData.ventas_trimestrales);
    return [
      { name: 'Q1', sales: 0, target: 0 },
      { name: 'Q2', sales: 0, target: 0 },
      { name: 'Q3', sales: 0, target: 0 },
      { name: 'Q4', sales: 0, target: 0 }
    ];
  }
  
  return userData.ventas_trimestrales.map((item: any) => ({
    name: item.trimestre,
    sales: item.ventas || 0,
    target: item.objetivo || 0
  }));
}

function transformProductData(userData: any) {
  if (!userData || !userData.distribucion_ingresos) {
    return [
      { name: 'Producto A', value: 0 },
      { name: 'Producto B', value: 0 },
      { name: 'Producto C', value: 0 }
    ];
  }
  
  // Check if distribucion_ingresos has por_producto property (based on console logs)
  if (userData.distribucion_ingresos.por_producto && Array.isArray(userData.distribucion_ingresos.por_producto)) {
    return userData.distribucion_ingresos.por_producto.map((item: any) => ({
      name: item.producto,
      value: item.ingresos_anuales || 0
    }));
  }
  
  if (!Array.isArray(userData.distribucion_ingresos)) {
    console.warn('distribucion_ingresos is not an array in transformProductData:', userData.distribucion_ingresos);
    return [
      { name: 'Producto A', value: 0 },
      { name: 'Producto B', value: 0 },
      { name: 'Producto C', value: 0 }
    ];
  }
  
  return userData.distribucion_ingresos.map((item: any) => ({
    name: item.producto,
    value: item.valor || 0
  }));
}

function transformSalesPerformanceData(userData: any) {
  if (!userData || !userData.rendimiento_ventas) {
    return [
      { name: 'Ene', actual: 0, target: 0 },
      { name: 'Feb', actual: 0, target: 0 },
      { name: 'Mar', actual: 0, target: 0 },
      { name: 'Abr', actual: 0, target: 0 },
      { name: 'May', actual: 0, target: 0 },
      { name: 'Jun', actual: 0, target: 0 }
    ];
  }
  
  if (!Array.isArray(userData.rendimiento_ventas)) {
    console.warn('rendimiento_ventas is not an array:', userData.rendimiento_ventas);
    return [
      { name: 'Ene', actual: 0, target: 0 },
      { name: 'Feb', actual: 0, target: 0 },
      { name: 'Mar', actual: 0, target: 0 },
      { name: 'Abr', actual: 0, target: 0 },
      { name: 'May', actual: 0, target: 0 },
      { name: 'Jun', actual: 0, target: 0 }
    ];
  }
  
  return userData.rendimiento_ventas.map((item: any) => ({
    name: item.mes,
    actual: item.real || 0,
    target: item.objetivo || 0
  }));
}

function transformTopProductsData(userData: any) {
  if (!userData || !userData.productos_vendidos) {
    return [
      { name: 'Producto A', value: 0 },
      { name: 'Producto B', value: 0 },
      { name: 'Producto C', value: 0 },
      { name: 'Producto D', value: 0 },
      { name: 'Producto E', value: 0 }
    ];
  }
  
  if (!Array.isArray(userData.productos_vendidos)) {
    console.warn('productos_vendidos is not an array:', userData.productos_vendidos);
    return [
      { name: 'Producto A', value: 0 },
      { name: 'Producto B', value: 0 },
      { name: 'Producto C', value: 0 },
      { name: 'Producto D', value: 0 },
      { name: 'Producto E', value: 0 }
    ];
  }
  
  return userData.productos_vendidos
    .slice(0, 5)
    .map((item: any) => ({
      name: item.producto,
      value: item.unidades || 0
    }));
}

function transformTrendData(userData: any) {
  if (!userData || !userData.tendencia_financiera) {
    return [
      { name: 'Ene', ventas: 0, costos: 0 },
      { name: 'Feb', ventas: 0, costos: 0 },
      { name: 'Mar', ventas: 0, costos: 0 },
      { name: 'Abr', ventas: 0, costos: 0 },
      { name: 'May', ventas: 0, costos: 0 },
      { name: 'Jun', ventas: 0, costos: 0 }
    ];
  }
  
  if (!Array.isArray(userData.tendencia_financiera)) {
    console.warn('tendencia_financiera is not an array:', userData.tendencia_financiera);
    return [
      { name: 'Ene', ventas: 0, costos: 0 },
      { name: 'Feb', ventas: 0, costos: 0 },
      { name: 'Mar', ventas: 0, costos: 0 },
      { name: 'Abr', ventas: 0, costos: 0 },
      { name: 'May', ventas: 0, costos: 0 },
      { name: 'Jun', ventas: 0, costos: 0 }
    ];
  }
  
  return userData.tendencia_financiera.map((item: any) => ({
    name: item.mes,
    ventas: item.ingresos || 0,
    costos: item.gastos || 0
  }));
}

function transformExpenseData(userData: any) {
  if (!userData || !userData.analisis_gastos) {
    return [
      { name: 'Operativos', value: 0 },
      { name: 'Administrativos', value: 0 },
      { name: 'Marketing', value: 0 },
      { name: 'Impuestos', value: 0 },
      { name: 'Otros', value: 0 }
    ];
  }
  
  if (!Array.isArray(userData.analisis_gastos)) {
    console.warn('analisis_gastos is not an array:', userData.analisis_gastos);
    return [
      { name: 'Operativos', value: 0 },
      { name: 'Administrativos', value: 0 },
      { name: 'Marketing', value: 0 },
      { name: 'Impuestos', value: 0 },
      { name: 'Otros', value: 0 }
    ];
  }
  
  return userData.analisis_gastos.map((item: any) => ({
    name: item.categoria,
    value: item.monto || 0
  }));
}

function transformExpenseTrendData(userData: any) {
  if (!userData || !userData.tendencia_gastos) {
    return Array(12).fill(0).map((_, i) => {
      const month = new Date(0, i).toLocaleString('es-ES', { month: 'short' });
      return {
        name: month,
        operativos: 0,
        administrativos: 0,
        marketing: 0
      };
    });
  }
  
  if (!Array.isArray(userData.tendencia_gastos)) {
    console.warn('tendencia_gastos is not an array:', userData.tendencia_gastos);
    return Array(12).fill(0).map((_, i) => {
      const month = new Date(0, i).toLocaleString('es-ES', { month: 'short' });
      return {
        name: month,
        operativos: 0,
        administrativos: 0,
        marketing: 0
      };
    });
  }
  
  return userData.tendencia_gastos.map((item: any) => ({
    name: item.mes,
    operativos: item.operativos || 0,
    administrativos: item.administrativos || 0,
    marketing: item.marketing || 0
  }));
}

function calculateExpenseMetrics(userData: any) {
  const defaultResult = {
    hasData: false,
    totalExpenses: 0,
    operatingExpenses: 0,
    administrativeExpenses: 0,
    expenseChange: 0
  };
  
  if (!userData) return defaultResult;
  
  const gastosMensuales = userData.gastos_mensuales || {};
  const datosMensuales = gastosMensuales.datos_mensuales || [];
  
  if (!Array.isArray(datosMensuales) || datosMensuales.length === 0) {
    return defaultResult;
  }
  
  const lastMonth = datosMensuales[0];
  const prevMonth = datosMensuales.length > 1 ? datosMensuales[1] : null;
  
  const totalExpenses = lastMonth.total || 0;
  const operatingExpenses = lastMonth.operativos || 0;
  const administrativeExpenses = lastMonth.administrativos || 0;
  
  let expenseChange = 0;
  if (prevMonth && prevMonth.total > 0) {
    expenseChange = ((totalExpenses - prevMonth.total) / prevMonth.total) * 100;
  }
  
  return {
    hasData: true,
    totalExpenses,
    operatingExpenses,
    administrativeExpenses,
    expenseChange
  };
}

function calculateCashFlowMetrics(userData: any) {
  const defaultResult = {
    hasData: false,
    initialCash: 0,
    cashIn: 0,
    cashOut: 0,
    endingCash: 0,
    cashFlowChange: 0,
    cashFlowChangePct: 0
  };
  
  if (!userData) return defaultResult;
  
  const flujoCaja = userData.flujo_caja || {};
  const datosMensuales = flujoCaja.datos_mensuales || [];
  
  if (!Array.isArray(datosMensuales) || datosMensuales.length === 0) {
    return defaultResult;
  }
  
  const lastMonth = datosMensuales[0];
  const prevMonth = datosMensuales.length > 1 ? datosMensuales[1] : null;
  
  const initialCash = lastMonth.saldo_inicial || 0;
  const cashIn = lastMonth.entradas || 0;
  const cashOut = lastMonth.salidas || 0;
  const endingCash = lastMonth.saldo_final || initialCash + cashIn - cashOut;
  
  let cashFlowChange = endingCash - initialCash;
  let cashFlowChangePct = initialCash > 0 ? (cashFlowChange / initialCash) * 100 : 0;
  
  return {
    hasData: true,
    initialCash,
    cashIn,
    cashOut,
    endingCash,
    cashFlowChange,
    cashFlowChangePct
  };
}

function calculateRevenueDistribution(userData: any) {
  if (!userData || !userData.distribucion_ingresos) {
    return [];
  }
  
  // Check if distribucion_ingresos has por_producto property (based on console logs)
  if (userData.distribucion_ingresos.por_producto && Array.isArray(userData.distribucion_ingresos.por_producto)) {
    return userData.distribucion_ingresos.por_producto.map((item: any) => ({
      name: item.producto,
      value: item.ingresos_anuales || 0
    }));
  }
  
  if (!Array.isArray(userData.distribucion_ingresos)) {
    console.warn('distribucion_ingresos is not an array:', userData.distribucion_ingresos);
    return [];
  }
  
  return userData.distribucion_ingresos.map((item: any) => ({
    name: item.producto,
    value: item.valor || 0
  }));
}

function getUserNewClients(userData: any) {
  if (!userData || !userData.clientes_nuevos) {
    return "0";
  }
  return userData.clientes_nuevos.toString();
}

function getUserNewClientsChange(userData: any) {
  if (!userData || !userData.cambio_clientes_nuevos) {
    return "+0%";
  }
  const change = userData.cambio_clientes_nuevos;
  return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
}

function getAccountsReceivable(userData: any) {
  if (!userData || !userData.cuentas_por_cobrar) {
    return "$ 0";
  }
  return new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP',
    maximumFractionDigits: 0 
  }).format(userData.cuentas_por_cobrar);
}

function getAccountsReceivableChange(userData: any) {
  if (!userData || !userData.cambio_cuentas_por_cobrar) {
    return "+0%";
  }
  const change = userData.cambio_cuentas_por_cobrar;
  return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
}

function getAccountsPayable(userData: any) {
  if (!userData || !userData.cuentas_por_pagar) {
    return "$ 0";
  }
  return new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP',
    maximumFractionDigits: 0 
  }).format(userData.cuentas_por_pagar);
}

function getAccountsPayableChange(userData: any) {
  if (!userData || !userData.cambio_cuentas_por_pagar) {
    return "-0%";
  }
  const change = userData.cambio_cuentas_por_pagar;
  return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
}

function getGeneralBalance(userData: any) {
  if (!userData || !userData.balance_general) {
    return "$ 0";
  }
  return new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP',
    maximumFractionDigits: 0 
  }).format(userData.balance_general);
}

function getGeneralBalanceChange(userData: any) {
  if (!userData || !userData.cambio_balance_general) {
    return "+0%";
  }
  const change = userData.cambio_balance_general;
  return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
}

function getPendingTaxes(userData: any) {
  if (!userData || !userData.impuestos_pendientes) {
    return "$ 0";
  }
  return new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP',
    maximumFractionDigits: 0 
  }).format(userData.impuestos_pendientes);
}

function getPendingTaxesChange(userData: any) {
  if (!userData || !userData.cambio_impuestos_pendientes) {
    return "-0%";
  }
  const change = userData.cambio_impuestos_pendientes;
  return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
}

function getRoi(userData: any) {
  if (!userData || !userData.roi) {
    return "0%";
  }
  return `${userData.roi.toFixed(1)}%`;
}

function getRoiChange(userData: any) {
  if (!userData || !userData.cambio_roi) {
    return "+0% desde último trimestre";
  }
  const change = userData.cambio_roi;
  return `${change > 0 ? '+' : ''}${change.toFixed(1)}% desde último trimestre`;
}

function isPositiveRoiChange(userData: any) {
  if (!userData || !userData.cambio_roi) {
    return false;
  }
  return userData.cambio_roi > 0;
}

function getCashConversionCycle(userData: any) {
  if (!userData || !userData.ciclo_conversion_efectivo) {
    return "0 días";
  }
  return `${userData.ciclo_conversion_efectivo} días`;
}

function getCashConversionCycleChange(userData: any) {
  if (!userData || !userData.cambio_ciclo_conversion) {
    return "0 días desde último trimestre";
  }
  const change = userData.cambio_ciclo_conversion;
  return `${change > 0 ? '+' : ''}${change} días desde último trimestre`;
}

function isPositiveCashCycleChange(userData: any) {
  if (!userData || !userData.cambio_ciclo_conversion) {
    return false;
  }
  return userData.cambio_ciclo_conversion > 0;
}

function getTaxCalendar(userData: any) {
  if (!userData || !userData.calendario_tributario) {
    return [
      {
        name: "IVA",
        dueDate: "30/06/2023",
        amount: "$ 2,500,000",
        color: "amber"
      },
      {
        name: "Retención en la Fuente",
        dueDate: "15/07/2023",
        amount: "$ 1,200,000",
        color: "blue"
      },
      {
        name: "Impuesto de Renta",
        dueDate: "08/08/2023",
        amount: "$ 5,800,000",
        color: "red"
      }
    ];
  }
  
  if (!Array.isArray(userData.calendario_tributario)) {
    console.warn('calendario_tributario is not an array:', userData.calendario_tributario);
    return [
      {
        name: "IVA",
        dueDate: "30/06/2023",
        amount: "$ 2,500,000",
        color: "amber"
      },
      {
        name: "Retención en la Fuente",
        dueDate: "15/07/2023",
        amount: "$ 1,200,000",
        color: "blue"
      },
      {
        name: "Impuesto de Renta",
        dueDate: "08/08/2023",
        amount: "$ 5,800,000",
        color: "red"
      }
    ];
  }
  
  return userData.calendario_tributario.map((tax: any) => ({
    name: tax.nombre,
    dueDate: tax.fecha_vencimiento,
    amount: new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      maximumFractionDigits: 0 
    }).format(tax.monto_estimado),
    color: tax.color || "amber"
  }));
}

function calculateSalesMetrics(userData: any) {
  const defaultResult = {
    hasSalesData: false,
    totalSales: 0,
    onlineSales: 0,
    inStoreSales: 0,
    salesChange: 0,
    onlinePct: 0,
    inStorePct: 0
  };
  
  if (!userData) return defaultResult;
  
  const ventasMensuales = userData.ventas_mensuales || {};
  const datosMensuales = ventasMensuales.datos_mensuales || [];
  
  if (!Array.isArray(datosMensuales) || datosMensuales.length === 0) {
    return defaultResult;
  }
  
  const lastMonth = datosMensuales[0];
  
  const prevMonth = datosMensuales.length > 1 ? datosMensuales[1] : null;
  
  const totalSales = lastMonth.total || 0;
  const onlineSales = lastMonth.online || 0;
  const inStoreSales = lastMonth.tienda || 0;
  
  const onlinePct = totalSales > 0 ? (onlineSales / totalSales) * 100 : 0;
  const inStorePct = totalSales > 0 ? (inStoreSales / totalSales) * 100 : 0;
  
  let salesChange = 0;
  if (prevMonth && prevMonth.total > 0) {
    salesChange = ((totalSales - prevMonth.total) / prevMonth.total) * 100;
  }
  
  return {
    hasSalesData: true,
    totalSales,
    onlineSales,
    inStoreSales,
    salesChange,
    onlinePct,
    inStorePct
  };
}

function calculateProfitMetrics(userData: any) {
  const defaultResult = {
    hasData: false,
    revenue: 0,
    grossMargin: 0,
    netMargin: 0,
    grossMarginChange: 0,
    netMarginChange: 0
  };
  
  if (!userData) return defaultResult;
  
  const margenBeneficio = userData.margen_beneficio || {};
  const datosMensuales = margenBeneficio.datos_mensuales || [];
  
  if (!Array.isArray(datosMensuales) || datosMensuales.length === 0) {
    return defaultResult;
  }
  
  const lastMonth = datosMensuales[0];
  
  const prevMonth = datosMensuales.length > 1 ? datosMensuales[1] : null;
  
  const revenue = lastMonth.ingresos || 0;
  const cogs = lastMonth.costo_ventas || 0;
  const opExpenses = lastMonth.gastos_operativos || 0;
  
  let grossMargin = lastMonth.margen_bruto !== undefined ? 
    (typeof lastMonth.margen_bruto === 'number' ? lastMonth.margen_bruto * 100 : parseFloat(lastMonth.margen_bruto) * 100) :
    (revenue > 0 ? ((revenue - cogs) / revenue) * 100 : 0);
  
  let netMargin = lastMonth.margen_neto !== undefined ? 
    (typeof lastMonth.margen_neto === 'number' ? lastMonth.margen_neto * 100 : parseFloat(lastMonth.margen_neto) * 100) :
    (revenue > 0 ? ((revenue - cogs - opExpenses) / revenue) * 100 : 0);
  
  let grossMarginChange = 0;
  let netMarginChange = 0;
  
  if (prevMonth) {
    const prevGrossMargin = prevMonth.margen_bruto !== undefined ? 
      (typeof prevMonth.margen_bruto === 'number' ? prevMonth.margen_bruto * 100 : parseFloat(prevMonth.margen_bruto) * 100) :
      (prevMonth.ingresos > 0 ? ((prevMonth.ingresos - prevMonth.costo_ventas) / prevMonth.ingresos) * 100 : 0);
    
    const prevNetMargin = prevMonth.margen_neto !== undefined ? 
      (typeof prevMonth.margen_neto === 'number' ? prevMonth.margen_neto * 100 : parseFloat(prevMonth.margen_neto) * 100) :
      (prevMonth.ingresos > 0 ? ((prevMonth.ingresos - prevMonth.costo_ventas - prevMonth.gastos_operativos) / prevMonth.ingresos) * 100 : 0);
    
    grossMarginChange = grossMargin - prevGrossMargin;
    netMarginChange = netMargin - prevNetMargin;
  }
  
  return {
    hasData: true,
    revenue,
    grossMargin,
    netMargin,
    grossMarginChange,
    netMarginChange
  };
}

const ManagementModule = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const user = await api.getCurrentUser();
        if (!user) {
          setError("No se pudo obtener información del usuario");
          return;
        }
        setUserData(user);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Error al cargar los datos del usuario");
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos. Por favor, intenta nuevamente.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  const calculateFinancialMetrics = () => {
    if (!userData) return null;
    
    const salesMetrics = calculateSalesMetrics(userData);
    
    const profitMetrics = calculateProfitMetrics(userData);
    
    const expenseMetrics = calculateExpenseMetrics(userData);
    
    const cashFlowMetrics = calculateCashFlowMetrics(userData);
    
    const revenueDistribution = calculateRevenueDistribution(userData);
    
    return {
      salesMetrics,
      profitMetrics,
      expenseMetrics,
      cashFlowMetrics,
      revenueDistribution
    };
  };
  
  const metrics = calculateFinancialMetrics();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      maximumFractionDigits: 0 
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-pyme-gray-light">
        <section className="pt-24 pb-12 relative bg-gradient-to-b from-white to-pyme-gray-light overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-bl from-pyme-blue/10 to-transparent blur-3xl"></div>
            <div className="absolute bottom-[10%] left-[5%] w-[30%] h-[30%] rounded-full bg-gradient-to-tr from-pyme-success/5 to-transparent blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto container-padding relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-8 animate-fade-up">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-pyme-blue bg-pyme-blue/10 border border-pyme-blue/20 mb-4">
                Módulo de PyME360
              </div>
              
              <h1 className="mb-4 text-balance">
                Gestión <span className="text-pyme-blue">Empresarial</span>
              </h1>
              
              <p className="text-pyme-gray-dark text-lg">
                Plataforma integrada para administrar todos los aspectos financieros de tu negocio con 
                herramientas avanzadas que te ayudan a tomar mejores decisiones.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">ERP Simplificado</h2>
          
          {isLoading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-8">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="border-none shadow-elevation">
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-8 w-32 mb-2" />
                      <Skeleton className="h-4 w-16" />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card className="border-none shadow-elevation">
                  <CardHeader>
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                  </CardContent>
                </Card>
                <Card className="border-none shadow-elevation">
                  <CardHeader>
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p className="font-medium">Error al cargar datos</p>
              <p>{error}</p>
              <p className="mt-2">Por favor, verifica tu conexión e intenta nuevamente.</p>
            </div>
          ) : metrics ? (
            <>
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4">Resumen Financiero</h3>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-8">
                  <KpiCard 
                    title="Ventas Mensuales" 
                    value={metrics.salesMetrics.hasSalesData ? 
                      formatCurrency(metrics.salesMetrics.totalSales) : "No disponible"} 
                    trend={metrics.salesMetrics.hasSalesData ? 
                      `${metrics.salesMetrics.salesChange > 0 ? '+' : ''}${metrics.salesMetrics.salesChange.toFixed(1)}%` : "--"}
                    trendDirection={metrics.salesMetrics.hasSalesData && metrics.salesMetrics.salesChange > 0 ? "up" : "down"}
                    icon={<BarChart2 />}
                    color="blue"
                  />
                  
                  <KpiCard 
                    title="Margen de Beneficio" 
                    value={metrics.profitMetrics.hasData ? 
                      `${metrics.profitMetrics.grossMargin.toFixed(1)}%`
