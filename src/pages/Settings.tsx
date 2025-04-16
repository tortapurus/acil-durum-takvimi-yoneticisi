
import React, { useState } from "react";
import { useItems } from "@/context/ItemContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, AlertTriangle, Save, Moon, Sun } from "lucide-react";
import { toast } from "sonner";

const Settings: React.FC = () => {
  const { settings, updateSettings } = useItems();
  
  const [warningThreshold, setWarningThreshold] = useState(settings.warningThreshold.toString());
  const [reminderDays, setReminderDays] = useState(settings.reminderDays.toString());
  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notificationsEnabled);
  
  const [warningThresholdError, setWarningThresholdError] = useState("");
  const [reminderDaysError, setReminderDaysError] = useState("");
  
  const handleSave = () => {
    // Validate inputs
    let isValid = true;
    
    const warningThresholdValue = parseInt(warningThreshold);
    if (isNaN(warningThresholdValue) || warningThresholdValue < 1) {
      setWarningThresholdError("Geçerli bir sayı girin (en az 1)");
      isValid = false;
    }
    
    const reminderDaysValue = parseInt(reminderDays);
    if (isNaN(reminderDaysValue) || reminderDaysValue < 1) {
      setReminderDaysError("Geçerli bir sayı girin (en az 1)");
      isValid = false;
    }
    
    if (!isValid) return;
    
    updateSettings({
      warningThreshold: warningThresholdValue,
      reminderDays: reminderDaysValue,
      notificationsEnabled,
    });
  };
  
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Ayarlar</h1>
        <p className="text-muted-foreground">
          Uygulama ayarlarını özelleştirin
        </p>
      </div>
      
      <Tabs defaultValue="notifications">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
          <TabsTrigger value="appearance">Görünüm</TabsTrigger>
        </TabsList>
        
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bildirim Ayarları</CardTitle>
              <CardDescription>
                Son kullanma tarihi bildirimleri ve hatırlatmalar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notificationsEnabled" className="text-base">Bildirimleri Etkinleştir</Label>
                  <p className="text-sm text-muted-foreground">
                    Son kullanma tarihi yaklaşan öğeler için bildirimler alın
                  </p>
                </div>
                <Switch
                  id="notificationsEnabled"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              
              <div className="space-y-2">
                <Label 
                  htmlFor="warningThreshold" 
                  className="flex items-center gap-1"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Uyarı Eşiği (gün)
                </Label>
                <Input
                  id="warningThreshold"
                  type="number"
                  min="1"
                  value={warningThreshold}
                  onChange={(e) => {
                    setWarningThreshold(e.target.value);
                    setWarningThresholdError("");
                  }}
                  placeholder="30"
                  className={warningThresholdError ? "border-destructive" : ""}
                />
                {warningThresholdError && (
                  <p className="text-sm text-destructive">{warningThresholdError}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Son kullanma tarihinden kaç gün önce öğelerin "Yaklaşıyor" durumuna geçeceği
                </p>
              </div>
              
              <div className="space-y-2">
                <Label 
                  htmlFor="reminderDays" 
                  className="flex items-center gap-1"
                >
                  <Bell className="h-4 w-4" />
                  Hatırlatma Günleri (gün)
                </Label>
                <Input
                  id="reminderDays"
                  type="number"
                  min="1"
                  value={reminderDays}
                  onChange={(e) => {
                    setReminderDays(e.target.value);
                    setReminderDaysError("");
                  }}
                  placeholder="7"
                  className={reminderDaysError ? "border-destructive" : ""}
                />
                {reminderDaysError && (
                  <p className="text-sm text-destructive">{reminderDaysError}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Son kullanma tarihinden kaç gün önce bildirimlerin başlayacağı
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Görünüm Ayarları</CardTitle>
              <CardDescription>
                Tema tercihleri ve görsel ayarlar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="theme" className="text-base">Tema Modu</Label>
                  <p className="text-sm text-muted-foreground">
                    Uygulama için açık veya koyu tema seçin
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-md"
                    onClick={() => {
                      document.documentElement.classList.remove("dark");
                      toast.success("Açık tema uygulandı");
                    }}
                  >
                    <Sun className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-md"
                    onClick={() => {
                      document.documentElement.classList.add("dark");
                      toast.success("Koyu tema uygulandı");
                    }}
                  >
                    <Moon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Ayarları Kaydet
        </Button>
      </div>
    </div>
  );
};

export default Settings;
