
export interface AlertProps {
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
}

export const Alert = ({ title, description, severity }: AlertProps) => {
  const severityClasses = {
    high: "border-red-500 bg-red-50",
    medium: "border-amber-500 bg-amber-50",
    low: "border-blue-500 bg-blue-50",
  };
  
  const textClasses = {
    high: "text-red-700",
    medium: "text-amber-700",
    low: "text-blue-700",
  };
  
  return (
    <div className={`border-l-4 px-4 py-2 rounded-r ${severityClasses[severity]}`}>
      <div className={`font-medium ${textClasses[severity]}`}>{title}</div>
      <div className="text-sm text-gray-600">{description}</div>
    </div>
  );
};
