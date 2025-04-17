
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

interface ItemsHeaderProps {
  pageTitle: string;
  categoryFilter: string;
}

export const ItemsHeader: React.FC<ItemsHeaderProps> = ({ 
  pageTitle, 
  categoryFilter 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
        <p className="text-muted-foreground">
          {categoryFilter !== "all" 
            ? `${pageTitle} kategorisindeki acil durum malzemelerinizi görüntüleyin` 
            : "Tüm acil durum malzemelerinizi görüntüleyin"}
        </p>
      </div>
      <Button
        size="lg"
        className="gap-2"
        onClick={() => navigate("/add")}
      >
        <PlusCircle className="h-5 w-5" />
        Yeni Öğe Ekle
      </Button>
    </div>
  );
};
