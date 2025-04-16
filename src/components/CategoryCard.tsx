
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategorySummary } from "@/types";
import { getCategoryLabel, getCategoryIcon } from "@/utils/categoryUtils";

interface CategoryCardProps {
  summary: CategorySummary;
  onClick?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ summary, onClick }) => {
  const Icon = getCategoryIcon(summary.category);

  return (
    <Card 
      className={`
        hover:shadow-md transition-all duration-200 cursor-pointer
        ${summary.expiringSoon > 0 ? 'border-status-warning' : ''}
      `}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Icon className="h-5 w-5" />
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
        </div>
      </CardContent>
    </Card>
  );
};
