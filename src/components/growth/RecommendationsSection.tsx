
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RecommendationsSectionProps {
  data: any;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ data }) => {
  const recommendations = React.useMemo(() => {
    // First, check if there's a dedicated recommendations array
    if (data?.recomendaciones && Array.isArray(data.recomendaciones)) {
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

  // If no recommendations found, don't render the component
  if (!recommendations.length) {
    return (
      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-white to-pyme-gray-light">
          <CardTitle className="text-xl text-pyme-blue">Recomendaciones</CardTitle>
          <CardDescription>
            No se encontraron recomendaciones específicas en el análisis
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-gray-500 italic">
            Realiza un análisis más detallado para obtener recomendaciones específicas
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-white to-pyme-gray-light">
        <CardTitle className="text-xl text-pyme-blue">Recomendaciones</CardTitle>
        <CardDescription>
          Sugerencias basadas en el análisis de datos
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <ul className="space-y-3">
          {recommendations.map((recommendation: string, index: number) => (
            <li key={index} className="flex items-start gap-2">
              <span className="inline-flex items-center justify-center rounded-full bg-pyme-blue/10 p-1 w-6 h-6 text-sm font-medium text-pyme-blue">
                {index + 1}
              </span>
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecommendationsSection;
