
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Certification from "./pages/Certification";
import CreditScore from "./pages/CreditScore";
import NotFound from "./pages/NotFound";
import FinancingModule from "./pages/FinancingModule";
import ManagementModule from "./pages/ManagementModule";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/acceso" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/certificacion" element={<Certification />} />
          <Route path="/credit-score" element={<CreditScore />} />
          <Route path="/financiamiento" element={<FinancingModule />} />
          <Route path="/gestion" element={<ManagementModule />} />
          <Route path="/marketplace-financiamiento" element={<FinancingModule />} />
          <Route path="/preparacion-financiamiento" element={<FinancingModule />} />
          <Route path="/busqueda-empleados" element={<ManagementModule />} />
          <Route path="/cumplimiento" element={<NotFound />} />
          <Route path="/crecimiento" element={<NotFound />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
