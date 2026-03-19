import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Search,
  Loader2,
  User,
  Landmark,
  Scale,
  FileText,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CandidateData {
  nome_completo: string;
  partido: string;
  cargo_atual: string;
  estado: string;
  idade: string;
  formacao: string;
  historico_politico: string[];
  principais_projetos: string[];
  votacoes_polemicas: string[];
  processos_juridicos: string[];
  patrimonio_declarado: string;
  curiosidades: string[];
  fontes: string[];
  aviso: string;
}

const Candidatos = () => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [candidate, setCandidate] = useState<CandidateData | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 3) {
      toast.error("Digite pelo menos 3 caracteres do nome do candidato");
      return;
    }

    setIsLoading(true);
    setCandidate(null);

    try {
      const { data, error } = await supabase.functions.invoke("search-candidate", {
        body: { candidateName: name.trim() },
      });

      if (error) {
        toast.error("Erro ao buscar informações do candidato");
        console.error(error);
        return;
      }

      if (!data.success) {
        toast.error(data.error || "Erro ao buscar candidato");
        return;
      }

      setCandidate(data.candidate);
      toast.success("Dossiê do candidato carregado!");
    } catch (err) {
      console.error(err);
      toast.error("Erro inesperado ao buscar candidato");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-serif font-black text-3xl md:text-4xl text-foreground mb-2">
              Quem é o Candidato?
            </h1>
            <p className="text-muted-foreground font-body text-sm max-w-md mx-auto">
              Digite o nome de um candidato ou político e veja seu histórico completo
              com base em fontes públicas.
            </p>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-8">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Lula, Bolsonaro, Marina Silva..."
              className="flex-1 h-12 text-base font-body rounded-sm border-foreground/20 focus:border-primary"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || name.trim().length < 3}
              className="h-12 px-6 bg-primary hover:bg-primary/90 rounded-sm font-sans"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Buscar
                </>
              )}
            </Button>
          </form>

          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground font-body animate-pulse">
                Buscando informações em múltiplas fontes...
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-sans">
                Isso pode levar alguns segundos
              </p>
            </div>
          )}

          {/* Result */}
          {candidate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Name & Party Header */}
              <div className="border-b-2 border-foreground pb-4 mb-4">
                <h2 className="font-serif font-black text-2xl md:text-3xl text-foreground">
                  {candidate.nome_completo}
                </h2>
                <div className="flex flex-wrap gap-3 mt-2 text-sm font-sans">
                  <span className="flex items-center gap-1 text-primary font-semibold">
                    <Landmark className="w-4 h-4" />
                    {candidate.partido}
                  </span>
                  {candidate.cargo_atual && (
                    <span className="text-muted-foreground">
                      {candidate.cargo_atual}
                    </span>
                  )}
                  {candidate.estado && (
                    <span className="text-muted-foreground">
                      {candidate.estado}
                    </span>
                  )}
                  {candidate.idade && (
                    <span className="text-muted-foreground">
                      {candidate.idade}
                    </span>
                  )}
                </div>
                {candidate.formacao && (
                  <p className="text-sm text-muted-foreground mt-1 font-body">
                    🎓 {candidate.formacao}
                  </p>
                )}
              </div>

              {/* Political History */}
              <Section
                icon={Landmark}
                title="Histórico Político"
                items={candidate.historico_politico}
                iconColor="text-primary"
              />

              {/* Key Projects */}
              <Section
                icon={FileText}
                title="Principais Projetos"
                items={candidate.principais_projetos}
                iconColor="text-verde"
              />

              {/* Controversial Votes */}
              <Section
                icon={Scale}
                title="Votações Polêmicas"
                items={candidate.votacoes_polemicas}
                iconColor="text-amarelo-progresso"
              />

              {/* Legal Issues */}
              <Section
                icon={AlertTriangle}
                title="Processos e Investigações"
                items={candidate.processos_juridicos}
                iconColor="text-destructive"
              />

              {/* Patrimony */}
              {candidate.patrimonio_declarado && (
                <div className="bg-card border border-border rounded-sm p-4">
                  <h3 className="font-serif font-bold text-base text-card-foreground flex items-center gap-2 mb-2">
                    💰 Patrimônio Declarado
                  </h3>
                  <p className="text-sm text-muted-foreground font-body">
                    {candidate.patrimonio_declarado}
                  </p>
                </div>
              )}

              {/* Fun Facts */}
              {candidate.curiosidades?.length > 0 && (
                <Section
                  icon={BookOpen}
                  title="Curiosidades"
                  items={candidate.curiosidades}
                  iconColor="text-muted-foreground"
                />
              )}

              {/* Sources */}
              {candidate.fontes?.length > 0 && (
                <div className="bg-card border border-border rounded-sm p-4">
                  <h3 className="font-serif font-bold text-sm text-card-foreground mb-2">
                    Fontes Consultadas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.fontes.map((src, i) => (
                      <a
                        key={i}
                        href={src.startsWith("http") ? src : undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "text-[11px] px-2 py-1 bg-muted rounded-sm font-sans",
                          src.startsWith("http") && "text-primary hover:underline flex items-center gap-1"
                        )}
                      >
                        {src.startsWith("http")
                          ? new URL(src).hostname.replace("www.", "")
                          : src}
                        {src.startsWith("http") && <ExternalLink className="w-2.5 h-2.5" />}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="bg-muted/50 border border-border rounded-sm p-4 flex gap-3">
                <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground font-body space-y-1">
                  <p>{candidate.aviso || "As informações são baseadas em fontes públicas e podem estar incompletas."}</p>
                  <p className="font-semibold">
                    Este aplicativo tem caráter informativo e não substitui a orientação de um advogado ou autoridade pública.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

function Section({
  icon: Icon,
  title,
  items,
  iconColor,
}: {
  icon: typeof Landmark;
  title: string;
  items: string[];
  iconColor: string;
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-sm p-4">
      <h3 className="font-serif font-bold text-base text-card-foreground flex items-center gap-2 mb-3">
        <Icon className={cn("w-4 h-4", iconColor)} />
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-muted-foreground font-body flex items-start gap-2">
            <span className="text-foreground/30 font-sans text-xs mt-0.5">{i + 1}.</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Candidatos;
