
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ItemProvider } from "./context/ItemContext";
import { MainLayout } from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import ItemsList from "./pages/ItemsList";
import ItemDetail from "./pages/ItemDetail";
import AddEditItem from "./pages/AddEditItem";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

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
              <Route path="/items" element={<ItemsList />} />
              <Route path="/items/:id" element={<ItemDetail />} />
              <Route path="/items/:id/edit" element={<AddEditItem />} />
              <Route path="/add" element={<AddEditItem />} />
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
