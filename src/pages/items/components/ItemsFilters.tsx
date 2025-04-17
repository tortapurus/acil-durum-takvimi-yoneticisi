
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LayoutGrid, Clock } from "lucide-react";
import { getCategoryOptions } from "@/utils/categoryUtils";

interface ItemsFiltersProps {
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  daysFilter: string;
  setDaysFilter: (days: string) => void;
  searchQuery: string;
  resetFilters: () => void;
  categoryFromUrl: string | null;
}

export const ItemsFilters: React.FC<ItemsFiltersProps> = ({
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  daysFilter,
  setDaysFilter,
  searchQuery,
  resetFilters,
  categoryFromUrl,
}) => {
  const categoryOptions = getCategoryOptions();
  const hasActiveFilters = searchQuery || categoryFilter !== "all" || statusFilter !== "all" || daysFilter !== "all";

  return (
    <Card className="border border-border/50">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <LayoutGrid className="h-4 w-4" />
              Kategori
            </label>
            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tüm kategoriler" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm kategoriler</SelectItem>
                {categoryOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Durum</label>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tüm durumlar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm durumlar</SelectItem>
                <SelectItem value="safe">Güvenli</SelectItem>
                <SelectItem value="warning">Yaklaşıyor</SelectItem>
                <SelectItem value="danger">Süresi Dolmuş</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Zaman
            </label>
            <Select
              value={daysFilter}
              onValueChange={setDaysFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tüm zamanlar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm zamanlar</SelectItem>
                <SelectItem value="today">Bugün süresi dolanlar</SelectItem>
                <SelectItem value="week">7 gün içinde süresi dolacaklar</SelectItem>
                <SelectItem value="month">30 gün içinde süresi dolacaklar</SelectItem>
                <SelectItem value="expired">Süresi geçmiş olanlar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {hasActiveFilters && (
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetFilters}
            >
              Filtreleri Temizle
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
