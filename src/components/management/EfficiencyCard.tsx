
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface EfficiencyCardProps {
  title: string;
  value: string;
  trend: string;
  status: "positive" | "negative" | "neutral";
}

export const EfficiencyCard = ({ title, value, trend, status }: EfficiencyCardProps) => {
  const statusColor = status === "positive" 
    ? "text-green-600" 
    : status === "negative" 
      ? "text-red-600" 
      : "text-gray-600";
  
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className={`text-sm ${statusColor}`}>
          {trend}
        </div>
      </CardContent>
    </Card>
  );
};
