import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  RotateCcw,
  Calendar,
  Link2,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFactCheck, FactCheckResponse } from "@/hooks/useFactCheck";
import { ShareButtons } from "@/components/ShareButtons";

const veredictoConfig: Record<
  FactCheckResponse["veredito"],
  { icon: React.ElementType; label: string; color: string; bgColor: string; borderColor: string }
> = {
  verdade: {
    icon: CheckCircle2,
    label: "VERDADE",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-500/10",
    borderColor: "border-green-200 dark:border-green-500/30",
  },
  mentira: {
    icon: XCircle,
    label: "MENTIRA",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-500/10",
    borderColor: "border-red-200 dark:border-red-500/30",
  },
  meia_verdade: {
    icon: AlertTriangle,
    label: "MEIA VERDADE",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-500/10",
    borderColor: "border-amber-200 dark:border-amber-500/30",
  },
  inconclusivo: {
    icon: HelpCircle,
    label: "INCONCLUSIVO",
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-50 dark:bg-gray-500/10",
    borderColor: "border-gray-200 dark:border-gray-500/30",
  },
};

const FactCheck = () => {
  const [inputType, setInputType] = useState<"text" | "link">("text");
  const [claim, setClaim] = useState("");
  const [url, setUrl] = useState("");
  const { checkFact, isLoading, response, reset } = useFactCheck();

  const handleSubmit = async () => {
    if (inputType === "text" && !claim.trim()) return;
    if (inputType === "link" && !url.trim()) return;
    
    const input = inputType === "text" ? claim : url;
    await checkFact(input, inputType);
  };

  const handleReset = () => {
    setClaim("");
    setUrl("");
    reset();
  };

  const isValid = inputType === "text" ? claim.trim() : url.trim();
  const config = response ? veredictoConfig[response.veredito] : null;
  const VeredictIcon = config?.icon || HelpCircle;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-4xl mb-4 block">🔍</span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Verificador de Fatos
            </h1>
            <p className="text-foreground/80">
              Cole uma notícia, post, link ou afirmação para verificar se é verdade
            </p>
          </div>

          {/* Input Section */}
          {!response && (
            <div className="bg-card rounded-2xl shadow-card p-6 mb-8">
              <Tabs value={inputType} onValueChange={(v) => setInputType(v as "text" | "link")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="text" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Texto
                  </TabsTrigger>
                  <TabsTrigger value="link" className="gap-2">
                    <Link2 className="w-4 h-4" />
                    Link
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-4">
                  <div>
                    <Label htmlFor="claim" className="text-base font-semibold text-card-foreground">
                      Afirmação ou publicação
                    </Label>
                    <Textarea
                      id="claim"
                      placeholder="Cole aqui o texto da notícia, post de rede social ou afirmação que deseja verificar..."
                      value={claim}
                      onChange={(e) => setClaim(e.target.value)}
                      className="mt-2 min-h-[200px] resize-none text-base rounded-xl"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      💡 Dica: Quanto mais contexto você fornecer, mais precisa será a análise
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="link" className="space-y-4">
                  <div>
                    <Label htmlFor="url" className="text-base font-semibold text-card-foreground">
                      Link da notícia
                    </Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://exemplo.com/noticia"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="mt-2 h-14 text-base rounded-xl"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      🔗 Cole o link completo da notícia ou post que deseja verificar
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                onClick={handleSubmit}
                disabled={!isValid || isLoading}
                className="w-full gap-2 bg-verde hover:bg-verde-brasil-light text-primary-foreground rounded-xl h-14 text-lg font-semibold mt-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {inputType === "link" ? "Buscando e verificando..." : "Verificando..."}
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Verificar {inputType === "link" ? "Link" : "Afirmação"}
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-verde-brasil" />
              <p className="text-foreground/80 text-lg mb-2">Analisando a afirmação...</p>
              <p className="text-muted-foreground text-sm">
                Verificando fontes e cruzando informações
              </p>
            </div>
          )}

          {/* Result Section */}
          {response && config && (
            <div className="space-y-6 animate-fade-in">
              {/* New Check Button */}
              <Button
                onClick={handleReset}
                variant="outline"
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Nova verificação
              </Button>

              {/* Main Result Card */}
              <div className={cn(
                "rounded-2xl border-2 overflow-hidden",
                config.borderColor
              )}>
                {/* Verdict Header */}
                <div className={cn("p-6", config.bgColor)}>
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center",
                      config.bgColor,
                      "border-2",
                      config.borderColor
                    )}>
                      <VeredictIcon className={cn("w-8 h-8", config.color)} />
                    </div>
                    <div>
                      <div className={cn("text-2xl font-bold", config.color)}>
                        {response.vereditoTitulo}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Calendar className="w-4 h-4" />
                        Verificado em {new Date(response.dataVerificacao).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Summary */}
                <div className="p-6 border-b border-border">
                  <h3 className="font-semibold text-lg text-card-foreground mb-3 flex items-center gap-2">
                    📝 O que diz a publicação
                  </h3>
                  <p className="text-card-foreground/90 leading-relaxed bg-muted/30 p-4 rounded-xl italic">
                    "{response.postResumo}"
                  </p>
                </div>

                {/* Explanation */}
                <div className="p-6 border-b border-border">
                  <h3 className={cn("font-semibold text-lg mb-3 flex items-center gap-2", config.color)}>
                    <VeredictIcon className="w-5 h-5" />
                    {response.veredito === "verdade" ? "Por que é verdade?" : 
                     response.veredito === "mentira" ? "Por que é mentira?" :
                     "Por que não é bem assim?"}
                  </h3>
                  <p className="text-card-foreground leading-relaxed text-base">
                    {response.explicacao}
                  </p>
                </div>

                {/* Key Points */}
                {response.pontosChave && response.pontosChave.length > 0 && (
                  <div className="p-6 border-b border-border">
                    <h3 className="font-semibold text-lg text-card-foreground mb-3 flex items-center gap-2">
                      📌 Pontos-chave
                    </h3>
                    <ul className="space-y-2">
                      {response.pontosChave.map((ponto, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-verde/10 text-verde-brasil flex items-center justify-center shrink-0 text-sm font-bold">
                            {index + 1}
                          </span>
                          <span className="text-card-foreground">{ponto}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Context */}
                {response.contexto && (
                  <div className="p-6 border-b border-border bg-muted/20">
                    <h3 className="font-semibold text-lg text-card-foreground mb-3 flex items-center gap-2">
                      💡 Contexto importante
                    </h3>
                    <p className="text-card-foreground/90 leading-relaxed">
                      {response.contexto}
                    </p>
                  </div>
                )}

                {/* Sources */}
                {response.fontes && response.fontes.length > 0 && (
                  <div className="p-6 bg-muted/30">
                    <h3 className="font-semibold text-lg text-card-foreground mb-4 flex items-center gap-2">
                      📚 Fontes consultadas
                    </h3>
                    <div className="space-y-3">
                      {response.fontes.map((fonte, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-xl bg-card border border-border"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="font-semibold text-card-foreground">
                                {fonte.nome}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {fonte.descricao}
                              </p>
                            </div>
                            {fonte.url && (
                              <a
                                href={fonte.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 p-2 rounded-lg hover:bg-muted transition-colors"
                              >
                                <ExternalLink className="w-5 h-5 text-verde-brasil" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Confidence */}
                <div className="p-4 bg-card border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Confiança na análise:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", {
                            "bg-green-500": response.confianca >= 0.7,
                            "bg-amber-500": response.confianca >= 0.4 && response.confianca < 0.7,
                            "bg-red-500": response.confianca < 0.4,
                          })}
                          style={{ width: `${response.confianca * 100}%` }}
                        />
                      </div>
                      <span className="font-semibold text-card-foreground">
                        {Math.round(response.confianca * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share */}
              <ShareButtons
                summary={`${response.vereditoTitulo}: ${response.postResumo}`}
                sources={response.fontes.map(f => ({ law: f.nome, article: f.descricao, url: f.url || "" }))}
              />

              {/* Disclaimer */}
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground text-center">
                  ⚠️ Este aplicativo tem caráter informativo e não substitui a orientação de um advogado ou autoridade pública.
                  A verificação é baseada em fontes públicas disponíveis.
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!response && !isLoading && (
            <div className="text-center py-8">
              <div className="bg-muted/30 rounded-2xl p-8">
                <h3 className="font-semibold text-lg text-card-foreground mb-4">
                  💡 O que você pode verificar:
                </h3>
                <ul className="text-left max-w-md mx-auto space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-verde-brasil">✓</span>
                    Posts de redes sociais (Twitter/X, Facebook, WhatsApp)
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-verde-brasil">✓</span>
                    Notícias e manchetes de sites
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-verde-brasil">✓</span>
                    Afirmações de políticos e figuras públicas
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-verde-brasil">✓</span>
                    Dados e estatísticas compartilhados
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FactCheck;
