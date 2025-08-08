import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden border border-osslt-purple/20", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-3xl font-bold text-osslt-purple">{value}</h2>
              {trend && trendValue && (
                <p
                  className={cn(
                    "text-xs font-medium",
                    trend === "up" && "text-green-600",
                    trend === "down" && "text-red-600",
                    trend === "neutral" && "text-gray-500"
                  )}
                >
                  <span className="mr-1">
                    {trend === "up" && "↑"}
                    {trend === "down" && "↓"}
                    {trend === "neutral" && "→"}
                  </span>
                  {trendValue}
                </p>
              )}
            </div>
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>
          <div className="rounded-full bg-gradient-to-r from-osslt-purple/20 to-osslt-dark-purple/20 p-3">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 