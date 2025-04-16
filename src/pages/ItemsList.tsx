
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useItems } from "@/context/ItemContext";
import { ItemCard } from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Search, Filter, LayoutGrid, Clock } from "lucide-react";
import { getCategoryOptions } from "@/utils/categoryUtils";
import { differenceInDays } from "date-fns";
import { Toggle } from "@/components/ui/toggle";
import { Card, CardContent } from "@/components/ui/card";

const ItemsList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, getItemStatus } = useItems();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [daysFilter, setDaysFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Parse category from URL query param
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get("category");

  // Set category filter from URL on mount
  useEffect(() => {
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
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;

      // Filter by status
      const itemStatus = getItemStatus(item);
      const matchesStatus = statusFilter === "all" || itemStatus === statusFilter;

      // Filter by days
      const daysRemaining = differenceInDays(item.expirationDate, new Date());
      const matchesDays = 
        daysFilter === "all" || 
        (daysFilter === "today" && daysRemaining === 0) ||
        (daysFilter === "week" && daysRemaining > 0 && daysRemaining <= 7) ||
        (daysFilter === "month" && daysRemaining > 0 && daysRemaining <= 30) ||
        (daysFilter === "expired" && daysRemaining < 0);

      return matchesSearch && matchesCategory && matchesStatus && matchesDays;
    });
  }, [items, searchQuery, categoryFilter, statusFilter, daysFilter, getItemStatus]);

  const categoryOptions = getCategoryOptions();

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const pageTitle = categoryFilter !== "all" 
    ? categoryOptions.find(option => option.value === categoryFilter)?.label || "Öğeler"
    : "Öğeler";

  return (
    <div className="space-y-6">
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

      {/* Search and Filter Toggle */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
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
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2"
          onClick={toggleFilters}
        >
          <Filter className="h-4 w-4" />
          {showFilters ? "Filtreleri Gizle" : "Filtreleri Göster"}
        </Button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
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
            
            {(searchQuery || categoryFilter !== "all" || statusFilter !== "all" || daysFilter !== "all") && (
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter(categoryFromUrl || "all");
                    setStatusFilter("all");
                    setDaysFilter("all");
                  }}
                >
                  Filtreleri Temizle
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
                setCategoryFilter(categoryFromUrl || "all");
                setStatusFilter("all");
                setDaysFilter("all");
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
