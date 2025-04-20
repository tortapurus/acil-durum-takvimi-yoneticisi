
import React, { createContext, useContext, useState, useEffect } from "react";
import { Item, Category, ItemStatus, CategorySummary, AppSettings, CustomCategory } from "../types";
import { differenceInDays } from "date-fns";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  warningThreshold: 30, // 30 days
  reminderDays: 7, // 7 days
  notificationsEnabled: true,
  customCategories: [],
};

// Mock data for initial loading
const INITIAL_ITEMS: Item[] = [
  {
    id: uuidv4(),
    name: "İlk Yardım Kiti",
    category: "medical",
    expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    reminderDate: new Date(new Date().setMonth(new Date().getMonth() + 11)),
    notes: "Temel ilaçları ve bandajları içerir",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    name: "Konserve Gıda",
    category: "food",
    expirationDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    reminderDate: new Date(new Date().setDate(new Date().getDate() + 20)),
    notes: "6 adet konserve fasulye, 4 adet ton balığı",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    name: "Su Depolama",
    category: "water",
    expirationDate: new Date(new Date().setDate(new Date().getDate() - 5)),
    reminderDate: new Date(new Date().setDate(new Date().getDate() - 12)),
    notes: "10 litre içme suyu",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface ItemContextType {
  items: Item[];
  settings: AppSettings;
  getItemById: (id: string) => Item | undefined;
  addItem: (item: Omit<Item, "id" | "createdAt" | "updatedAt">) => void;
  updateItem: (id: string, updates: Partial<Omit<Item, "id" | "createdAt" | "updatedAt">>) => void;
  deleteItem: (id: string) => void;
  getCategorySummaries: () => CategorySummary[];
  getItemStatus: (item: Item) => ItemStatus;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  addCustomCategory: (category: Omit<CustomCategory, "id">) => void;
  deleteCustomCategory: (categoryId: string) => void;
}

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export const ItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Load items from localStorage on initial render
  useEffect(() => {
    const savedItems = localStorage.getItem("emergencyItems");
    const savedSettings = localStorage.getItem("emergencySettings");
    
    if (savedItems) {
      // Parse and fix dates which are serialized as strings
      const parsedItems = JSON.parse(savedItems).map((item: any) => ({
        ...item,
        expirationDate: new Date(item.expirationDate),
        reminderDate: new Date(item.reminderDate),
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));
      setItems(parsedItems);
    } else {
      // Use initial mock data if no saved items
      setItems(INITIAL_ITEMS);
    }

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("emergencyItems", JSON.stringify(items));
  }, [items]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("emergencySettings", JSON.stringify(settings));
  }, [settings]);

  const getItemById = (id: string) => {
    return items.find(item => item.id === id);
  };

  const addItem = (newItem: Omit<Item, "id" | "createdAt" | "updatedAt">) => {
    const item: Item = {
      ...newItem,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setItems(prevItems => [...prevItems, item]);
    toast.success("Öğe başarıyla eklendi.");
  };

  const updateItem = (
    id: string, 
    updates: Partial<Omit<Item, "id" | "createdAt" | "updatedAt">>
  ) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, ...updates, updatedAt: new Date() } 
          : item
      )
    );
    toast.success("Öğe başarıyla güncellendi.");
  };

  const deleteItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    toast.success("Öğe başarıyla silindi.");
  };

  const getItemStatus = (item: Item): ItemStatus => {
    const daysUntilExpiration = differenceInDays(
      item.expirationDate,
      new Date()
    );

    if (daysUntilExpiration < 0) {
      return "danger"; // Expired
    }
    if (daysUntilExpiration <= settings.warningThreshold) {
      return "warning"; // Approaching expiration
    }
    return "safe"; // Safe
  };

  const getCategorySummaries = (): CategorySummary[] => {
    // Get unique categories from items
    const categories = [...new Set(items.map(item => item.category))];
    
    return categories.map(category => {
      const categoryItems = items.filter(item => item.category === category);
      
      const expiringSoon = categoryItems.filter(item => {
        const status = getItemStatus(item);
        const daysUntilExpiration = differenceInDays(item.expirationDate, new Date());
        return status === "warning" && daysUntilExpiration >= 0;
      }).length;
      
      const expired = categoryItems.filter(item => {
        return getItemStatus(item) === "danger";
      }).length;
      
      return {
        category,
        totalItems: categoryItems.length,
        expiringSoon,
        expired,
      };
    });
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    toast.success("Ayarlar başarıyla güncellendi.");
  };

  const addCustomCategory = (category: Omit<CustomCategory, "id">) => {
    const newCategory = {
      ...category,
      id: uuidv4(),
    };
    
    setSettings(prev => ({
      ...prev,
      customCategories: [...(prev.customCategories || []), newCategory]
    }));
    toast.success("Yeni kategori eklendi");
  };

  const deleteCustomCategory = (categoryId: string) => {
    setSettings(prev => ({
      ...prev,
      customCategories: (prev.customCategories || []).filter(cat => cat.id !== categoryId)
    }));
    toast.success("Kategori silindi");
  };

  return (
    <ItemContext.Provider
      value={{
        items,
        settings,
        getItemById,
        addItem,
        updateItem,
        deleteItem,
        getCategorySummaries,
        getItemStatus,
        updateSettings,
        addCustomCategory,
        deleteCustomCategory,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};

export const useItems = () => {
  const context = useContext(ItemContext);
  if (context === undefined) {
    throw new Error("useItems must be used within an ItemProvider");
  }
  return context;
};
