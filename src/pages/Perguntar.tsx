import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Send,
  Mic,
  Loader2,
  BookOpen,
  ExternalLink,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnalyzeQuestion } from "@/hooks/useAnalyzeQuestion";
import { ShareButtons } from "@/components/ShareButtons";

const categories = [
  { value: "auto", label: "Detectar automaticamente" },
  { value: "penal", label: "Direito Penal" },
  { value: "transito", label: "Trânsito" },
  { value: "consumidor", label: "Direito do Consumidor" },
  { value: "trabalho", label: "Direito do Trabalho" },
  { value: "familia", label: "Direito de Família" },
  { value: "constituicao", label: "Direito Constitucional" },
];

const Perguntar = () => {
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("auto");
  const { askQuestion, isLoading, response } = useAnalyzeQuestion();

  const handleSubmit = async () => {
    if (!question.trim()) return;
    await askQuestion(question, category !== "auto" ? category : undefined);
  };

  const confidenceLabels = {
    high: { label: "Alta confiança", color: "text-verde-brasil" },
    medium: { label: "Média confiança", color: "text-amarelo-progresso" },
    low: { label: "Baixa confiança", color: "text-muted-foreground" },
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-4xl mb-4 block">📘</span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Perguntar sobre Leis
            </h1>
            <p className="text-foreground/80">
              Tire suas dúvidas jurídicas. Resposta com base na legislação oficial.
            </p>
          </div>

          {/* Input Section */}
          <div className="bg-card rounded-2xl shadow-card p-6 mb-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="question" className="text-base font-semibold text-card-foreground">
                  Sua pergunta
                </Label>
                <Textarea
                  id="question"
                  placeholder="Ex: Qual o prazo para troca de produto com defeito? O que diz a lei sobre demissão sem justa causa?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="mt-2 min-h-[140px] resize-none text-base rounded-xl"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="category" className="text-sm text-card-foreground">
                    Categoria (opcional)
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category" className="mt-1 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 sm:items-end">
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 rounded-xl h-10 w-10"
                    title="Gravar pergunta por voz"
                  >
                    <Mic className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!question.trim() || isLoading}
                    className="flex-1 sm:flex-initial gap-2 bg-verde hover:bg-verde-brasil-light text-primary-foreground rounded-xl h-10 px-6 font-semibold"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    Perguntar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Response Section */}
          {response && (
            <div className="space-y-6 animate-fade-in">
              {/* Answer Card */}
              <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display font-bold text-xl text-card-foreground">
                      O que a lei diz
                    </h2>
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        confidenceLabels[response.confidence].color
                      )}
                    >
                      {confidenceLabels[response.confidence].label}
                    </span>
                  </div>

                  <p className="text-card-foreground leading-relaxed text-base">
                    {response.answer}
                  </p>

                  {response.followUp && (
                    <div className="mt-4 p-4 rounded-xl bg-amarelo-progresso/10 border border-amarelo-progresso/20 flex items-start gap-3">
                      <Info className="w-5 h-5 text-amarelo-progresso shrink-0 mt-0.5" />
                      <p className="text-sm text-card-foreground">{response.followUp}</p>
                    </div>
                  )}
                </div>

                {/* Sources */}
                {response.sources && response.sources.length > 0 && (
                  <div className="border-t border-border bg-muted/30 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="w-5 h-5 text-verde-brasil" />
                      <h3 className="font-semibold text-card-foreground">Artigos Citados</h3>
                    </div>

                    <div className="space-y-3">
                      {response.sources.map((source, index) => (
                        <a
                          key={index}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-verde-brasil/50 transition-colors group"
                        >
                          <div>
                            <div className="font-semibold text-card-foreground">{source.law}</div>
                            <div className="text-sm text-muted-foreground">
                              {source.article}
                            </div>
                          </div>
                          <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-verde-brasil transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <ShareButtons
                summary={response.answer}
                sources={response.sources}
              />
            </div>
          )}

          {/* Empty State */}
          {!response && !isLoading && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-foreground/30" />
              <p className="text-foreground/60 text-lg">Digite sua pergunta para começar</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="w-10 h-10 mx-auto mb-4 animate-spin text-verde-brasil" />
              <p className="text-foreground/80 text-lg">Buscando na legislação...</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Perguntar;
