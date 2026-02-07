import { Scale, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Legal Disclaimer */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50 mb-8">
          <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong>Aviso importante:</strong> Este serviço é meramente informativo e não substitui 
            orientação jurídica profissional. Para casos específicos, consulte um advogado.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 hero-gradient rounded-lg flex items-center justify-center">
              <Scale className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-foreground">
              Verdade na Lei BR
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
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
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Verdade na Lei BR
          </p>
        </div>
      </div>
    </footer>
  );
}
