import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, Settings, Info, Share2, MoreHorizontal, Heart, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { DonationModal } from "./DonationModal";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/perguntar", label: "Perguntar" },
  { href: "/checar-imagem", label: "Checar" },
  { href: "/biblioteca", label: "Leis" },
];

const moreLinks = [
  { href: "/configuracoes", label: "Configurações", icon: Settings },
  { href: "/sobre", label: "Sobre o app", icon: Info },
];

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const newDark = !isDark;
    root.classList.remove("light", "dark");
    root.classList.add(newDark ? "dark" : "light");
    localStorage.setItem("theme", newDark ? "dark" : "light");
    setIsDark(newDark);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 dark:bg-background/60 backdrop-blur-xl border-b border-border dark:border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          {/* Logo — NYT style text-only */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-serif font-bold text-lg text-foreground tracking-tight leading-none">
              Verdade na Lei
            </span>
          </Link>

          {/* Desktop Navigation — flat text links */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-3 py-1.5 text-[13px] font-medium transition-colors rounded-sm",
                  location.pathname === link.href
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "px-3 py-1.5 text-[13px] font-medium h-auto gap-1 rounded-sm",
                    moreLinks.some(l => location.pathname === l.href)
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Mais
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-sm">
                {moreLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link to={link.href} className="flex items-center gap-2 cursor-pointer text-sm">
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: "Verdade na Lei Brasil",
                        text: "Verifique fatos com base na legislação brasileira!",
                        url: window.location.origin,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.origin);
                      toast.success("Link copiado!");
                    }
                  }}
                  className="flex items-center gap-2 cursor-pointer text-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={toggleTheme}
              className="ml-1 p-1.5 rounded-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Alternar tema"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setDonationOpen(true)}
              className="ml-1 px-3 py-1.5 text-[13px] font-medium transition-colors flex items-center gap-1 text-accent hover:text-accent/80"
            >
              <Heart className="w-3.5 h-3.5" />
              Apoiar
            </button>

            <DonationModal open={donationOpen} onOpenChange={setDonationOpen} />
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-3 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-3 py-2.5 text-sm font-medium transition-colors",
                    location.pathname === link.href
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="mt-2 pt-2 border-t border-border">
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={toggleTheme}
                  className="w-full px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDark ? "Tema Claro" : "Tema Escuro"}
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setDonationOpen(true);
                  }}
                  className="w-full px-3 py-2.5 text-sm font-medium text-accent flex items-center gap-2 mt-1"
                >
                  <Heart className="w-4 h-4" />
                  Apoiar o projeto
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
