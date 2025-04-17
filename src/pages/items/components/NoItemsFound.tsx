
import React from "react";
import { Button } from "@/components/ui/button";

interface NoItemsFoundProps {
  hasItems: boolean;
  resetFilters: () => void;
}

export const NoItemsFound: React.FC<NoItemsFoundProps> = ({ 
  hasItems, 
  resetFilters 
}) => {
  return (
    <div className="bg-muted/50 rounded-lg p-8 text-center space-y-4">
      <h2 className="text-xl font-medium">Sonuç Bulunamadı</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        Arama veya filtre kriterlerinize uygun öğe bulunamadı. Farklı bir arama terimi kullanmayı veya filtreleri sıfırlamayı deneyin.
      </p>
      {hasItems && (
        <Button 
          variant="outline" 
          onClick={resetFilters}
        >
          Filtreleri Temizle
        </Button>
      )}
    </div>
  );
};
