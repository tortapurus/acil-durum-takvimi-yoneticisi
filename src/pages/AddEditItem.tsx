
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useItems } from "@/context/ItemContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, ArrowLeft, Trash2 } from "lucide-react";
import { getCategoryOptions } from "@/utils/categoryUtils";
import { Category } from "@/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const AddEditItem: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItemById, addItem, updateItem, deleteItem } = useItems();
  const isEditMode = Boolean(id);
  
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("food");
  const [expirationDate, setExpirationDate] = useState<Date>(new Date());
  const [reminderDate, setReminderDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [nameError, setNameError] = useState("");
  
  const categoryOptions = getCategoryOptions();

  useEffect(() => {
    if (isEditMode && id) {
      const item = getItemById(id);
      if (item) {
        setName(item.name);
        setCategory(item.category);
        setExpirationDate(item.expirationDate);
        setReminderDate(item.reminderDate);
        setNotes(item.notes || "");
        setImageUrl(item.imageUrl || "");
      } else {
        // Item not found, redirect to items list
        navigate("/items");
      }
    } else {
      // In create mode, set reminder date to a week before expiration by default
      const defaultExpiry = new Date();
      defaultExpiry.setMonth(defaultExpiry.getMonth() + 3); // Default 3 months expiry
      setExpirationDate(defaultExpiry);
      
      const defaultReminder = new Date(defaultExpiry);
      defaultReminder.setDate(defaultReminder.getDate() - 7); // Default 7 days before
      setReminderDate(defaultReminder);
    }
  }, [id, isEditMode, getItemById, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!name.trim()) {
      setNameError("Öğe adı gereklidir");
      return;
    }
    
    if (isEditMode && id) {
      updateItem(id, {
        name,
        category,
        expirationDate,
        reminderDate,
        notes: notes || undefined,
        imageUrl: imageUrl || undefined,
      });
    } else {
      addItem({
        name,
        category,
        expirationDate,
        reminderDate,
        notes: notes || undefined,
        imageUrl: imageUrl || undefined,
      });
    }
    
    navigate("/items");
  };

  const handleDelete = () => {
    if (isEditMode && id) {
      deleteItem(id);
      navigate("/items");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Öğeyi Düzenle" : "Yeni Öğe Ekle"}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Öğe Adı<span className="text-destructive">*</span>
            </Label>
            <Input 
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
              }}
              placeholder="Öğe adını girin"
              className={nameError ? "border-destructive" : ""}
            />
            {nameError && (
              <p className="text-sm text-destructive">{nameError}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">
              Kategori<span className="text-destructive">*</span>
            </Label>
            <Select 
              value={category} 
              onValueChange={(value) => setCategory(value as Category)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="expirationDate">
                Son Kullanma Tarihi<span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="expirationDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expirationDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expirationDate ? (
                      format(expirationDate, "PPP", { locale: tr })
                    ) : (
                      <span>Tarih seçin</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={expirationDate}
                    onSelect={(date) => date && setExpirationDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reminderDate">
                Hatırlatma Başlangıç Tarihi<span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="reminderDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !reminderDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {reminderDate ? (
                      format(reminderDate, "PPP", { locale: tr })
                    ) : (
                      <span>Tarih seçin</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={reminderDate}
                    onSelect={(date) => date && setReminderDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notlar</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Öğe hakkında notlar ekleyin"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Görsel URL (isteğe bağlı)</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Görsel URL'si"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="order-2 sm:order-1">
            {isEditMode && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" type="button">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Sil
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Bu öğeyi silmek istediğinizden emin misiniz?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bu işlem geri alınamaz. Bu öğe kalıcı olarak silinecektir.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>İptal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                      Sil
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          <div className="flex gap-3 order-1 sm:order-2">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => navigate(-1)}
            >
              İptal
            </Button>
            <Button type="submit">
              {isEditMode ? "Güncelle" : "Kaydet"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddEditItem;
