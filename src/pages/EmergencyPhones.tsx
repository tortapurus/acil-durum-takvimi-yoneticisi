import React from "react";
import { Phone, Flame, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EmergencyPhone {
  name: string;
  number: string;
  category: "general" | "health" | "security" | "utility" | "emergency";
  icon?: React.ElementType;
}

const emergencyPhones: EmergencyPhone[] = [
  { name: "Acil Çağrı Merkezi", number: "112", category: "general" },
  { name: "İtfaiye", number: "112", category: "emergency", icon: Flame },
  { name: "Orman Yangın Hattı", number: "112", category: "emergency", icon: Flame },
  { name: "AFAD", number: "122", category: "emergency", icon: AlertTriangle },
  { name: "Polis İmdat", number: "112", category: "security" },
  { name: "Jandarma İmdat", number: "112", category: "security" },
  { name: "Sahil Güvenlik", number: "112", category: "security" },
  { name: "Ambulans", number: "112", category: "health" },
  { name: "Alo Doktor", number: "113", category: "health" },
  { name: "Sağlık Danışma", number: "184", category: "health" },
  { name: "Zehir Danışma", number: "114", category: "health" },
  { name: "Elektrik Arıza", number: "186", category: "utility" },
  { name: "Doğalgaz Arıza", number: "187", category: "utility" },
  { name: "Su Arıza", number: "185", category: "utility" },
  { name: "Telekom Arıza", number: "121", category: "utility" },
  { name: "Kadın Destek Hattı", number: "183", category: "security" },
  { name: "Turist Polis", number: "0 212 527 45 03", category: "security" },
  { name: "Sağır ve İşitme Engelliler", number: "0850 288 50 60", category: "health" }
];

const EmergencyPhones: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Acil Durum Telefonları</h1>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="all" className="flex-1">Tümü</TabsTrigger>
          <TabsTrigger value="general" className="flex-1">Genel</TabsTrigger>
          <TabsTrigger value="health" className="flex-1">Sağlık</TabsTrigger>
          <TabsTrigger value="security" className="flex-1">Güvenlik</TabsTrigger>
          <TabsTrigger value="utility" className="flex-1">Altyapı</TabsTrigger>
          <TabsTrigger value="emergency" className="flex-1">Acil</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <PhoneList phones={emergencyPhones} />
        </TabsContent>
        
        <TabsContent value="general">
          <PhoneList phones={emergencyPhones.filter(phone => phone.category === "general")} />
        </TabsContent>
        
        <TabsContent value="health">
          <PhoneList phones={emergencyPhones.filter(phone => phone.category === "health")} />
        </TabsContent>
        
        <TabsContent value="security">
          <PhoneList phones={emergencyPhones.filter(phone => phone.category === "security")} />
        </TabsContent>
        
        <TabsContent value="utility">
          <PhoneList phones={emergencyPhones.filter(phone => phone.category === "utility")} />
        </TabsContent>

        <TabsContent value="emergency">
          <PhoneList phones={emergencyPhones.filter(phone => phone.category === "emergency")} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const PhoneList: React.FC<{ phones: EmergencyPhone[] }> = ({ phones }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {phones.map((phone) => (
        <Card key={phone.name} className="overflow-hidden">
          <CardHeader className="bg-primary/5 pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              {phone.icon ? <phone.icon className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
              {phone.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-xl font-bold">{phone.number}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EmergencyPhones;
