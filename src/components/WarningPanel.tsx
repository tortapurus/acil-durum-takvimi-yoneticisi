
import React from "react";
import { X, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface Warning {
  id: string;
  message: string;
  read: boolean;
}

interface WarningPanelProps {
  warnings: Warning[];
  onWarningRead: (id: string) => void;
  onClose: () => void;
}

export const WarningPanel: React.FC<WarningPanelProps> = ({
  warnings,
  onWarningRead,
  onClose,
}) => {
  const unreadWarnings = warnings.filter(w => !w.read);
  const readWarnings = warnings.filter(w => w.read);

  return (
    <Card className="w-80 h-full max-h-[calc(100vh-2rem)] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Uyarılar</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          {unreadWarnings.length > 0 
            ? `${unreadWarnings.length} yeni uyarı` 
            : "Yeni uyarı yok"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full px-4">
          {unreadWarnings.length > 0 && (
            <div className="space-y-2 mb-4">
              <h3 className="text-sm font-medium text-muted-foreground pt-2">Okunmamış</h3>
              {unreadWarnings.map((warning) => (
                <Alert 
                  key={warning.id} 
                  variant="destructive" 
                  className="relative cursor-pointer"
                  onClick={() => onWarningRead(warning.id)}
                >
                  <AlertTitle className="text-sm font-semibold">Uyarı</AlertTitle>
                  <AlertDescription className="text-xs">
                    {warning.message}
                  </AlertDescription>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onWarningRead(warning.id);
                    }}
                  >
                    <CheckCheck className="h-4 w-4" />
                    <span className="sr-only">Okundu olarak işaretle</span>
                  </Button>
                </Alert>
              ))}
            </div>
          )}
          
          {readWarnings.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground pt-2">Okunmuş</h3>
              {readWarnings.map((warning) => (
                <Alert 
                  key={warning.id} 
                  className={cn(
                    "relative",
                    "bg-muted/50 text-muted-foreground"
                  )}
                >
                  <AlertTitle className="text-sm font-semibold">Uyarı</AlertTitle>
                  <AlertDescription className="text-xs">
                    {warning.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
          
          {warnings.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              <p>Şu anda hiç uyarı bulunmuyor.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-end border-t p-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => warnings.forEach(w => onWarningRead(w.id))}
          disabled={unreadWarnings.length === 0}
        >
          Tümünü okundu olarak işaretle
        </Button>
      </CardFooter>
    </Card>
  );
};
