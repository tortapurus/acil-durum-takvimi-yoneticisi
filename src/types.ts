
export interface Item {
  id: string;
  name: string;
  category: string; // Changed from Category type to string to allow custom categories
  location?: string;
  expirationDate: Date;
  reminderDate: Date;
  notes?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Updated to store custom categories
export interface CustomCategory {
  id: string;
  value: string;
  label: string;
  icon: string;
}

export type Category = 
  | "food" 
  | "water" 
  | "medical" 
  | "documents" 
  | "tools" 
  | "communication" 
  | "clothing" 
  | "other";

export type ItemStatus = "safe" | "warning" | "danger";

export interface CategorySummary {
  category: string; // Changed from Category to string to allow custom categories
  totalItems: number;
  expiringSoon: number;
  expired: number;
}

// Update AppSettings to include custom categories
export interface AppSettings {
  warningThreshold: number;
  reminderDays: number;
  notificationsEnabled: boolean;
  customCategories: CustomCategory[];
}
