
import React from "react";
import { useItems } from "@/context/ItemContext";
import { getCategoryOptions } from "@/utils/categoryUtils";
import { useItemFilters } from "./hooks/useItemFilters";
import { ItemsHeader } from "./components/ItemsHeader";
import { SearchBar } from "./components/SearchBar";
import { ItemsFilters } from "./components/ItemsFilters";
import { NoItemsFound } from "./components/NoItemsFound";
import { ItemsListComponent } from "./components/ItemsList";

const ItemsPage: React.FC = () => {
  const { items, getItemStatus } = useItems();
  const categoryOptions = getCategoryOptions();
  
  const {
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
  } = useItemFilters({ items, getItemStatus });

  const pageTitle = categoryFilter !== "all" 
    ? categoryOptions.find(option => option.value === categoryFilter)?.label || "Öğeler"
    : "Öğeler";

  return (
    <div className="space-y-6">
      <ItemsHeader pageTitle={pageTitle} categoryFilter={categoryFilter} />
      
      <SearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFilters={showFilters}
        toggleFilters={toggleFilters}
      />

      {showFilters && (
        <ItemsFilters
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          daysFilter={daysFilter}
          setDaysFilter={setDaysFilter}
          searchQuery={searchQuery}
          resetFilters={resetFilters}
          categoryFromUrl={categoryFromUrl}
        />
      )}

      {filteredItems.length === 0 ? (
        <NoItemsFound 
          hasItems={items.length > 0} 
          resetFilters={resetFilters} 
        />
      ) : (
        <ItemsListComponent items={filteredItems} />
      )}
    </div>
  );
};

export default ItemsPage;
