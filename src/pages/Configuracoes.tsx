import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Bell, BellOff, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Configuracoes = () => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [notifications, setNotifications] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme("system");
    }
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (newTheme === "system") {
      localStorage.removeItem("theme");
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.add(systemDark ? "dark" : "light");
    } else {
      localStorage.setItem("theme", newTheme);
      root.classList.add(newTheme);
    }
    toast.success(`Tema alterado para ${newTheme === "system" ? "automático" : newTheme === "dark" ? "escuro" : "claro"}`);
  };

  const handleNotificationToggle = async () => {
    if (!notifications) {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          setNotifications(true);
          toast.success("Notificações ativadas!");
        } else {
          toast.error("Permissão de notificações negada");
        }
      } else {
        toast.error("Seu navegador não suporta notificações");
      }
    } else {
      setNotifications(false);
      toast.info("Notificações desativadas");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-4xl mb-4 block">⚙️</span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Configurações
            </h1>
            <p className="text-foreground/80">
              Personalize sua experiência no app
            </p>
          </div>

          <div className="space-y-6">
            {/* Theme Section */}
            <div className="bg-card rounded-2xl shadow-card p-6">
              <h2 className="font-display font-bold text-lg text-card-foreground mb-4 flex items-center gap-2">
                <Sun className="w-5 h-5 text-amarelo-progresso" />
                Aparência
              </h2>
              
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => handleThemeChange("light")}
                >
                  <Sun className="w-6 h-6" />
                  <span className="text-sm">Claro</span>
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => handleThemeChange("dark")}
                >
                  <Moon className="w-6 h-6" />
                  <span className="text-sm">Escuro</span>
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => handleThemeChange("system")}
                >
                  <Globe className="w-6 h-6" />
                  <span className="text-sm">Auto</span>
                </Button>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-card rounded-2xl shadow-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {notifications ? (
                    <Bell className="w-5 h-5 text-verde" />
                  ) : (
                    <BellOff className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div>
                    <Label htmlFor="notifications" className="font-display font-bold text-lg text-card-foreground">
                      Notificações
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receba alertas sobre novas análises
                    </p>
                  </div>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={handleNotificationToggle}
                />
              </div>
            </div>

            {/* Language Section */}
            <div className="bg-card rounded-2xl shadow-card p-6">
              <h2 className="font-display font-bold text-lg text-card-foreground mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-azul-info" />
                Idioma
              </h2>
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                <span className="text-2xl">🇧🇷</span>
                <div>
                  <p className="font-semibold text-card-foreground">Português (Brasil)</p>
                  <p className="text-sm text-muted-foreground">Único idioma disponível</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Configuracoes;
