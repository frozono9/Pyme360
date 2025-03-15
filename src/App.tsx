
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import AboutUs from "@/pages/AboutUs";
import NotFound from "@/pages/NotFound";
import Certification from "@/pages/Certification";
import ManagementModule from "@/pages/ManagementModule";
import FinancingModule from "@/pages/FinancingModule";
import ComplianceModule from "@/pages/ComplianceModule";
import GrowthModule from "@/pages/GrowthModule";
import FinancingPreparation from "@/pages/FinancingPreparation";
import FinancingMarketplace from "@/pages/FinancingMarketplace";
import CreditScore from "@/pages/CreditScore";
import EmployeeSearchModule from "@/pages/EmployeeSearchModule";
import DatabaseView from "@/pages/DatabaseView";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
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
        <Route path="/financiamiento/credito" element={<CreditScore />} />
        <Route path="/cumplimiento" element={<ComplianceModule />} />
        <Route path="/crecimiento" element={<GrowthModule />} />
        <Route path="/busqueda-empleados" element={<EmployeeSearchModule />} />
        <Route path="/database" element={<DatabaseView />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
