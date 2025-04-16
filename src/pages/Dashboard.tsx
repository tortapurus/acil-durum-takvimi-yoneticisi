
import React from "react";
import { useNavigate } from "react-router-dom";
import { useItems } from "@/context/ItemContext";
import { CategoryCard } from "@/components/CategoryCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { getCategorySummaries, items } = useItems();
  const categorySummaries = getCategorySummaries();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Ana Sayfa</h1>
          <p className="text-muted-foreground">
            Acil durum malzemelerinizi takip edin
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

      {items.length === 0 ? (
        <div className="bg-muted/50 rounded-lg p-8 text-center space-y-4">
          <h2 className="text-xl font-medium">Henüz Öğe Eklenmemiş</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Acil durum malzemelerinizi takip etmek için listenize yeni öğeler ekleyin. Böylece son kullanma tarihlerini kolayca izleyebilirsiniz.
          </p>
          <Button 
            size="lg" 
            className="gap-2 mt-4"
            onClick={() => navigate("/add")}
          >
            <PlusCircle className="h-5 w-5" />
            İlk Öğeyi Ekle
          </Button>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold">Kategori Özeti</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorySummaries.map((summary) => (
              <CategoryCard
                key={summary.category}
                summary={summary}
                onClick={() => navigate(`/items?category=${summary.category}`)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
