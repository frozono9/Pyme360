
import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface KpiCardProps {
  title: string;
  value: string;
  trend: string;
  trendDirection: "up" | "down";
  icon: ReactNode;
  color: "blue" | "green" | "amber" | "red";
}

export const KpiCard = ({ title, value, trend, trendDirection, icon, color }: KpiCardProps) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  };
  
  const trendIconClass = trendDirection === "up" ? "text-green-500" : "text-red-500";
  const TrendIcon = trendDirection === "up" ? TrendingUp : TrendingDown;
  
  return (
    <Card className="border-none shadow-elevation hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 mb-2">
          <div className="text-3xl font-bold">{value}</div>
          <div className="flex items-center mb-1">
            <TrendIcon className={`h-4 w-4 mr-1 ${trendIconClass}`} />
            <span className={trendIconClass}>{trend}</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${color === "blue" ? "bg-blue-500" : color === "green" ? "bg-green-500" : color === "amber" ? "bg-amber-500" : "bg-red-500"}`}
            style={{ width: "70%" }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};
