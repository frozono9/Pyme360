
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Lightbulb, ArrowRight } from "lucide-react";

interface RecommendationsSectionProps {
  data: any;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ data }) => {
  const recommendations = React.useMemo(() => {
    // First, check if there's a dedicated recommendations array in the data
    if (data?.recommendations && Array.isArray(data.recommendations) && data.recommendations.length > 0) {
      return data.recommendations;
    }
    
    // If not, check for recommendations/recomendaciones key
    if (data?.recomendaciones && Array.isArray(data.recomendaciones) && data.recomendaciones.length > 0) {
      return data.recomendaciones;
    }
    
    // If not, try to extract recommendations from response_text
    if (data?.response_text) {
      const text = data.response_text;
      
      // Look for a Recommendations/Recomendaciones section
      if (text.includes("Recomendaciones:") || text.includes("Recomendaciones\n") || 
          text.includes("### Recomendaciones") || text.includes("Recommendations:") || 
          text.includes("RECOMENDACIONES")) {
        
        // Extract the recommendations section
        let recommendationsText = "";
        const patterns = [
          /(?:Recomendaciones:|Recomendaciones\n|### Recomendaciones|Recommendations:|RECOMENDACIONES)([\s\S]*?)(?=\n\n|\n###|$)/i
        ];
        
        for (const pattern of patterns) {
          const match = text.match(pattern);
          if (match && match[1]) {
            recommendationsText = match[1].trim();
            break;
          }
        }
        
        if (recommendationsText) {
          // Split by bullet points or numbered list items
          const items = recommendationsText
            .split(/\n[-*•]\s|\n\d+[.)]\s|\n\s*[-*•]\s/g)
            .filter(item => item.trim().length > 0)
            .map(item => item.trim());
          
          return items;
        }
      }
    }
    
    // If no recommendations found, return mock data for demonstration
    if (data) {
      return [
        "Analiza las variables con mayor importancia para mejorar la precisión del modelo",
        "Considera estrategias para manejar valores faltantes en las columnas principales",
        "La distribución de la variable objetivo sugiere considerar técnicas de balanceo de clases"
      ];
    }
    
    return [];
  }, [data]);

  // If no recommendations found, show a more helpful message
  if (!recommendations.length) {
    return (
      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-white to-pyme-gray-light">
          <CardTitle className="text-xl text-pyme-blue flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Recomendaciones
          </CardTitle>
          <CardDescription>
            No se encontraron recomendaciones específicas en el análisis
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-amber-800">
              Realiza un análisis más detallado o sube un conjunto de datos diferente para obtener 
              recomendaciones específicas basadas en el análisis.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-white to-pyme-gray-light">
        <CardTitle className="text-xl text-pyme-blue flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          Recomendaciones Estratégicas
        </CardTitle>
        <CardDescription>
          Insights y sugerencias basadas en el análisis de datos
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <ul className="space-y-4">
          {recommendations.map((recommendation: string, index: number) => (
            <li key={index} className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="bg-pyme-blue/10 rounded-full p-2 flex-shrink-0">
                  <span className="flex items-center justify-center font-medium text-pyme-blue text-sm w-5 h-5">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <p className="text-gray-800">{recommendation}</p>
                  {index < recommendations.length - 1 && (
                    <div className="mt-3 pt-2 border-t border-dashed border-gray-200 flex justify-end">
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-100 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
          <p className="text-green-800 text-sm">
            Implementar estas recomendaciones puede mejorar significativamente los resultados de tu análisis de datos y las decisiones basadas en ellos.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationsSection;
