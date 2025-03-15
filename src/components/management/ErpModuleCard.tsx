
import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonCustom } from "@/components/ui/button-custom";

export interface ErpModuleCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  color: "blue" | "indigo" | "violet" | "amber";
}

export const ErpModuleCard = ({ title, description, icon, color }: ErpModuleCardProps) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    indigo: "from-indigo-500 to-indigo-600",
    violet: "from-violet-500 to-violet-600",
    amber: "from-amber-500 to-amber-600",
  };
  
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className={`h-1.5 w-full bg-gradient-to-r ${colorClasses[color]}`}></div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center 
            ${color === "blue" ? "bg-blue-100 text-blue-600" : 
              color === "indigo" ? "bg-indigo-100 text-indigo-600" : 
              color === "violet" ? "bg-violet-100 text-violet-600" : 
              "bg-amber-100 text-amber-600"}`}>
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <ButtonCustom variant="ghost" className="p-0 h-auto hover:bg-transparent hover:underline" size="sm">
          <span className="text-sm">Ver más</span>
          <ArrowRight className="h-3 w-3 ml-1" />
        </ButtonCustom>
      </CardFooter>
    </Card>
  );
};
