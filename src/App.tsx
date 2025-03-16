
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import AboutUs from "@/pages/AboutUs";
import NotFound from "@/pages/NotFound";
import Certification from "@/pages/Certification";
import ManagementModule from "@/pages/ManagementModule";
import FinancingModule from "@/pages/FinancingModule";
import GrowthModule from "@/pages/GrowthModule";
import FinancingPreparation from "@/pages/FinancingPreparation";
import FinancingMarketplace from "@/pages/FinancingMarketplace";
import FinancingAiAdvisor from "@/pages/FinancingAiAdvisor";
import CreditScore from "@/pages/CreditScore";
import EmployeeSearchModule from "@/pages/EmployeeSearchModule";
import DatabaseView from "@/pages/DatabaseView";
import { Toaster } from "@/components/ui/toaster";
import ChatbotAssistant from "@/components/ChatbotAssistant";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/acceso" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/nosotros" element={<AboutUs />} />
          <Route path="/certificacion" element={<Certification />} />
          <Route path="/gestion" element={<ManagementModule />} />
          <Route path="/financiamiento" element={<FinancingModule />} />
          <Route path="/financiamiento/preparacion" element={<FinancingPreparation />} />
          <Route path="/financiamiento/marketplace" element={<FinancingMarketplace />} />
          <Route path="/financiamiento/asesor-ia" element={<FinancingAiAdvisor />} />
          <Route path="/financiamiento/credito" element={<CreditScore />} />
          <Route path="/crecimiento/*" element={<GrowthModule />} />
          <Route path="/busqueda-empleados" element={<EmployeeSearchModule />} />
          <Route path="/database" element={<DatabaseView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <ChatbotAssistant />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
