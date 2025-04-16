
export interface Item {
  id: string;
  name: string;
  category: Category;
  expirationDate: Date;
  reminderDate: Date;
  notes?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
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
  category: Category;
  totalItems: number;
  expiringSoon: number;
  expired: number;
}

export interface AppSettings {
  warningThreshold: number; // Days before expiration to show warning status
  reminderDays: number; // Days before expiration to start reminders
  notificationsEnabled: boolean;
}
