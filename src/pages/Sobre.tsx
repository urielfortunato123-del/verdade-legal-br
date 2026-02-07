import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Scale, ExternalLink, Shield, BookOpen, Users } from "lucide-react";

const Sobre = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-verde rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Scale className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Verdade na Lei
            </h1>
            <p className="text-amarelo-progresso font-semibold tracking-widest text-sm mb-3">
              BRASIL
            </p>
            <p className="text-foreground/80">
              Versão 1.0.0
            </p>
          </div>

          <div className="space-y-6">
            {/* Mission */}
            <div className="bg-card rounded-2xl shadow-card p-6">
              <h2 className="font-display font-bold text-lg text-card-foreground mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-verde" />
                Nossa Missão
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Combater a desinformação no Brasil através da verificação de fatos baseada 
                na legislação brasileira. Utilizamos inteligência artificial para analisar 
                afirmações e conectá-las às leis oficiais do país.
              </p>
            </div>

            {/* Features */}
            <div className="bg-card rounded-2xl shadow-card p-6">
              <h2 className="font-display font-bold text-lg text-card-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-azul-info" />
                O que fazemos
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-verde">✓</span>
                  Verificação de notícias e afirmações
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-verde">✓</span>
                  Análise de documentos e imagens
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-verde">✓</span>
                  Transcrição e análise de áudios
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-verde">✓</span>
                  Consulta à legislação brasileira
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-verde">✓</span>
                  Relatórios detalhados com fontes oficiais
                </li>
              </ul>
            </div>

            {/* Team */}
            <div className="bg-card rounded-2xl shadow-card p-6">
              <h2 className="font-display font-bold text-lg text-card-foreground mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-amarelo-progresso" />
                Equipe
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Desenvolvido por brasileiros comprometidos com a verdade e a transparência.
                Nosso objetivo é empoderar cidadãos com informações precisas e verificáveis.
              </p>
            </div>

            {/* Legal Links */}
            <div className="bg-card rounded-2xl shadow-card p-6 space-y-3">
              <Button
                variant="outline"
                className="w-full justify-between h-14 rounded-xl"
                onClick={() => window.open("#termos", "_blank")}
              >
                <span>Termos de Uso</span>
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between h-14 rounded-xl"
                onClick={() => window.open("#privacidade", "_blank")}
              >
                <span>Política de Privacidade</span>
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between h-14 rounded-xl"
                onClick={() => window.open("#licencas", "_blank")}
              >
                <span>Licenças Open Source</span>
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                © 2025 Verdade na Lei Brasil
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Feito com 💚💛 no Brasil
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Sobre;
