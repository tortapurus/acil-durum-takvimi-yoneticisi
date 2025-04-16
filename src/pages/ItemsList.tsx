
import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useItems } from "@/context/ItemContext";
import { ItemCard } from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Search, Filter } from "lucide-react";
import { getCategoryOptions } from "@/utils/categoryUtils";
import { ItemStatus } from "@/types";

const ItemsList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, getItemStatus } = useItems();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Parse category from URL query param
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get("category");

  // Set category filter from URL on mount
  React.useEffect(() => {
    if (categoryFromUrl) {
      setCategoryFilter(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Filter by search query
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Filter by category
      const matchesCategory = categoryFilter
        ? item.category === categoryFilter
        : true;

      // Filter by status
      const itemStatus = getItemStatus(item);
      const matchesStatus = statusFilter
        ? itemStatus === statusFilter
        : true;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, searchQuery, categoryFilter, statusFilter, getItemStatus]);

  const categoryOptions = getCategoryOptions();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Öğeler</h1>
          <p className="text-muted-foreground">
            Tüm acil durum malzemelerinizi görüntüleyin
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

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Öğe ara..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={setCategoryFilter}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Tüm kategoriler" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tüm kategoriler</SelectItem>
            {categoryOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Tüm durumlar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tüm durumlar</SelectItem>
            <SelectItem value="safe">Güvenli</SelectItem>
            <SelectItem value="warning">Yaklaşıyor</SelectItem>
            <SelectItem value="danger">Süresi Dolmuş</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="bg-muted/50 rounded-lg p-8 text-center space-y-4">
          <h2 className="text-xl font-medium">Sonuç Bulunamadı</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Arama veya filtre kriterlerinize uygun öğe bulunamadı. Farklı bir arama terimi kullanmayı veya filtreleri sıfırlamayı deneyin.
          </p>
          {items.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("");
                setStatusFilter("");
              }}
            >
              Filtreleri Temizle
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={() => navigate(`/items/${item.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemsList;
