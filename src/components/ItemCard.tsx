
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Item } from "@/types";
import { differenceInDays, format } from "date-fns";
import { tr } from "date-fns/locale";
import { StatusBadge } from "./StatusBadge";
import { useItems } from "@/context/ItemContext";
import { getCategoryIcon } from "@/utils/categoryUtils";

interface ItemCardProps {
  item: Item;
  onClick?: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
  const { getItemStatus } = useItems();
  const status = getItemStatus(item);
  const daysRemaining = differenceInDays(item.expirationDate, new Date());
  const CategoryIcon = getCategoryIcon(item.category);

  // Define background color based on status
  const getCardColorClass = () => {
    if (status === 'danger') return 'border-l-status-danger bg-status-danger/5';
    if (status === 'warning') return 'border-l-status-warning bg-status-warning/5';
    return 'border-l-status-safe bg-status-safe/5';
  };

  return (
    <Card 
      className={`hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 ${getCardColorClass()}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <CategoryIcon className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="font-medium text-lg">{item.name}</h3>
              <p className="text-sm text-muted-foreground">
                Son Kullanma: {format(item.expirationDate, "d MMMM yyyy", { locale: tr })}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <StatusBadge status={status} size="sm" />
            <span className={`text-sm font-medium ${
              status === 'danger' 
                ? 'text-status-danger' 
                : status === 'warning' 
                  ? 'text-status-warning' 
                  : 'text-status-safe'
            }`}>
              {daysRemaining === 0 && "Bugün"}
              {daysRemaining > 0 && `${daysRemaining} gün kaldı`}
              {daysRemaining < 0 && `${Math.abs(daysRemaining)} gün geçti`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
