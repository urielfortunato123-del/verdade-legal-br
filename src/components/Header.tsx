import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Scale, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/perguntar", label: "Perguntar" },
  { href: "/checar-imagem", label: "Checar" },
  { href: "/checar-audio", label: "Áudio" },
  { href: "/biblioteca", label: "Leis" },
  { href: "/historico", label: "Histórico" },
];

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-verde rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Scale className="w-5 h-5 text-primary-foreground" />
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
                    ? "bg-verde text-primary-foreground shadow-md"
                    : "text-foreground/80 hover:text-foreground hover:bg-white/10"
                )}
              >
                {link.label}
              </Link>
            ))}
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
          <nav className="lg:hidden py-4 border-t border-white/10 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-base font-medium transition-colors",
                    location.pathname === link.href
                      ? "bg-verde text-primary-foreground"
                      : "text-foreground/80 hover:text-foreground hover:bg-white/10"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
