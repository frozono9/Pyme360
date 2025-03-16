
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RecommendationsSectionProps {
  data: any;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ data }) => {
  const recommendations = React.useMemo(() => {
    if (data?.recomendaciones && Array.isArray(data.recomendaciones)) {
      return data.recomendaciones;
    }
    
    // If recomendaciones doesn't exist, try to extract them from response_text
    if (data?.response_text) {
      // Try to find a recommendations section
      const text = data.response_text;
      if (text.includes("Recomendaciones") || text.includes("recomendaciones")) {
        // Extract the recommendations section
        const recommendationsSection = text.split(/Recomendaciones|recomendaciones/i)[1];
        if (recommendationsSection) {
          // Split by bullet points or numbered list
          const items = recommendationsSection.split(/\n[-*]\s|\n\d+\.\s/).filter(Boolean);
          return items.map(item => item.trim());
        }
      }
    }
    
    return [];
  }, [data]);

  if (!recommendations.length) {
    return null;
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
