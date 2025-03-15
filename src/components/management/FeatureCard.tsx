
import { ReactNode } from "react";

export interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="glass-card p-6 hover:shadow-elevation transition-all duration-300">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pyme-blue/10 text-pyme-blue mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-pyme-gray-dark">{description}</p>
    </div>
  );
};
