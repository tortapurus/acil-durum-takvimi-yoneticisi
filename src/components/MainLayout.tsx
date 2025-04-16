
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  ListChecks, 
  PlusCircle, 
  Settings,
  LayoutDashboard,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, isActive }) => {
  return (
    <Link to={to}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2",
          isActive ? "bg-primary/10 text-primary" : ""
        )}
      >
        <Icon className="h-5 w-5" />
        {label}
      </Button>
    </Link>
  );
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  const menuItems = [
    { path: "/", icon: LayoutDashboard, label: "Ana Sayfa" },
    { path: "/items", icon: ListChecks, label: "Öğeler" },
    { path: "/add", icon: PlusCircle, label: "Yeni Ekle" },
    { path: "/settings", icon: Settings, label: "Ayarlar" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-40">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Acil Durum Takvimi</h2>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => (
                <NavItem
                  key={item.path}
                  to={item.path}
                  icon={item.icon}
                  label={item.label}
                  isActive={location.pathname === item.path}
                />
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Acil Durum Takvimi</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.path}
            />
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="md:hidden h-14" />
        {children}
      </main>
    </div>
  );
};
