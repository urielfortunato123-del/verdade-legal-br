import { Scale, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-background dark:bg-background/60 dark:backdrop-blur-md border-t border-border dark:border-border/50 mt-auto">
      <div className="container mx-auto px-4 py-6">
        {/* Legal Disclaimer */}
        <div className="flex items-start gap-3 p-4 border border-border mb-6">
          <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Aviso importante:</strong> Este aplicativo tem caráter informativo. 
            Não substitui orientação jurídica profissional ou autoridade pública.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-sm text-foreground">
                Verdade na Lei
              </span>
              <span className="text-[9px] text-muted-foreground font-sans uppercase tracking-wider">
                Informação, não manipulação
              </span>
            </div>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-xs text-muted-foreground font-sans">
            <Link to="/sobre" className="hover:text-foreground transition-colors hover:underline">
              Sobre
            </Link>
            <Link to="/metodologia" className="hover:text-foreground transition-colors hover:underline">
              Metodologia
            </Link>
            <Link to="/privacidade" className="hover:text-foreground transition-colors hover:underline">
              Privacidade
            </Link>
          </nav>

          {/* Copyright */}
          <div className="text-xs text-muted-foreground text-center md:text-right font-sans">
            <p>© {new Date().getFullYear()} Verdade na Lei BR</p>
            <p className="text-[10px] mt-0.5">
              por <span className="text-foreground">Uriel da Fonseca Fortunato</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
