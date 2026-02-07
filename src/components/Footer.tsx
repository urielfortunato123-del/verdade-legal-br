import { Scale, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-background border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Legal Disclaimer */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 mb-8">
          <AlertCircle className="w-5 h-5 text-amarelo-progresso shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/80 leading-relaxed">
            <strong className="text-foreground">Aviso importante:</strong> Este aplicativo tem caráter informativo. 
            Não substitui orientação jurídica profissional ou autoridade pública.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-verde rounded-lg flex items-center justify-center">
              <Scale className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm text-foreground">
                Verdade na Lei BR
              </span>
              <span className="text-[9px] text-foreground/60">
                Informação, não manipulação.
              </span>
            </div>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm text-foreground/70">
            <Link to="/sobre" className="hover:text-foreground transition-colors">
              Sobre
            </Link>
            <Link to="/metodologia" className="hover:text-foreground transition-colors">
              Metodologia
            </Link>
            <Link to="/privacidade" className="hover:text-foreground transition-colors">
              Privacidade
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-foreground/60">
            © {new Date().getFullYear()} Verdade na Lei BR
          </p>
        </div>
      </div>
    </footer>
  );
}
