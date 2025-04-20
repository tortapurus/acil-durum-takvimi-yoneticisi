
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategorySummary } from "@/types";
import { getCategoryLabel, getCategoryIcon, getCategoryIconStyle } from "@/utils/categoryUtils";

interface CategoryCardProps {
  summary: CategorySummary;
  onClick?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ summary, onClick }) => {
  // No type issues here since getCategoryIcon and getCategoryIconStyle now accept string
  const Icon = getCategoryIcon(summary.category);
  const iconStyle = getCategoryIconStyle(summary.category);
  
  // Determine background color class based on status
  const getCardColorClass = () => {
    if (summary.expired > 0) return "border-l-status-danger bg-status-danger/5";
    if (summary.expiringSoon > 0) return "border-l-status-warning bg-status-warning/5";
    return "border-l-status-safe bg-status-safe/5";
  };

  return (
    <Card 
      className={`
        hover:shadow-md transition-all duration-200 cursor-pointer border-l-4
        ${getCardColorClass()}
      `}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 blur-sm opacity-30">
              <Icon className={`h-5 w-5 ${iconStyle}`} />
            </div>
            <Icon className={`h-5 w-5 ${iconStyle} relative z-10`} />
          </div>
          {getCategoryLabel(summary.category)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <div className="text-sm text-muted-foreground">
            Toplam: <span className="font-medium text-foreground">{summary.totalItems}</span>
          </div>
          {summary.expiringSoon > 0 && (
            <div className="text-sm text-status-warning font-medium">
              Son kullanma yaklaşıyor: {summary.expiringSoon}
            </div>
          )}
          {summary.expired > 0 && (
            <div className="text-sm text-status-danger font-medium">
              Süresi dolmuş: {summary.expired}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
