
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { differenceInDays } from "date-fns";
import { useItems } from "@/context/ItemContext";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Pencil, Trash2, CalendarClock, Bell, FileText, Clock, Tag } from "lucide-react";
import { getCategoryLabel, getCategoryIcon, getCategoryIconStyle } from "@/utils/categoryUtils";

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItemById, deleteItem, getItemStatus } = useItems();
  
  const item = id ? getItemById(id) : undefined;
  
  if (!item) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium">Öğe bulunamadı</h2>
        <Button 
          variant="link" 
          onClick={() => navigate("/items")}
          className="mt-4"
        >
          Öğe listesine dön
        </Button>
      </div>
    );
  }
  
  const status = getItemStatus(item);
  const daysRemaining = differenceInDays(item.expirationDate, new Date());
  // No type issues here since getCategoryIcon and getCategoryIconStyle now accept string
  const CategoryIcon = getCategoryIcon(item.category);
  const iconStyle = getCategoryIconStyle(item.category);
  
  const handleDelete = () => {
    deleteItem(item.id);
    navigate("/items");
  };

  const getStatusClass = () => {
    if (status === 'danger') return 'bg-status-danger/5 border-l-status-danger';
    if (status === 'warning') return 'bg-status-warning/5 border-l-status-warning';
    return 'bg-status-safe/5 border-l-status-safe';
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
        <h1 className="text-2xl font-bold">{item.name}</h1>
      </div>
      
      <div className="flex flex-wrap gap-3 items-center">
        <StatusBadge status={status} size="lg" />
        <span className={`text-sm font-medium ${
          status === 'danger' 
            ? 'text-status-danger' 
            : status === 'warning' 
              ? 'text-status-warning' 
              : 'text-status-safe'
        }`}>
          {daysRemaining === 0 && "Bugün son kullanma tarihi"}
          {daysRemaining > 0 && `Son kullanma tarihine ${daysRemaining} gün kaldı`}
          {daysRemaining < 0 && `Son kullanma tarihi ${Math.abs(daysRemaining)} gün önce geçti`}
        </span>
      </div>
      
      <Card className={`border-l-4 ${getStatusClass()}`}>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 blur-sm opacity-30">
                  <CategoryIcon className={`h-5 w-5 ${iconStyle}`} />
                </div>
                <CategoryIcon className={`h-5 w-5 ${iconStyle} relative z-10`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kategori</p>
                <p className="font-medium">{getCategoryLabel(item.category)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Son Kullanma Tarihi</p>
                <p className="font-medium">
                  {format(item.expirationDate, "d MMMM yyyy", { locale: tr })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Hatırlatma Başlangıç Tarihi</p>
                <p className="font-medium">
                  {format(item.reminderDate, "d MMMM yyyy", { locale: tr })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Ekleme Tarihi</p>
                <p className="font-medium">
                  {format(item.createdAt, "d MMMM yyyy", { locale: tr })}
                </p>
              </div>
            </div>
            
            {item.notes && (
              <div className="flex gap-2 md:col-span-2">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Notlar</p>
                  <p className="whitespace-pre-line">{item.notes}</p>
                </div>
              </div>
            )}
          </div>
          
          {item.imageUrl && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Görsel</p>
              <div className="border rounded-lg overflow-hidden bg-white">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="mx-auto max-h-72 object-contain shadow-sm"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex gap-3 justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
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
        
        <Button onClick={() => navigate(`/items/${item.id}/edit`)}>
          <Pencil className="mr-2 h-4 w-4" />
          Düzenle
        </Button>
      </div>
    </div>
  );
};

export default ItemDetail;
