
import { BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface KpiPredictionEntryProps {
  className?: string;
}

export const KpiPredictionEntry = ({ className }: KpiPredictionEntryProps) => {
  const navigate = useNavigate();
  
  const handleNavigateToPredictor = () => {
    navigate("/crecimiento/predictor");
  };
  
  return (
    <Card className={`bg-gradient-to-br from-blue-50 to-blue-100 border-none shadow-md ${className}`}>
      <CardContent className="p-6">
        <h3 className="text-2xl font-bold text-blue-700 mb-3">Predicción de KPIs</h3>
        <p className="text-blue-900 mb-5">
          Visualiza el comportamiento futuro de tus indicadores clave basado en tendencias y proyecciones.
        </p>
        <Button 
          onClick={handleNavigateToPredictor}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
        >
          <BarChart2 className="mr-2 h-5 w-5" />
          Predecir tendencias de KPIs
        </Button>
      </CardContent>
    </Card>
  );
};
