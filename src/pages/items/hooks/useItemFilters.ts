
import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Item } from "@/types";
import { differenceInDays } from "date-fns";

interface UseItemFiltersProps {
  items: Item[];
  getItemStatus: (item: Item) => "safe" | "warning" | "danger";
}

export const useItemFilters = ({ items, getItemStatus }: UseItemFiltersProps) => {
  const location = useLocation();
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

  const resetFilters = () => {
    setSearchQuery("");
    setCategoryFilter(categoryFromUrl || "all");
    setStatusFilter("all");
    setDaysFilter("all");
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return {
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    daysFilter,
    setDaysFilter,
    showFilters,
    toggleFilters,
    categoryFromUrl,
    filteredItems,
    resetFilters
  };
};
