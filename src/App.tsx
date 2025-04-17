
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ItemProvider } from "./context/ItemContext";
import { MainLayout } from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import ItemsPage from "./pages/items";
import ItemDetail from "./pages/ItemDetail";
import AddEditItem from "./pages/AddEditItem";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import EmergencyPhones from "./pages/EmergencyPhones";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ItemProvider>
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/items" element={<ItemsPage />} />
              <Route path="/items/:id" element={<ItemDetail />} />
              <Route path="/items/:id/edit" element={<AddEditItem />} />
              <Route path="/add" element={<AddEditItem />} />
              <Route path="/emergency-phones" element={<EmergencyPhones />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </ItemProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
