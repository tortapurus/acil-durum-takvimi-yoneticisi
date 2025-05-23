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
import { CalendarIcon, ArrowLeft, Trash2, Upload, X } from "lucide-react";
import { getCategoryOptions } from "@/utils/categoryUtils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const AddEditItem: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItemById, addItem, updateItem, deleteItem, settings } = useItems();
  const isEditMode = Boolean(id);
  
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>("food");
  const [expirationDate, setExpirationDate] = useState<Date>(new Date());
  const [reminderDate, setReminderDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [nameError, setNameError] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [location, setLocation] = useState("");
  
  const baseCategories = getCategoryOptions();
  const customCategories = settings.customCategories || [];
  const allCategories = [
    ...baseCategories,
    ...customCategories.map(c => ({ value: c.value, label: c.label }))
  ];
  
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
        if (item.imageUrl) {
          setPreviewUrl(item.imageUrl);
        }
        setLocation(item.location || "");
      } else {
        navigate("/items");
      }
    } else {
      const defaultExpiry = new Date();
      defaultExpiry.setMonth(defaultExpiry.getMonth() + 3);
      setExpirationDate(defaultExpiry);
      
      const defaultReminder = new Date(defaultExpiry);
      defaultReminder.setDate(defaultReminder.getDate() - 7);
      setReminderDate(defaultReminder);
    }
  }, [id, isEditMode, getItemById, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Görsel 5MB'dan küçük olmalıdır");
        return;
      }
      
      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl("");
    setImageUrl("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setNameError("Öğe adı gereklidir");
      return;
    }
    
    let finalImageUrl = imageUrl;
    if (selectedImage && previewUrl) {
      finalImageUrl = previewUrl;
    }
    
    if (isEditMode && id) {
      updateItem(id, {
        name,
        category,
        expirationDate,
        reminderDate,
        location: location || undefined,
        notes: notes || undefined,
        imageUrl: finalImageUrl || undefined,
      });
    } else {
      addItem({
        name,
        category,
        expirationDate,
        reminderDate,
        location: location || undefined,
        notes: notes || undefined,
        imageUrl: finalImageUrl || undefined,
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
              onValueChange={(value) => setCategory(value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                {allCategories.map(option => (
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
            <Label htmlFor="image">Fotoğraf</Label>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById('imageUpload')?.click()}
                  className="flex gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Fotoğraf Yükle
                </Button>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {(previewUrl || imageUrl) && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={clearImage}
                    size="sm"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Görseli Kaldır
                  </Button>
                )}
              </div>
              
              {previewUrl && (
                <div className="relative mt-2 border rounded-md overflow-hidden" style={{ maxWidth: "300px" }}>
                  <img 
                    src={previewUrl} 
                    alt="Önizleme" 
                    className="w-full h-auto object-contain max-h-48"
                  />
                </div>
              )}
              
              {!previewUrl && imageUrl && (
                <div className="relative mt-2 border rounded-md overflow-hidden" style={{ maxWidth: "300px" }}>
                  <img 
                    src={imageUrl} 
                    alt="Mevcut görsel" 
                    className="w-full h-auto object-contain max-h-48"
                  />
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                En fazla 5MB. Önerilen boyut: 800x600 piksel.
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Konum</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Öğenin konumunu girin"
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
