import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, Settings, Info, History, Share2, MoreHorizontal, Heart } from "lucide-react";
import brazilFlag from "@/assets/brazil-flag.jpg";
import { useState } from "react";
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
  { href: "/checar-audio", label: "Áudio" },
  { href: "/biblioteca", label: "Leis" },
];

const moreLinks = [
  { href: "/historico", label: "Histórico", icon: History },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
  { href: "/sobre", label: "Sobre o app", icon: Info },
];

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
              <img src={brazilFlag} alt="Bandeira do Brasil" className="w-full h-full object-cover scale-150" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-display font-bold text-base text-foreground leading-tight">
                Verdade na Lei
              </span>
              <span className="text-[10px] font-semibold text-amarelo-progresso tracking-widest">
                BRASIL
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  location.pathname === link.href
                    ? "bg-verde text-white shadow-md"
                    : "text-foreground/80 hover:text-foreground hover:bg-muted/50"
                )}
              >
                {link.label}
              </Link>
            ))}
            
            {/* More Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 gap-1",
                    moreLinks.some(l => location.pathname === l.href)
                      ? "bg-verde text-white shadow-md"
                      : "text-foreground/80 hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  Mais
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {moreLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link to={link.href} className="flex items-center gap-2 cursor-pointer">
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
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  Compartilhar app
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Donation Button */}
            <button
              onClick={() => setDonationOpen(true)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 bg-amarelo-ouro/10 text-amarelo-ouro hover:bg-amarelo-ouro/20 border border-amarelo-ouro/30"
            >
              <Heart className="w-4 h-4" />
              Ajude o app
            </button>

            <DonationModal open={donationOpen} onOpenChange={setDonationOpen} />
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-foreground hover:bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-base font-medium transition-colors",
                    location.pathname === link.href
                      ? "bg-verde text-white"
                      : "text-foreground/80 hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* More Section in Mobile */}
              <div className="mt-2 pt-2 border-t border-border">
                <p className="px-4 py-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Mais
                </p>
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-xl text-base font-medium transition-colors flex items-center gap-3",
                      location.pathname === link.href
                        ? "bg-verde text-white"
                        : "text-foreground/80 hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
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
                  className="w-full px-4 py-3 rounded-xl text-base font-medium transition-colors flex items-center gap-3 text-foreground/80 hover:text-foreground hover:bg-muted/50"
                >
                  <Share2 className="w-5 h-5" />
                  Compartilhar app
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setDonationOpen(true);
                  }}
                  className="w-full px-4 py-3 rounded-xl text-base font-medium transition-colors flex items-center gap-3 bg-amarelo-ouro/10 text-amarelo-ouro hover:bg-amarelo-ouro/20 border border-amarelo-ouro/30 mt-2"
                >
                  <Heart className="w-5 h-5" />
                  💛 Ajude o app a continuar rodando
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
