import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  variant?: "default" | "primary" | "accent" | "warning";
}

const variantStyles = {
  default: "bg-card",
  primary: "bg-primary/5",
  accent: "bg-accent/10",
  warning: "bg-warning/10",
};

const iconVariantStyles = {
  default: "bg-secondary text-foreground",
  primary: "gradient-primary text-primary-foreground",
  accent: "bg-accent text-accent-foreground",
  warning: "bg-warning text-warning-foreground",
};

const StatCard = ({ title, value, icon: Icon, trend, trendUp, variant = "default" }: StatCardProps) => {
  return (
    <div className={`rounded-xl border p-5 shadow-card transition-all duration-200 hover:shadow-elevated ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-card-foreground">{value}</p>
          {trend && (
            <p className={`text-xs font-medium ${trendUp ? "text-success" : "text-destructive"}`}>
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        <div className={`rounded-lg p-2.5 ${iconVariantStyles[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
