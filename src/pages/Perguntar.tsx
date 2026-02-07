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
  FileText,
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
    high: { label: "Alta confiança", color: "text-verdict-confirmed" },
    medium: { label: "Média confiança", color: "text-verdict-misleading" },
    low: { label: "Baixa confiança", color: "text-verdict-unverifiable" },
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Perguntar sobre Leis
            </h1>
            <p className="text-muted-foreground">
              Faça sua pergunta jurídica e receba uma resposta baseada em legislação oficial.
            </p>
          </div>

          {/* Input Section */}
          <div className="bg-card rounded-xl border border-border shadow-card p-6 mb-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="question" className="text-base font-medium">
                  Sua pergunta
                </Label>
                <Textarea
                  id="question"
                  placeholder="Ex: Qual o prazo para troca de produto com defeito? O que diz a lei sobre demissão sem justa causa?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="mt-2 min-h-[120px] resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="category" className="text-sm">
                    Categoria (opcional)
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category" className="mt-1">
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
                    className="shrink-0"
                    title="Gravar pergunta por voz"
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!question.trim() || isLoading}
                    className="flex-1 sm:flex-initial gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
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
              <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display font-semibold text-lg">Resposta</h2>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        confidenceLabels[response.confidence].color
                      )}
                    >
                      {confidenceLabels[response.confidence].label}
                    </span>
                  </div>

                  <p className="text-foreground leading-relaxed">{response.answer}</p>

                  {response.followUp && (
                    <div className="mt-4 p-3 rounded-lg bg-secondary/50 flex items-start gap-2">
                      <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground">{response.followUp}</p>
                    </div>
                  )}
                </div>

                {/* Sources */}
                {response.sources && response.sources.length > 0 && (
                  <div className="border-t border-border bg-secondary/30 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <h3 className="font-semibold text-sm">Base Legal</h3>
                    </div>

                    <div className="space-y-3">
                      {response.sources.map((source, index) => (
                        <a
                          key={index}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors group"
                        >
                          <div>
                            <div className="font-medium text-sm">{source.law}</div>
                            <div className="text-xs text-muted-foreground">
                              {source.article}
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
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
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Digite sua pergunta para começar</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
              <p className="text-muted-foreground">Buscando na legislação...</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Perguntar;
